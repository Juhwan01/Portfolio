---
title: Jira Extended MCP Server
summary: 읽기 전용이거나 이슈를 하나씩만 만들던 기존 Jira MCP 대신, AI 에이전트가 이슈 일괄 생성·상태 변경부터 릴리스·스프린트·이슈 링크까지 다루게 한 Jira 전용 MCP 서버.
period:
  start: 2026-03
  end: 2026-03
role: 1인 설계·개발 · Jira API 클라이언트, 도구 설계, API 버전 전략, PyPI 배포와 문서화
team: DevTools 1
status: completed
featured: false
order: 13
category: MCP
tags:
- Python
- MCP
- Jira API
- uvx
- PyPI
responsibilities:
- 도구 설계 — 스프린트 실무에서 출발해 이슈 CRUD·일괄 작업·릴리스·스프린트·이슈 링크·댓글과 작업 기록을 도구 27개로 구성
- Jira API 클라이언트 — httpx 기반 비동기 REST 클라이언트, 요청 한도(Rate Limit)에 걸리면 자동 재시도
- API 버전 전략 — 엔드포인트마다 v2·v3·Agile API를 골라 쓰는 하이브리드 구조
- 배포와 문서화 — PyPI 패키지로 공개하고 Claude Code·Claude Desktop·VS Code·Cursor 설치 가이드 작성
links:
  github: https://github.com/Juhwan01/jira-extended-mcp-server
  demo: https://pypi.org/project/jira-extended-mcp/
cover: /images/projects/jira-extended-mcp/thumbnail.png
part_of: beans-pirates-ax
---

## 맥락과 제약

- **사내 AX의 한 부분:** AI 코딩 에이전트가 팀의 Jira를 직접 읽고 쓰게 하려고 만든 도구입니다. 전체 흐름은 [사내 AX](/projects/beans-pirates-ax)에 정리했습니다.
- **기존 MCP 서버의 한계:** 읽기 전용이거나 이슈를 하나씩만 만들 수 있었습니다. 스프린트를 시작할 때 이슈 수십 개를 한 번에 만들고, 릴리스에 묶고, 이슈 사이 의존 관계를 거는 실제 업무를 에이전트에 맡기기 어려웠습니다.
- **본문 형식의 비용:** Jira REST API v3는 본문을 ADF라는 JSON 구조로 받습니다. 굵은 글씨 한 단어도 여러 겹의 JSON이 되어, 에이전트가 만들기에는 토큰이 많이 들고 사용자가 프롬프트로 서식을 지정하기도 어렵습니다.

## 핵심 결정

1. **Jira 하나만 제대로 지원한다.** 여러 서버가 Confluence·Compass까지 함께 다루며 복잡해지는 것과 달리, Jira 기능에만 집중하고 `uvx` 한 줄로 실행되게 했습니다.
2. **이슈 본문은 v2 API의 Wiki Markup으로 쓴다.** 최신 v3 대신 v2를 일부러 골랐습니다. `*Hello*` 같은 Wiki Markup 문자열을 그대로 보내면 Jira가 서식으로 렌더링하므로, 토큰이 적게 들고 사람이 읽기도 쉽습니다.
3. **도구 수보다 일괄 작업을 먼저 만든다.** "스프린트 시작 때 이슈를 한 번에 만들고 싶다"는 실무 요구에서 출발했습니다. 반복문으로 하나씩 부르지 않고 Jira의 일괄 생성 엔드포인트로 호출 한 번에 이슈를 최대 50개까지 만들고, 스프린트를 마칠 때 남은 이슈를 한꺼번에 Done으로 옮기는 일괄 상태 변경도 명령 하나로 처리합니다.

## 결과

- **도구 27개:** 이슈 CRUD 6, 상태 전이 3, 이슈 링크 3, 릴리스 4, 스프린트 2, 댓글·작업 기록 3, 메타데이터 6개입니다. 일괄 상태 변경과 릴리스 관리까지 갖춰, 스프린트 준비부터 릴리스 정리까지 대화로 처리할 수 있습니다.
- **API 폐기 뒤에도 Wiki Markup 유지:** 검색만 v3로 옮기고 이슈 생성·수정은 v2에 남겨, 사용자는 API 버전을 의식하지 않고 Wiki Markup을 계속 씁니다.

## 막혔던 것

- **Jira Cloud의 v2 검색 API 폐기:** v2 검색 API가 폐기되어 410 Gone을 돌려주기 시작했습니다. 전부 v3로 옮기면 Wiki Markup 지원을 잃기 때문에, 엔드포인트마다 맞는 버전을 고르는 방식으로 대응했습니다. 이슈 생성·수정은 v2, JQL 검색은 커서 페이지네이션을 쓰는 v3, 텍스트 필드가 없는 프로젝트·사용자 메타데이터는 v3, 스프린트·보드는 별도 엔드포인트만 있는 Agile API를 씁니다.

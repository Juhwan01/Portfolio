---
title: Jira Extended MCP Server
summary: 읽기 전용이거나 이슈를 하나씩만 만들던 기존 Jira MCP 대신, AI 에이전트가 이슈 일괄 생성·상태 변경부터 릴리스·스프린트·이슈 링크까지 다루게 한 Jira 전용 MCP 서버.
period:
  start: 2026-03
  end: 2026-03
role: 1인 설계·개발 · Jira API 클라이언트, 도구 설계, API 버전 전략, PyPI 배포와 문서화
team: DevTools 1
status: completed
featured: true
order: 3
category: MCP
tags:
- Python
- MCP
- Jira API
- uvx
- PyPI
responsibilities:
- 도구 설계 — 스프린트 실무에서 출발해 이슈 CRUD·일괄 작업·릴리스·스프린트·이슈 링크·댓글과 작업 기록을 다루는 도구 구성
- Jira API 클라이언트 — httpx 기반 비동기 REST 클라이언트, 요청 한도(Rate Limit)에 걸리면 자동 재시도
- API 버전 전략 — 엔드포인트마다 v2·v3·Agile API를 골라 쓰는 하이브리드 구조
- 배포와 문서화 — PyPI 패키지로 공개하고 Claude Code·Claude Desktop·VS Code·Cursor 설치 가이드 작성
metrics:
- value: 50회 → 1회
  label: 이슈 50개를 만드는 호출 수
  before: 50
  after: 1
  unit: 회
  scope: 설계 기준 · 일괄 생성 API 사양(호출 한 번에 최대 50개)으로 계산
links:
  github: https://github.com/Juhwan01/jira-extended-mcp-server
  demo: https://pypi.org/project/jira-extended-mcp/
cover: /images/projects/jira-extended-mcp/thumbnail.png
part_of: beans-pirates-ax
---

[사내 AX](/projects/beans-pirates-ax)의 한 부분으로, AI 코딩 에이전트가 팀의 Jira를 직접 읽고 쓰게 하려고 만든 도구입니다.

## 구조 결정

### 1. 일괄 작업: 이슈를 하나씩 만드는 대신 호출 한 번으로

**왜:** 스프린트를 시작할 때 이슈 수십 개를 한 번에 만들고, 마칠 때 남은 이슈를 한꺼번에 옮기는 일이 실제 업무였습니다. 기존 Jira MCP 서버는 읽기 전용이거나 이슈를 하나씩만 만들 수 있었습니다.

**구조:** 반복문으로 하나씩 부르지 않고 Jira의 일괄 생성 엔드포인트로 호출 한 번에 이슈를 최대 50개까지 만듭니다. 스프린트를 마칠 때 남은 이슈를 Done으로 옮기는 일괄 상태 변경도 명령 하나로 처리합니다.

**결과:** 이슈 50개를 만들 때 호출이 50번에서 1번으로 줄어듭니다(일괄 생성 API 사양 기준).

### 2. 본문 형식: v3 ADF 대신 v2 Wiki Markup

**왜:** Jira REST API v3는 본문을 ADF라는 JSON 구조로 받습니다. 굵은 글씨 한 단어도 여러 겹의 JSON이 되어, 에이전트가 만들기에는 토큰이 많이 들고 사람이 프롬프트로 서식을 지정하기도 어렵습니다.

**구조:** 이슈 본문은 v2 API에 `*Hello*` 같은 Wiki Markup 문자열로 보내고, Jira가 이를 서식으로 그립니다.

**결과:** 같은 서식을 여러 겹의 JSON 대신 짧은 문자열로 쓰므로 토큰이 덜 들고, 사람이 읽고 고치기도 쉽습니다.

### 3. API 버전: 전면 v3 이전 대신 엔드포인트별 선택

**왜:** Jira Cloud가 v2 검색 API를 폐기해 410 Gone을 돌려주기 시작했습니다. 전부 v3로 옮기면 Wiki Markup을 잃습니다.

**바꾼 구조:** 이슈 생성·수정은 v2, JQL 검색은 커서 페이지네이션을 쓰는 v3, 텍스트 필드가 없는 프로젝트·사용자 메타데이터는 v3, 스프린트·보드는 별도 엔드포인트만 있는 Agile API를 씁니다.

**결과:** 검색이 다시 동작하면서도, 사용자는 API 버전을 의식하지 않고 Wiki Markup을 계속 씁니다.

## 그 밖의 설계

- **Jira 하나만 제대로:** Confluence·Compass까지 함께 다루며 복잡해지는 서버들과 달리 Jira에만 집중하고, `uvx` 한 줄로 실행되게 했습니다.

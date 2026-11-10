---
title: Jira Extended MCP Server
description: AI 에이전트를 위한 풀스택 Jira Cloud 통합 MCP 서버. 27개 도구, 벌크 작업, 릴리스 관리, 이슈 링크 지원. PyPI 배포.
category: MCP
tech_stack:
- Python
- MCP
- Jira API
- uvx
- PyPI
thumbnail_url: /images/projects/jira-extended-mcp/thumbnail.png
images:
- /images/projects/jira-extended-mcp/thumbnail.png
demo_url: https://pypi.org/project/jira-extended-mcp/
github_url: https://github.com/Juhwan01/jira-extended-mcp-server
featured: true
status: completed
start_date: 2025-03
end_date: 2025-03
order: 13
notion_page_id: null
video_url: null
team_composition:
- role: DevTools
  count: 1
slide_url: null
highlight: 27 Tools · PyPI
id: 5337de6d-1891-4e06-885d-f35ee08104fd
created_at: '2026-03-25T11:08:40.115943Z'
updated_at: null
---

## Problem

AI 코딩 에이전트(Claude Code, Cursor 등)에서 Jira를 사용하려면 MCP 서버가 필요합니다. 하지만 기존 MCP 서버들은 **읽기 전용이거나, 이슈를 하나씩만 생성**할 수 있었습니다.

> 스프린트 시작일에 20~30개 이슈를 한 번에 만들고, 릴리스에 할당하고, 이슈 간 의존성을 설정하는 것이 실무입니다. 기존 MCP 서버로는 이슈 하나 만드는 데도 3번의 대화가 필요했습니다.

## My Role: 1인 설계 및 개발 (Moobean Team)

**API 설계, 구현, PyPI 배포, 문서화**까지 전 과정을 수행했습니다.

| 담당 영역 | 구현 내용 |
|-----------|----------|
| API 클라이언트 | httpx 기반 비동기 Jira REST 클라이언트, Rate Limit 자동 재시도 |
| MCP 도구 설계 | 27개 도구 (CRUD, Bulk, 릴리스, 스프린트, 이슈 링크) |
| API 버전 전략 | v2/v3 하이브리드 아키텍처 설계 및 구현 |
| 배포 | PyPI 패키지 + Claude Code/Desktop/VS Code/Cursor 설치 가이드 |

## Approach

### 설계 철학: Jira-Only, Zero Bloat

경쟁 제품들은 Confluence, Compass 등을 함께 지원하며 복잡해집니다. **Jira 하나만 완벽하게** 지원하는 것이 더 가치 있다고 판단했습니다.

| 기능 | jira-mcp | mcp-atlassian | Atlassian Rovo | **Jira Extended** |
|------|----------|---------------|----------------|-------------------|
| 이슈 CRUD | 읽기만 | O | O | O |
| Bulk 생성 (50개) | X | O | O | **O** |
| Bulk 상태 변경 | X | X | X | **O** |
| 릴리스 관리 | X | X | X | **O (4개 도구)** |
| Wiki Markup | X | Markdown->ADF | ADF | **O (네이티브)** |
| 설치 방법 | npm | pip/Docker | OAuth (SaaS) | **uvx 한 줄** |
| 총 Jira 도구 | 2 | ~30 | ~25 | **27** |

### 왜 Wiki Markup인가? (v2 vs v3 의사결정)

이 프로젝트의 **핵심 기술적 트레이드오프**입니다.

Jira REST API v3는 ADF(Atlassian Document Format) JSON을 요구합니다:

```
// ADF (v3): 단순한 볼드 텍스트를 쓰려면
{"type":"doc","content":[{"type":"paragraph",
"content":[{"type":"text","text":"Hello",
"marks":[{"type":"strong"}]}]}]}

// Wiki Markup (v2): 같은 결과
*Hello*
```

| 방식 | AI 토큰 비용 | 사용자 가독성 | Jira 렌더링 |
|------|-------------|-------------|-------------|
| ADF (v3) | 높음 (JSON 구조) | 낮음 | O |
| Markdown | 중간 | 높음 | X (변환 필요) |
| **Wiki Markup (v2)** | **낮음** | **높음** | **O (네이티브)** |

AI 에이전트가 ADF JSON을 생성하면 토큰 낭비가 심하고, 사용자가 프롬프트에서 서식을 지정하기도 어렵습니다. **v2 API를 의도적으로 선택**하여 Wiki Markup을 지원한 것은 사용성과 토큰 효율 모두를 확보한 판단입니다.

### API 폐기 대응: v2/v3 하이브리드 전략

Jira Cloud가 2025년 5월 v2 검색 API를 폐기(410 Gone)했습니다.

전체를 v3로 전환하면 Wiki Markup 지원을 잃게 됩니다. 대신 **엔드포인트별로 최적의 API 버전을 선택**하는 하이브리드 전략을 설계했습니다:

| 엔드포인트 | API 버전 | 이유 |
|-----------|---------|------|
| 이슈 생성/수정 | v2 | Wiki Markup 지원 유지 |
| 이슈 검색 (JQL) | v3 | v2 폐기 대응, 커서 페이지네이션 |
| 메타데이터 (프로젝트, 사용자) | v3 | 텍스트 필드 없음, v3가 적합 |
| 스프린트/보드 | Agile API | 별도 엔드포인트만 지원 |

이 전략으로 사용자는 API 버전을 의식하지 않고, Wiki Markup도 계속 사용할 수 있습니다.

### Bulk 작업: 실무 워크플로우 지원

Bulk 생성은 단순히 반복문을 돌리는 것이 아닙니다. Jira의 `/rest/api/2/issue/bulk` 엔드포인트를 사용하여 **단일 API 호출로 최대 50개 이슈를 생성**합니다.

Bulk 상태 변경도 마찬가지로, 스프린트 완료 시 "남은 이슈 10개를 전부 Done으로" 같은 실무 시나리오를 한 번의 명령으로 처리합니다.

## Results

- **27개 Jira 전용 도구**: CRUD 6, Transition 3, Issue Link 3, Release 4, Sprint 2, Comment/Worklog 3, Metadata 6
- **PyPI 배포**: pip install jira-extended-mcp으로 즉시 설치
- **4개 AI 클라이언트 지원**: Claude Code, Claude Desktop, VS Code (Copilot), Cursor
- **v2/v3 하이브리드**: Wiki Markup 유지 + API 폐기 대응 완료
- **단일 uvx 설치**: clone/build 없이 한 줄로 실행

## Lessons Learned

> **"오픈소스의 가치는 기능 수가 아니라, 사용자의 워크플로우를 얼마나 이해하는가에 있습니다."**

27개 도구를 만든 것보다, "스프린트 시작 시 이슈를 한 번에 생성하고 싶다"는 실무 니즈를 파악하고 Bulk 작업을 우선 구현한 것이 핵심이었습니다. 기능 목록이 아니라 **사용 시나리오에서 출발**하는 것이 올바른 설계 순서입니다.

또한 API v2/v3 하이브리드 전략은 "최신 API를 무조건 따르는 것"이 아니라, **사용자 가치(Wiki Markup)를 지키면서 호환성을 확보하는** 실용적 판단이었습니다. v2 폐기 공지가 떴을 때, 전체 마이그레이션 대신 영향받는 엔드포인트만 v3로 전환한 것이 개발 비용과 사용자 경험 모두를 지킨 결정이었습니다.

**Tech Stack:** `Python` `MCP` `Jira REST API v2/v3` `FastMCP` `httpx` `PyPI`

---

> **Related:** 이 도구는 [SAiM Agent Hub](/projects/d2c8c285-0d6b-4201-875e-32867300790e) 및 [SAiM RecSys](/projects/5efd3a9a-ef62-4d0f-9959-5203cc6f437a) 프로젝트의 Jira 이슈 관리 자동화를 위해 개발되었습니다.
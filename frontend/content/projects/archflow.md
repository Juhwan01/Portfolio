---
title: ArchFlow
description: Jira + GitHub + Draw.io를 하나의 MCP 서버로 통합. Claude Code에서 자연어 질문 하나로 스프린트 현황, 이슈-PR-코드 추적, 아키텍처 탐색이 가능한 Context Hub.
category: MCP
tech_stack:
- Python
- MCP
- Jira API
- GitHub API
- Google Drive API
- PyPI
thumbnail_url: /images/projects/archflow/thumbnail.png
images:
- /images/projects/archflow/thumbnail.png
demo_url: null
github_url: https://github.com/Juhwan01/ArchFlow
featured: true
status: completed
start_date: 2025-03
end_date: 2025-03
order: 12
notion_page_id: null
video_url: null
team_composition:
- role: AI
  count: 1
slide_url: null
highlight: Open Source · PyPI
id: 446b115a-a028-421d-8e8b-df443509dc66
created_at: '2026-03-25T11:08:40.045291Z'
updated_at: null
---

## Problem

개발 팀에서 이슈를 확인하려면 Jira, 코드를 보려면 GitHub, 아키텍처를 파악하려면 Draw.io를 각각 열어야 합니다. **3개 탭을 번갈아 보며 맥락을 조합하는 것**이 일상이었습니다.

> "KAN-42 코드 어디 있어?" — Jira에서 이슈를 찾고, GitHub에서 PR을 검색하고, Draw.io에서 관련 서비스를 확인하는 데 매번 5분. 하루에 수십 번 반복됩니다.

## My Role: 1인 설계 및 개발

**기획, 설계, 구현, PyPI 배포**까지 전 과정을 혼자 수행했습니다.

| 담당 영역 | 구현 내용 |
|-----------|----------|
| MCP 서버 설계 | 23개 도구 설계, Cross-Source Matcher 아키텍처 |
| API 통합 | Jira Cloud, GitHub, Google Drive(Draw.io) 3개 소스 연동 |
| CLI 도구 | archflow init (대화형 설정), archflow doctor (진단) |
| Claude Code 연동 | 6개 슬래시 커맨드, MCP 자동 등록 |
| 배포 | PyPI 패키지 (pip install archflow-hub) |

## Approach

### 왜 MCP 서버인가?

Jira/GitHub/Draw.io를 통합하는 방법은 여러 가지입니다. 웹 대시보드, Slack 봇, VS Code 확장 등. 하지만 **이미 AI 코딩 어시스턴트를 쓰고 있다면**, 별도 도구를 추가하는 것보다 기존 워크플로우 안에서 해결하는 것이 자연스럽습니다.

| 방식 | 컨텍스트 전환 | 자연어 질의 | 확장성 |
|------|-------------|-----------|--------|
| 웹 대시보드 | 높음 (탭 이동) | X | 낮음 |
| Slack 봇 | 중간 | O | 중간 |
| **MCP 서버** | **없음 (에디터 내)** | **O** | **높음 (23개 도구)** |

MCP는 AI 어시스턴트가 외부 도구를 호출할 수 있는 표준 프로토콜입니다. ArchFlow는 이 프로토콜 위에 Jira, GitHub, Draw.io를 하나의 서버로 묶어 제공합니다.

### Cross-Source Tracing: 핵심 설계

단순히 3개 API를 병렬 호출하는 것이 아닙니다. **이슈 키 하나로 연관된 모든 맥락을 자동 추적**하는 Cross-Source Matcher가 핵심입니다.

```
"KAN-42 코드 어디 있어?"

  Jira   -> KAN-42: "Add OAuth2 login" (In Progress, @alice)
  GitHub -> PR #87 "feat: oauth2 login flow" (src/auth/oauth.ts)
  Draw.io -> Auth Service -> API Gateway, User DB와 연결
```

추적 로직:
1. Jira 이슈 키를 기준으로 GitHub PR 제목, 브랜치명, 본문을 검색
2. PR에서 변경된 파일 경로를 추출
3. Draw.io 다이어그램에서 관련 컴포넌트 노드를 매칭
4. 결과를 하나의 응답으로 합성

### 캐싱과 Graceful Degradation

모든 API 응답은 TTL 기반 캐시(기본 30분)로 관리됩니다. 같은 질문을 반복하면 API 호출 비용이 0입니다.

또한 **소스가 일부만 설정되어도 동작**합니다. GitHub 토큰이 없으면 Jira + Draw.io만으로 응답하고, 에러 대신 "GitHub not configured" 메시지를 반환합니다.

### CLI 설계: archflow init

설정 파일을 수동으로 만드는 대신, **대화형 CLI**로 토큰 입력, 검증, MCP 등록, 슬래시 커맨드 설치를 한 번에 처리합니다.

```bash
pip install archflow-hub
archflow init    # 대화형 설정 -> 즉시 사용 가능
archflow doctor  # 연결 상태 진단
```

## Results

- **23개 MCP 도구**: Jira 7, GitHub 6, Draw.io 4, Cross-Source 5, 통합검색 1
- **6개 슬래시 커맨드**: /archflow-status, /archflow-trace, /archflow-arch, /archflow-onboard, /archflow-report, /archflow-search
- **PyPI 배포**: pip install archflow-hub으로 즉시 설치
- **3개 소스 통합**: 이슈 하나로 PR, 코드 위치, 아키텍처 노드까지 추적
- **Graceful Degradation**: 일부 소스만 설정해도 정상 동작

## Lessons Learned

> **"도구를 새로 만드는 것보다, 기존 워크플로우에 녹이는 것이 채택률을 결정합니다."**

처음에는 웹 대시보드를 만들려고 했습니다. 하지만 개발자들이 이미 Claude Code 안에서 작업하고 있다면, 별도 웹을 열게 만드는 것은 채택 장벽입니다. MCP 프로토콜을 선택한 것은 기술적 판단이 아니라 **사용자의 기존 습관을 존중하는 UX 판단**이었습니다.

또한 Cross-Source 추적은 개별 API 연동보다 "어떤 질문에 어떤 소스를 조합해야 하는가"라는 매칭 로직이 훨씬 어려웠습니다. PR 제목에 이슈 키가 없는 경우, 브랜치명에서 추출하고, 그것도 없으면 본문을 검색하는 fallback 체인이 실제 사용성을 결정했습니다.

**Tech Stack:** `Python` `MCP` `Jira Cloud API` `GitHub API` `Google Drive API` `PyPI`

---

> **Related:** 이 도구는 [SAiM Agent Hub](/projects/d2c8c285-0d6b-4201-875e-32867300790e) 및 [SAiM RecSys](/projects/5efd3a9a-ef62-4d0f-9959-5203cc6f437a) 프로젝트의 Jira 스프린트 관리와 아키텍처 추적을 위해 개발되었습니다.
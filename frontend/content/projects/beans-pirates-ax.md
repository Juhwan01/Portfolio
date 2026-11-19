---
title: 에이전트 중심 사내 AI 전환(AX) 체계
summary: AI 코딩 에이전트가 팀의 Jira·GitHub·설계 문서를 직접 읽고 쓰도록 도구와 작업 체계를 만들어, 기획부터 배포까지의 업무 흐름을 에이전트 중심으로 바꿨습니다. 여러 작업을 동시에 맡겨도 서로를 깨뜨리지 않고, 모든 코드 변경이 티켓으로 추적됩니다.
org: Beans Pirates
period:
  start: 2026-03
role: AI Engineer · 도구 설계·개발, 팀 작업 체계 설계
status: shipped
featured: true
order: 2
category: MCP
tags:
- MCP
- Claude Code
- Jira API
- GitHub API
- Python
- PyPI
responsibilities:
- Jira Extended MCP — 이슈 일괄 생성·일괄 상태 변경·릴리스·스프린트·이슈 링크까지 에이전트가 다루는 Jira MCP 서버를 만들어 PyPI에 공개
- ArchFlow — Jira·GitHub·draw.io를 MCP 서버 하나로 묶어, 티켓 하나로 이슈 상태·관련 PR·아키텍처 위치를 함께 답하게 함
- 팀용 Claude Code 플러그인 — 계획·구현·리뷰 에이전트, Jira 동기화, 프롬프트 인젝션 방어, 보안 검사를 묶어 누가 써도 같은 방식으로 일하게 함
- 티켓 단위 작업 체계 — 티켓 하나를 독립된 작업 공간 하나와 PR 하나로 처리하고, 작업 사이 인계는 Jira 티켓으로 남김
- 기획과의 협업 — 기획 작업 목록과 개발 작업이 같은 Jira 티켓 번호로 이어져, 기획자가 같은 도구로 진행 상황을 직접 확인
metrics:
- value: 57% → 100%
  label: 티켓으로 추적되는 코드 변경
  scope: 어떤 변경이든 티켓에서 이유와 진행 상황을 찾을 수 있음 · 챗봇 저장소 코드 변경(PR), 2026.06과 2026.11 비교
  group: 작업 흐름
  before: 57
  after: 100
  unit: '%'
- value: 0.2%
  label: 여러 작업을 동시에 진행하면서 되돌린 변경
  scope: 병렬 작업이 서로를 깨뜨리지 않음 · 2026.05~11 챗봇 저장소 main에 합쳐진 변경 가운데 되돌린(Revert) 비율
  group: 작업 흐름
- value: 98%
  label: 하루 안에 본 코드에 합쳐진 작업
  scope: 만들어 두고 묵히는 작업이 없음 · 2026.06~11 챗봇 저장소, 첫 커밋부터 합쳐지기까지(중앙값 10분)
  group: 작업 흐름
- value: 850회+
  label: 공개한 도구의 누적 다운로드(PyPI)
  scope: MCP 서버 2종 · 2026.04 이후 집계, 미러 제외
  group: 공개 도구
links:
  github: https://github.com/Juhwan01/jira-extended-mcp-server
cover: /images/projects/beans-pirates-ax/cover.png
gallery:
- /images/projects/archflow/thumbnail.png
- /images/projects/jira-extended-mcp/thumbnail.png
---

## 구조 결정

### 1. 작업 단위: 티켓 하나 = 작업 공간 하나 = PR 하나

**왜:** 챗봇 개발을 설계·구현·프롬프트·배포 트랙으로 나눠 여러 에이전트 세션이 동시에 일하므로, 트랙 사이 맥락이 끊기지 않아야 했습니다.

**바꾼 구조:**

- **이전:** 작업 공간이 역할(설계·구현·프롬프트)마다 하나뿐이라, 같은 역할의 일이 겹치면 공간을 손으로 따로 만들어야 했습니다. 인계 메모는 한곳에 쌓여 어느 기능의 일인지 읽어 봐야 알았습니다.
- **지금:** 할 일(티켓)마다 작업 공간(git worktree)과 PR을 하나씩 줍니다. 여러 에이전트가 동시에 일해도 서로의 파일을 건드리지 않고, 작업 사이 인계는 Jira 티켓으로 남깁니다. 큰 기능은 Jira의 기능 묶음 하나와 코드 줄기 하나가 짝을 이뤄, Jira만 봐도 진행 상황을 압니다.

**결과:** 챗봇 저장소 기록으로 확인한 변화입니다.

- **추적:** 모든 코드 변경이 티켓에 묶입니다. 에이전트가 [Jira Extended MCP](/projects/jira-extended-mcp)로 티켓을 직접 만들고 상태를 옮기게 되면서, 티켓과 연결된 코드 변경(PR)이 2026년 6월 57%에서 11월 100%가 됐습니다.
- **병렬 작업:** 여러 에이전트 세션이 동시에 일해도 서로의 작업을 깨뜨리지 않았습니다. 합친 뒤 되돌린 변경은 0.2%입니다.

### 2. 팀 도구: 에이전트가 직접 읽고 쓰는 MCP 서버

**왜:** 기존 Jira MCP 서버는 읽기 전용이거나 일괄 상태 변경·릴리스 관리를 지원하지 않아, 스프린트 시작 때 수십 개 이슈를 만들고 릴리스에 묶는 실제 업무를 에이전트에 맡기기 어려웠습니다. 이슈·코드·구조도도 Jira·GitHub·draw.io에 흩어져 있었습니다.

**구조:** [Jira Extended MCP](/projects/jira-extended-mcp)로 이슈 일괄 생성·상태 변경·릴리스·스프린트를 에이전트가 직접 처리하게 했습니다. [ArchFlow](/projects/archflow)로는 Jira·GitHub·draw.io를 MCP 서버 하나에 묶어, 티켓 하나를 물으면 이슈 상태·관련 PR·아키텍처 위치를 함께 답하게 했습니다. 기획자도 같은 도구로 Jira 티켓을 따라가므로, 개발 쪽에 따로 묻지 않고 진행 상황을 확인합니다.

**결과:** 두 서버(jira-extended-mcp, archflow-hub)의 PyPI 누적 다운로드가 2026년 4월 이후 850회를 넘었습니다(미러 제외).

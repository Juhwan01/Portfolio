---
title: 에이전트 중심 사내 AX 체계
summary: AI 코딩 에이전트가 팀의 Jira·GitHub·설계 문서를 직접 읽고 쓰도록 도구와 작업 체계를 만들어, 기획부터 배포까지의 업무 흐름을 에이전트 중심으로 바꿨습니다.
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
- 사내 Claude Code 하네스 — 계획·구현·리뷰 에이전트, Jira 동기화 스킬, 프롬프트 인젝션 방어 훅, 보안 검사 CI를 묶은 팀용 플러그인
- 티켓 단위 작업 체계 — 챗봇 개발을 트랙으로 나누고 티켓 하나를 git worktree 하나·PR 하나로 처리, 트랙 사이 인계는 인계용 Jira 티켓으로
metrics:
- value: 850회+
  label: PyPI 누적 다운로드
  scope: MCP 서버 2종 · 2026.04 이후 집계, 미러 제외
- value: 859건
  label: 머지된 PR
  scope: 이 체계로 운영한 챗봇 저장소 · 2026.04–11
links:
  github: https://github.com/Juhwan01/jira-extended-mcp-server
cover: /images/projects/beans-pirates-ax/cover.png
gallery:
- /images/projects/archflow/thumbnail.png
- /images/projects/jira-extended-mcp/thumbnail.png
---

## 구조 결정

### 1. 작업 단위: 티켓 하나 = 작업 공간 하나 = PR 하나

**왜:** 여러 에이전트 세션이 병렬로 일해도 트랙 사이 맥락이 끊기지 않아야 했습니다.

**구조:** 챗봇 개발을 설계·구현·프롬프트·배포 트랙으로 나누고, 티켓마다 작업 공간(git worktree) 하나와 PR 하나로 처리합니다. 트랙 사이 인계는 인계용 Jira 티켓으로 남깁니다.

**결과:** 이 체계로 운영한 챗봇 저장소에서 2026년 4~11월에 PR 859건이 머지되고 설계 결정 기록(ADR) 268건이 쌓였습니다.

### 2. 팀 도구: 에이전트가 직접 읽고 쓰는 MCP 서버

**왜:** 기존 Jira MCP는 읽기 전용이거나 일괄 상태 변경·릴리스 관리를 지원하지 않아, 스프린트 시작 때 수십 개 이슈를 만들고 릴리스에 묶는 실제 업무를 에이전트에 맡기기 어려웠습니다. 이슈·코드·구조도도 Jira·GitHub·draw.io에 흩어져 있었습니다.

**구조:** [Jira Extended MCP](/projects/jira-extended-mcp)로 이슈 일괄 생성·상태 변경·릴리스·스프린트를 에이전트가 직접 처리하게 했습니다. [ArchFlow](/projects/archflow)로는 Jira·GitHub·draw.io를 MCP 서버 하나에 묶어, 티켓 하나를 물으면 이슈 상태·관련 PR·아키텍처 위치를 함께 답하게 했습니다.

**결과:** 두 서버(jira-extended-mcp, archflow-hub)의 PyPI 누적 다운로드가 2026년 4월 이후 850회를 넘었습니다(미러 제외).

## 그 밖의 설계

- **작업 방식은 하네스 하나에:** 계획·구현·리뷰 에이전트, Jira 동기화 스킬, 프롬프트 인젝션 방어 훅, 보안 검사 CI를 팀용 Claude Code 플러그인으로 묶어, 누가 세션을 열어도 같은 방식으로 일하게 했습니다.

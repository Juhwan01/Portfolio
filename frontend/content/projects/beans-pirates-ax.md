---
title: 사내 AX — 에이전트 중심 개발 체계
summary: AI 코딩 에이전트가 팀의 Jira·GitHub·설계 문서를 직접 읽고 쓰도록 도구와 작업 체계를 만들어, 기획부터 배포까지의 업무 흐름을 에이전트 중심으로 바꿨다.
org: Beans Pirates
period:
  start: 2026-03
role: AI Engineer · 도구 설계·개발, 팀 작업 체계 설계
status: shipped
featured: true
order: 2
accent: '#b8a8ff'
category: MCP
tags:
- MCP
- Claude Code
- Jira API
- GitHub API
- Python
- PyPI
responsibilities:
- Jira Extended MCP — 이슈 일괄 생성·일괄 상태 변경·릴리스·스프린트·이슈 링크까지 Jira 도구 27개를 만들어 PyPI에 공개
- ArchFlow — Jira·GitHub·draw.io를 MCP 서버 하나로 묶어, 티켓 하나로 이슈 상태·관련 PR·아키텍처 위치를 함께 답하게 함
- 사내 Claude Code 하네스 — 계획·구현·리뷰 에이전트, Jira 동기화 스킬, 프롬프트 인젝션 방어 훅, 보안 검사 CI를 묶은 팀용 플러그인
- 티켓 단위 작업 체계 — 챗봇 개발을 트랙으로 나누고 티켓 하나를 git worktree 하나·PR 하나로 처리, 트랙 사이 인계는 Jira 쪽지로
metrics:
- value: 850회+
  label: PyPI 누적 다운로드
  scope: MCP 서버 2종 · 2026.04 이후 집계, 미러 제외
- value: 859건
  label: 머지된 PR
  scope: 이 체계로 운영한 챗봇 저장소 · 2026.04–11
- value: 268건
  label: 설계 결정 기록(ADR)
  scope: 같은 챗봇 저장소 · 2026.04–11
links:
  github: https://github.com/Juhwan01/jira-extended-mcp-server
cover: /images/projects/jira-extended-mcp/thumbnail.png
gallery:
- /images/projects/archflow/thumbnail.png
---

## 맥락과 제약

- **작은 팀:** 소수 인원이 기획·개발·배포를 함께 맡는 스타트업입니다. AI 코딩 에이전트가 사람처럼 팀 도구를 다루게 하는 것이 목표였습니다.
- **기존 Jira MCP의 한계:** 읽기 위주이거나 이슈를 하나씩만 만들 수 있어, 스프린트 시작 때 수십 개 이슈를 만들고 릴리스에 묶는 실제 업무를 에이전트에 맡기기 어려웠습니다.
- **흩어진 맥락:** 이슈는 Jira, 코드는 GitHub, 구조도는 draw.io에 있어 "이 티켓 코드 어디 있어?" 같은 질문 하나에도 여러 곳을 오가야 했습니다.

## 핵심 결정

1. **에이전트가 쓸 Jira 도구를 직접 만든다.** [Jira Extended MCP](/projects/jira-extended-mcp)는 이슈 일괄 생성(최대 50개)·일괄 상태 변경·릴리스·스프린트·이슈 링크까지 27개 도구를 갖췄습니다. 이슈 본문은 토큰이 적게 드는 Wiki Markup으로 씁니다.
2. **맥락은 티켓 하나로 묻는다.** [ArchFlow](/projects/archflow)는 Jira·GitHub·draw.io 다이어그램을 MCP 서버 하나로 묶어, 티켓 하나를 물으면 이슈 상태·관련 PR·아키텍처 위치를 함께 답합니다.
3. **티켓 하나 = 작업 공간 하나 = PR 하나.** 챗봇 개발을 설계·구현·프롬프트·배포 트랙으로 나누고, 티켓마다 git worktree 하나와 PR 하나로 처리합니다. 트랙 사이의 인계는 Jira 쪽지로 남겨, 여러 에이전트 세션이 병렬로 일해도 맥락이 끊기지 않게 했습니다.
4. **팀이 함께 쓰는 작업 방식은 하네스 하나에 담는다.** 계획·구현·리뷰 에이전트, Jira 동기화 스킬, 프롬프트 인젝션 방어 훅, 보안 검사 CI를 팀용 Claude Code 플러그인으로 묶었습니다.

## 결과

- **공개 도구 사용:** MCP 서버 2종(jira-extended-mcp, archflow-hub)의 PyPI 누적 다운로드가 2026년 4월 이후 850회를 넘었습니다(미러 제외).
- **챗봇 저장소 운영:** 이 체계로 운영한 챗봇 저장소에서 2026년 4~11월에 PR 859건이 머지되고 설계 결정 기록(ADR) 268건이 쌓였습니다.

## 막혔던 것

- **Jira v2 검색 API 폐기:** Wiki Markup은 v2 API에서 쓰는 형식인데, Jira가 v2 검색 API를 폐기했습니다. 전체를 v3로 옮기지 않고 엔드포인트마다 v2와 v3를 골라 쓰는 방식으로 대응해 Wiki Markup을 유지했습니다.

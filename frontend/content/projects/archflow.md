---
title: ArchFlow
summary: Jira·GitHub·draw.io 세 탭을 오가며 맞춰 보던 이슈·코드·구조도를, Claude Code 안에서 질문 하나로 추적하게 한 통합 MCP 서버(Context Hub).
period:
  start: 2026-03
  end: 2026-03
role: 1인 기획·설계·개발 · 교차 추적 설계, 3개 소스 연동, 설정 CLI, Claude Code 연동, PyPI 배포
team: AI 1
status: completed
featured: false
order: 14
category: MCP
tags:
- Python
- MCP
- Jira API
- GitHub API
- Google Drive API
- PyPI
responsibilities:
- 교차 추적 설계 — 이슈 키 하나로 PR·변경 파일·다이어그램 노드를 잇는 Cross-Source Matcher
- 3개 소스 연동 — Jira Cloud, GitHub, Google Drive에 저장된 draw.io 다이어그램
- 설정 CLI — archflow init 한 번으로 토큰 입력·검증, MCP 등록, 슬래시 커맨드 설치까지 처리하고 archflow doctor로 연결 상태 진단
- Claude Code 연동 — 자주 하는 질문용 슬래시 커맨드, MCP 자동 등록, PyPI 패키지(archflow-hub) 공개
links:
  github: https://github.com/Juhwan01/ArchFlow
cover: /images/projects/archflow/thumbnail.png
part_of: beans-pirates-ax
---

[사내 AX](/projects/beans-pirates-ax)의 한 부분으로, AI 코딩 에이전트가 팀의 이슈·코드·구조도를 함께 읽게 하려고 만든 도구입니다.

## 구조 결정

### 1. 형태: 웹 대시보드 대신 MCP 서버

**왜:** 팀은 이미 Claude Code 안에서 일하고 있어, 화면을 하나 더 열게 하는 것 자체가 채택 장벽이었습니다.

**바꾼 구조:** 처음 생각한 웹 대시보드를 접고, AI 어시스턴트가 바로 호출하는 MCP 서버로 만들었습니다.

**결과:** 에디터를 떠나지 않고 "KAN-42 코드 어디 있어?"라고 물으면 Jira 이슈 상태, 관련 PR과 변경 파일, 다이어그램에서 연결된 서비스를 한 응답으로 받습니다. 전에는 Jira·GitHub·draw.io 세 탭을 오가며 맞춰 보던 질문입니다.

### 2. 교차 추적: API 나열 대신 이슈 키로 세 소스 연결

**왜:** 세 API를 나란히 부르는 것만으로는 "이 티켓의 코드와 구조도 위치"가 나오지 않습니다. 어떤 질문에 어떤 소스를 조합할지 맞추는 매칭이 핵심이었고, 개별 연동보다 훨씬 어려웠습니다.

**구조:** 교차 추적기가 이슈 키로 GitHub PR을 찾고, 그 PR의 변경 파일 경로를 draw.io 다이어그램의 컴포넌트 노드와 맞춰 하나의 응답으로 합칩니다. PR 제목에 이슈 키가 없으면 브랜치명, 그래도 없으면 본문을 찾는 대체 경로를 두었습니다.

**결과:** PR 제목에 이슈 키를 적지 않은 경우에도 추적이 이어집니다. 실제로 쓸 만한지는 이 대체 경로에서 갈렸습니다.

## 그 밖의 설계

- **빠진 소스가 있어도 응답:** GitHub 토큰이 없으면 Jira와 draw.io만으로 답하고, 오류 대신 "GitHub not configured"를 돌려줍니다.
- **반복 질문은 캐시에서:** 모든 API 응답을 TTL 캐시(기본 30분)에 담아, 같은 질문을 반복하면 API를 다시 부르지 않습니다.

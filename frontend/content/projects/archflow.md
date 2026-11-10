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
- 교차 추적 설계 — 이슈 키 하나로 PR·변경 파일·다이어그램 노드를 잇는 Cross-Source Matcher와 MCP 도구 23개
- 3개 소스 연동 — Jira Cloud, GitHub, Google Drive에 저장된 draw.io 다이어그램
- 설정 CLI — archflow init 한 번으로 토큰 입력·검증, MCP 등록, 슬래시 커맨드 설치까지 처리하고 archflow doctor로 연결 상태 진단
- Claude Code 연동과 배포 — 슬래시 커맨드 6개, MCP 자동 등록, PyPI 패키지(archflow-hub) 공개
links:
  github: https://github.com/Juhwan01/ArchFlow
cover: /images/projects/archflow/thumbnail.png
part_of: beans-pirates-ax
---

## 맥락과 제약

- **사내 AX의 한 부분:** AI 코딩 에이전트가 팀의 이슈·코드·구조도를 함께 읽게 하려고 만든 도구입니다. 전체 흐름은 [사내 AX](/projects/beans-pirates-ax)에 정리했습니다.
- **맥락이 세 곳에 흩어져 있음:** 이슈는 Jira, 코드는 GitHub, 아키텍처는 draw.io에 있어 "KAN-42 코드 어디 있어?" 같은 질문 하나에도 세 탭을 오가며 맥락을 맞춰야 했습니다.
- **개발자는 이미 에디터 안에 있음:** 팀은 Claude Code 안에서 일하고 있어, 별도 화면을 하나 더 열게 하는 것 자체가 채택 장벽이었습니다.

## 핵심 결정

1. **웹 대시보드 대신 MCP 서버로 만든다.** 처음에는 웹 대시보드를 생각했습니다. 하지만 별도 웹을 열게 하는 것이 채택 장벽이라고 보고, AI 어시스턴트가 바로 호출하는 MCP 서버로 방향을 바꿨습니다. 에디터를 떠나지 않고 자연어로 묻고 답을 받습니다.
2. **이슈 키 하나로 세 소스를 잇는다.** 세 API를 나란히 부르는 데서 끝내지 않습니다. 교차 추적기가 이슈 키로 GitHub PR의 제목·브랜치명·본문을 찾고, 그 PR에서 바뀐 파일 경로를 뽑아 draw.io 다이어그램의 컴포넌트 노드와 맞춘 뒤 하나의 응답으로 합칩니다.
3. **빠진 소스가 있어도 답한다.** GitHub 토큰이 없으면 Jira와 draw.io만으로 답하고, 오류 대신 "GitHub not configured"를 돌려줍니다. 모든 API 응답은 TTL 캐시(기본 30분)에 담아, 같은 질문을 반복하면 API를 다시 부르지 않습니다.

## 결과

- **질문 하나로 교차 추적:** "KAN-42 코드 어디 있어?"라고 물으면 Jira 이슈 상태, 관련 PR과 변경 파일, 다이어그램에서 연결된 서비스를 한 응답으로 받습니다.
- **도구 23개와 슬래시 커맨드 6개:** Jira 7, GitHub 6, draw.io 4, 교차 추적 5, 통합 검색 1개 도구 위에 현황·추적·아키텍처·온보딩·리포트·검색 커맨드를 두어, 자주 하는 질문은 커맨드 하나로 시작합니다.

## 막혔던 것

- **PR에 이슈 키가 없을 때:** 개별 API 연동보다 "어떤 질문에 어떤 소스를 조합할지" 정하는 매칭이 훨씬 어려웠습니다. PR 제목에 이슈 키가 없으면 브랜치명에서 찾고, 그래도 없으면 본문을 검색하는 대체 경로를 두었습니다. 실제 쓸모는 이 경로가 갈랐습니다.

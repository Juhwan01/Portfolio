---
title: PaperGraph
summary: 논문을 읽다 떠오른 질문을 화면 옆 사이드 패널에 자연어로 물어, 의미 기반 검색과 후속 질문으로 관련 논문을 찾아가는 Electron 데스크톱 AI 챗봇.
period:
  start: 2026-01
  end: null
role: 개인 프로젝트 · 검색 엔진, 백엔드 API, 데스크톱 앱 전체 설계·구현
team: AI 1
status: in-progress
featured: false
order: 16
category: AI
tags:
- OpenSearch
- FastAPI
- Electron
responsibilities:
- 논문 의미 검색 — 논문 제목·초록·키워드를 벡터로 바꿔 AWS OpenSearch에 색인하고 질문과의 의미 유사도로 검색
- 검색·챗봇 API — FastAPI 백엔드
- 데스크톱 사이드 패널 — 화면 오른쪽에 상주하는 Electron 앱
- 대화형 탐색 — 후속 질문으로 비슷한 연구나 같은 방법론을 쓴 논문을 이어 찾는 흐름
links:
  github: https://github.com/Juhwan01/PaperGraph
cover: /images/projects/papergraph/thumbnail.png
gallery:
- /images/projects/papergraph/image-01.png
- /images/projects/papergraph/image-02.png
---

## 구조 결정

### 1. 위치: 브라우저 대신 화면 옆 사이드 패널

**왜:** 논문을 읽다 "이 분야 최신 연구는 뭐가 있지?"라는 질문이 떠오를 때, 브라우저를 열고 검색하고 거르는 과정 자체가 연구 흐름을 끊습니다.

**구조:** Electron 데스크톱 앱이 화면 오른쪽에 패널로 상주해, 논문을 읽다가 창을 바꾸지 않고 자연어로 묻습니다.

### 2. 검색: 키워드 매칭 대신 의미 검색과 후속 질문

**왜:** 논문 검색에서 가장 어려운 것은 무엇을 모르는지 모르는 상황인데, 키워드 검색은 이미 아는 단어로만 찾아 줍니다.

**구조:** 논문의 제목·초록·키워드를 벡터로 바꿔 AWS OpenSearch에 색인하고, 질문과 의미가 가까운 논문을 찾습니다. 결과를 목록으로 끝내지 않고 "이 논문과 비슷한 연구", "이 방법론을 쓴 다른 논문" 같은 후속 질문으로 논문 사이 관계를 따라갑니다.

## 지금 상태

사이드 패널에서 자연어로 묻고, 의미 검색으로 찾은 논문에서 후속 질문으로 관련 논문을 이어 찾는 흐름까지 만들었습니다(진행 중).

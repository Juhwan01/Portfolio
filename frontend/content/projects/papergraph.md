---
title: PaperGraph
description: PaperGraph는 연구자들이 학술 논문을 빠르고 정확하게 검색하고 이해할 수 있도록 돕는 Electron 기반 AI 챗봇입니다. 데스크톱 사이드 패널 형태로 언제든 호출 가능하며, 대화형 인터페이스를 통해 논문 검색과 탐색을 지원합니다.
category: AI
tech_stack:
- OpenSearch
- FastAPI
- Electron
thumbnail_url: /images/projects/papergraph/thumbnail.png
images:
- /images/projects/papergraph/thumbnail.png
- /images/projects/papergraph/image-01.png
- /images/projects/papergraph/image-02.png
demo_url: ''
github_url: https://github.com/Juhwan01/PaperGraph
featured: true
status: in_progress
start_date: ''
end_date: ''
order: 6
notion_page_id: 2f26efa211b2802d9fdad0101ebcec56
video_url: ''
team_composition:
- role: AI
  count: 1
slide_url: ''
highlight: null
id: 5e8986af-a27d-493b-86fc-3d5108939876
created_at: '2026-01-28T06:38:00.389027Z'
updated_at: '2026-03-27T11:40:39.360573Z'
---

## Problem

논문 검색은 연구의 첫 단계이자 가장 많은 시간이 소요되는 작업입니다. Google Scholar나 Semantic Scholar에서 키워드로 검색하면 수백 개의 결과가 쏟아지지만, 정작 내 연구와 관련된 핵심 논문을 찾기까지 상당한 시간이 걸립니다.

> 논문을 읽다가 "이 분야의 최신 연구는 뭐가 있지?" 같은 질문이 떠오를 때, 브라우저를 열고 검색하고 필터링하는 과정 자체가 연구 흐름을 끊습니다.

## My Role: 전체 설계 및 구현 (개인 프로젝트)

검색 엔진, 백엔드 API, 데스크톱 앱까지 전체를 단독으로 설계하고 구현했습니다.

## Approach

### 1. 데스크톱 사이드 패널 형태의 AI 챗봇

Electron 기반 데스크톱 앱으로, 화면 오른쪽에 사이드 패널 형태로 상주합니다. 논문을 읽다가 궁금한 점이 생기면 패널에 자연어로 질문하면 됩니다. 브라우저 전환 없이 연구 흐름을 유지할 수 있습니다.

### 2. OpenSearch 기반 논문 검색 엔진

단순 키워드 매칭이 아닌 의미 기반 검색을 위해 AWS OpenSearch를 활용했습니다. 논문의 제목, 초록, 키워드를 벡터화하여 인덱싱하고, 사용자 질문과의 의미적 유사도를 기반으로 관련 논문을 검색합니다.

| 구성 요소 | 역할 |
|-----------|------|
| OpenSearch | 논문 벡터 인덱싱 및 의미 검색 |
| FastAPI | 검색 API 및 챗봇 백엔드 |
| Electron | 데스크톱 사이드 패널 UI |

### 3. 대화형 논문 탐색

검색 결과를 단순히 나열하는 것이 아니라, 대화형 인터페이스를 통해 논문을 탐색합니다. "이 논문과 비슷한 연구", "이 방법론을 사용한 다른 논문" 같은 후속 질문으로 논문 간 관계를 파악할 수 있습니다.

## Results

- OpenSearch 기반 의미 검색으로 키워드 검색 대비 관련성 높은 결과 제공
- Electron 사이드 패널로 연구 흐름 중단 없는 논문 탐색 경험 구현
- 대화형 인터페이스로 논문 간 관계 탐색 지원

## Lessons Learned

> **검색 문제는 결국 "맥락" 문제입니다.**

논문 검색에서 가장 어려운 것은 사용자가 "무엇을 모르는지 모르는" 상황입니다. 키워드 검색은 이미 알고 있는 것만 찾을 수 있지만, 의미 기반 검색은 "비슷한 것"을 찾아줍니다. OpenSearch의 벡터 검색을 적용하면서 검색 시스템 설계에서 맥락의 중요성을 체감했습니다.

**Tech Stack:** `OpenSearch` `FastAPI` `Electron`
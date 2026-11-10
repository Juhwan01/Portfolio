---
title: Chef's Market
summary: 사용자 데이터가 없는 서비스 초기에도 추천이 동작하도록, 프로필 점수로 시작해 행동 데이터가 쌓이면 Q-learning이 주도하는 하이브리드 레시피 추천을 만든 졸업작품입니다.
org: 인제대학교 졸업작품
period:
  start: 2025-01
  end: 2025-04
role: 팀장(5인 팀) · 강화학습 기반 추천 엔진 설계 및 개발 총괄
team: Frontend 1 · Backend 2 · AI 2
status: completed
featured: true
order: 6
category: ML
tags:
- Python
- FastAPI
- Q-learning
- AWS RDS
- AWS S3
- PostgreSQL
responsibilities:
- 팀장 — 5인 팀을 이끌며 AI 추천 엔진과 백엔드 API를 주도
- 하이브리드 추천 엔진 — 콘텐츠 기반·Q-learning·인기도·다양성 점수를 합친 추천 로직 설계·구현
- 콜드 스타트 단계 설계 — 프로필만 있는 첫날부터 Q-learning이 주도하는 단계까지 점수 비중이 옮겨 가는 구조
- 백엔드 API — FastAPI로 레시피·재료 매핑·검색 API
links:
  github: https://github.com/Juhwan01/Capstone_II
  video: /videos/projects/chefs-market/demo.mp4
cover: /images/projects/chefs-market/thumbnail.png
gallery:
- /images/projects/chefs-market/image-01.png
---

사용자가 가진 식재료로 레시피를 추천하고 식재료를 거래하는 플랫폼을 졸업작품으로 만들었습니다.

## 구조 결정

### 1. 추천 엔진: 순수 Q-learning 대신 단계형 하이브리드

**왜:** 서비스 초기라 사용자 데이터가 없고, 선호는 겨울엔 국물·여름엔 차가운 면처럼 시간에 따라 바뀝니다. 협업 필터링은 이력이 있어야 하고 다시 학습해야 변화를 반영해서, 피드백으로 계속 배우는 Q-learning을 골랐습니다. 그런데 Q-learning만 적용하자 초기 탐색 단계에서 완전히 무작위인 추천이 나왔습니다.

**바꾼 구조:** 콘텐츠 기반·Q-learning·인기도·다양성 네 점수를 합치고, 데이터가 쌓이는 정도에 따라 비중을 옮깁니다.

1. 첫날: 사용자 프로필과 레시피를 맞춰 보는 콘텐츠 점수로 추천
2. 1주 뒤: Q-learning 탐색과 인기도 점수를 더함
3. 한 달 뒤: Q-learning이 추천을 주도

인기도 점수는 전체 트렌드를, 다양성 점수는 편향 방지를 보조로 맡습니다.

**결과:** 목 데이터 없이도 가입 첫날부터 프로필에 맞는 추천이 나오고, 행동 데이터가 쌓일수록 Q-learning 쪽으로 비중이 옮겨 갑니다.

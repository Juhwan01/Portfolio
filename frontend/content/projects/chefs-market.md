---
title: Chef's Market
summary: 데이터가 없는 서비스 초기에도 추천이 동작하도록, 프로필 점수로 시작해 행동 데이터가 쌓이면 Q-learning이 주도하는 하이브리드 레시피 추천.
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
links:
  github: https://github.com/Juhwan01/Capstone_II
  video: /videos/projects/chefs-market/demo.mp4
cover: /images/projects/chefs-market/thumbnail.png
gallery:
- /images/projects/chefs-market/image-01.png
---

## Problem

졸업작품으로 개발한 레시피 추천 및 식재료 거래 플랫폼.

> 신규 사용자가 가입한 직후, 어떤 음식을 좋아하는지 전혀 모르는 상태에서 레시피를 추천해야 합니다. 그런데 서비스 초기에는 기존 사용자 데이터도 없습니다.

## My Role: AI + Backend + DevOps (팀장)

5인 팀(Frontend 1, Backend 2, AI 2)의 **팀장**으로 AI 추천 엔진, 백엔드 API, 인프라 구축을 주도했습니다.

| 담당 영역 | 구현 내용 |
|-----------|----------|
| AI 추천 | Q-learning 하이브리드 추천 로직 설계 및 구현 |
| Backend | FastAPI 기반 레시피 CRUD, 유저 관리, 재료 매핑, 검색 API |
| 권한 시스템 | 사용자/판매자/관리자 3단계 Depends 체인 |
| DevOps | AWS RDS 연결, VPC 네트워크 아키텍처, 배포 |

## Approach

### 1. 왜 Q-learning인가? (강화학습을 선택한 근거)

레시피 추천에서 사용자의 선호는 **시간에 따라 변합니다.** 겨울에는 따뜻한 국물, 여름에는 차가운 면. 정적인 추천 모델로는 이 변화를 반영할 수 없습니다.

| 알고리즘 | 콜드 스타트 | 시간적 변화 | 탐색-활용 |
|---------|-----------|-----------|--------|
| Collaborative Filtering | X (이력 필요) | X (재학습 필요) | X |
| Content-Based | O (프로필 매칭) | X (정적) | X |
| **Q-learning** | **O (탐색 모드)** | **O (실시간 학습)** | **자동** |

Q-learning의 핵심 장점: **탐색(exploration)과 활용(exploitation)의 균형을 자동으로 조절합니다.** 데이터가 없을 때는 다양한 레시피를 탐색하고, 피드백이 쌓이면 선호에 맞는 레시피를 집중 추천합니다.

### 2. 단순 Q-learning의 한계와 하이브리드 설계

순수 Q-learning만 적용하면 초기 탐색 단계에서 **완전히 랜덤한 추천**이 나와 사용자 경험이 나빠집니다. 이 문제를 해결하기 위해 4가지 점수를 결합한 하이브리드 시스템을 설계했습니다.

| 점수 | 역할 | 데이터 0일 때 | 데이터 100+일 때 |
|------|------|-------------|----------------|
| 콘텐츠 기반 | 프로필-레시피 매칭 | **주도 (콜드 스타트 해결)** | 보조 |
| Q-learning | 행동 기반 학습 | 탐색 모드 | **주도 (개인화)** |
| 인기도 | 전체 트렌드 | 보조 | 보조 |
| 다양성 | 편향 방지 | 보조 | 보조 |

> **핵심 설계:** 콘텐츠 기반 점수가 콜드 스타트를 커버하고, 데이터가 쌓이면 Q-learning이 자연스럽게 가중치를 가져가는 **전이(transition) 구조**입니다.

### 3. 목 데이터에서 실 데이터로의 전환 설계

서비스 초기에는 사용자 데이터가 없으므로, **목 데이터 없이도 동작하는 구조**를 설계했습니다:

- **Phase 1 (Day 1):** 콘텐츠 기반 점수만으로 추천 (사용자 프로필만 필요)
- **Phase 2 (Week 1+):** Q-learning 탐색 시작, 인기도 점수 반영
- **Phase 3 (Month 1+):** Q-learning이 주도, 완전한 개인화

### 4. 권한 시스템: 왜 미들웨어가 아닌 Depends 체인인가?

Django 스타일의 미들웨어 대신 FastAPI의 Depends 체인을 선택한 이유:

1. **엔드포인트별 세밀한 제어:** 미들웨어는 URL 패턴으로만 구분
2. **테스트 용이성:** 의존성 주입으로 모킹 간편
3. **명시적:** 각 엔드포인트에 필요한 권한이 코드에 드러남

## Results

- Q-learning + 콘텐츠 기반 하이브리드 추천으로 콜드 스타트 해결
- 3단계 역할 기반 접근 제어 시스템 구현
- AWS VPC/RDS 네트워크 아키텍처 실전 배포
- 졸업작품 완성 및 발표

## Lessons Learned

> **"완벽한 데이터가 없으면 시작할 수 없다"는 것은 착각입니다.**

처음에는 추천 시스템을 만들려면 대규모 사용자 데이터가 필수라고 생각했습니다. 하지만 콜드 스타트는 데이터 문제가 아니라 **설계 문제**입니다. 데이터가 없을 때도 합리적으로 동작하고, 데이터가 쌓이면 자연스럽게 좋아지는 구조를 설계하는 것이 핵심이었습니다.

순수 Q-learning만 적용했을 때 초기 랜덤 추천으로 사용자 이탈이 발생한 경험이, 하이브리드 설계로 이어진 가장 직접적인 계기였습니다. 이 프로젝트의 경험이 이후 SAiM RecSys에서 LinUCB를 선택하는 근거가 되었습니다.

**Tech Stack:** `Python` `Q-learning` `FastAPI` `PostgreSQL` `AWS (EC2, RDS, VPC)`
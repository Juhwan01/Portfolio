---
title: SAiM RecSys
summary: 개인 맞춤형 운동 추천 엔진. LinUCB Contextual Bandit + FastAPI + Full MLOps Pipeline. 605개 운동 x 6개 페르소나 기반 추천 시스템.
period:
  start: 2026-03
  end: 2026-03
status: archived
featured: false
order: 90
category: ML
tags:
- Python
- FastAPI
- LinUCB
- K-Prototypes
- Docker
- pytest
- MLOps
links:
  github: https://github.com/Juhwan01/SAiM-RecSys
cover: /images/projects/saim-recsys/thumbnail.png
note: 폐기한 프로젝트 — 목록에 노출하지 않음
---

## Problem

605개 운동 중 사용자에게 맞는 것을 추천해야 하지만, **실제 사용자 데이터가 전혀 없었습니다.**

> 추천 시스템은 데이터로 학습하는데, 데이터가 없으면 어떻게 시작할 것인가?

## My Role: AI Engineer (1인 개발)

개인 프로젝트로 데이터 생성, 추천 엔진, 안전 시스템, 백엔드 API, 배포까지 **전 과정을 단독 설계/구현**했습니다.

| 담당 영역 | 구현 내용 |
|-----------|----------|
| 데이터 | TVAE 합성 데이터 생성, KNHANES 분포 검증 |
| 추천 엔진 | LinUCB Contextual Bandit 설계/구현 |
| 안전 시스템 | ACSM/NSCA 기반 3단계 안전 필터 |
| 인프라 | FastAPI + Redis + PostgreSQL + Docker 배포 |

## Approach

### 1. 합성 데이터를 어떻게 신뢰할 수 있게 만들 것인가?

랜덤 생성은 실제 한국인의 체형/건강 분포와 맞지 않습니다. **국가 수준 실측 데이터**를 시드로 사용했습니다.

| 데이터 소스 | 규모 | 역할 |
|------------|------|------|
| 세종시 InBody 체성분 | 45,966건 | 체성분 분포 시드 |
| KNHANES 국민건강영양조사 | 62개 계층 | 운동습관/건강 조건부 확률 |

이 데이터를 기반으로 **TVAE**(NeurIPS 2019)로 1,002명의 합성 사용자를 생성하고, KS-test로 분포 일치를 검증했습니다. K-Prototypes 클러스터링으로 6개 페르소나(젊은 남성 벌크업, 중년 여성 건강유지, 부상 이력 보유자 등)를 도출한 뒤, 룰베이스 시뮬레이터로 **50,100건의 세션 데이터**를 생성했습니다.

### 2. 왜 LinUCB인가?

Two-Tower + BPR도 구현하여 비교했습니다.

| 알고리즘 | Cold Start | 합성 데이터 적합성 | 선택 |
|---------|-----------|------------------|------|
| Two-Tower + BPR | X (이력 필요) | 낮음 (분포 오차에 민감) | 폐기 |
| Collaborative Filtering | X (이력 필요) | 낮음 | 폐기 |
| **LinUCB** | **O (Context만)** | **높음** | **채택** |

핵심 판단: 합성 데이터에서 사용자 간 상호작용 패턴은 재현이 어렵지만, **Context(나이, 체력, BMI)는 KNHANES로 정확히 재현 가능**합니다.

### 3. 안전성: 정확도보다 중요한 것

운동 추천에서 잘못된 추천은 부상으로 이어집니다. ACSM/NSCA 가이드라인 기반 3단계 안전 시스템:

- **RPE 상한** — 연령별 운동 강도 제한 (시니어 RPE <= 7.0)
- **Hard Block** — 부상 이력 기반 고위험 운동 완전 차단
- **ExerciseSubstitutor** — 차단된 운동의 대체를 Weighted Jaccard Similarity로 자동 제안

무게/세트/강도 처방은 1RM 추정(Takagi et al. 2022) 기반으로 학술 근거에 따라 설계했습니다.

### 4. 실데이터 전환을 고려한 설계

BaseEngine Protocol로 추천 엔진을 추상화하여, 실데이터 확보 시 **아키텍처 변경 없이** 모델 교체가 가능합니다.

## Results

| 지표 | 값 |
|------|-----|
| **Hit@10** | **70.6%** (95% CI: 67.6~73.1%) |
| vs Random | **11.7x** (Random: 4.9%) |
| 안전 위반 | **0건** |
| 테스트 | 123개 전체 통과 |
| 외부 API 비용 | **$0** |

## Lessons Learned

> 합성 데이터의 한계를 인정하는 것이 오히려 설계를 강하게 만들었습니다.

Context 분포는 KNHANES로 활용하고, 상호작용 패턴의 약점은 ACSM/NSCA 도메인 규칙으로 보완하는 전략이 핵심이었습니다. Two-Tower를 구현하고 버린 경험, LLM 시뮬레이터를 프로토타이핑하고 룰베이스로 전환한 경험 등, **시도하고 근거를 가지고 폐기한 과정**이 최종 아키텍처의 신뢰도를 높였습니다.

**Tech Stack:** `Python` `LinUCB` `TVAE` `K-Prototypes` `FastAPI` `PostgreSQL` `Redis` `Docker` `MLflow`
---
title: 구조물 안정성 물리 추론 AI
summary: 정면·상단 두 시점 이미지로 10초 뒤 구조물 붕괴 여부를 예측. 시뮬레이션 영상에서 뽑은 소프트 레이블로 학습하고, 실험실·실제 환경의 색 차이를 Fourier Domain Adaptation으로 줄임.
org: DACON
period:
  start: 2026-03
  end: 2026-03
role: 1인 참가 · 데이터 분석, 도메인 적응, 모델 설계·학습, 앙상블 전담
team: AI 1
status: completed
featured: false
order: 11
category: ML
tags:
- Python
- PyTorch
- ConvNeXt-V2
- FDA
- Knowledge Distillation
- Transformer
responsibilities:
- 도메인 차이 측정 — Train(실험실)과 Dev(실제 환경)의 색상·조명 차이를 Hue·Value·RGB 거리로 재고, 차이가 저주파에 몰려 있음을 확인
- 두 시점 모델 — 시점마다 ConvNeXt-V2 인코더를 두고 Transformer Cross-Attention으로 융합, 움직임·붕괴 시점·심각도 보조 과제
- 소프트 레이블 — 대회 제공 시뮬레이션 영상의 프레임 간 변위로 불안정한 정도를 연속값으로 만들어 정답 레이블과 혼합
- FDA 적용 — 별도 학습 없이 Train 이미지의 저주파 성분만 Dev 것으로 바꿔 색 분포를 맞춤
metrics:
- value: −81%
  label: 예측 오차(LogLoss)
  before: 0.1296
  after: 0.0242
  scope: 버전별 실험 기록 · 베이스라인(v1) → v8
links:
  github: https://github.com/Juhwan01/structural-stability-prediction
---

DACON 대회에 혼자 참가해, 기법을 버전마다 더하며 LogLoss로 효과를 확인했습니다.

## 구조 결정

### 1. 모델: 한 인코더 대신 시점별 인코더와 융합

**왜:** 정면에서는 수평 변위, 상단에서는 회전·붕괴 패턴이 핵심 정보라 시점마다 봐야 할 것이 다릅니다.

**구조:** 시점마다 ConvNeXt-V2 인코더와 GeM 풀링을 두고 Transformer Cross-Attention으로 융합했습니다.

**결과:** LogLoss 0.1296(v1 베이스라인) → 0.0891(두 시점 분리를 넣은 v4), −31%.

### 2. 학습 신호: 0/1 정답에 소프트 레이블 혼합

**왜:** 0/1 정답만으로는 구조물이 얼마나 불안정한지를 배울 수 없습니다.

**구조:** 대회가 제공한 시뮬레이션 영상에서 첫 프레임과 마지막 프레임의 구조 변위를 재 연속값 레이블을 만들고, 정답 레이블과 alpha 0.7로 섞어 Teacher 신호로 썼습니다. 움직임 회귀와 붕괴 시점·심각도 분류를 보조 과제로 붙였습니다.

**결과:** LogLoss 0.0891(v4) → 0.0242(소프트 레이블·보조 과제를 더한 v8), −73%.

### 3. 도메인 차이: 픽셀 증강 대신 주파수 영역 색 맞춤

**왜:** Train은 실험실, Dev는 실제 환경 데이터라 색상·조명이 크게 달랐습니다(EDA 기준 Hue Train 71.6 · Dev 99.0, RGB 거리 43.6). 그대로 학습하면 모델이 구조물 형태보다 배경 색에 과적합했고, ColorJitter·CLAHE 같은 픽셀 증강은 효과가 제한적이었습니다. 차이를 재 보니 저주파에 몰려 있었습니다.

**바꾼 구조:** 구조물 형태는 고주파, 색상·조명은 저주파에 담깁니다. FFT로 Train 이미지의 저주파 성분만 Dev 것으로 바꾸는 FDA를 적용해, CycleGAN 같은 생성 모델을 따로 학습하지 않고 색 분포를 맞췄습니다.

**결과:** FDA를 더한 v15의 LogLoss는 약 0.024로 v8 수준을 유지했습니다.

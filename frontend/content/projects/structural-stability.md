---
title: 구조물 안정성 물리 추론 AI
description: DACON 경진대회. 멀티뷰 이미지 기반 구조물 안정성 예측. Dual-Stream ConvNeXt-V2 + Fourier Domain Adaptation.
category: ML
tech_stack:
- Python
- PyTorch
- ConvNeXt-V2
- FDA
- Knowledge Distillation
- Transformer
thumbnail_url: null
images: []
demo_url: null
github_url: https://github.com/Juhwan01/structural-stability-prediction
featured: false
status: completed
start_date: null
end_date: null
order: 16
notion_page_id: null
video_url: null
team_composition:
- role: AI
  count: 1
slide_url: null
highlight: 물리 추론 AI
id: 46d56a4e-f319-404d-a094-d01692f38794
created_at: '2026-03-25T11:08:39.898539Z'
updated_at: '2026-03-27T16:26:36.436344Z'
---

## My Role: AI Engineer (1인 참가)

DACON 경진대회에 개인으로 참가하여 데이터 분석, 도메인 적응, 모델 설계/학습, 앙상블까지 전체 파이프라인을 담당했습니다.

## Problem

DACON 구조물 안정성 물리 추론 AI 경진대회. 정면/상단 2개 시점 이미지에서 10초 후 구조물의 안정성을 예측해야 했습니다.

> **핵심 난제:** Train(실험실)과 Dev(실제 환경) 간 색상/조명이 완전히 달라, 모델이 구조물 형태가 아닌 배경 색상에 과적합했습니다.

| 지표 | Train (실험실) | Dev (실제 환경) |
|------|---------------|----------------|
| Hue | 71.6 (따뜻한 톤) | 99.0 (차가운 톤) |
| Value | 235.9±3.6 (밝음) | 211.0±12.1 (어둡고 불균일) |
| RGB 거리 | - | **43.6** (완전히 다른 색공간) |

## Approach

### 왜 Dual-Stream인가?

단일 인코더에 정면+상단을 함께 넣으면 두 시점의 특성이 섞입니다. 정면은 **수평 변위**, 상단은 **회전/붕괴 패턴**이 핵심 정보인데, 이를 독립적으로 인코딩한 후 Cross-Attention으로 융합하는 것이 물리적으로 더 합리적이라고 판단했습니다.

- 각 시점별 ConvNeXt-V2 인코더 + GeM Pooling
- Transformer Cross-Attention으로 두 시점 간 정보 융합
- Auxiliary Tasks: 움직임 회귀, 붕괴 시점/심각도 분류

### 왜 Knowledge Distillation인가?

대회에서 제공된 `simulation.mp4` 영상에는 Hard Label(안정/불안정)보다 풍부한 정보가 담겨 있었습니다.

> 첫 프레임과 마지막 프레임의 구조적 변위를 측정하면, **"얼마나 불안정한가"** 라는 연속적 확률값을 추출할 수 있습니다.

```
Hard Label: 0 또는 1 (정보 손실 큼)
Soft Label: 0.73 (구조 변위량에 비례, 정보 풍부)
→ alpha=0.7로 혼합하여 Teacher 신호로 활용
```

이 결정이 v1(0.1296) → v8(0.0242)의 **5.3배 성능 개선**의 핵심이었습니다.

### 왜 FDA(Fourier Domain Adaptation)인가?

일반적인 Domain Adaptation(Style Transfer, CycleGAN)은 학습 비용이 높고 아티팩트가 발생합니다. EDA 결과, Train/Dev 간 차이가 **색상/조명(저주파)**에 집중되어 있음을 확인했습니다.

> **핵심 통찰:** 구조물 형태는 고주파, 색상/조명은 저주파. FFT로 분리하면 학습 없이 Domain Adaptation이 가능하다.

```
FFT(Train) → 저주파(색상)만 Dev 것으로 교체 → IFFT
결과: Hue 75 → 97 (목표 ~100), 구조물 형태 100% 보존
```

CycleGAN 대비 **학습 불필요, 아티팩트 제로, 실행 시간 0.1초 미만**이라는 압도적 이점.

## Results

| 버전 | 기법 | LogLoss | 핵심 결정 |
|------|------|---------|----------|
| v1 | Baseline | 0.1296 | 단일 인코더 |
| v4 | Dual-Stream | 0.0891 | 시점 분리 인코딩 |
| v8 | + KD + Multi-task | **0.0242** | Soft Label 도입 |
| v15 | + FDA | ~0.024 | Domain Adaptation |

## Lessons Learned

> **Data Augmentation으로 해결이 안 되면, 문제의 원인을 주파수 영역에서 다시 분석해보아야 합니다.**

처음에는 ColorJitter, CLAHE 등 픽셀 공간 Augmentation으로 해결하려 했지만 효과가 제한적이었습니다. "왜 안 되는가?"를 파고들어 RGB 거리가 43.6이라는 수치를 확인하고, 이 차이가 저주파에 집중됨을 증명한 후 FDA를 적용했습니다.

15번의 실험 반복에서 배운 것은, **가장 큰 성능 점프는 새로운 모델이 아니라 문제를 다른 관점에서 바라보는 것**에서 나온다는 것입니다.

**Tech Stack:** `PyTorch` `ConvNeXt-V2` `FDA` `Knowledge Distillation` `5-Fold CV` `TTA`

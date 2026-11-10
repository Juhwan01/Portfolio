---
title: 'Track1 알고리즘 부문 : K리그-서울시립대 공개 AI 경진대회'
description: 'K리그 경기 내 주어진 플레이 시퀀스의 마지막 패스 도착 좌표(X,Y)를 예측하는 AI 모델을 개발해야합니다.

  제공되는 좌표 값은 모든 경기장의 실제 크기 차이를 보정하고 일관된 분석을 제공하기 위해, 피파 공식 권장 경기장 규격인 105 x 68 크기의 그리드에 매핑한 상대 좌표 값입니다.'
category: ML
tech_stack:
- Python
- PyTorch
- LSTM
- MDN
- scikit-learn
- pandas
thumbnail_url: /images/projects/kleague-pass-prediction/thumbnail.png
images: []
demo_url: ''
github_url: https://github.com/Juhwan01/KLeague-Pass-Prediction
featured: true
status: completed
start_date: 2025.12.01
end_date: 2025.01.12
order: 10
notion_page_id: 2ed6efa211b280359b40f50da83013f5
video_url: ''
team_composition:
- role: AI
  count: 1
slide_url: ''
highlight: 상위 9%
id: 40f91fa2-56bc-461a-b818-50309672acf2
created_at: '2026-01-19T07:27:00.601079Z'
updated_at: '2026-03-27T11:40:39.360573Z'
---

## Problem

K리그 경기 데이터에서 주어진 플레이 시퀀스의 마지막 패스 도착 좌표(X, Y)를 예측하는 AI 모델을 개발하는 대회입니다. 좌표 값은 FIFA 공식 권장 규격(105 x 68)에 매핑된 상대 좌표입니다.

> 축구 패스는 여러 합리적 선택이 동시에 존재하는 다중모드(multi-modal) 문제입니다. 단일 회귀 모델은 "중간 지점"을 예측하게 되어 비현실적인 결과를 낳습니다.

## My Role: AI 모델링 전체

사실상 솔로로 EDA부터 최종 모델(V15)까지 전체 AI 파이프라인을 설계하고 구현했습니다.

### 1. 문제 본질 파악: 확률 분포 모델링

패스의 도착 지점은 하나의 "정답"이 아니라 여러 합리적 선택이 존재합니다. 이를 단일 값이 아닌 **확률 분포로 모델링**하기 위해 MDN(Mixture Density Network)을 도입했습니다.

### 2. 단계별 모델 발전 (V10 → V15)

| 버전 | 핵심 개선 | 효과 |
|------|-----------|------|
| V10 | LSTM-MDN 기본 모델 (2개 가우시안) | 확률 분포 모델링 도입 |
| V11 | Y축 데이터 증강 (경기장 좌우 대칭) | 학습 데이터 2배, 좌우 편향 제거 |
| V12 | N-gram 패턴 + 팀ID 임베딩 | 전술 패턴 학습 (단기/중기) |
| V13 | 5-Fold 크로스 밸리데이션 | 앙상블로 variance 감소 |
| V14 | 가우시안 헤드 2개 → 10개 | 복잡한 분포 표현력 강화 |
| V15 | TTA (Test-Time Augmentation) | 재학습 없이 추론 성능 향상 |

### 3. 물리와 전술의 분리 설계

V12에서 가장 큰 성능 도약이 있었습니다. LSTM이 순수 물리적 피처(위치, 속도, 각도)를 학습하고, N-gram 임베딩이 전술적 패턴(최근 3~5개 액션)을 별도로 학습하는 **이중 구조**를 설계했습니다.

전술 드롭아웃(30%)을 적용하여 물리 엔진이 전술 정보에 과의존하는 것을 방지하고, 일반화 성능을 확보했습니다.

### 4. 다층적 불확실성 처리

- **모델 수준**: 10개 가우시안으로 분포 표현
- **앙상블 수준**: 5-Fold로 모델 다양성 확보
- **증강 수준**: TTA로 기하학적 대칭성 활용
- 최종: 5-Fold x TTA = 총 10개 예측의 평균

## Results

- 최종 모델: LSTM-MDN + Y축증강 + N-gram임베딩 + 5-Fold + 10 Gaussians + TTA
- Baseline 대비 지속적 성능 향상 (20.7 → 13점대 진입)
- 6단계 점진적 모델 발전으로 각 기법의 기여도를 명확히 분리

## Lessons Learned

> **스포츠 데이터는 "도메인 지식의 체계적 통합"이 성능을 좌우합니다.**

순수 ML 기법만으로는 한계가 있었고, 축구 경기의 기하학적 특성(좌우 대칭), 전술적 맥락(역습, 빌드업), 물리적 관성을 각각 피처로 번역했을 때 성능이 크게 향상되었습니다. 특히 "물리적으로는 (50,30)인데, 역습이고 특정 팀이니까 (55,25)로 조정"하는 식의 물리-전술 분리가 핵심 인사이트였습니다.

급진적 변화보다 단계적 복잡도 증가(V10→V15)가 각 기법의 효과를 검증하면서도 안정적으로 성능을 끌어올리는 전략이었습니다.

**Tech Stack:** `Python` `PyTorch` `LSTM` `MDN` `scikit-learn` `pandas`
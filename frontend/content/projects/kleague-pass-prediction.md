---
title: K리그 패스 도착 좌표 예측
summary: 경기 플레이 시퀀스를 보고 마지막 패스가 도착할 좌표를 예측하는 모델(LSTM + Mixture Density Network)입니다. 1인 참가로 Track1 상위 9%에 들었습니다.
org: DACON · K리그-서울시립대 공개 AI 경진대회 Track1
period:
  start: 2025-12
  end: 2026-01
role: 1인 참가 · EDA부터 최종 모델(V15)까지 전담
team: AI 1
status: completed
featured: false
order: 12
category: ML
tags:
- Python
- PyTorch
- LSTM
- MDN
- scikit-learn
- pandas
responsibilities:
- 확률 분포 예측 — LSTM-MDN으로 도착 좌표를 가우시안 혼합으로 예측하고, 가우시안 수를 2개에서 10개로 확장
- 물리·전술 분리 — LSTM은 위치·속도·각도를, N-gram·팀 ID 임베딩은 최근 3~5개 액션의 전술 패턴을 따로 학습
- 대칭 활용 — 경기장 좌우 대칭으로 Y축 증강, 추론 때는 같은 대칭으로 TTA
- 단계별 실험 — V10부터 V15까지 기법을 한 번에 하나씩 더해 효과를 확인
metrics:
- value: 상위 9%
  label: 대회 순위
  scope: K리그-서울시립대 공개 AI 경진대회 Track1 알고리즘 부문 · 1인 참가
links:
  github: https://github.com/Juhwan01/KLeague-Pass-Prediction
  demo: https://dacon.io/competitions/official/236647
cover: /images/projects/kleague-pass-prediction/thumbnail.png
---

K리그 경기의 플레이 시퀀스를 보고 마지막 패스가 도착할 좌표(X, Y)를 예측하는 데이콘 대회(K리그-서울시립대 공개 AI 경진대회)에 혼자 참가했습니다. 평가는 예측 지점과 실제 도착 지점 사이의 거리로, 낮을수록 좋습니다. V10부터 V15까지 기법을 한 번에 하나씩 더해 효과를 따로 확인했습니다. 거리 오차는 MDN을 붙이기 전의 양방향 LSTM 베이스라인 20.7에서, MDN을 붙인 V10부터 13점대로 내려왔습니다(버전별 실험 기록).

## 구조 결정

### 1. 출력: 한 점 대신 분포 예측

**왜:** 같은 상황에서도 합리적인 패스가 여럿이라, 단일 회귀 모델은 그 사이 "중간 지점"을 찍어 비현실적인 답을 냅니다.

**구조:** LSTM 뒤에 MDN(Mixture Density Network)을 붙여 여러 후보 지점을 가우시안 혼합으로 표현했습니다. 가우시안은 V10의 2개에서 V14에 10개로 늘렸습니다.

### 2. 피처: 물리와 전술 분리 학습

**왜:** 모델 기법만으로는 점수 개선에 한계가 있었습니다. 경기의 물리적 관성과 역습·빌드업 같은 전술 맥락을 피처로 따로 넣어야 했습니다.

**구조:** LSTM은 위치·속도·각도 같은 물리 피처를, N-gram 패턴과 팀 ID 임베딩은 최근 3~5개 액션의 전술 패턴을 맡습니다. 전술 쪽에 드롭아웃 30%를 걸어 물리 쪽이 전술 정보에 기대지 않게 했습니다.

**결과:** 이 분리를 넣은 V12가 V10–V15 가운데 거리 오차를 가장 크게 줄인 단계였습니다(버전별 실험 기록).

## 그 밖의 설계

- **경기장 대칭 활용:** 좌우 대칭으로 Y축을 뒤집어 학습 데이터를 2배로 늘리고 좌우 편향을 없앴습니다. 추론 때도 같은 대칭으로 TTA를 해, 5-Fold 모델과 TTA를 합친 예측 10개를 평균했습니다.

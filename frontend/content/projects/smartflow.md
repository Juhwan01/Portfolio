---
title: SmartFlow
summary: 앞 공정의 품질 편차가 다음 공정에 미칠 영향을 미리 예측하고, LLM 에이전트들이 과거 작업 이력(RAG)을 근거로 협상해 공정 파라미터를 조정하는 다단계 제조 공정 시스템. 데이콘 스마트 제조 AI Agent 해커톤 2025 본선 진출.
org: DACON · 스마트 제조 AI Agent 해커톤 2025
period:
  start: 2025-12
  end: 2025-12
role: AI Engineer(1인 개발) · 멀티 에이전트 시스템, RAG 파이프라인, 품질 예측 모델 설계·구현
team: AI 1
status: completed
featured: false
order: 17
category: AI
tags:
- Python
- GPT-4
- Claude 3.5
- LangGraph
- LangChain
- ChromaDB
- XGBoost
- Streamlit
responsibilities:
- 멀티 에이전트 설계 — 공정 감시·품질 연쇄 예측·협상·최종 승인을 맡는 에이전트 4개의 역할과 흐름
- RAG 협상 — 과거 작업 이력을 검색해 조정안 추론의 근거로 쓰는 협상 에이전트
- 품질 예측 모델 — 앞 공정의 편차가 다음 공정 품질에 주는 영향을 예측하는 ML/DL 모델
- MVP 범위 설정 — 프레스→용접 두 공정과 두께 편차 시 용접 파라미터 재조정 시나리오로 좁힘
links:
  github: https://github.com/Juhwan01/SmartFlow
  demo: https://dacon.io/competitions/official/236652
---

데이콘 스마트 제조 AI Agent 해커톤 2025에 혼자 낸 프로젝트로, 본선에 진출했습니다.

다단계 제조에서 한 공정의 편차가 다음 공정 품질로 이어지는 연쇄를 미리 예측하고, 공정 파라미터 조정까지 스스로 잇는 것이 목표였습니다. MVP는 프레스 → 용접 두 공정, 두께 편차가 생겼을 때 용접 파라미터를 다시 맞추는 시나리오로 좁혔습니다. 데이터는 Kaggle의 Multi-Stage Manufacturing Process(14,089개 샘플)를 썼습니다.

## 설계

- **에이전트 4개로 역할 분리:** 공정 모니터 에이전트가 센서 데이터를 모아 이상 징후를 먼저 잡고, 품질 연쇄 예측 에이전트가 ML/DL 모델로 앞 공정의 편차가 다음 공정 품질에 줄 영향을 예측합니다. 협상 에이전트가 조정안을 만들고, Coordinator 에이전트가 생산 목표 전체를 보고 승인하거나 반려합니다.
- **조정안은 과거 사례에서:** 협상 에이전트가 RAG로 과거 작업 이력을 찾아, 그 사례를 바탕으로 조정안을 추론합니다.

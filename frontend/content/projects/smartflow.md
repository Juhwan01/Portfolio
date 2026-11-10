---
title: SmartFlow
description: LLM 기반 Multi-Agent 협상을 통한 다단계 제조 공정의 사전 품질 예측 및 자율 조정 시스템.
category: AI
tech_stack:
- Python
- GPT-4
- Claude 3.5
- LangGraph
- LangChain
- ChromaDB
- XGBoost
- Streamlit
thumbnail_url: null
images: []
demo_url: null
github_url: https://github.com/Juhwan01/SmartFlow
featured: false
status: completed
start_date: null
end_date: null
order: 14
notion_page_id: null
video_url: null
team_composition:
- role: AI
  count: 1
slide_url: null
highlight: LangGraph Workflow
id: cae41c4a-7231-4feb-9d10-4dd66605d377
created_at: '2026-03-25T11:08:39.978256Z'
updated_at: '2026-03-27T16:26:36.436344Z'
---

## My Role: AI Engineer (1인 개발)

개인 프로젝트로 멀티 에이전트 시스템 설계, RAG 파이프라인, 품질 예측 모델까지 전체를 단독 구현했습니다.

## 프로젝트 개요

스마트 제조 환경에서 공정 간 품질 연쇄 효과를 사전에 예측하고, LLM Agent들이 과거 작업 이력(RAG)을 참조하여 추론 및 협상을 통해 공정 파라미터를 자율 조정하는 시스템입니다.

## 에이전트 구성

1. **Process Monitor Agent:** 센서 데이터 실시간 수집, 이상 징후 1차 포착
2. **Quality Cascade Predictor:** ML/DL 모델을 통한 품질 영향 예측
3. **RAG-enabled Negotiation Agent:** 과거 사례 검색 및 최적 조정안 추론
4. **Coordinator Agent:** 전체 생산 목표 고려, 협상 결과 최종 승인/반려

## MVP 범위

- 대상 공정: 프레스 → 용접 (2단계 연결)
- 핵심 시나리오: 두께 편차 발생 시 용접 파라미터 자동 재조정
- 데이터: Kaggle Multi-Stage Manufacturing Process (14,089 samples)
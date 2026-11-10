---
title: Allerguard
summary: 식품 라벨 사진에서 원재료를 읽어 알레르기 유발 성분을 찾아 경고하는 서비스. 팀 최종 코드의 골격이 된 AI 베이스라인(OCR → 원재료 파싱 → 성분 사전 매칭 → 사전 보강)을 설계·구현했다.
org: kakao x goorm 생성형 AI 부트캠프
period:
  start: 2025-09
  end: 2025-09
role: 팀원 · AI 베이스라인 설계·구현
team: AI 4
status: completed
featured: false
order: 10
category: AI
tags:
- Python
- LangGraph
- GCP Vision API
- OpenAI
- Hugging Face
- Gradio
responsibilities:
- AI 베이스라인 — GCP Vision OCR, 원재료명 파싱, 성분 사전 매칭, 사전에 없는 원재료 보완을 LangGraph 흐름으로 묶고 V1 → V3로 개선
- 성분 사전 매칭 — 원재료마다 다국어 문장 임베딩으로 702개 용어의 성분 사전과 유사도를 재, 기준(0.85)을 넘을 때만 알레르기로 판정
- '사전 보강 — 사전에 없는 원재료는 로컬 모델로 보완하고(V1 T5 → V2 zero-shot 분류: 학습 없이 후보 중 고르는 모델), V3에서는 검색으로 찾은 분류를 사전에 추가'
links:
  github: https://github.com/Goorm-AI-Semi-Project/AllerGuard
cover: /images/projects/allerguard/thumbnail.png
---

kakao x goorm 생성형 AI 부트캠프의 2주 스프린트(2025.09.03–09.16)에서 4인 팀의 AI 베이스라인을 맡았습니다.

## 구조 결정

### 1. 판별 흐름: LLM 한 번에 맡기는 대신 단계형 파이프라인

**왜:** 라벨 이미지를 LLM에 통째로 넣어도 탐지는 되지만, 호출마다 비용이 들고 왜 경고했는지 보여 줄 수 없습니다.

**구조:** GCP Vision OCR로 글자를 뽑고, 원재료명 부분을 잘라 원재료 단위로 나눈 뒤, 원재료마다 성분 사전(702개 용어)과 임베딩 유사도를 잽니다. 기준(0.85)을 넘으면 알레르기로 판정하고, 사전에 없는 원재료만 다음 단계로 넘깁니다. 이 베이스라인에는 유료 LLM 호출이 없습니다.

**결과와 반영:** 이 베이스라인이 팀 최종 코드의 골격이 됐습니다. 8단계 처리 흐름은 그대로 두고, 팀이 그 위에 GPT-4.1 원재료 파서(교차오염 문구 추출), Tavily 검색, Gradio 화면을 더했습니다.

## 그 밖의 설계

- **사전은 쓰면서 자란다:** 사전에 없는 원재료는 검색으로 분류를 찾아 성분 사전에 추가해, 다음부터는 사전 매칭으로 처리합니다(V3).

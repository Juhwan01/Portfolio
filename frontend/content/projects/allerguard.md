---
title: Allerguard
summary: 식품 라벨을 OCR로 읽고 NLI·LLM·웹 검색으로 판별해, 키워드 매칭으로는 가려내지 못하던 별칭·부정 표현·교차오염까지 경고하는 알레르기 성분 탐지 서비스.
org: kakao x goorm 생성형 AI 부트캠프
period:
  start: 2025-09
  end: 2025-09
role: 팀 리더 · AI 베이스라인 모델 설계·구현
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
- NLI
- Gradio
responsibilities:
- AI 베이스라인 설계·구현 — 팀 파이프라인의 기반이 된 초기 모델을 v2, v3, final 세 버전으로 반복 개선
- 판별 파이프라인 — GCP Vision OCR로 글자를 뽑고 NLI로 의미를 판별한 뒤 GPT-4.1로 성분과 알레르기를 잇고, 불확실한 성분은 Tavily 검색으로 재확인
- NLI 의미 판별 — klue/roberta-base 기반 NLI로 원재료 문구를 긍정·부정·교차오염으로 구분
- 임계값 설정 — 위험 성분을 놓치는 false negative를 줄이는 쪽으로 판별 기준을 조정
links:
  github: https://github.com/Goorm-AI-Semi-Project/AllerGuard
cover: /images/projects/allerguard/thumbnail.png
---

## 구조 결정

### 1. 판별 파이프라인: GPT-4 Vision 단일 호출 대신 단계 분리

**왜:** 라벨 이미지를 GPT-4에 바로 넣어도 탐지는 되지만, 호출마다 비용이 들고 판단 근거를 보여 줄 수 없습니다. 위험 성분을 놓치면 건강 문제가 되는 서비스라, 경고가 왜 떴는지 사용자에게 설명할 수 있어야 했습니다.

**구조:** GCP Vision OCR로 글자를 뽑고, NLI로 문장의 의미를 판별하고, GPT-4.1로 성분과 알레르기를 잇고, 불확실한 성분만 Tavily 검색으로 한 번 더 확인합니다.

**결과:** NLI를 로컬에서 돌려 비용을 줄였고, 단계마다 결과가 남아 "왜 이 경고가 떴는지"를 설명할 수 있습니다.

### 2. 의미 판별: 키워드 매칭 대신 NLI

**왜:** 초기 키워드 매칭은 "non-dairy"에서도 우유를 잡는 오탐을 냈고, "유청단백"·"카제인나트륨" 같은 별칭은 놓쳤습니다. 이런 오탐이 쌓이면 사용자가 경고 자체를 믿지 않게 됩니다.

**바꾼 구조:** klue/roberta-base 기반 NLI가 원재료 문구를 긍정·부정·교차오염으로 나눕니다.

**결과:** 부정 표현은 걸러내고 별칭은 잡으며, "같은 시설에서 우유 처리" 같은 교차오염 문구에는 따로 경고합니다. 알레르기 유발 물질 22종 이상이 대상입니다.

## 그 밖의 설계

- **임계값은 누락을 줄이는 쪽에:** 2주 스프린트(2025.09.03–09.16) 안에 정확도를 끝까지 올릴 수는 없어, 위험 성분을 놓치는 false negative를 최소화하도록 판별 임계값을 정했습니다.

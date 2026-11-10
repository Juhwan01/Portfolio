---
title: SAiM Agent Hub
description: 7개 전문 AI 에이전트가 협업하는 헬스 트레이닝 오케스트레이션 시스템. Orchestrator 기반 자동 라우팅, Guardrails 안전장치, Context Engine 토큰 최적화.
category: AI
tech_stack:
- Python
- FastAPI
- Pydantic v2
- OpenAI
- LangGraph
- Redis
thumbnail_url: /images/projects/saim-agent-hub/thumbnail.png
images:
- /images/projects/saim-agent-hub/thumbnail.png
demo_url: null
github_url: https://github.com/Juhwan01/SAiM-Agent-Hub
featured: true
status: completed
start_date: 2025-03
end_date: 2025-03
order: 1
notion_page_id: null
video_url: null
team_composition: []
slide_url: null
highlight: Multi-Agent Hub
id: d2c8c285-0d6b-4201-875e-32867300790e
created_at: '2026-03-28T13:30:07.966750Z'
updated_at: null
---

## Problem

AI 헬스 트레이너 앱에서 운동 코칭, 식단 분석, 신체 리포트를 **하나의 API**로 제공해야 합니다. 각 기능은 필요한 데이터, 안전 규칙, 응답 형식이 전혀 다릅니다.

> 하나의 거대한 프롬프트로 모든 걸 처리하면 토큰 비용이 폭발하고 응답 품질이 떨어집니다.

## My Role: AI Engineer (1인 개발)

개인 프로젝트로 멀티 에이전트 아키텍처 설계, LangGraph 워크플로우 구현, 안전 시스템 통합까지 **전 과정을 단독 개발**했습니다.

## Approach

### 1. 왜 멀티 에이전트인가?

| 방식 | 토큰 비용 | 응답 품질 | 안전성 제어 |
|------|----------|----------|------------|
| 단일 프롬프트 | 높음 (전체 컨텍스트) | 낮음 (역할 혼동) | 어려움 |
| **멀티 에이전트** | **낮음 (필요한 것만)** | **높음 (전문화)** | **에이전트별 규칙** |

**Orchestrator + 6개 전문 에이전트** 구조를 설계하여, 각 에이전트가 자신의 도메인에만 집중하도록 했습니다.

- **의도 분류 → 자동 라우팅**: 사용자 메시지를 LLM으로 분류하여 적절한 에이전트에 전달
- **태스크 분해**: 복합 요청은 순차 실행 후 결과 합성
- **폴백**: 에러 시 1회 재시도 → ChatbotAgent

### 2. Context Engine: 핵심 설계

에이전트가 LLM을 호출할 때 **필요한 데이터만 골라서 조립**하는 레이어입니다.

| 에이전트 | 필요한 데이터 | 제외되는 데이터 |
|----------|-------------|----------------|
| RealtimeCoaching | 현재 세션 + 최근 3세트 + 부상도 | 식단 기록, 대화 히스토리 |
| DietAnalysis | 음식 이미지 + 영양 데이터 | 운동 세션, 신체 리포트 |
| BodyReport | 월간 체성분 히스토리 | 실시간 세션, 식단 |

같은 에이전트라도 불필요한 컨텍스트가 들어가면 LLM이 혼란스러워하고 비용이 증가합니다.

### 3. Guardrails: 건강 도메인의 필수 안전장치

건강/운동 도메인에서 AI가 위험한 조언을 하지 못하게 막는 이중 안전장치:

- **Input Guardrail** — 부상 부위 고위험 운동 차단, 프롬프트 인젝션 방어
- **Output Guardrail** — 비현실적 무게/횟수 차단, 의학적 조언 패턴 차단, 할루시네이션 검출

### 4. Provider 추상화

모든 인프라를 ABC 인터페이스로 정의. 환경변수 하나로 구현체 교체:

```
SAIM_LLM_PROVIDER=openai     -> GPT-4o
SAIM_LLM_PROVIDER=anthropic  -> Claude
SAIM_LLM_PROVIDER=gemini     -> Gemini
```

LLM, DB, Cache, Vision, Tracing, EventBus까지 6개 Provider 모두 같은 패턴입니다.

## Results

- **7개 전문 에이전트** 오케스트레이션 시스템 구축
- **Context Engine**으로 에이전트별 최소 컨텍스트 조립, 토큰 비용 최적화
- 이중 **Guardrails**로 건강 도메인 안전성 확보
- 6개 **Provider ABC**로 인프라 교체 가능한 아키텍처
- **Structured Output**(Pydantic)으로 모든 응답 강제, 할루시네이션 감소

## Lessons Learned

> 에이전트를 나누는 것보다, 각 에이전트에 **무엇을 보여주지 않을지**를 결정하는 것이 더 중요합니다.

처음에는 에이전트를 나누는 것 자체가 핵심이라 생각했지만, 실제로 응답 품질과 비용을 결정한 것은 Context Engine이었습니다. 또한 Guardrails는 "있으면 좋은 것"이 아니라 필수였습니다. 테스트 중 LLM이 부상 부위에 고강도 운동을 추천한 사례가 Output Guardrail 설계의 직접적인 계기가 되었습니다.

**Tech Stack:** `Python` `FastAPI` `Pydantic v2` `OpenAI` `LangGraph` `Redis`
---
title: Allerguard
summary: 식품 라벨 OCR과 3단계 판별(RAG·NLI·웹 검색)로 알레르기 성분을 자동으로 찾아내는 서비스.
org: kakao x goorm 생성형 AI 부트캠프
period:
  start: 2025-09
  end: 2025-09
role: 팀 리더 · 4인 AI 팀
team: AI 4
status: completed
featured: false
order: 10
category: AI
tags:
- Python
- LangGraph
- GCP Vision API
- OpenAI GPT-4
- NLI
- Gradio
links:
  github: https://github.com/Goorm-AI-Semi-Project/AllerGuard
cover: /images/projects/allerguard/thumbnail.png
---

## Problem

식품 라벨 이미지에서 알레르기 유발 성분을 자동 탐지하는 시스템. **2주 스프린트**(2025.09.03~09.16)로 개발했습니다.

> 식품 라벨은 단순 텍스트가 아닙니다. "우유"라고 쓰여있으면 쉽지만, "유청단백", "카제인나트륨", "non-dairy"는 어떻게 판별할까요?

## My Role: AI Baseline 모델링

5인 AI 팀에서 **초기 AI 베이스라인 모델 설계 및 구현**을 담당했습니다. 3개 버전(v2, v3, final)을 반복 개선하며 팀의 파이프라인 기반을 구축했습니다.

## Approach

### 왜 단일 LLM이 아닌 4단계 파이프라인인가?

GPT-4에 이미지를 바로 넣어도 알레르기 탐지는 가능합니다. 하지만 두 가지 문제가 있었습니다:

| 방식 | 정확도 | 비용 | 설명 가능성 |
|------|--------|------|----------|
| GPT-4 Vision 단독 | 중간 | 높음 (매 호출) | 낮음 (블랙박스) |
| **OCR -> NLI -> LLM** | **높음** | **낮음** (NLI 로컬) | **높음** (단계별 추적) |

특히 **설명 가능성**이 핵심이었습니다. 알레르기는 건강 문제이므로, "왜 이 성분이 위험한가"를 사용자에게 설명할 수 있어야 합니다.

```
[라벨 이미지]
  -> 1. GCP OCR (텍스트 추출)
  -> 2. NLI - klue/roberta-base (의미 판별: 긍정/부정/교차오염)
  -> 3. GPT-4.1 (성분과 알레르기 매핑)
  -> 4. Tavily Search (불확실한 성분 추가 검증)
```

### 왜 NLI가 키워드 매칭보다 나은가?

이 프로젝트의 **핵심 기술적 의사결정**입니다.

| 입력 텍스트 | 키워드 매칭 | NLI |
|------------|-----------|-----|
| "우유 함유" | 검출 O | 검출 O |
| "non-dairy" | **검출 O (오탐!)** | 미검출 O |
| "같은 시설에서 우유 처리" | 검출 O | **교차오염 경고 O** |
| "유청단백질" | 미검출 (별칭) | **검출 O** |

### 안전성 우선 설계: False Negative 최소화

2주라는 제한된 시간에서, 정확도를 100%로 만드는 것은 불가능했습니다. 대신 **false negative(위험 성분을 놓치는 것)을 최소화**하는 방향으로 임계값을 설정했습니다.

> 알레르기 탐지에서 false positive(과잉 경고)는 불편하지만, false negative(누락)는 **건강 위험**입니다.

## Results

- **22+ 알레르기 유발 물질** 탐지 지원
- 색상 코드 경고: RED(고위험), YELLOW(개인화 매칭)
- 별칭 탐지 + 교차 오염 경고 + 부정 표현 처리
- Hugging Face 모델 배포 + Gradio 공개 데모
- **2주 만에 MVP 완성**

## Lessons Learned

> **"정확한 시스템"보다 "안전한 시스템"을 만드는 것이 더 어렵습니다.**

초기 키워드 매칭 방식에서 NLI로 전환한 것은, 정확도 수치가 아니라 "non-dairy에서 false positive가 발생하면 사용자가 시스템을 신뢰하지 않게 된다"는 UX 관점의 판단이었습니다.

또한 4단계 파이프라인은 단일 LLM보다 복잡하지만, 각 단계의 결과를 사용자에게 보여줄 수 있어 **"왜 이 경고가 떴는지"를 설명할 수 있다**는 것이 실제 사용성에서 결정적 차이였습니다.

**Tech Stack:** `LangGraph` `LangChain` `GCP OCR` `GPT-4.1` `NLI` `Gradio` `Hugging Face`
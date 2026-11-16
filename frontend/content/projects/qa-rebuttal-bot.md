---
title: Q&A 반박봇
summary: 발표 원고를 보고 나올 법한 반박 질문과 그 답변을 미리 만들어 주는 Q&A 대비 봇입니다. 원고 분석부터 답변 생성까지를 LangGraph 단계로 나눠 혼자 만들었습니다.
period:
  start: 2024-08
  end: 2024-08
role: 1인 개발 · 기획, LangGraph 파이프라인, Streamlit UI
team: AI 1
status: completed
featured: false
order: 18
category: AI
tags:
- Python
- LangGraph
- LLM
- Streamlit
responsibilities:
- LangGraph 파이프라인 — 원고 분석, 질문 생성, 답변 가능성 검증, 답변 생성을 단계로 나눠 설계
- 질문 프롬프트 — 논리 허점·대안·근거를 묻는 질문 유형을 정하고 프롬프트를 반복 수정
- Streamlit UI — 발표 원고를 넣고 질문·답변을 확인하는 화면
links:
  github: https://github.com/Juhwan01/LANGGRAPH-Prj
cover: /images/projects/qa-rebuttal-bot/thumbnail.png
---

## 구조 결정

### 1. 생성 흐름: 한 프롬프트 대신 네 단계

**왜:** 발표 Q&A에서 나올 질문을 미리 대비하려는 도구인데, 처음에 질문과 답변을 한 프롬프트로 함께 만들었더니 질문의 질이 낮았습니다.

**바꾼 구조:** LangGraph로 원고 분석 → 질문 생성 → 답변 가능성 검증 → 답변 생성 단계로 나눠, 각 단계가 앞 단계의 결과를 받아 쓰게 했습니다. 답할 수 없는 질문은 검증 단계에서 걸러 답변 단계로 넘기지 않습니다.

**결과:** 단계를 나누자 질문의 질이 나아졌습니다. 여기서 익힌 단계 분리 방식이 이후 프로젝트의 멀티스텝 파이프라인 설계로 이어졌습니다.

## 그 밖의 설계

- **이해 확인 대신 반박 질문:** 논리 허점을 찌르는 질문, 대안을 요구하는 질문, 근거를 요구하는 질문으로 유형을 나눠 생성합니다.

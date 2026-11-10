---
title: Q&A 반박봇
description: 발표에 대비하여 발표 원고에서 나올만한 질문쌍을 생성해주는 Q&A 반박 봇
category: AI
tech_stack:
- Python
- LangGraph
- LLM
- Streamlit
thumbnail_url: /images/projects/qa-rebuttal-bot/thumbnail.png
images: []
demo_url: ''
github_url: https://github.com/Juhwan01/LANGGRAPH-Prj
featured: true
status: completed
start_date: 2024.08.04
end_date: 2024.08.14
order: 9
notion_page_id: 2ed6efa211b2802da409cbbd48e0f71a
video_url: ''
team_composition:
- role: AI
  count: 1
slide_url: ''
highlight: null
id: 3b0a6432-3ea0-4358-8549-6d4873fb4dbe
created_at: '2026-01-19T03:43:22.734684Z'
updated_at: '2026-03-27T11:40:39.360573Z'
---

## Problem

발표를 준비할 때 가장 긴장되는 순간은 Q&A 시간입니다. 청중이 어떤 질문을 할지 예측하기 어렵고, 예상치 못한 질문에 당황하면 발표 전체의 인상이 나빠집니다.

> 발표 원고를 넣으면, AI가 나올 수 있는 질문과 그에 대한 반박/답변을 미리 생성해주면 어떨까?

## My Role: 기획 + AI + 풀스택 (1인 개발)

개인 프로젝트로 기획부터 LangGraph 파이프라인 설계, 프론트엔드/백엔드 구현까지 전체를 담당했습니다.

## Approach

개인 프로젝트로 기획부터 구현까지 전체를 담당했습니다.

### 1. LangGraph 기반 멀티스텝 파이프라인

LangGraph를 활용하여 단계별로 분리된 파이프라인을 설계했습니다.

| 단계 | 역할 |
|------|------|
| 원고 분석 | 발표 원고의 핵심 주장과 논리 구조 파악 |
| 질문 생성 | 약점, 모호한 부분, 반론 가능 지점에서 질문 도출 |
| 답변 가능성 체크 | 생성된 질문의 답변 가능 여부 검증 |
| 답변 생성 | 각 질문에 대한 논리적 반박/답변 작성 |

### 2. 다각도 질문 생성

단순한 이해 확인 질문이 아니라, 논리적 허점을 찌르는 질문, 대안을 요구하는 질문, 근거를 요구하는 질문 등 다양한 유형을 생성합니다. 프롬프트를 반복 수정하여 실제 Q&A에서 나올 법한 날카로운 질문을 목표로 했습니다.

### 3. Streamlit UI

발표 원고를 입력하고 결과를 확인할 수 있는 Streamlit 기반 웹 인터페이스를 구현했습니다.

## Results

- LangGraph 기반 Q&A 쌍 자동 생성 파이프라인 구현
- 답변 가능성 검증 단계 추가로 실용적 질문만 필터링
- Streamlit UI로 즉시 사용 가능한 도구 완성

## Lessons Learned

> **LangGraph의 진가는 "단계를 나누는 것"에 있습니다.**

처음에는 하나의 프롬프트로 질문과 답변을 동시에 생성했지만, 질문의 질이 낮았습니다. 분석 → 질문 → 검증 → 답변으로 단계를 나누자 각 단계가 이전 단계의 결과를 활용하면서 품질이 크게 향상되었습니다. LangGraph를 처음 사용한 프로젝트로, 이후 다른 프로젝트에서도 멀티스텝 파이프라인 설계의 기초가 되었습니다.

**Tech Stack:** `Python` `LangGraph` `LLM` `Streamlit`
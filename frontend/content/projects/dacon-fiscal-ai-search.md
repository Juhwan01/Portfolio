---
title: 재정정보 AI 검색 알고리즘 경진대회
summary: 재정 보고서·예산 자료를 근거로 질문에 답하는 문서 검색·답변 생성 파이프라인을 개발해 Private 리더보드 4위 / 359팀.
org: DACON · 주최 기획재정부, 한국재정정보원
period:
  start: 2024-07
  end: 2024-08
role: AI 엔지니어 · 재정 문서 검색·답변 생성 파이프라인 개발 및 성능 개선
team: 5인 (팀 DongBee)
status: completed
featured: true
order: 3
category: LLM
tags:
- RAG
- LLM
- NLP
responsibilities:
- 재정 문서 검색 — 재정 보고서·예산 설명자료·보도자료 PDF에서 질문의 근거를 찾는 검색 단계 개발
- 답변 생성 — 찾은 근거로 질문에 답을 만드는 생성 단계 개발
- 성능 개선 — 답변과 정답의 F1 점수를 기준으로 파이프라인 성능 개선
metrics:
- value: 4위 / 359팀
  label: Private 리더보드
  scope: DACON 대회 최종 순위 · 최종 점수 0.71642 (F1)
links:
  demo: https://dacon.io/competitions/official/236295/overview/description
---

## 맥락과 제약

- **과제:** 재정 보고서, 예산 설명자료, 기획재정부 보도자료 같은 PDF 문서를 근거로 주어진 질문에 정확히 답하는 자연어처리 알고리즘을 개발합니다. 열린재정의 중앙정부 재정 정보가 바탕입니다.
- **평가:** 생성한 답변과 정답의 F1 점수로 순위를 매깁니다.
- **참가:** AI Leaders(SW중심대학사업단) 과정 중 5인 팀 DongBee로 참가했습니다. 대회 기간은 2024.07.29 – 08.23이고 참가자는 1,132명이었습니다.

## 결과

- **Private 리더보드 4위 / 359팀:** 최종 점수 0.71642(F1).

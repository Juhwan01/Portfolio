---
title: Delusion Diary
summary: 평범한 하루를 적으면 생성형 AI가 드라마틱한 "망상 버전"으로 다시 써 주는 일기장. 3일 해커톤에서 AI 변환 로직과 백엔드 API를 맡음.
period:
  start: 2024-11
  end: 2024-11
role: AI · Backend · 일기 변환 로직 설계, 백엔드 API
team: AI 1 · Backend 1 · Frontend 2
status: completed
featured: false
order: 19
category: AI
tags:
- Python
- Generative AI
- Prompt Engineering
- Docker
responsibilities:
- 망상 변환 로직 — 일기의 핵심 내용은 남기고 표현을 과장해 드라마틱하게 바꾸는 생성형 AI 로직 설계
- 프롬프트 개선 — 1차 기본 변환 이후 2차에서 프롬프트를 고쳐 문체와 톤을 다듬음
- API 설계 — 프론트엔드와 연동할 START/CONTINUE/END 엔드포인트
- 배포 준비 — Docker 컨테이너화와 디렉토리 구조 정리
links:
  github: https://github.com/Juhwan01/Delusion-Diary.git
  slides: https://docs.google.com/presentation/d/1wunV-zf--46IJUpXNEKnB7QuYXVegpX6/edit?slide=id.p1#slide=id.p1
cover: /images/projects/delusion-diary/thumbnail.png
---

## 맥락과 제약

- **매일 진지하게 쓰기는 부담:** 일기는 자기 성찰에 좋지만 매일 쓰기는 부담스럽습니다. 평범한 하루를 적으면 AI가 드라마틱한 "망상 버전"으로 다시 써 주는 일기장을 만들었습니다.
- **3일 해커톤:** 2024년 11월 9–11일. 4인 팀(AI 1, 백엔드 1, 프론트엔드 2)에서 AI 변환 로직과 백엔드 API를 맡았습니다.

## 핵심 결정

1. **핵심 내용은 지키고 표현만 과장한다.** 입력한 일기의 핵심 내용은 그대로 두고, 표현을 과장하고 드라마틱하게 바꾸도록 변환 로직을 설계했습니다.
2. **먼저 돌아가게 만들고, 문체는 그다음에 다듬는다.** 1차로 기본 텍스트 변환 파이프라인을 빠르게 붙이고, 2차에서 프롬프트를 고쳐 유머러스하면서도 읽기 좋은 문체와 톤을 맞췄습니다.
3. **있으면 좋은 기능은 버린다.** 3일 안에 MVP를 내기 위해 핵심 기능에만 집중하고, AI 파이프라인과 UI를 병렬로 개발했습니다.

## 결과

- **MVP:** 3일 해커톤 안에 일기 변환 서비스 MVP를 완성했습니다.
- **문체:** 2차 프롬프트 개선으로 변환 결과가 일관된 유머러스한 문체로 나오도록 맞췄습니다.

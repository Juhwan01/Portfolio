---
title: Delusion Diary
summary: 오늘 일기를 쓰기 시작하면 생성형 AI가 그날 벌어질 법한 다음 전개를 다섯 갈래로 제안하고, 고른 전개를 이어 "망상 일기" 한 편으로 다듬어 주는 일기장입니다. 3일 해커톤에서 AI 로직과 백엔드 API를 맡았습니다.
period:
  start: 2024-11
  end: 2024-11
role: AI · Backend · 일기 전개 로직 설계, 백엔드 API
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
- 망상 전개 로직 — 사용자의 말투를 따라 감동·반전·코믹 등 다섯 갈래의 다음 전개를 제안하고, 끝에서 고른 전개를 한 편으로 다듬는 생성형 AI 로직 설계
- 프롬프트 개선 — 기본 변환을 먼저 붙인 뒤 프롬프트를 고쳐 문체와 톤을 다듬음
- API 설계 — 프론트엔드와 연동할 START/CONTINUE/END 엔드포인트
links:
  github: https://github.com/Juhwan01/Delusion-Diary.git
  slides: https://docs.google.com/presentation/d/1wunV-zf--46IJUpXNEKnB7QuYXVegpX6/edit?slide=id.p1#slide=id.p1
cover: /images/projects/delusion-diary/thumbnail.png
---

3일 해커톤(2024.11.09–11)에서 4인 팀(AI 1, 백엔드 1, 프론트엔드 2)의 AI 로직과 백엔드 API를 맡아 MVP를 완성했습니다.

## 만든 방식

- **고르면서 이어 쓰는 일기:** 사용자가 쓴 내용을 받아 오늘 하루 안에서 벌어질 다음 전개를 감동, 반전, 코믹, 엉뚱함, 현실적인 쪽으로 하나씩 제안합니다. 사용자가 하나를 고르면 그 뒤를 다시 제안하고, 마지막에는 고른 전개를 순서대로 이어 한 편의 일기로 다듬습니다. 말투(반말·존댓말, 습관적 표현)는 사용자가 쓴 그대로 따라가게 했습니다.
- **먼저 돌아가게, 문체는 그다음에:** AI 파이프라인과 UI를 병렬로 개발하면서, AI 쪽은 기본 텍스트 변환부터 빠르게 붙였습니다. 그다음 프롬프트를 고쳐, AI가 쓰는 글이 일관된 유머러스한 문체로 나오게 했습니다.

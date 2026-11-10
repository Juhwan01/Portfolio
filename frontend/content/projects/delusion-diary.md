---
title: Delusion Diary
summary: 생성형 AI 활용한 망상 일기장
period:
  start: 2024-11
  end: 2024-11
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
links:
  github: https://github.com/Juhwan01/Delusion-Diary.git
  slides: https://docs.google.com/presentation/d/1wunV-zf--46IJUpXNEKnB7QuYXVegpX6/edit?slide=id.p1#slide=id.p1
cover: /images/projects/delusion-diary/thumbnail.png
---

## Problem

일기를 쓰는 것은 자기 성찰에 좋지만, 매일 진지하게 쓰기는 부담스럽습니다. 평범한 하루를 적으면 AI가 드라마틱한 "망상 버전"으로 재탄생시켜주는 서비스를 만들고 싶었습니다.

## My Role: AI + Backend

4인 팀(AI 1, Backend 1, Frontend 2)에서 **AI 파이프라인 설계와 백엔드 API 구현**을 담당했습니다.

### 1. 생성형 AI 변환 파이프라인

사용자의 평범한 일기를 입력받아 핵심 내용은 유지하면서 과장되고 드라마틱한 "망상 버전"으로 변환하는 AI 로직을 설계했습니다. 1차, 2차에 걸쳐 프롬프트를 반복 개선하여 유머러스하면서도 읽기 좋은 문체를 구현했습니다.

| 단계 | 내용 |
|------|------|
| 1차 AI 로직 | 기본 텍스트 변환 파이프라인 |
| 2차 AI 로직 | 프롬프트 개선으로 문체/톤 최적화 |
| API 연동 | START/CONTINUE/END 엔드포인트 설계 |

### 2. 백엔드 API 및 배포

Frontend팀과 연동할 REST API를 설계하고, Docker 컨테이너화 및 디렉토리 구조를 정리하여 배포 환경을 구축했습니다. axios Instance를 활용한 유연한 URL 관리로 개발/운영 환경 전환을 간소화했습니다.

### 3. 해커톤 3일 개발

2024년 11월 9일~11일, 3일간의 해커톤에서 개발했습니다. 짧은 시간 내에 MVP를 완성하기 위해 AI 파이프라인과 UI를 병렬로 개발하는 전략을 택했습니다.

## Results

- 생성형 AI 기반 일기 변환 서비스 MVP 완성 (해커톤 3일)
- 프롬프트 2차 반복 개선으로 일관된 유머러스 문체 구현
- Docker 컨테이너화 배포 환경 구축

## Lessons Learned

> **3일이라는 제약이 오히려 좋은 의사결정을 만듭니다.**

해커톤의 시간 제약 덕분에 "있으면 좋은 기능"을 과감히 버리고 핵심 기능에만 집중했습니다. 특히 AI 로직을 1차로 빠르게 만들고 2차로 개선하는 반복 접근이 효과적이었고, 이 경험이 이후 프로젝트에서도 MVP 우선 사고방식으로 이어졌습니다.

**Tech Stack:** `Python` `Generative AI` `Prompt Engineering` `Docker`
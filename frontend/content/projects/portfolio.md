---
title: 포트폴리오
summary: Neural Noir 디자인 시스템 기반 AI 엔지니어 포트폴리오
period:
  start: 2026-01
  end: 2026-01
team: Full-stack 1
status: completed
featured: false
order: 21
category: Web
tags:
- React
- TypeScript
- FastAPI
- PostgreSQL
- Docker
- AWS Lightsail
- Three.js
- Nginx
links:
  github: https://github.com/Juhwan01/Portfolio
  demo: http://13.124.78.178/
cover: /images/projects/portfolio/thumbnail.png
---

## Problem

AI 엔지니어로서의 프로젝트, 기술 스택, 경험을 체계적으로 보여줄 개인 포트폴리오가 필요했습니다. 단순한 정적 페이지가 아닌, 프로젝트를 깊이 있게 설명하고 관리할 수 있는 풀스택 웹 애플리케이션을 목표로 했습니다.

## Approach

### 1. Neural Noir 디자인 시스템

다크 테마 기반의 자체 디자인 시스템을 설계했습니다. 보더 대신 배경색 차이로 섹션을 구분하는 No-Line Rule, Glass Effect, Neural Glow 등의 원칙을 정의하고 일관되게 적용했습니다.

| 요소 | 값 |
|------|-----|
| Background | #0e0e13 |
| Primary | #a8a4ff |
| Font | Inter |
| Glass | backdrop-blur 20px |

### 2. 풀스택 아키텍처

React + TypeScript 프론트엔드와 FastAPI 백엔드를 Docker Compose로 구성하고, Nginx 리버스 프록시와 Let's Encrypt SSL을 적용했습니다. AWS Lightsail에 배포하고 GitHub Actions로 CI/CD를 구축했습니다.

### 3. 어드민 시스템

프로젝트, 블로그, 스킬을 Markdown 에디터로 관리하는 어드민 패널을 구현했습니다. JWT 인증 기반으로 S3 이미지 업로드, CRUD 전체를 지원합니다.

### 4. 3D Hero 섹션

Three.js와 React Three Fiber로 파티클 애니메이션 배경을 구현한 Hero 섹션으로 첫 인상을 강화했습니다.

## Results

- Neural Noir 디자인 시스템 기반 풀스택 포트폴리오 완성
- Docker Compose + Nginx + SSL 배포 환경 구축
- GitHub Actions CI/CD 자동 배포 파이프라인
- 어드민 패널로 콘텐츠 자체 관리

## Lessons Learned

> **"보여주는 방식"이 "만든 것" 못지않게 중요합니다.**

프로젝트를 잘 만드는 것과 잘 설명하는 것은 별개의 역량입니다. 포트폴리오를 만들면서 각 프로젝트의 문제-접근-결과를 구조화하는 과정에서, 내가 무엇을 왜 만들었는지 다시 정리할 수 있었습니다.

**Tech Stack:** `React` `TypeScript` `FastAPI` `PostgreSQL` `Docker` `AWS Lightsail` `Three.js`
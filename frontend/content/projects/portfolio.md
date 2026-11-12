---
title: 포트폴리오
summary: 이 사이트입니다. DB와 관리자 페이지에 묶여 있던 내용을 저장소의 Markdown·YAML 파일로 옮기고, 오픈소스 템플릿을 바탕으로 화면을 다시 만들었습니다.
period:
  start: 2026-01
  end: 2026-11
role: 1인 개발
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
- Vite
- Tailwind CSS
- Nginx
responsibilities:
- 콘텐츠 구조 — DB·관리자 페이지에 있던 프로젝트·글·프로필을 Markdown·YAML 파일로 옮기고, 빌드할 때 읽는 Vite 플러그인 작성
- 화면 — Magic UI 포트폴리오 템플릿(MIT)을 Next.js에서 React·Vite로 옮김
- 내용 점검 — 머리말(front matter) 형식, 수치의 측정 범위, 이미지 경로를 검사하는 스크립트
links:
  github: https://github.com/Juhwan01/Portfolio
  demo: https://juhwan.dev
cover: /images/projects/portfolio/thumbnail.png
---

## 구조 결정

### 1. 내용: DB·관리자 페이지 대신 저장소 파일

**왜:** 첫 버전(2026.01)은 FastAPI·PostgreSQL 백엔드와 관리자 페이지로 내용을 관리했습니다. 글 하나를 고쳐도 관리자 페이지와 DB를 거쳐야 했고, 내용이 DB에 있어 바뀐 기록이 저장소에 남지 않았습니다.

**바꾼 구조:** 프로젝트·글·프로필을 Markdown·YAML로 옮기고, 빌드할 때 작은 Vite 플러그인이 읽어 화면에 넘깁니다.

**결과:** 파일을 고쳐 머지하면 사이트에 반영되고, 고친 내용이 커밋 기록으로 남습니다. DB와 관리자 페이지는 필요 없어졌습니다.

## 그 밖의 설계

- **디자인은 검증된 템플릿에서:** 직접 만든 디자인 대신 오픈소스 Magic UI 포트폴리오 템플릿(MIT)을 React·Vite로 옮기고, 시간은 내용을 정리하는 데 썼습니다.
- **내용 점검 스크립트:** 머리말(front matter) 형식, 수치의 측정 범위, 전후 수치 짝, 이미지 경로를 스크립트로 검사합니다.

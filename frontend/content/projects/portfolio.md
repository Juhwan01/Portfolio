---
title: 포트폴리오
summary: 이 사이트. 내용을 DB와 관리자 페이지에서 레포의 Markdown·YAML 파일로 옮기고, 결과 중심의 에디토리얼 디자인으로 다시 만들었다.
period:
  start: 2026-01
  end: 2026-11
role: 1인 개발 · 설계, 프론트엔드·백엔드, 콘텐츠 이전, 배포
team: Full-stack 1
status: completed
featured: false
order: 21
accent: '#d4f55a'
category: Web
tags:
- React
- TypeScript
- FastAPI
- PostgreSQL
- Docker
- AWS Lightsail
- Vite
- Nginx
responsibilities:
- 첫 버전 풀스택 — React·TypeScript 화면, FastAPI·PostgreSQL 백엔드, Markdown 에디터 기반 관리자 페이지
- 콘텐츠 이전 — DB 내용을 공개 API로 읽어 Markdown·YAML 파일로 옮기고 원본과 대조, S3의 이미지·영상을 저장소로 이전
- 에디토리얼 재설계 — 빌드 시점에 콘텐츠를 읽는 Vite 플러그인, 출시 앱용 제품형 페이지와 일반 프로젝트 페이지, 옛 주소 리다이렉트
- 배포 정비 — 서버를 origin/main에 맞추고 이미지를 먼저 빌드한 뒤 교체, 끝에 사이트·API 응답 확인
links:
  github: https://github.com/Juhwan01/Portfolio
  demo: https://juhwan.dev
cover: /images/projects/portfolio/thumbnail.png
---

## 맥락과 제약

- **첫 버전(2026.01):** React·TypeScript 프론트엔드, FastAPI·PostgreSQL 백엔드, 관리자 페이지(Markdown 에디터, S3 이미지 업로드)로 만든 다크 테마 사이트였고, 첫 화면에 Three.js 파티클 배경을 썼습니다.
- **배포 환경:** AWS Lightsail 한 대에서 Docker Compose로 db·backend·frontend·nginx를 띄웁니다. main에 머지하면 GitHub Actions가 배포합니다.

## 핵심 결정

1. **내용을 저장소 파일로 옮긴다.** 프로젝트·블로그·스킬을 공개 API로 읽어 `frontend/content/` 아래 Markdown·YAML로 쓰고, S3의 이미지·영상은 `frontend/public/`으로 옮겼습니다. 쓴 파일을 다시 읽어 API 원본과 대조했고, 원본 응답은 `_backup`에 남겼습니다.
2. **빌드할 때 읽는다.** 작은 Vite 플러그인이 빌드 시점에 `content/`를 읽어 화면에 넘깁니다. DB나 관리자 페이지는 더 쓰지 않습니다.
3. **결과를 앞에, 수치에는 범위를.** 출시한 앱은 앱 소개·주요 기능(담당 부분 표시)·맡은 일·수치 순서의 제품형 페이지로, 나머지는 단순한 페이지로 보여 줍니다. 모든 머리말을 한 스키마로 정리하고, 수치마다 잰 범위를 붙였습니다.

## 결과

- **내용 수정이 파일 수정으로:** 프로젝트·블로그·프로필이 저장소 파일이 되어, 파일을 고쳐 머지하면 사이트에 반영됩니다.
- **점검 스크립트:** `check_content.py`가 스키마, 수치의 범위, 미디어 경로, 프로젝트 간 링크, 중복 YAML 키를 검사합니다.
- **옛 주소 유지:** 예전 `/projects/<DB id>`, `/project/:id` 링크는 새 주소로 넘어갑니다.

## 막혔던 것

- **서버가 저장소와 어긋나 있었습니다:** 운영 사이트가 서버에서 직접 고치고 커밋하지 않은 파일로 빌드되고 있었습니다. 예전 배포 스크립트는 실패한 `git pull`을 무시하고 디스크에 있는 것을 빌드해 이 어긋남을 허용했습니다. 서버 파일을 그대로 커밋해 남기고, 배포는 서버를 origin/main에 맞춘 뒤 이미지를 먼저 빌드해 교체하고 사이트·API 응답까지 확인하도록 고쳤습니다.
- **인증이 빠진 API(2026.03):** 블로그 작성·수정·삭제와 문의 조회 API에 인증이 없어, 인증을 붙이고 업로드 크기 제한·DB 포트 외부 노출 제거 등을 함께 고쳤습니다.

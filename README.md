# 정주환 — AI Engineer Portfolio

[juhwan.dev](https://juhwan.dev) 소스입니다.

## 구조

```
frontend/
  content/            사이트에 보이는 글 전부 (프로필, 프로젝트, 블로그) — 작성 규칙은 content/README.md
  public/images|videos  이미지·영상
  src/site/           화면 (React + Vite). content/는 빌드할 때 virtual:content 로 읽는다
backend/              FastAPI — 문의 폼 메일과 예전 /api 경로
nginx.conf            HTTPS 종단, / → frontend, /api → backend
docker-compose.yml    Lightsail 한 대에서 db · backend · frontend · nginx
scripts/              내용 이전·정리·점검 스크립트
```

## 내용 고치기

1. `frontend/content/` 아래 파일을 고친다. 프로젝트는 파일 하나가 페이지 하나다.
2. 점검: `uv run --with pyyaml python scripts/check_content.py`
3. 미리보기: `cd frontend && npm ci && npm run dev` → http://localhost:3000

## 배포

`main`에 머지하면 GitHub Actions(`deploy.yml`)가 빌드를 검사한 뒤 서버에 SSH로 들어가
`origin/main`으로 맞추고, 이미지를 먼저 빌드한 다음 컨테이너를 바꾼다. 마지막에 사이트와 API 응답을 확인하고,
실패하면 워크플로가 실패로 끝난다. PR은 `ci.yml`이 타입 검사와 빌드를 돌린다.

서버 비밀값(`backend/.env`, `frontend/.env`)과 TLS 인증서(`/etc/letsencrypt`, certbot 자동 갱신)는 서버에만 있다.

---
title: Lime
summary: 실시간 방송·채팅·VOD 플랫폼의 FastAPI 백엔드입니다. 채팅은 바로 전달하고 AI 비속어 필터링은 비동기로 돌려, 필터 응답이 늦어도 채팅이 멈추지 않게 했습니다.
period:
  start: 2020-10
  end: 2021-08
role: Backend · DevOps · AI 채팅 필터링
team: AI 1 · Backend 1 · Frontend 1
status: completed
featured: false
order: 20
category: Web
tags:
- Python
- FastAPI
- Docker
- AWS EC2
- WebSocket
- Nginx
responsibilities:
- 비동기 백엔드 — FastAPI로 RTMP/HLS 송출 파이프라인과 WebSocket 채팅 구현
- AI 채팅 필터링 — 채팅을 막지 않고 AI 모델로 비속어·악성 메시지를 사후 제거하는 비동기 구조
- VOD 변환 — 방송이 끝나면 자동으로 VOD로 변환
links:
  github: https://github.com/Juhwan01/Streaming-Site
cover: /images/projects/lime-streaming/thumbnail.png
---

## 구조 결정

### 1. 채팅 필터링: 동기 검사 대신 먼저 보내고 뒤에서 지우기

**왜:** 변형된 욕설이나 맥락적인 비방은 키워드 필터로 막을 수 없어 AI 모델이 필요했는데, 모델의 응답 지연이 채팅 흐름을 멈추게 했습니다.

**바꾼 구조:** 메시지를 WebSocket으로 바로 브로드캐스트하고, 동시에 AI 모델에 비동기로 필터링을 요청해 악성 메시지를 사후에 지웁니다. 동기 필터링은 정확하지만 느리고, 필터링을 건너뛰면 빠르지만 위험해서, 완벽한 순서보다 체감 지연을 줄이는 쪽을 택했습니다.

**결과:** AI 필터를 붙이고도 채팅이 필터 응답을 기다리지 않습니다.

## 그 밖의 설계

- **비동기 백엔드:** 영상 송출과 채팅을 함께 다루려고 asyncio를 기본 지원하는 FastAPI를 골랐습니다.

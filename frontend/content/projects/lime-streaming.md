---
title: Lime
summary: 실시간 방송·채팅·VOD 플랫폼. 채팅은 바로 전달하고 AI 비속어 필터링은 비동기로 돌려, 필터 응답 지연이 채팅을 멈추지 않게 한 FastAPI 백엔드.
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
- 비동기 백엔드 — FastAPI로 RTMP/HLS 송출 파이프라인, WebSocket 채팅, 로그인·토큰 재발급, 결제 로직 구현
- AI 채팅 필터링 — 채팅을 막지 않고 AI 모델로 비속어·악성 메시지를 사후 제거하는 비동기 구조
- VOD 변환 — 방송이 끝나면 자동으로 VOD로 변환
- 배포 — Docker Compose 컨테이너화, Nginx 리버스 프록시, AWS EC2
links:
  github: https://github.com/Juhwan01/Streaming-Site
cover: /images/projects/lime-streaming/thumbnail.png
---

## 맥락과 제약

- **영상과 채팅을 동시에:** RTMP/HLS로 방송을 내보내면서 시청자 채팅을 지연 없이 처리해야 했습니다.
- **키워드 필터로는 부족합니다:** 실시간 채팅은 비속어와 악성 댓글에 노출되기 쉬운데, 변형된 욕설이나 맥락적인 비방은 단순 키워드 필터링으로 막을 수 없었습니다.
- **3인 팀:** AI 1, 백엔드 1, 프론트엔드 1. 백엔드, 배포, AI 채팅 필터링을 맡았습니다.

## 핵심 결정

1. **비동기 백엔드로 간다.** 영상 송출과 채팅을 함께 다루기 위해 asyncio를 기본 지원하는 FastAPI를 골랐고, 채팅은 WebSocket으로 주고받습니다.
2. **채팅은 먼저 보내고, 필터링은 뒤에서 한다.** 메시지를 WebSocket으로 바로 브로드캐스트하고, 동시에 AI 모델에 비동기로 필터링을 요청해 악성 메시지를 사후에 지웁니다. 동기 필터링은 정확하지만 느리고, 필터링을 건너뛰면 빠르지만 위험해서, 완벽한 순서보다 체감 지연을 줄이는 쪽을 택했습니다.
3. **방송이 끝나면 VOD로 바꾼다.** 방송 종료 후 자동으로 VOD로 변환합니다.

## 결과

- **필터를 기다리지 않는 채팅:** AI 필터링을 붙이면서도 채팅 지연을 최소화했습니다.
- **라이브와 VOD:** RTMP/HLS 실시간 송출, WebSocket 채팅, 방송 종료 후 VOD 자동 변환을 한 플랫폼에 담았습니다.

## 막혔던 것

- **AI 필터 응답 지연:** 가장 큰 난관은 AI 모델의 응답 지연이 채팅 흐름을 멈추게 하는 것이었습니다. 메시지 전달과 필터링을 떼어 낸 비동기 호출로 풀었습니다.

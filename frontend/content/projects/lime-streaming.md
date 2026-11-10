---
title: Lime
summary: FastAPI와 AWS를 기반으로 구축한 실시간 스트리밍 및 VOD 플랫폼
period:
  start: 2020-10
  end: 2021-08
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
links:
  github: https://github.com/Juhwan01/Streaming-Site
cover: /images/projects/lime-streaming/thumbnail.png
---

## Problem

실시간 스트리밍 플랫폼 'Lime'을 구축하는 과정에서 두 가지 큰 난관에 부딪혔습니다.

1. **백엔드 성능**: 실시간 영상 송출(RTMP/HLS)과 동시에 수많은 사용자의 채팅 메시지를 지연 없이 처리해야 했습니다. 비동기 처리가 필수적인 백엔드 아키텍처가 필요했습니다.
2. **커뮤니티 관리**: 실시간 채팅방은 비속어나 악성 댓글에 무방비로 노출되기 쉽습니다. 단순한 키워드 필터링으로는 변형된 욕설이나 맥락적인 비방을 막을 수 없었습니다.

## My Role: Backend + DevOps + AI 채팅 필터링

3인 팀에서 **Backend, DevOps, AI 채팅 필터링**을 담당했습니다.

### 1. FastAPI 비동기 백엔드 구축

대규모 동시 접속 및 실시간 처리를 위해 asyncio를 네이티브로 지원하는 FastAPI를 채택했습니다. RTMP 스트리밍 서버, WebSocket 채팅, 사용자 인증, 결제 로직까지 백엔드 전체를 구현했습니다.

| 구성 요소 | 담당 내용 |
|-----------|----------|
| 스트리밍 서버 | RTMP/HLS 실시간 영상 송출 파이프라인 |
| 채팅 시스템 | WebSocket 기반 실시간 양방향 채팅 |
| 사용자 시스템 | 로그인, 토큰 재발급, 결제 로직 |
| VOD 시스템 | 방송 종료 후 자동 VOD 변환 |

### 2. Docker + AWS 배포 환경 구축

개발/운영 환경 차이로 인한 배포 문제를 원천 차단하기 위해 Docker Compose로 컨테이너화하고, Nginx 리버스 프록시를 구성하여 AWS EC2에 프로덕션 배포했습니다.

### 3. AI 비속어 필터링 시스템

가장 큰 난관은 AI 모델의 응답 지연이 채팅 흐름을 멈추게 하는 것이었습니다. **비동기 API 호출**로 해결했습니다. 채팅 메시지를 WebSocket으로 즉시 브로드캐스트하면서, 동시에 AI 모델에 비동기로 필터링 요청을 보내 악성 메시지를 사후 제거하는 방식으로 채팅 지연 없이 실시간 필터링을 구현했습니다.

## Results

- FastAPI + WebSocket 기반 실시간 스트리밍 백엔드 완성
- AI 비속어 필터링을 비동기로 연동하여 채팅 지연 최소화
- Docker + Nginx + AWS EC2 프로덕션 배포 환경 구축
- VOD 자동 변환 시스템 구현

## Lessons Learned

> **실시간 시스템에서 "기다리지 않는 설계"가 핵심입니다.**

AI 필터링을 동기로 처리하면 정확하지만 느리고, 건너뛰면 빠르지만 위험합니다. 비동기 사후 처리라는 제3의 방법을 찾으면서, 실시간 시스템에서는 "완벽한 순서"보다 "체감 지연 최소화"가 우선이라는 것을 배웠습니다.

**Tech Stack:** `Python` `FastAPI` `Docker` `AWS EC2` `WebSocket` `Nginx`
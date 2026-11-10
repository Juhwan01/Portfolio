---
title: W:IDE
summary: LangGraph 에이전트의 실시간 코드 분석·자동완성·오류 수정 제안을 Electron 데스크톱 앱에 통합한 AI 코드 에디터.
org: 인제대학교 캡스톤디자인
period:
  start: 2024-09
  end: 2024-12
role: 메인 개발자(2인 팀) · AI 코드 분석·자동완성, 백엔드, 데스크톱 앱 통합
team: 2인
status: completed
featured: true
order: 5
category: AI
tags:
- Python
- FastAPI
- LangGraph
- React
- Electron
- Node.js
awards:
- 2024 INJE 캡스톤디자인 경진대회 장려상
links:
  github: https://github.com/Juhwan01/Capstone-Design
  video: /videos/projects/wide/demo.mp4
cover: /images/projects/wide/thumbnail.png
---

## Problem

LangGraph를 활용한 AI 기반 실시간 코드 분석 및 자동 완성 IDE. 2024 INJE 캡스톤디자인 경진대회 **장려상** 수상.

## My Role: AI + Backend + 시스템 통합 (메인 개발)

2인 팀에서 **AI 코드 자동완성, 백엔드, 시스템 통합**을 주도했습니다. (13/16 커밋)

| 담당 영역 | 구현 내용 |
|-----------|----------|
| AI Copilot | LangGraph 기반 실시간 코드 분석 및 자동완성 프로토타입 |
| GitHub 연동 | 소셜 로그인, 레포지토리 에디터, 커밋/푸시 기능 |
| 터미널 | Electron Main Process에서 child_process.spawn 기반 실시간 터미널 |
| DB 연결 | PostgreSQL 연동 |
| Front-Back 통합 | React UI와 백엔드 API IPC 통신 연결 |

## 핵심 문제: 브라우저 보안 샌드박스

React 기반 AI 코드 에디터를 만들려 했지만, 브라우저의 **보안 샌드박스**가 거대한 장벽이었습니다.

IDE의 핵심 기능은:
- 로컬 파일 시스템 접근 (`fs.readFile`)
- 터미널 명령어 실행 (`python script.py`, `git status`)

브라우저에서는 이 두 가지가 모두 불가능합니다.

## 기술 선택: Electron

Electron의 **이중 프로세스 구조**가 해답:

- **Main Process**: Node.js 런타임, OS 레벨 API 접근 가능
- **Renderer Process**: Chrome 기반, React UI 렌더링
- **IPC 통신**: 두 프로세스 간 안전한 데이터 교환

## 해결 방식

1. **파일 시스템 접근:** Main Process에서 `fs` 모듈로 처리, IPC로 Renderer에 전달
2. **실시간 터미널:** Main Process에서 `child_process.spawn`, 출력을 IPC 스트리밍
3. **가상환경 관리:** Python venv 생성/활성화를 Main Process에서 관리

## AI 코드 분석

LangGraph로 AI 에이전트를 구성하여:
- 실시간 코드 분석
- 컨텍스트 기반 자동 완성
- 에러 진단 및 수정 제안

## Results

- 웹 기술이라는 제약 속에서 **파일 시스템 접근, 실시간 터미널, 가상환경 관리**라는 IDE의 3대 핵심 기능을 모두 구현
- Electron의 IPC 통신을 활용해 보안과 기능 두 마리 토끼를 잡음
- 2024 INJE 캡스톤디자인 경진대회 **장려상** 수상

**Tech Stack:** `Python` `FastAPI` `LangGraph` `React` `Electron` `Node.js` `PostgreSQL`
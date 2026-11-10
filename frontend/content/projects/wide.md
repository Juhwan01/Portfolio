---
title: W:IDE
summary: 브라우저에서는 막히는 파일·터미널·가상환경 작업을 Electron Main Process로 풀고, LangGraph 에이전트의 코드 분석·자동완성 프로토타입을 붙인 데스크톱 AI 코드 에디터입니다.
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
responsibilities:
- AI 코드 분석 프로토타입 — LangGraph 에이전트로 실시간 코드 분석, 맥락 기반 자동완성, 오류 진단·수정 제안
- 데스크톱 앱 구조 — 파일 시스템·터미널·가상환경 처리를 Electron Main Process에 모으고 React UI와 IPC로 연결
- 실시간 터미널 — Main Process에서 child_process.spawn으로 명령을 실행하고 출력을 IPC로 스트리밍
- GitHub 연동 — 저장소를 여는 에디터, 커밋·푸시
links:
  github: https://github.com/Juhwan01/Capstone-Design
  video: /videos/projects/wide/demo.mp4
cover: /images/projects/wide/thumbnail.png
---

캡스톤디자인 과제로, 저장소 커밋 16건 중 13건을 맡아 AI 기능·백엔드·앱 통합을 이끌었습니다.

## 구조 결정

### 1. 형태: 웹 에디터 대신 Electron 데스크톱 앱

**왜:** 코드 에디터의 핵심은 로컬 파일 읽기·쓰기(`fs.readFile`)와 터미널 명령 실행(`python script.py`, `git status`)입니다. 처음 만들던 React 웹 에디터에서는 브라우저 보안 샌드박스 때문에 둘 다 막혔습니다.

**바꾼 구조:** Electron으로 옮겨 Main Process는 Node.js 런타임에서 OS API를 쓰고, Renderer Process는 React UI를 그리게 나눴습니다. 파일은 Main에서 `fs` 모듈로 처리해 IPC로 넘기고, 터미널은 `child_process.spawn`으로 띄워 출력을 IPC로 흘려보냅니다. Python 가상환경 생성·활성화도 Main이 맡습니다.

**결과:** 웹 기술로 만든 UI를 그대로 두고, 브라우저에서 막혀 있던 파일 시스템 접근·실시간 터미널·가상환경 관리를 앱 안에서 동작시켰습니다.

## 그 밖의 설계

- **AI 기능은 LangGraph 에이전트로:** 실시간 코드 분석, 맥락 기반 자동완성, 오류 진단과 수정 제안을 에이전트가 맡는 프로토타입을 붙였습니다.

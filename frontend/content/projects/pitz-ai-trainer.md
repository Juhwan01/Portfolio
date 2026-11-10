---
title: PITZ AI 트레이너 챗봇
summary: 운동·식단 기록을 근거로 코칭하고 지난 대화를 기억하는 AI 트레이너. 서버 설계부터 운영까지 혼자 맡아 App Store·Google Play에 출시했다.
org: Beans Pirates
period:
  start: 2026-04
role: AI Engineer · 챗봇 서버 설계·개발·운영 전담, 에이전트 구조 재편 주도
status: shipped
featured: true
order: 1
category: AI Agent
tags:
- LangGraph
- FastAPI
- OpenAI
- PostgreSQL
- Qdrant
- Redis
- Langfuse
- AWS
product:
  name: PITZ
  tagline: 내 몸을 가장 잘 아는 AI 헬스 트레이너
  about: 신체 데이터와 운동 기록을 바탕으로 운동부터 식단, 일상까지 코칭하는 AI 피트니스 앱입니다. 그중 회원과 대화하는 AI 트레이너 채팅을 맡았습니다.
  icon: /images/projects/pitz-ai-trainer/app-icon.jpg
  features:
  - title: 실시간 코칭
    text: 운동을 기록하면 세트마다 내게 맞는 무게와 횟수를 안내합니다.
    image: /images/projects/pitz-ai-trainer/store-coaching.jpg
  - title: AI 트레이너와 대화
    text: 기록과 지난 대화를 기억하는 트레이너에게 운동 중에도, 쉬는 날에도 묻고 이야기합니다.
    image: /images/projects/pitz-ai-trainer/store-chat.jpg
    mine: true
  - title: 취향대로 고르는 트레이너
    text: 말투와 코칭 성향이 다른 트레이너 페르소나 가운데 나와 맞는 코치를 고릅니다.
    image: /images/projects/pitz-ai-trainer/persona-sua.jpg
    mine: true
  - title: 사진 한 장 식단 분석
    text: 음식 사진으로 칼로리와 영양소를 분석하고 목표에 맞는 피드백을 받습니다.
    image: /images/projects/pitz-ai-trainer/store-diet.jpg
responsibilities:
- 챗봇 서버 설계·개발·운영 전담 — FastAPI·LangGraph 서버를 처음부터 만들어 AWS에 배포하고 장애 대응까지
- 트레이너 페르소나와 대화 기억 — 대화 흐름은 요약으로, 회원에 대한 사실은 벡터 저장소에 나눠 기억
- 기록에 근거한 답변 — 기록을 묻는 말이면 회원 DB를 직접 조회해 그 수치로 답하는 흐름
- 대화로 기록을 바꾸는 에이전트 — 확인 후 실행 구조를 설계하고 에이전트 구조 재편을 주도
- 품질·비용 관측 — 회원 식별자를 가명화한 트레이싱과 상황별 실사용 시험 체계
metrics:
- value: 5개월
  label: 착수부터 스토어 정식 출시까지
  scope: 2026.04 서버 착수 → 2026.09 App Store 공개
- value: 71%
  label: 2일 이상 재방문
  scope: 베타 유입 이용자 49명 · 2026.09
- value: 90% → 0%
  label: 복합 요청 누락률
  scope: 구조 재편 사전 검증 · 같은 실패 사례 10회 재현
- value: −52%
  label: 복합 요청 응답 시간
  scope: 사전 검증 · p90 33.1초 → 16.0초
- value: 98%
  label: 요청 최종 반영률
  scope: 사전 검증 · 46개 상황 대화 232건 중 228건
links:
  website: https://www.pitz.co.kr
  appstore: https://apps.apple.com/kr/app/id6802202356
  playstore: https://play.google.com/store/apps/details?id=com.beanspirates.pitz
cover: /images/projects/pitz-ai-trainer/store-chat.jpg
gallery:
- /images/projects/pitz-ai-trainer/persona-sua.jpg
- /images/projects/pitz-ai-trainer/persona-taeho.jpg
- /images/projects/pitz-ai-trainer/store-coaching.jpg
- /images/projects/pitz-ai-trainer/store-diet.jpg
---

## 맥락과 제약

- **서비스 안의 한 기능:** 앱 백엔드(Spring)와 분리된 독립 서버입니다. 회원 기록은 읽기 전용으로 직접 읽고, 기록을 바꿀 때는 백엔드 API만 씁니다.
- **건강 데이터:** 민감 정보 동의를 받은 항목만 대화에 쓰고, 관측 도구에는 가명화한 회원 식별자만 남깁니다.
- **틀린 숫자는 신뢰를 깹니다:** "지난주 벤치 몇 kg 들었지?"에 지어낸 숫자로 답하면 코치로서 끝입니다.

## 핵심 결정

1. **수치는 기록에서 꺼내 답한다.** 기록을 묻는 말이면 그 턴에 조회 SQL을 만들어 회원 DB에서 직접 읽고, 읽은 값을 근거로 답합니다. 모델의 기억이나 추측에 기대지 않습니다.
2. **기억은 대화 요약과 회원 사실로 나눈다.** 대화 흐름은 롤링 요약으로 이어 가고, 목표·부상·취향 같은 회원에 대한 사실은 Qdrant에 따로 쌓아 필요한 턴에만 꺼냅니다.
3. **기록 변경은 "확인 후 실행".** "어제 스쿼트 무게 고쳐 줘" 같은 요청은 모델이 바꿀 내용을 제안하고, 회원이 확인 말풍선에서 승인해야 코드가 실행합니다. 부탁마다 상태를 코드가 쥐고 끝 상태 하나로 닫아, 말없이 빠지는 요청이 없게 했습니다.

## 결과

- **출시:** 2026년 9월 App Store·Google Play 정식 출시.
- **베타(2026.09.13–09.30):** 가입을 마친 회원의 59%가 AI 채팅을 썼고, 이 기간 유입된 이용자의 71%가 2일 이상 다시 찾았으며 18%는 4주 뒤에도 다시 썼습니다.
- **에이전트 구조 재편(사전 검증, 개발 환경):** 판단 하나에 모든 일을 몰던 구조를 일마다의 루프와 결정 모델 갈림길로 나눴습니다. 같은 실패 사례를 10번 재현했을 때 복합 요청 누락이 9번에서 0번으로 줄었고, 쓰기와 기록 조회가 겹친 턴의 p90 응답 시간은 33.1초에서 16.0초로 짧아졌습니다.

## 막혔던 것

- **프로덕션 채팅 전면 장애(29분):** 대화 체크포인트와 기억 저장소가 DB 커넥션 하나를 같이 쓰다 끊기자 모든 채팅이 실패했습니다. 공유 커넥션 풀로 바꾸고 준비 상태 검사에 이 풀을 넣어 재발을 막았습니다.
- **하나의 판단기에 너무 많은 일을 맡겼던 초기 구조:** 정확도를 올리려고 지시를 덧댈수록 서로 간섭했습니다. 일 단위로 나눈 지금 구조로 옮기는 데 재편 비용이 들었고, 처음부터 나눴다면 줄일 수 있었을 비용입니다.

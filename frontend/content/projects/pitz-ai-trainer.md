---
title: PITZ AI 트레이너 · AI 리포트
summary: 운동·식단 기록을 근거로 코칭하고 지난 대화를 기억하는 AI 트레이너와, 기록을 해석해 주는 AI 리포트를 맡아 App Store·Google Play에 출시했다.
org: Beans Pirates
period:
  start: 2026-04
role: AI Engineer · AI 트레이너 챗봇 설계·개발·운영 전담, AI 리포트 담당, 에이전트 구조 재편 주도
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
  about: 신체 데이터와 운동 기록을 바탕으로 운동부터 식단, 일상까지 코칭하는 AI 피트니스 앱입니다. 그중 회원과 대화하는 AI 트레이너 채팅과 기록을 해석하는 AI 리포트를 맡았습니다.
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
  - title: AI 리포트
    text: 운동 기록의 변화와 그 이유를 풀어 주고, 매달 운동·식단·체성분을 묶어 종합 리포트를 써 줍니다.
    image: /images/projects/pitz-ai-trainer/store-report.jpg
    mine: true
  - title: 사진 한 장 식단 분석
    text: 음식 사진으로 칼로리와 영양소를 분석하고 목표에 맞는 피드백을 받습니다.
    image: /images/projects/pitz-ai-trainer/store-diet.jpg
responsibilities:
- 챗봇 서버 설계·개발·운영 전담 — 앱 백엔드와 분리된 FastAPI·LangGraph 서버를 처음부터 설계
- 트레이너 페르소나와 대화 기억 — 대화 흐름은 요약으로, 회원에 대한 사실은 벡터 저장소에 나눠 기억
- 기록에 근거한 답변 — 기록을 묻는 말이면 회원 DB를 직접 조회해 그 수치로 답하는 흐름
- 대화로 기록을 바꾸는 에이전트 — 확인 후 실행 구조를 설계하고 에이전트 구조 재편을 주도
- AI 리포트 — 운동 기록을 해석하는 리포트와, 매달 1일 대상 회원 전원의 종합 리포트를 만드는 배치 파이프라인(Step Functions · Lambda · OpenAI Batch API)
- 품질·비용 관측 — 회원 식별자를 가명화한 트레이싱과 상황별 실사용 시험 체계
metrics:
- group: 기술 개선
  value: 90% → 0%
  label: 복합 요청 누락률
  before: 9
  after: 0
  unit: 회
  scope: 쓰기 경로 재편 · 개발 환경 · 같은 실패 사례 10회 재현 중 누락 횟수
- group: 기술 개선
  value: −52%
  label: 복합 요청 응답 시간 (p90)
  before: 33.1
  after: 16.0
  unit: 초
  scope: 개발 환경 · 쓰기와 기록 조회가 겹친 턴
- group: 기술 개선
  value: −51%
  label: 월간 리포트 1건당 생성 단가
  before: 71
  after: 35
  unit: 원
  scope: Batch API 설계 기준 · 같은 리포트를 실시간 호출로 만들 때와 비교
- group: 기술 개선
  value: 98%
  label: 요청 최종 반영률
  part: 228
  whole: 232
  unit: 건
  scope: 개발 환경 · 46개 상황 대화 232건
- group: 출시와 베타
  value: 5개월
  label: 착수부터 스토어 정식 출시까지
  scope: 2026.04 서버 착수 → 2026.09 App Store 공개
- group: 출시와 베타
  value: 59%
  label: 가입 회원의 AI 채팅 사용
  scope: 베타 2026.09.13–09.30 · 가입을 마친 회원
- group: 출시와 베타
  value: 71%
  label: 2일 이상 재방문
  scope: 베타 유입 이용자 49명 · 2026.09
- group: 출시와 베타
  value: 18%
  label: 4주 뒤에도 다시 사용
  scope: 베타 유입 이용자 49명 · 2026.09
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
- /images/projects/pitz-ai-trainer/store-report.jpg
---

## 구조 결정

### 1. 에이전트 쓰기 경로: 판단기 하나 대신 결정 모델과 작업별 루프

**왜:** 대화로 운동·식단 기록을 바꾸는 쓰기 경로에서, 처음에는 판단기 하나에 모든 일을 몰았습니다. 정확도를 올리려고 지시를 덧댈수록 지시끼리 간섭했고, 쓰기와 조회가 한 턴에 섞인 복합 요청에서는 한쪽이 말없이 빠졌습니다.

**바꾼 구조:** 결정 모델이 요청을 어떤 작업으로 보낼지 고르고, 작업마다 자기 루프를 둡니다.

**검증(개발 환경):**
1. 누락이 났던 실패 사례를 같은 조건으로 10번 재현해 이전 구조와 비교
2. 46개 상황 대화 232건을 돌려 요청이 끝까지 반영되는지 확인
3. 쓰기와 기록 조회가 겹친 턴의 p90 응답 시간 비교

**결과와 반영:** 같은 실패 사례 10회 재현에서 복합 요청 누락 9회 → 0회, p90 응답 시간 33.1초 → 16.0초(−52%), 232건 중 228건 최종 반영(98%). 이 결과를 확인한 뒤 쓰기 경로를 이 구조로 바꿨습니다.

### 2. 월간 리포트: 실시간 호출 대신 Batch API

**왜:** 매달 1일 대상 회원 전원의 종합 리포트를 한꺼번에 만들어야 합니다.

**구조:** Step Functions·Lambda로 배치 파이프라인을 짜 OpenAI Batch API로 리포트를 한꺼번에 만들고, 형식 검사에 걸린 섹션만 다시 생성합니다.

**결과:** 리포트 1건당 생성 단가 71원 → 35원(−51%). 같은 리포트를 실시간 호출로 만들 때와 비교한 설계 기준 값입니다.

## 그 밖의 설계

- **기록 변경은 확인 후 실행:** 모델은 바꿀 내용을 제안만 하고, 회원이 확인 말풍선에서 승인해야 코드가 실행합니다. 요청마다 진행 상태를 코드가 관리하고 종료 상태 하나로 닫아, 처리되지 않은 채 사라지는 요청이 없게 했습니다.
- **수치는 회원 DB에서:** "지난주 벤치 몇 kg 들었지?"에 지어낸 숫자로 답하면 코치로서 신뢰를 잃습니다. 기록을 묻는 말이면 그 턴에 조회 SQL을 만들어 회원 DB를 읽기 전용으로 읽고, 모델의 기억이나 추측 대신 읽은 값을 근거로 답합니다. 기록을 바꾸는 길은 앱 백엔드 API 하나로만 두었습니다.
- **기억은 둘로 나눔:** 대화 흐름은 롤링 요약으로 이어 가고, 목표·부상·취향 같은 회원 사실은 Qdrant에 따로 쌓아 필요한 턴에만 꺼냅니다.
- **건강 데이터는 동의 범위 안에서:** 민감 정보 동의를 받은 항목만 대화에 쓰고, 관측 도구에는 가명화한 회원 식별자만 남깁니다.

## 출시와 베타

2026년 9월 App Store·Google Play에 정식 출시했습니다. 베타(2026.09.13–09.30) 동안 가입을 마친 회원의 59%가 AI 채팅을 썼고, 이 기간 유입된 이용자 49명의 71%가 2일 이상 다시 찾았으며 18%는 4주 뒤에도 다시 썼습니다.

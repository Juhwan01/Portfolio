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
  label: 확인 창에 일부만 담김
  before: 9
  after: 0
  unit: 회
  scope: 개발 환경 · 같은 실패 사례 10회 재현
- group: 기술 개선
  value: −52%
  label: 기록 변경 요청 응답 시간
  before: 33.1
  after: 16.0
  unit: 초
  scope: 개발 환경 · 느린 쪽 10% 기준(p90)
- group: 기술 개선
  value: −50%
  label: 월간 리포트 1건당 생성 단가
  before: 71
  after: 35
  unit: 원
  scope: 설계 기준 · 같은 리포트를 실시간 호출로 만들 때와 비교
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

### 1. 쓰기 경로: 판단기 한 번 대신 단계별 루프와 결정 모델

**왜:** 대화로 운동·식단 기록을 바꾸는 쓰기 경로에서, 처음에는 판단기(매 대답 앞에서 요청을 분류하는 AI 호출) 한 번이 분류·기록 조회·값 추출을 함께 맡았고, 쓰기 루프도 응답 하나로 고르기·값 채우기·계속 여부를 정했습니다. 루틴을 추천받고 "넣어줘"라고 하면 확인 창에 종목 일부(3~4개)만 담기는 일이 같은 사례 10번 재현 중 9번 났습니다.

**바꾼 구조:** 모든 일을 같은 단계(요청 분류 → 실행 → 검사 → 응답)를 도는 루프로 만들고, 무엇을 고를지는 단계마다 따로 둔 결정 모델이 정합니다. 부탁은 표에 한 줄씩 올리고, 코드가 각 줄을 완료·거절 같은 끝 상태 하나로 닫도록 설계했습니다.

**검증(개발 환경):**
1. 같은 실패 사례를 10번 재현해 이전 구조와 비교
2. 46개 상황을 5번씩, 대화 232건으로 단계 재시험

**결과:** 일부만 담긴 확인 창이 10번 중 9번에서 0번으로 줄었습니다(첫날 종목 45개 모두 담김). 대화 232건 중 228건이 끝까지 반영됐고, 그중 214건은 첫 말에 바로 반영됐습니다.

**반영:** 개발 브랜치의 쓰기 경로를 이 구조로 전면 교체했고(이전 구조로 돌아가는 스위치 없음), 운영 배포 전 단계 시험을 이어 가고 있습니다.

### 2. 기록 변경 응답 시간: 기록 조회를 늘 돌리는 대신 변경 요청엔 건너뛰기

**왜:** 단계 재시험에서 기록 변경과 기록 조회가 겹친 대답이 느렸습니다. 가장 느린 10%가 33.1초 이상 걸렸습니다(p90).

**바꾼 구조:** 요청이 기록 변경으로 분류되면 그 대답에서는 기록 조회 단계를 돌리지 않게 했습니다.

**결과:** 다음 재시험에서 같은 대답의 p90 응답 시간이 16.0초로 줄었고(−52%), 156번 중 25초를 넘은 대답은 없었습니다(개발 환경).

### 3. 일반 대화: 지식 베이스와 여러 호출 경로 대신 모델 하나·경로 하나

**왜:** 일반 대화에는 지식 베이스 검색, 도구 호출 판단, 가벼운 응답용 경로, 상위 모델 승격까지 갈래가 많았습니다. 그중 한 API 경로에서는 프롬프트 캐시가 13번 호출 중 한 번도 적중하지 않았고, 판단기 응답은 중앙값 9.5초(느린 쪽 15.7초)가 걸렸습니다.

**검증:** 지식 베이스를 빼기 전에, 따로 떼어 둔 200문항으로 시험했습니다. 모델 단독 답의 99.0%가 사실 검사를 통과했고, 지식 베이스로 답할 수 있던 문항은 90.0%였습니다.

**바꾼 구조:** 지식 베이스·도구 호출 판단·경로 분기를 걷어내고 모델 하나와 호출 경로 하나로 합쳤습니다. 판단기도 같은 모델로 바꾸고 추론 단계를 껐습니다. 식단·프로필 데이터는 판단기 신호를 보고 코드가 미리 가져옵니다.

**결과와 반영:** 2026년 8월 서버에 배포한 뒤 대리 대화 5턴을 Langfuse로 재 보니, 프롬프트 캐시가 판단기는 2턴째, 응답 모델은 3턴째부터 계속 적중했고, 판단기 응답 시간이 중앙값 9.5초(느린 쪽 15.7초)에서 1.3~1.8초로 줄었습니다.

### 4. 월간 리포트: 실시간 호출 대신 Batch API

**왜:** 매달 1일 대상 회원 전원의 종합 리포트를 만드는 일은 하루 안에만 끝나면 되는 작업이라, 단가가 절반인 Batch API를 골랐습니다.

**구조:** Batch API는 결과가 최대 24시간 뒤에 오는데 Lambda 하나는 최대 15분까지만 돕니다. 그래서 Step Functions가 Lambda 여섯 개(접수 → 요청 파일 생성 → 제출 → 10분 간격 확인 → 형식 검사·저장·실패 섹션 재생성 → 알림)를 잇고 기다리는 일을 맡습니다.

**결과와 반영:** 리포트 1건당 생성 단가가 약 71원에서 약 35원으로 절반이 됐습니다(테스트 리포트 한 건의 토큰 수로 계산한 설계 기준). 2026년 11월 1일 운영 회차를 이 파이프라인으로 돌렸습니다.

## 그 밖의 설계

- **기록 변경은 확인 후 실행:** 모델은 바꿀 내용을 제안만 하고, 회원이 확인 말풍선에서 승인해야 코드가 실행합니다.
- **수치는 회원 DB에서:** "지난주 벤치 몇 kg 들었지?"에 지어낸 숫자로 답하면 코치로서 신뢰를 잃습니다. 기록을 묻는 말이면 그 턴에 조회 SQL을 만들어 회원 DB를 읽기 전용으로 읽고, 모델의 기억이나 추측 대신 읽은 값을 근거로 답합니다. 기록을 바꾸는 길은 앱 백엔드 API 하나로만 두었습니다.
- **기억은 둘로 나눔:** 대화 흐름은 롤링 요약으로 이어 가고, 목표·부상·취향 같은 회원 사실은 Qdrant에 따로 쌓아 필요한 턴에만 꺼냅니다.
- **건강 데이터는 동의 범위 안에서:** 민감 정보 동의를 받은 항목만 대화에 쓰고, 관측 도구에는 가명화한 회원 식별자만 남깁니다.

## 출시와 베타

2026년 9월 App Store·Google Play에 정식 출시했습니다. 베타(2026.09.13–09.30) 동안 가입을 마친 회원의 59%가 AI 채팅을 썼고, 이 기간 유입된 이용자 49명의 71%가 2일 이상 다시 찾았으며 18%는 4주 뒤에도 다시 썼습니다.

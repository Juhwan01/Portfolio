# content/

사이트에 보이는 글은 모두 이 폴더에 있습니다. 파일을 고치고 `main`에 머지하면 배포됩니다. DB나 관리자 페이지는 쓰지 않습니다.

| 경로 | 내용 |
|---|---|
| `profile.yaml` | 이름, 소개, 첫 화면 숫자 네 칸(`highlights`: value·label), 경력, 학력, 수상, 오픈소스, 대외 활동 |
| `projects/<slug>.md` | 프로젝트 하나에 파일 하나. 파일 이름이 주소가 됩니다(`/projects/<slug>`) |
| `blog/<id>.md` | 블로그 글. `/blog/<id>`로 보이고 첫 화면 "글"에 나열됩니다 |
| `skills.yaml` | 첫 화면 "기술". 분류와 순서만 적으면, 쓴 프로젝트는 프로젝트 `tags`에서 자동으로 모입니다 |
| `_backup/2026-11-10/` | 이전 전 DB 원본(공개 API 응답 그대로). 고치지 않습니다 |

이미지와 영상은 `frontend/public/` 아래에 두고 `/images/...`, `/videos/...` 경로로 씁니다.
프로젝트용은 `public/images/projects/<slug>/`, 대외 활동용은 `public/images/activity/<이름>/`입니다.

## 프로젝트 파일

```markdown
---
title: 요기어때?
summary: 목록에 보이는 한 줄. 무엇을 만들었고 무엇이 달라졌는지.
org: 소속이나 대회·과정 이름          # 선택
period:
  start: 2025-09
  end: 2025-11                      # 없으면 진행 중
role: 맡은 역할 한 줄
team: AI 4                          # 선택
status: shipped | completed | in-progress | archived
featured: true                      # 첫 화면 "선택한 작업"에 노출
order: 4                            # 작을수록 앞
accent: '#ff9a8a'                   # 선택. 첫 화면 패널과 카드 배경의 강조색(밝은 색). 없으면 라임
category: AI
tags: [Python, RAG]
awards: [수상명]                     # 선택
responsibilities:                   # 선택. "내가 맡은 일". ' — ' 앞은 굵게 보입니다
  - 추천 파이프라인 — LLM 대화로 프로필을 받고 벡터 검색으로 후보를 찾는 흐름 설계
metrics:                            # 선택. 숫자에는 범위를 꼭 붙입니다
  - value: 90% → 0%
    label: 무엇의 수치인지
    scope: 어디서 어떻게 잰 값인지
links:                              # 있는 것만
  github: ...
  website: ...
  appstore: ...
  playstore: ...
  demo: ...
  video: /videos/projects/<slug>/demo.mp4
  slides: ...
cover: /images/projects/<slug>/thumbnail.png
gallery: [...]
part_of: <slug>                     # 다른 프로젝트의 일부일 때
merged_into: <slug>                 # 합쳐져 더 이상 보이지 않을 때
note: 메모                          # 화면에 안 보임
---

본문(Markdown)
```

- `status: archived`는 목록에 보이지 않습니다. 파일은 기록으로 남깁니다.
- 새 프로젝트 본문은 한 줄 요약 → 맥락과 제약 → 핵심 결정 → 결과 → 막혔던 것 순서를 권장합니다.
- 수치는 사전 검증·베타·개발 환경처럼 잰 범위를 `scope`와 본문에 함께 적습니다.

## 이전 기록

- `scripts/migrate_content.py` — DB 내용을 공개 API로 읽어 이 폴더로 옮긴 스크립트. 옮긴 뒤 원본과 한 글자씩 대조했습니다.
- `scripts/normalize_content.py` — 옮긴 머리말을 위 형식으로 정리한 스크립트. 날짜 오류 수정 내역이 파일 머리에 있습니다.

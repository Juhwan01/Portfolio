"""One-off cleanup after migrate_content.py: rewrite each project's frontmatter into the readable schema
described in frontend/content/README.md. Bodies are left untouched.

Run from the repo root:  uv run --with pyyaml python scripts/normalize_content.py

Date fixes (raw values are kept in frontend/content/_backup/2026-11-10/projects.json):
  archflow, jira-extended-mcp, saim-agent-hub  2025-03 -> 2026-03 (repo creation and first PyPI release are 2026-03)
  kleague-pass-prediction                      end 2025.01.12 -> 2026-01 (end was before start; repo ran 2025-12 ~ 2026-01)
  wide, papergraph, smartflow, structural-stability, saim-recsys  empty dates filled from the GitHub repo history
"""

import pathlib

import yaml

PROJECTS = pathlib.Path(__file__).resolve().parents[1] / "frontend" / "content" / "projects"

# slug -> fields that replace or add to what the DB had. Anything not listed comes from the DB row.
OVERRIDES = {
    "yogi-eottae": dict(
        featured=True, order=4, period=("2025-09", "2025-11"), org="kakao x goorm 생성형 AI 부트캠프",
        role="AI Lead(팀장) · 4인 AI 팀 리드, 추천 엔진 설계, 자체 대중교통 라우팅 서버 구축",
        summary="평점뿐 아니라 실제 이동 부담까지 반영해 식당을 추천하는 외국인 관광객용 다국어 서비스.",
        awards=["kakao x goorm 생성형 AI 과정 우수프로젝트상"],
    ),
    "wide": dict(
        featured=True, order=5, period=("2024-09", "2024-12"), org="인제대학교 캡스톤디자인",
        role="메인 개발자(2인 팀) · AI 코드 분석·자동완성, 백엔드, 데스크톱 앱 통합",
        summary="LangGraph 에이전트의 실시간 코드 분석·자동완성·오류 수정 제안을 Electron 데스크톱 앱에 통합한 AI 코드 에디터.",
        awards=["2024 INJE 캡스톤디자인 경진대회 장려상"],
    ),
    "chefs-market": dict(
        featured=True, order=6, period=("2025-01", "2025-04"), org="인제대학교 졸업작품",
        role="팀장(5인 팀) · 강화학습 기반 추천 엔진 설계 및 개발 총괄",
        summary="데이터가 없는 서비스 초기에도 추천이 동작하도록, 프로필 점수로 시작해 행동 데이터가 쌓이면 Q-learning이 주도하는 하이브리드 레시피 추천.",
    ),
    "allerguard": dict(
        order=10, period=("2025-09", "2025-09"), org="kakao x goorm 생성형 AI 부트캠프", role="팀 리더 · 4인 AI 팀",
        summary="식품 라벨 OCR과 3단계 판별(RAG·NLI·웹 검색)로 알레르기 성분을 자동으로 찾아내는 서비스.",
    ),
    "structural-stability": dict(
        order=11, period=("2026-03", "2026-03"), org="DACON", role="1인 참가",
        summary="멀티뷰 이미지로 구조물 붕괴 여부를 예측. 학습·평가 데이터의 도메인 차이를 Fourier Domain Adaptation으로 줄임.",
    ),
    "kleague-pass-prediction": dict(
        order=12, period=("2025-12", "2026-01"), org="K리그 · 서울시립대 공개 AI 경진대회 Track1", role="1인 참가",
        title="K리그 패스 도착 좌표 예측",
        summary="경기 플레이 시퀀스를 보고 마지막 패스가 도착할 좌표를 예측하는 모델(LSTM + Mixture Density Network).",
    ),
    "jira-extended-mcp": dict(order=13, period=("2026-03", "2026-03"), part_of="beans-pirates-ax"),
    "archflow": dict(order=14, period=("2026-03", "2026-03"), part_of="beans-pirates-ax"),
    "saim-agent-hub": dict(order=15, period=("2026-03", "2026-03")),
    "papergraph": dict(order=16, period=("2026-01", None)),
    "smartflow": dict(order=17, period=("2025-12", "2025-12")),
    "qa-rebuttal-bot": dict(order=18, period=("2024-08", "2024-08")),
    "delusion-diary": dict(order=19, period=("2024-11", "2024-11")),
    "lime-streaming": dict(order=20, period=("2020-10", "2021-08")),
    "portfolio": dict(order=21, period=("2026-01", "2026-01")),
    "saim-recsys": dict(order=90, status="archived", period=("2026-03", "2026-03"), note="폐기한 프로젝트 — 목록에 노출하지 않음"),
    "kleague-pass-prediction-notebook": dict(order=91, status="archived", period=("2025-12", "2026-01"), merged_into="kleague-pass-prediction"),
}

STATUS = {"completed": "completed", "in_progress": "in-progress"}


def team_text(rows) -> str | None:
    rows = [r for r in rows or [] if r.get("count")]
    return " · ".join(f"{r['role']} {r['count']}" for r in rows) or None


def clean(meta: dict, slug: str) -> dict:
    o = OVERRIDES[slug]
    start, end = o.get("period", (None, None))
    links = {
        "github": meta.get("github_url"),
        "demo": meta.get("demo_url"),
        "video": meta.get("video_url"),
        "slides": meta.get("slide_url"),
    }
    out = {
        "title": o.get("title", meta["title"]),
        "summary": o.get("summary", " ".join(meta["description"].split())),
        "org": o.get("org"),
        "period": {"start": start, "end": end},
        "role": o.get("role"),
        "team": team_text(meta.get("team_composition")),
        "status": o.get("status", STATUS.get(meta.get("status"), meta.get("status"))),
        "featured": o.get("featured", False),
        "order": o["order"],
        "category": meta.get("category"),
        "tags": meta.get("tech_stack") or [],
        "awards": o.get("awards"),
        "links": {k: v for k, v in links.items() if v},
        "cover": meta.get("thumbnail_url") or None,
        "gallery": [u for u in meta.get("images") or [] if u and u != meta.get("thumbnail_url")],
        "part_of": o.get("part_of"),
        "merged_into": o.get("merged_into"),
        "note": o.get("note"),
    }
    return {k: v for k, v in out.items() if v not in (None, [], {})}


def main() -> None:
    for path in sorted(PROJECTS.glob("*.md")):
        slug = path.stem
        if slug not in OVERRIDES:
            continue  # files written by hand already use the new schema
        _, fm, body = path.read_text(encoding="utf-8").split("---\n", 2)
        meta = yaml.safe_load(fm)
        if "summary" in meta:
            continue  # already normalized
        new = yaml.safe_dump(clean(meta, slug), allow_unicode=True, sort_keys=False, width=1000)
        path.write_text(f"---\n{new}---\n{body}", encoding="utf-8")
        print("normalized", slug)


if __name__ == "__main__":
    main()

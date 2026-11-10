"""One-off migration: juhwan.dev DB content (read through the public API) -> files in this repo.

Run from the repo root:  uv run --with pyyaml python scripts/migrate_content.py

Writes
  frontend/content/projects/<slug>.md   frontmatter = every DB field except `content`; body = `content`
  frontend/content/blog/<id>.md         same layout
  frontend/content/skills.yaml          every skill row, sorted by category then order
  frontend/content/_backup/<date>/      the raw API responses and an image manifest
  frontend/public/{images,videos}/projects/<slug>/   media re-hosted from the portfolio S3 bucket

Image URLs on our own hosts are rewritten to the local copies. Everything else is copied verbatim.
The script ends by reading every written file back and checking it equals the API data.
"""

import hashlib
import json
import pathlib
import re
import sys
import urllib.request

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1]
API = "https://juhwan.dev/api"
STAMP = "2026-11-10"
CONTENT = ROOT / "frontend" / "content"
BACKUP = CONTENT / "_backup" / STAMP
PUBLIC = ROOT / "frontend" / "public"
OWN_HOSTS = ("https://portfolio-2026-01-17.s3.ap-northeast-2.amazonaws.com/", "https://raw.githubusercontent.com/")

SLUGS = {
    "Chef's Market": "chefs-market",
    "SAiM Agent Hub": "saim-agent-hub",
    "SAiM RecSys": "saim-recsys",
    "요기어때?": "yogi-eottae",
    "Allerguard": "allerguard",
    "W:IDE": "wide",
    "PaperGraph": "papergraph",
    "Lime": "lime-streaming",
    "Delusion Diary": "delusion-diary",
    "Q&A 반박봇": "qa-rebuttal-bot",
    "Track1 알고리즘 부문 : K리그-서울시립대 공개 AI 경진대회": "kleague-pass-prediction",
    "포트폴리오": "portfolio",
    "ArchFlow": "archflow",
    "Jira Extended MCP Server": "jira-extended-mcp",
    "SmartFlow": "smartflow",
    "K리그 패스 좌표 예측 AI": "kleague-pass-prediction-notebook",
    "구조물 안정성 물리 추론 AI": "structural-stability",
}
IMG_IN_MD = re.compile(r"!\[[^\]]*\]\(([^)\s]+)[^)]*\)|<img[^>]*\bsrc=[\"']([^\"']+)[\"']")
EXT_BY_TYPE = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif", "image/svg+xml": ".svg"}


def fetch(url: str) -> tuple[bytes, str]:
    req = urllib.request.Request(url, headers={"User-Agent": "portfolio-content-migration"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read(), resp.headers.get_content_type()


def get_json(name: str):
    raw, _ = fetch(f"{API}/{name}/")
    (BACKUP / f"{name}.json").write_bytes(raw)
    return json.loads(raw)


def is_own(url: str | None) -> bool:
    return bool(url) and url.startswith(OWN_HOSTS)


def download_images(slug: str, project: dict, manifest: dict) -> dict:
    """Download our own images for one project. Returns original URL -> site path."""
    ordered = []
    if is_own(project.get("thumbnail_url")):
        ordered.append(("thumbnail", project["thumbnail_url"]))
    ordered += [("image", u) for u in project.get("images") or [] if is_own(u)]
    if is_own(project.get("video_url")):
        ordered.append(("video", project["video_url"]))
    for m in IMG_IN_MD.finditer(project.get("content") or ""):
        u = m.group(1) or m.group(2)
        if is_own(u):
            ordered.append(("content", u))

    mapping, counters = {}, {"image": 0, "content": 0}
    for kind, url in ordered:
        if url in mapping:
            continue
        data, ctype = fetch(url)
        expected = "video/" if kind == "video" else "image/"
        if not ctype.startswith(expected):
            raise SystemExit(f"{slug}: {url} returned {ctype}, expected {expected}*")
        ext = pathlib.PurePosixPath(url.split("?")[0]).suffix.lower() or EXT_BY_TYPE.get(ctype, "")
        if kind in ("thumbnail", "video"):
            name = f"{'thumbnail' if kind == 'thumbnail' else 'demo'}{ext}"
        else:
            counters[kind] += 1
            name = f"{kind}-{counters[kind]:02d}{ext}"
        folder = "videos" if kind == "video" else "images"
        site_path = f"/{folder}/projects/{slug}/{name}"
        dest = PUBLIC / site_path.lstrip("/")
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        mapping[url] = site_path
        manifest[url] = {"path": site_path, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    return mapping


def remap(value, mapping: dict):
    if isinstance(value, str):
        for old, new in mapping.items():
            value = value.replace(old, new)
        return value
    if isinstance(value, list):
        return [remap(v, mapping) for v in value]
    return value


def write_md(path: pathlib.Path, meta: dict, body: str) -> None:
    fm = yaml.safe_dump(meta, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=False)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"---\n{fm}---\n\n{body}", encoding="utf-8")


def read_md(path: pathlib.Path) -> dict:
    text = path.read_text(encoding="utf-8")
    _, fm, body = text.split("---\n", 2)
    meta = yaml.safe_load(fm)
    meta["content"] = body[1:]  # drop the blank line after the frontmatter
    return meta


def main() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    projects, blog, skills = get_json("projects"), get_json("blog"), get_json("skills")

    unknown = [p["title"] for p in projects if p["title"] not in SLUGS]
    if unknown or len(set(SLUGS.values())) != len(SLUGS):
        raise SystemExit(f"slug table out of date: {unknown}")

    manifest, reverse = {}, {}
    for p in projects:
        slug = SLUGS[p["title"]]
        mapping = download_images(slug, p, manifest)
        reverse.update({v: k for k, v in mapping.items()})
        meta = {k: remap(v, mapping) for k, v in p.items() if k != "content"}
        write_md(CONTENT / "projects" / f"{slug}.md", meta, remap(p.get("content") or "", mapping))

    for post in blog:
        write_md(CONTENT / "blog" / f"{post['id']}.md", {k: v for k, v in post.items() if k != "content"}, post["content"])

    ordered_skills = sorted(skills, key=lambda s: (s["category"], s["order"], s["name"]))
    (CONTENT / "skills.yaml").write_text(
        yaml.safe_dump(ordered_skills, allow_unicode=True, sort_keys=False, width=1000), encoding="utf-8"
    )
    (BACKUP / "images.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    # Read everything back and compare with the API data.
    problems = []
    for p in projects:
        back = read_md(CONTENT / "projects" / f"{SLUGS[p['title']]}.md")
        restored = {k: remap(v, reverse) for k, v in back.items()}
        expected = dict(p, content=p.get("content") or "")
        if restored != expected:
            diff = sorted(k for k in set(restored) | set(expected) if restored.get(k) != expected.get(k))
            problems.append(f"project {p['title']}: {diff}")
    for post in blog:
        if read_md(CONTENT / "blog" / f"{post['id']}.md") != post:
            problems.append(f"blog {post['id']}")
    if sorted(yaml.safe_load((CONTENT / "skills.yaml").read_text(encoding="utf-8")), key=lambda s: s["id"]) != sorted(
        skills, key=lambda s: s["id"]
    ):
        problems.append("skills.yaml")
    for url, info in manifest.items():
        if (PUBLIC / info["path"].lstrip("/")).stat().st_size != info["bytes"]:
            problems.append(f"image size {info['path']}")

    print(f"projects {len(projects)} · blog {len(blog)} · skills {len(skills)} · media files {len(manifest)}")
    if problems:
        print("MISMATCH:", *problems, sep="\n  ")
        sys.exit(1)
    print("round-trip check: all files equal the API data")


if __name__ == "__main__":
    main()

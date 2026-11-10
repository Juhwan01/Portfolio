"""Check frontend/content against the schema in frontend/content/README.md.

Run from the repo root:  uv run --with pyyaml python scripts/check_content.py
Exits non-zero and lists every problem found.
"""

import pathlib
import re
import sys

import yaml


class UniqueKeyLoader(yaml.SafeLoader):
    """SafeLoader that rejects duplicate keys instead of silently keeping the last one."""

    def construct_mapping(self, node, deep=False):
        keys = [self.construct_object(k, deep=deep) for k, _ in node.value]
        dupes = {k for k in keys if keys.count(k) > 1}
        if dupes:
            raise yaml.constructor.ConstructorError(None, None, f"duplicate keys {sorted(dupes)}", node.start_mark)
        return super().construct_mapping(node, deep=deep)


def load(text: str):
    return yaml.load(text, Loader=UniqueKeyLoader)


ROOT = pathlib.Path(__file__).resolve().parents[1]
CONTENT = ROOT / "frontend" / "content"
PUBLIC = ROOT / "frontend" / "public"
REQUIRED = ("title", "summary", "period", "status", "order")
STATUSES = {"shipped", "completed", "in-progress", "archived"}
MONTH = re.compile(r"^\d{4}-\d{2}$")
LOCAL_MEDIA = re.compile(r"(/(?:images|videos)/[^\s)\"'>]+)")

problems: list[str] = []


def check_local(owner: str, value) -> None:
    for path in LOCAL_MEDIA.findall(str(value)):
        if not (PUBLIC / path.lstrip("/")).is_file():
            problems.append(f"{owner}: missing file {path}")


def check_period(owner: str, period) -> None:
    if not isinstance(period, dict) or not period.get("start"):
        problems.append(f"{owner}: period.start missing")
        return
    for key in ("start", "end"):
        v = period.get(key)
        if v is not None and not MONTH.match(str(v)):
            problems.append(f"{owner}: period.{key} '{v}' is not YYYY-MM")
    if period.get("end") and str(period["end"]) < str(period["start"]):
        problems.append(f"{owner}: period ends before it starts")


projects = {}
for path in sorted((CONTENT / "projects").glob("*.md")):
    _, fm, body = path.read_text(encoding="utf-8").split("---\n", 2)
    meta = load(fm)
    projects[path.stem] = meta
    owner = f"projects/{path.name}"
    problems += [f"{owner}: '{k}' missing" for k in REQUIRED if k not in meta]
    if meta.get("status") not in STATUSES:
        problems.append(f"{owner}: status '{meta.get('status')}'")
    check_period(owner, meta.get("period"))
    # Cards sit next to the polite-register intro, so a plain "~했다" summary reads out of place.
    if meta.get("status") != "archived" and not str(meta.get("summary", "")).endswith("니다."):
        problems.append(f"{owner}: summary should end in 합니다체 (…니다.)")
    # The page calls string methods on these; an unquoted ": " turns a list item into a mapping
    # and blanks the whole page at runtime.
    for key in ("responsibilities", "tags", "awards", "gallery"):
        for i, item in enumerate(meta.get(key) or []):
            if not isinstance(item, str):
                problems.append(f"{owner}: {key}[{i}] is a {type(item).__name__}, not text (quote it if it contains ': ')")
    for m in meta.get("metrics") or []:
        for key in ("value", "label", "scope", "group", "unit"):
            if key in m and not isinstance(m[key], str):
                problems.append(f"{owner}: metric '{m.get('value')}' {key} is not text")
        if not m.get("scope"):
            problems.append(f"{owner}: metric '{m.get('value')}' has no scope")
        for pair in (("before", "after"), ("part", "whole")):
            given = [k for k in pair if k in m]
            if given and (len(given) == 1 or not all(isinstance(m[k], (int, float)) for k in pair)):
                problems.append(f"{owner}: metric '{m.get('value')}' needs numeric {' and '.join(pair)}")
        if "part" in m and "whole" in m and not 0 <= m["part"] <= m["whole"]:
            problems.append(f"{owner}: metric '{m.get('value')}' part must be within 0..whole")
    check_local(owner, meta)
    check_local(owner, body)

for slug, meta in projects.items():
    for key in ("part_of", "merged_into"):
        if meta.get(key) and meta[key] not in projects:
            problems.append(f"projects/{slug}.md: {key} -> unknown '{meta[key]}'")
orders = [m["order"] for m in projects.values() if m.get("status") != "archived"]
if len(orders) != len(set(orders)):
    problems.append("projects: duplicate order values among visible projects")

profile = load((CONTENT / "profile.yaml").read_text(encoding="utf-8"))
check_local("profile.yaml", profile)
if not profile.get("about"):
    problems.append("profile.yaml: about missing")
for section in ("experience", "education"):
    for i, item in enumerate(profile.get(section) or []):
        check_period(f"profile.yaml {section}[{i}]", item.get("period"))
timeline = profile.get("timeline") or []
for i, entry in enumerate(timeline):
    owner = f"profile.yaml timeline[{i}] ({entry.get('title')})"
    problems += [f"{owner}: '{k}' missing" for k in ("title", "mark") if not entry.get(k)]
    check_period(owner, entry.get("period"))
    for item in entry.get("items") or []:
        if not isinstance(item, dict) or not isinstance(item.get("text"), str):
            problems.append(f"{owner}: each item needs a text line (quote it if it contains ': ')")
        elif item.get("project") and item["project"] not in projects:
            problems.append(f"{owner}: unknown project '{item['project']}'")
# The page shows the file order, which should be newest first.
starts = [str((e.get("period") or {}).get("start", "")) for e in timeline]
if starts != sorted(starts, reverse=True):
    problems.append("profile.yaml timeline: entries are not newest first by period.start")

# CommonMark won't close `**` that ends in punctuation and is glued to a letter (or open one the
# other way round), so `**"인용"**은` or `**−32%**에` shows literal asterisks. Keep punctuation
# outside the markers: `"**인용**"은`.
PUNCT = set("\"'“”‘’%().,!?:;-−[]")
WORD = re.compile(r"[가-힣A-Za-z0-9]")


def check_bold(owner: str, text: str) -> None:
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    for line in text.splitlines():
        marks = [m.start() for m in re.finditer(r"\*\*", line)]
        for n, i in enumerate(marks):
            before, after = line[i - 1 : i], line[i + 2 : i + 3]
            opening = n % 2 == 0
            if (opening and after in PUNCT and WORD.match(before)) or (
                not opening and before in PUNCT and WORD.match(after)
            ):
                problems.append(f"{owner}: '**' next to punctuation won't render as bold: {line.strip()[:70]}")
                break


for path in sorted((CONTENT / "blog").glob("*.md")):
    _, fm, body = path.read_text(encoding="utf-8").split("---\n", 2)
    check_local(f"blog/{path.name}", body)
    check_bold(f"blog/{path.name}", body)
for path in sorted((CONTENT / "projects").glob("*.md")):
    check_bold(f"projects/{path.name}", path.read_text(encoding="utf-8").split("---\n", 2)[2])
skills = load((CONTENT / "skills.yaml").read_text(encoding="utf-8"))
all_tags = {t.lower() for m in projects.values() if m.get("status") != "archived" for t in m.get("tags") or []}
seen_skills: set[str] = set()
if not (skills or {}).get("items"):
    problems.append("skills.yaml: items missing")
for item in (skills or {}).get("items") or []:
    name = item.get("name")
    if not name:
        problems.append("skills.yaml: item without name")
        continue
    if name in seen_skills:
        problems.append(f"skills.yaml: '{name}' listed twice")
    seen_skills.add(name)
    unused = [t for t in item.get("match") or [] if t.lower() not in all_tags]
    if unused:
        print(f"note: skills.yaml '{name}' match {unused} is on no visible project")

visible = sum(1 for m in projects.values() if m.get("status") != "archived")
featured = sorted((m["order"], s) for s, m in projects.items() if m.get("featured"))
print(f"projects {len(projects)} (visible {visible}) · featured: {', '.join(s for _, s in featured)}")
if problems:
    print("PROBLEMS:", *problems, sep="\n  ")
    sys.exit(1)
print("content check: ok")

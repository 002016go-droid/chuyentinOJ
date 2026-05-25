#!/usr/bin/env python3
"""
Phase 2 — augment public/data/roadmap.json with LQDOJ-style topic fields:
- objectives        ("Bạn sẽ học được gì?")
- requirements      ("Yêu cầu")
- studyMethod       ("Cách học")
- theoryFull        long-form theory (markdown, sourced from VNOI Wiki / USACO Guide / CP-Algorithms / GfG)
- codeExample       short C++ snippet
- referenceProblems 15+ curated external links (CSES, CF, AtCoder, VNOJ, HackerRank, LeetCode, USACO Guide)

Run:  python3 scripts/build_topic_content.py
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROADMAP = ROOT / "public" / "data" / "roadmap.json"


def _r(label, url, source=None, difficulty=None):
    """ExternalRef builder."""
    d = {"label": label, "url": url}
    if source:
        d["source"] = source
    if difficulty:
        d["difficulty"] = difficulty
    return d


# ---------------------------------------------------------------------------
# CONTENT[node_id] = dict with the 6 new fields
# ---------------------------------------------------------------------------
CONTENT = {}

# Will be populated by individual register_* functions imported below.
from topic_content_data import register_all  # noqa: E402

register_all(CONTENT, _r)


def main():
    if not ROADMAP.exists():
        print(f"ERROR: {ROADMAP} not found", file=sys.stderr)
        sys.exit(1)

    data = json.loads(ROADMAP.read_text(encoding="utf-8"))
    nodes = data["nodes"]

    missing = [n["id"] for n in nodes if n["id"] not in CONTENT]
    if missing:
        print(f"WARN: {len(missing)} nodes have no augmentation: {missing}", file=sys.stderr)

    augmented = 0
    for n in nodes:
        c = CONTENT.get(n["id"])
        if not c:
            continue
        # Only set fields that are provided in CONTENT
        for key in ("objectives", "requirements", "studyMethod", "theoryFull", "codeExample", "referenceProblems"):
            if key in c:
                n[key] = c[key]
        augmented += 1

    ROADMAP.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Augmented {augmented}/{len(nodes)} nodes -> {ROADMAP}")


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    main()

#!/usr/bin/env python3
"""
crawl_theory.py — Aggregate theory content from external open-licensed sources.

For each of the 30 roadmap nodes, we fetch one or more pages from:
  - VNOI Wiki (Vietnamese, CC-BY-SA 4.0)        — https://wiki.vnoi.info/
  - CP-Algorithms (English, CC-BY-SA 4.0)       — https://cp-algorithms.com/
  - USACO Guide (English, link only)            — https://usaco.guide/
  - GeeksforGeeks (English, link only)          — https://www.geeksforgeeks.org/

For VNOI Wiki and CP-Algorithms, we parse the HTML content of each page and
convert it to clean Markdown (preserving headings, paragraphs, lists, code
blocks, images, blockquotes, tables, and KaTeX equations). The result is
written to:

  public/data/theory-deep/<topic_id>.json

with attribution and the source URL. The TopicPage React component loads
this file lazily and renders it under a "Tài liệu chuyên sâu" section.

Images are NOT downloaded — we keep absolute URLs pointing at the original
CDN (CC-BY-SA permits this with attribution).

USAGE:
  pip install beautifulsoup4 requests
  python3 scripts/crawl_theory.py            # crawl all
  python3 scripts/crawl_theory.py io-complexity dsu   # crawl specific topics
  python3 scripts/crawl_theory.py --no-cache  # force re-fetch

Cache lives in scripts/.crawl_cache/ and is git-ignored.
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Optional

import requests
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "data" / "theory-deep"
CACHE_DIR = Path(__file__).resolve().parent / ".crawl_cache"
OUT_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 "
        "(ChuyenTinOJ-content-crawler; for personal educational use)"
    ),
    "Accept-Language": "vi,en;q=0.8",
}

# ---------------------------------------------------------------------------
# Topic -> sources map
# ---------------------------------------------------------------------------
# Format:
#   topic_id: [(source_name, url), ...]
# source_name in {"VNOI Wiki", "CP-Algorithms"} (only these are crawled).
# USACO Guide / GfG links live in the per-node referenceProblems list.

SOURCES: dict[str, list[tuple[str, str]]] = {
    "io-complexity": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/basic/computational-complexity"),
    ],
    # simulation: no VNOI/CP page; covered by VNOI basic articles in roadmap references
    "array-1d": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/data-structures/array-vs-linked-lists"),
    ],
    "array-2d": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/data-structures/prefix-sum-and-difference-array"),
    ],
    "string-basic": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/string/basic"),
    ],
    "sort": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/basic/sorting-new"),
    ],
    "greedy": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/greedy-new"),
    ],
    "two-pointers": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/basic/two-pointers"),
    ],
    "prefix-sum": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/data-structures/prefix-sum-and-difference-array"),
    ],
    "binary-search": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/basic/binary-search"),
    ],
    "parametric-search": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/basic/binary-search"),
    ],
    "recursion-backtracking": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/basic/backtracking"),
    ],
    "meet-in-middle": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/basic/divide-and-conquer"),
    ],
    "stl-overview": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/data-structures/data-structures-overview"),
    ],
    "monotonic-stack": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/data-structures/Stack"),
        ("CP-Algorithms", "https://cp-algorithms.com/data_structures/stack_queue_modification.html"),
    ],
    "monotonic-deque": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/data-structures/deque-min-max"),
        ("CP-Algorithms", "https://cp-algorithms.com/data_structures/stack_queue_modification.html"),
    ],
    "dsu": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/data-structures/disjoint-set-union"),
        ("CP-Algorithms", "https://cp-algorithms.com/data_structures/disjoint_set_union.html"),
    ],
    "graph-bfs": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/graph-theory/breadth-first-search"),
        ("CP-Algorithms", "https://cp-algorithms.com/graph/breadth-first-search.html"),
    ],
    "graph-dfs": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/graph-theory/graph"),
        ("CP-Algorithms", "https://cp-algorithms.com/graph/depth-first-search.html"),
    ],
    "shortest-path": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/graph-theory/shortest-path"),
        ("CP-Algorithms", "https://cp-algorithms.com/graph/dijkstra.html"),
    ],
    "dp-intro": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/dp/basic-problems"),
        ("CP-Algorithms", "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html"),
    ],
    "dp-knapsack": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/dp/dp-knapsack-1"),
        ("CP-Algorithms", "https://cp-algorithms.com/dynamic_programming/knapsack.html"),
    ],
    "dp-lis-lcs": [
        ("CP-Algorithms", "https://cp-algorithms.com/sequences/longest_increasing_subsequence.html"),
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/dp/thac-mac-ve-qhd"),
    ],
    "dp-grid": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/dp/Mot-so-ky-thuat-toi-uu-hoa-thuat-toan-Quy-Hoach-Dong"),
    ],
    "number-theory": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/algebra/euclid"),
        ("CP-Algorithms", "https://cp-algorithms.com/algebra/euclid-algorithm.html"),
    ],
    "sieve-factorization": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/math/integer-factorization"),
        ("CP-Algorithms", "https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html"),
    ],
    "string-hash": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/string/hash"),
        ("CP-Algorithms", "https://cp-algorithms.com/string/string-hashing.html"),
    ],
    "tree-dp-intro": [
        ("VNOI Wiki", "https://wiki.vnoi.info/algo/dp/treedp"),
    ],
    # simulation, week1-review, mock-exam are review/skill nodes — no external theory.
}

LICENSE_MAP = {
    "VNOI Wiki": "CC-BY-SA 4.0 — VNOI Wiki",
    "CP-Algorithms": "CC-BY-SA 4.0 — cp-algorithms.com",
}


# ---------------------------------------------------------------------------
# HTTP layer with on-disk cache
# ---------------------------------------------------------------------------
def cache_path(url: str) -> Path:
    safe = re.sub(r"[^a-zA-Z0-9._-]", "_", url)[:200]
    return CACHE_DIR / (safe + ".html")


def fetch(url: str, use_cache: bool = True) -> Optional[str]:
    cp = cache_path(url)
    if use_cache and cp.exists():
        return cp.read_text(encoding="utf-8")
    print(f"  GET {url}", flush=True)
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
    except requests.RequestException as exc:
        print(f"    ! request failed: {exc}", flush=True)
        return None
    if resp.status_code != 200:
        print(f"    ! HTTP {resp.status_code}", flush=True)
        return None
    text = resp.text
    cp.write_text(text, encoding="utf-8")
    time.sleep(0.5)  # be polite
    return text


# ---------------------------------------------------------------------------
# HTML -> Markdown converter
# ---------------------------------------------------------------------------
def absolutize(src: str, base: str) -> str:
    return urllib.parse.urljoin(base, src)


def katex_to_tex(span: Tag) -> str:
    """Extract LaTeX source from a KaTeX rendered span."""
    annot = span.find("annotation", {"encoding": "application/x-tex"})
    if annot:
        return annot.get_text()
    return ""


def inline_md(node: Tag | NavigableString, base_url: str) -> str:
    if isinstance(node, NavigableString):
        s = str(node)
        # collapse internal whitespace runs but preserve single spaces / newlines
        return s

    name = node.name
    if name is None:
        return ""

    # KaTeX inline / display
    classes = node.get("class") or []
    if "katex" in classes:
        tex = katex_to_tex(node)
        if tex:
            return f"${tex}$"
        return ""
    if "katex-display" in classes:
        tex = katex_to_tex(node)
        if tex:
            return f"\n\n$${tex}$$\n\n"
        return ""

    if name == "br":
        return "\n"
    if name == "strong" or name == "b":
        return "**" + "".join(inline_md(c, base_url) for c in node.children).strip() + "**"
    if name == "em" or name == "i":
        return "*" + "".join(inline_md(c, base_url) for c in node.children).strip() + "*"
    if name == "code":
        return "`" + node.get_text() + "`"
    if name == "a":
        # Skip toc-anchor / heading-anchor markers (they only contain ¶ or empty)
        classes_a = node.get("class") or []
        if "toc-anchor" in classes_a or "headerlink" in classes_a:
            return ""
        href = node.get("href") or ""
        href = absolutize(href, base_url)
        text = "".join(inline_md(c, base_url) for c in node.children).strip() or href
        # If the only text was a pilcrow, drop entirely
        if text.strip() in ("", "¶"):
            return ""
        return f"[{text}]({href})"
    if name == "img":
        src = absolutize(node.get("src") or "", base_url)
        alt = node.get("alt") or ""
        return f"![{alt}]({src})"
    if name == "span":
        return "".join(inline_md(c, base_url) for c in node.children)
    if name == "sub":
        return "_" + node.get_text() + "_"
    if name == "sup":
        return "^" + node.get_text() + "^"
    # fallback: recurse into children
    return "".join(inline_md(c, base_url) for c in node.children)


def block_md(node: Tag, base_url: str, depth: int = 0) -> str:
    name = node.name
    if name is None:
        return ""

    if name in ("h1", "h2", "h3", "h4", "h5", "h6"):
        level = int(name[1])
        # remove ¶ anchor marker
        text = "".join(inline_md(c, base_url) for c in node.children).replace("¶", "").strip()
        return "\n" + "#" * level + " " + text + "\n\n"

    if name == "p":
        text = "".join(inline_md(c, base_url) for c in node.children).strip()
        return text + "\n\n" if text else ""

    if name in ("ul", "ol"):
        items = []
        for i, li in enumerate(node.find_all("li", recursive=False), 1):
            prefix = "- " if name == "ul" else f"{i}. "
            li_md_parts = []
            for c in li.children:
                if isinstance(c, NavigableString):
                    li_md_parts.append(str(c))
                elif isinstance(c, Tag):
                    if c.name in ("ul", "ol"):
                        nested = block_md(c, base_url, depth + 1)
                        # indent nested list
                        nested = "\n" + "\n".join(("  " + ln if ln.strip() else ln) for ln in nested.split("\n"))
                        li_md_parts.append(nested)
                    elif c.name in ("p",):
                        # inline a single p into the li
                        li_md_parts.append(
                            "".join(inline_md(cc, base_url) for cc in c.children)
                        )
                    else:
                        li_md_parts.append(inline_md(c, base_url))
            text = "".join(li_md_parts).strip()
            items.append(prefix + text)
        return "\n".join(items) + "\n\n"

    if name == "pre":
        code = node.find("code")
        lang = ""
        if code is not None:
            for cls in code.get("class") or []:
                if cls.startswith("language-"):
                    lang = cls[len("language-"):]
        text = (code or node).get_text()
        text = text.rstrip("\n")
        return f"\n```{lang}\n{text}\n```\n\n"

    if name == "blockquote":
        inner = []
        for c in node.children:
            if isinstance(c, Tag):
                inner.append(block_md(c, base_url, depth + 1))
            elif isinstance(c, NavigableString):
                s = str(c).strip()
                if s:
                    inner.append(s + "\n\n")
        body = "".join(inner).strip()
        body = "\n".join("> " + ln for ln in body.split("\n"))
        return body + "\n\n"

    if name == "table":
        rows = []
        for tr in node.find_all("tr"):
            cells = []
            for cell in tr.find_all(["th", "td"]):
                cell_md = "".join(inline_md(c, base_url) for c in cell.children).strip()
                cell_md = cell_md.replace("\n", " ").replace("|", "\\|")
                cells.append(cell_md)
            rows.append(cells)
        if not rows:
            return ""
        out = []
        # header row
        out.append("| " + " | ".join(rows[0]) + " |")
        out.append("| " + " | ".join("---" for _ in rows[0]) + " |")
        for r in rows[1:]:
            out.append("| " + " | ".join(r) + " |")
        return "\n".join(out) + "\n\n"

    if name == "img":
        src = absolutize(node.get("src") or "", base_url)
        alt = node.get("alt") or ""
        return f"\n![{alt}]({src})\n\n"

    if name == "hr":
        return "\n---\n\n"

    # container: recurse
    if name in ("div", "section", "article", "main", "details", "summary", "figure", "figcaption"):
        out = []
        for c in node.children:
            if isinstance(c, Tag):
                out.append(block_md(c, base_url, depth + 1))
            elif isinstance(c, NavigableString):
                s = str(c).strip()
                if s:
                    out.append(s + "\n\n")
        return "".join(out)

    # default: inline only
    text = inline_md(node, base_url).strip()
    if text:
        return text + "\n\n"
    return ""


def html_to_markdown(content_html: str, base_url: str) -> str:
    soup = BeautifulSoup(content_html, "html.parser")
    parts = []
    for child in soup.children:
        if isinstance(child, Tag):
            parts.append(block_md(child, base_url))
        elif isinstance(child, NavigableString):
            s = str(child).strip()
            if s:
                parts.append(s + "\n\n")
    md = "".join(parts)
    # cleanup: collapse 3+ blank lines into 2
    md = re.sub(r"\n{3,}", "\n\n", md)
    # remove stray pilcrow markers
    md = md.replace("¶", "")
    return md.strip() + "\n"


# ---------------------------------------------------------------------------
# Site-specific extractors
# ---------------------------------------------------------------------------
def extract_vnoi(html: str) -> Optional[tuple[str, str]]:
    """Return (title, content_html) or None if not parseable."""
    # title from <title>X | VNOI Wiki</title>
    tm = re.search(r"<title>([^<]+?)\s*\|\s*VNOI Wiki</title>", html)
    title = tm.group(1).strip() if tm else "VNOI Wiki"
    # content block: between the first <div><h1 ... toc-header ...> and </page>
    m = re.search(r"<div>(?=<h1[^>]*toc-header)", html)
    if not m:
        # Try a looser match
        m = re.search(r"<h1[^>]*toc-header", html)
        if not m:
            return None
        start = m.start()
    else:
        start = m.start()
    end_idx = html.find("</page>", start)
    if end_idx == -1:
        end_idx = len(html)
    content_html = html[start:end_idx]
    return title, content_html


def extract_cp_algo(html: str) -> Optional[tuple[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    article = soup.find("article")
    if not article:
        return None
    h1 = article.find("h1")
    title = h1.get_text(strip=True).replace("¶", "").strip() if h1 else "CP-Algorithms"
    return title, str(article)


SITE_BASE = {
    "VNOI Wiki": "https://wiki.vnoi.info/",
    "CP-Algorithms": "https://cp-algorithms.com/",
}

EXTRACTORS = {
    "VNOI Wiki": extract_vnoi,
    "CP-Algorithms": extract_cp_algo,
}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def crawl_topic(topic_id: str, sources: list[tuple[str, str]], use_cache: bool) -> dict:
    print(f"\n[{topic_id}]")
    out_sources = []
    for source_name, url in sources:
        html = fetch(url, use_cache=use_cache)
        if html is None:
            print(f"  skip {source_name} (fetch failed)")
            continue
        extractor = EXTRACTORS.get(source_name)
        if extractor is None:
            print(f"  skip {source_name} (no extractor)")
            continue
        extracted = extractor(html)
        if not extracted:
            print(f"  skip {source_name} (extractor returned None)")
            continue
        title, content_html = extracted
        base_url = SITE_BASE.get(source_name, url)
        md = html_to_markdown(content_html, base_url)
        if len(md) < 200:
            print(f"  skip {source_name} (markdown too short: {len(md)} chars)")
            continue
        out_sources.append(
            {
                "source": source_name,
                "url": url,
                "title": title,
                "license": LICENSE_MAP.get(source_name, ""),
                "markdown": md,
            }
        )
        print(f"  ok {source_name}: {title} ({len(md)} chars)")
    return {"topic": topic_id, "sources": out_sources}


def main(argv: list[str]) -> int:
    use_cache = True
    topics: list[str] = []
    for arg in argv[1:]:
        if arg == "--no-cache":
            use_cache = False
        elif arg.startswith("--"):
            print(f"Unknown flag: {arg}", file=sys.stderr)
            return 1
        else:
            topics.append(arg)
    if not topics:
        topics = list(SOURCES.keys())

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    index = []

    for topic_id in topics:
        sources = SOURCES.get(topic_id)
        if not sources:
            print(f"[{topic_id}] no sources defined; skipping")
            continue
        data = crawl_topic(topic_id, sources, use_cache)
        if not data["sources"]:
            print(f"  ! no usable sources for {topic_id}")
            continue
        out_path = OUT_DIR / f"{topic_id}.json"
        out_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        index.append(
            {
                "topic": topic_id,
                "sources": [s["source"] for s in data["sources"]],
            }
        )

    # write a manifest for the frontend
    manifest_path = OUT_DIR / "index.json"
    manifest_path.write_text(
        json.dumps({"topics": index}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\nWrote manifest for {len(index)} topics -> {manifest_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))

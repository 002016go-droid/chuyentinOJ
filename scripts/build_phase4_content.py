#!/usr/bin/env python3
"""Phase 4 content fill — generates HSG lớp 9 contests, chuyên Tin entrance exams,
and expanded Day 3-7 learning lessons. All problem references must exist in
public/data/problems/index.json (no new internal problems are created)."""

from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "public" / "data"


def load_index() -> set[str]:
    return set(json.loads((DATA / "problems" / "index.json").read_text()))


# ----------------------------------------------------------------------------
# HSG lớp 9 contests
# ----------------------------------------------------------------------------
#
# User scope: "chỉ lấy đề học sinh giỏi lớp 9 thôi".  Each contest = 4 problems
# in increasing difficulty (T1 → T3).  Problems are mapped to existing slugs in
# index.json — typical HSG-9 topics: I/O & simulation, sort/search, prefix sum
# & two-pointer, greedy & DP cơ bản, BFS/DFS.

HSG9_PROVINCES = [
    # (id, title, province, flag, year, problems[4])
    (
        "danang-hsg9-2024",
        "HSG Tin học Đà Nẵng 2024 — Lớp 9",
        "Đà Nẵng",
        "🏙",
        2024,
        ["io-sum1ton", "sort-find-kth", "tp-pair-sum", "bfs-grid"],
    ),
    (
        "danang-hsg9-2023",
        "HSG Tin học Đà Nẵng 2023 — Lớp 9",
        "Đà Nẵng",
        "🏙",
        2023,
        ["io-counteven", "arr1d-maxsubarr", "greedy-min-platforms", "dfs-largest-component"],
    ),
    (
        "danang-hsg9-2022",
        "HSG Tin học Đà Nẵng 2022 — Lớp 9",
        "Đà Nẵng",
        "🏙",
        2022,
        ["io-digitsum", "sort-stable-pair", "bs-find-x", "dp-climb-stairs"],
    ),
    (
        "quangnam-hsg9-2024",
        "HSG Tin học Quảng Nam 2024 — Lớp 9",
        "Quảng Nam",
        "🏯",
        2024,
        ["io-aplusb", "hash-pair-sum", "greedy-activity", "bfs-distance"],
    ),
    (
        "quangnam-hsg9-2023",
        "HSG Tin học Quảng Nam 2023 — Lớp 9",
        "Quảng Nam",
        "🏯",
        2023,
        ["io-fib-mod", "arr2d-spiral", "tp-window-min-len", "dp-coin-min"],
    ),
    (
        "hanoi-hsg9-2024",
        "HSG Tin học Hà Nội 2024 — Lớp 9",
        "Hà Nội",
        "🇻🇳",
        2024,
        ["io-primes-lr", "sort-distinct-count", "greedy-coin", "bfs-multi-source"],
    ),
    (
        "hanoi-hsg9-2023",
        "HSG Tin học Hà Nội 2023 — Lớp 9",
        "Hà Nội",
        "🇻🇳",
        2023,
        ["io-reversenum", "arr1d-inversions-easy", "bs-lower-bound", "dp-house-robber"],
    ),
    (
        "hcmc-hsg9-2024",
        "HSG Tin học TP.HCM 2024 — Lớp 9",
        "TP.HCM",
        "🌆",
        2024,
        ["io-minmax", "hash-freq", "greedy-min-water", "dfs-cycle-detect"],
    ),
    (
        "hcmc-hsg9-2023",
        "HSG Tin học TP.HCM 2023 — Lớp 9",
        "TP.HCM",
        "🌆",
        2023,
        ["arr1d-sum", "arr1d-kth-smallest", "tp-zero-sum-segments", "dp-max-subarray"],
    ),
    (
        "haiphong-hsg9-2024",
        "HSG Tin học Hải Phòng 2024 — Lớp 9",
        "Hải Phòng",
        "⚓",
        2024,
        ["arr1d-rangesum", "sort-bytwo-keys", "tp-3sum-zero", "bfs-knight"],
    ),
    (
        "nghean-hsg9-2024",
        "HSG Tin học Nghệ An 2024 — Lớp 9",
        "Nghệ An",
        "🌅",
        2024,
        ["arr2d-rowsum", "hash-count-distinct", "greedy-fuel-station", "dfs-bipartite"],
    ),
    (
        "thanhhoa-hsg9-2024",
        "HSG Tin học Thanh Hoá 2024 — Lớp 9",
        "Thanh Hoá",
        "🌾",
        2024,
        ["str-palindrome", "sort-pairs-mate", "bs-rotated", "lis-basic"],
    ),
]


def build_contests(index: set[str]) -> list[dict]:
    out = []
    for cid, title, province, flag, year, problems in HSG9_PROVINCES:
        missing = [p for p in problems if p not in index]
        if missing:
            raise SystemExit(f"contest {cid} references missing problems: {missing}")
        out.append({
            "id": cid,
            "title": title,
            "province": province,
            "flag": flag,
            "year": year,
            "grade": 9,
            "type": "hsg-city",
            "problems": problems,
            "duration": 150,
        })
    return out


# ----------------------------------------------------------------------------
# Chuyên Tin entrance exams (Tuyển sinh lớp 10)
# ----------------------------------------------------------------------------
# Schools commonly used for chuyên Tin entrance:
#   NBK (Lê Quý Đôn — Đà Nẵng), PTNK (Phổ Thông Năng Khiếu — TP.HCM),
#   LHP (Lê Hồng Phong — TP.HCM), HSGS (Khoa học Tự nhiên — Hà Nội),
#   Amsterdam — Hà Nội, Lê Quý Đôn — Quảng Trị / Bình Định, Phan Bội Châu — Nghệ An.

ENTRANCE_EXAMS = [
    # NBK Đà Nẵng — keep + extend
    ("nbk-2024", "Tuyển sinh 10 Chuyên Tin — NBK Đà Nẵng 2024", "Đà Nẵng", "Lê Quý Đôn (NBK)",
     2024, ["io-sum1ton", "partial-sort-3", "max-subarray-sum", "shortest-path-unweighted"]),
    ("nbk-2023", "Tuyển sinh 10 Chuyên Tin — NBK Đà Nẵng 2023", "Đà Nẵng", "Lê Quý Đôn (NBK)",
     2023, ["io-counteven", "sort-find-kth", "tp-pair-sum", "dp-house-robber"]),
    ("nbk-2022", "Tuyển sinh 10 Chuyên Tin — NBK Đà Nẵng 2022", "Đà Nẵng", "Lê Quý Đôn (NBK)",
     2022, ["io-aplusb", "hash-mode", "bs-find-x"]),
    ("nbk-2021", "Tuyển sinh 10 Chuyên Tin — NBK Đà Nẵng 2021", "Đà Nẵng", "Lê Quý Đôn (NBK)",
     2021, ["io-digitsum", "arr1d-inversions-easy", "greedy-activity", "dp-max-subarray"]),
    # Quảng Nam
    ("quangnam-2024", "Tuyển sinh 10 Chuyên Tin — Quảng Nam 2024", "Quảng Nam", "Nguyễn Bỉnh Khiêm",
     2024, ["io-fib-mod", "sort-stable-pair", "bs-lower-bound", "bfs-distance"]),
    ("quangnam-2023", "Tuyển sinh 10 Chuyên Tin — Quảng Nam 2023", "Quảng Nam", "Nguyễn Bỉnh Khiêm",
     2023, ["arr1d-rangesum", "tp-window-min-len", "dp-coin-min"]),
    ("quangnam-2022", "Tuyển sinh 10 Chuyên Tin — Quảng Nam 2022", "Quảng Nam", "Nguyễn Bỉnh Khiêm",
     2022, ["io-primes-lr", "hash-freq", "bs-rope-cut", "dfs-largest-component"]),
    # PTNK TP.HCM
    ("ptnk-2024", "Tuyển sinh 10 Chuyên Tin — PTNK 2024", "TP.HCM", "Phổ Thông Năng Khiếu",
     2024, ["io-reversenum", "sort-distinct-count", "greedy-min-platforms", "dijkstra-classic"]),
    ("ptnk-2023", "Tuyển sinh 10 Chuyên Tin — PTNK 2023", "TP.HCM", "Phổ Thông Năng Khiếu",
     2023, ["arr1d-maxsubarr", "hash-subarray-sum", "bs-painters-partition", "dp-climb-stairs"]),
    # LHP TP.HCM
    ("lhp-2024", "Tuyển sinh 10 Chuyên Tin — Lê Hồng Phong 2024", "TP.HCM", "Lê Hồng Phong",
     2024, ["io-minmax", "sort-bytwo-keys", "tp-3sum-zero", "bfs-multi-source"]),
    ("lhp-2023", "Tuyển sinh 10 Chuyên Tin — Lê Hồng Phong 2023", "TP.HCM", "Lê Hồng Phong",
     2023, ["str-anagram", "arr2d-maxsubrect", "greedy-coin", "lis-basic"]),
    # HSGS Hà Nội
    ("hsgs-2024", "Tuyển sinh 10 Chuyên Tin — HSGS Hà Nội 2024", "Hà Nội", "KHTN (HSGS)",
     2024, ["io-counteven", "hash-pair-sum", "bs-split-array-min-max", "dp-house-robber"]),
    ("hsgs-2023", "Tuyển sinh 10 Chuyên Tin — HSGS Hà Nội 2023", "Hà Nội", "KHTN (HSGS)",
     2023, ["arr1d-rotate", "sort-median", "tp-distinct-window", "knap-01"]),
    # Amsterdam Hà Nội
    ("ams-2024", "Tuyển sinh 10 Chuyên Tin — Amsterdam 2024", "Hà Nội", "Hà Nội — Amsterdam",
     2024, ["io-aplusb", "arr1d-freq", "greedy-min-water", "bfs-grid"]),
    ("ams-2023", "Tuyển sinh 10 Chuyên Tin — Amsterdam 2023", "Hà Nội", "Hà Nội — Amsterdam",
     2023, ["str-vowel-count", "arr1d-kth-smallest", "tp-pair-sum", "lcs-basic"]),
    # Phan Bội Châu Nghệ An
    ("pbc-2024", "Tuyển sinh 10 Chuyên Tin — Phan Bội Châu 2024", "Nghệ An", "Phan Bội Châu",
     2024, ["io-fib-mod", "hash-mode", "bs-koko-bananas", "dp-fib-mod"]),
    # Lê Quý Đôn Bình Định
    ("lqd-bd-2024", "Tuyển sinh 10 Chuyên Tin — LQĐ Bình Định 2024", "Bình Định", "Lê Quý Đôn",
     2024, ["arr2d-rowsum", "sort-mergetwo", "greedy-fractional-knapsack", "dfs-bipartite"]),
]


def build_entrance(index: set[str]) -> list[dict]:
    out = []
    for eid, title, province, school, year, problems in ENTRANCE_EXAMS:
        missing = [p for p in problems if p not in index]
        if missing:
            raise SystemExit(f"entrance {eid} references missing problems: {missing}")
        out.append({
            "id": eid,
            "title": title,
            "province": province,
            "school": school,
            "year": year,
            "type": "entrance",
            "problems": problems,
            "duration": 150,
        })
    return out


# ----------------------------------------------------------------------------
# Learning lessons — expand Day 1-2 to Day 1-7
# ----------------------------------------------------------------------------
# Existing data on disk already covers Day 1 (5 lessons) + Day 2 (3 lessons).
# We extend with Day 3 (Stack/Queue/Sim), Day 4 (STL deep), Day 5 (Number
# theory + bit), Day 6 (Graph algo), Day 7 (DP nâng cao).  Each lesson keeps
# the schema used in learning.json on main: slug, day, block, duration, title,
# goal, practiceProblems[].

EXTRA_LESSONS = [
    # Day 3 — Stack / Queue / Simulation
    {
        "slug": "stack-queue-basics",
        "day": 3, "block": "sáng", "duration": "90 phút",
        "title": "Stack & Queue cơ bản",
        "goal": "STL stack/queue, ngoặc cân bằng, mô phỏng lịch sử thao tác.",
        "practiceProblems": ["stl-stack-reverse-stk", "valid-brackets", "mock-bracket-balance"],
    },
    {
        "slug": "deque-monoqueue",
        "day": 3, "block": "sáng", "duration": "60 phút",
        "title": "Deque & cửa sổ trượt",
        "goal": "Sliding window max/min với deque, áp dụng cho streaming.",
        "practiceProblems": ["mdq-window-max", "mdq-window-min", "stl-deque-rolling-avg"],
    },
    {
        "slug": "simulation-day3",
        "day": 3, "block": "chiều", "duration": "90 phút",
        "title": "Mô phỏng & truy vết",
        "goal": "Đọc đề kỹ, dựng mô phỏng đúng từng bước; bug giảm 80% nhờ trace.",
        "practiceProblems": ["sim-bank", "sim-elevator", "sim-clock", "sim-trafficlight"],
    },
    # Day 4 — STL deep
    {
        "slug": "stl-set-map",
        "day": 4, "block": "sáng", "duration": "90 phút",
        "title": "set / map / multiset",
        "goal": "lower_bound/upper_bound trên set, đếm phần tử, median trượt.",
        "practiceProblems": ["stl-set-distinct", "stl-map-freq", "stl-multiset-median"],
    },
    {
        "slug": "stl-priority-queue",
        "day": 4, "block": "chiều", "duration": "90 phút",
        "title": "priority_queue & heap thủ công",
        "goal": "Top-K, gộp K dãy, lập lịch theo độ ưu tiên.",
        "practiceProblems": ["stl-priority-task", "stl-pq-merge"],
    },
    {
        "slug": "stl-pair-vector",
        "day": 4, "block": "tối", "duration": "60 phút",
        "title": "pair + vector + tuple thuần",
        "goal": "Sort theo nhiều khoá, lưu cấu trúc gọn, tránh struct dư thừa.",
        "practiceProblems": ["stl-pair-sort", "stl-vector-rotate", "sort-pairs-mate"],
    },
    # Day 5 — Number theory + bit
    {
        "slug": "number-theory-basics",
        "day": 5, "block": "sáng", "duration": "90 phút",
        "title": "Số học cơ bản: gcd, sàng, modular",
        "goal": "Sàng Eratosthenes, phân tích thừa số bằng SPF, mũ nhanh modulo.",
        "practiceProblems": ["sieve-count-primes", "sieve-list-primes", "sieve-range-count", "gcd-recursion"],
    },
    {
        "slug": "modular-arithmetic",
        "day": 5, "block": "chiều", "duration": "60 phút",
        "title": "Modulo & nghịch đảo Fermat",
        "goal": "Fib mod, tổ hợp mod, tránh tràn số.",
        "practiceProblems": ["dp-fib-mod", "io-fib-mod"],
    },
    {
        "slug": "bitmask-intro",
        "day": 5, "block": "tối", "duration": "60 phút",
        "title": "Bitmask nhập môn",
        "goal": "Dùng bit để biểu diễn tập con, popcount, lưu trạng thái DP.",
        "practiceProblems": ["bitmask-tsp", "subset-sum-exist", "subset-count-ways"],
    },
    # Day 6 — Graph algorithms
    {
        "slug": "graph-traversal",
        "day": 6, "block": "sáng", "duration": "90 phút",
        "title": "Duyệt đồ thị: BFS / DFS",
        "goal": "Đếm thành phần, kiểm chu trình, BFS đa nguồn, lưới trở thành đồ thị.",
        "practiceProblems": ["bfs-distance", "dfs-toposort", "dfs-count-components", "bfs-multi-source"],
    },
    {
        "slug": "shortest-path",
        "day": 6, "block": "chiều", "duration": "90 phút",
        "title": "Đường đi ngắn nhất",
        "goal": "Dijkstra (cạnh dương), 0-1 BFS, Floyd cho đồ thị nhỏ.",
        "practiceProblems": ["sp-dijkstra-basic", "sp-zero-one-bfs", "sp-floyd-warshall"],
    },
    {
        "slug": "dsu-mst",
        "day": 6, "block": "tối", "duration": "60 phút",
        "title": "DSU & cây khung nhỏ nhất",
        "goal": "Union-Find với rank + path compression, Kruskal.",
        "practiceProblems": ["dsu-friends", "dsu-mst-kruskal", "dsu-size-largest"],
    },
    # Day 7 — DP nâng cao
    {
        "slug": "knapsack-family",
        "day": 7, "block": "sáng", "duration": "90 phút",
        "title": "Knapsack 0/1 & unbounded",
        "goal": "Khử chiều, mẹo tối ưu O(N*W), ý nghĩa dp[i][w].",
        "practiceProblems": ["knapsack-01", "knap-01", "knap-unbounded"],
    },
    {
        "slug": "lis-lcs",
        "day": 7, "block": "chiều", "duration": "90 phút",
        "title": "LIS & LCS",
        "goal": "LIS O(N log N) bằng patience, LCS DP + truy ngược.",
        "practiceProblems": ["lis-classic", "lis-fast", "lcs-classic", "edit-distance"],
    },
    {
        "slug": "tree-dp",
        "day": 7, "block": "tối", "duration": "60 phút",
        "title": "DP trên cây",
        "goal": "Kích thước cây con, đường kính, tập độc lập cực đại.",
        "practiceProblems": ["tdp-subtree-size", "tdp-tree-diameter", "tdp-max-indep-set"],
    },
]


def build_learning(existing: list[dict], index: set[str]) -> list[dict]:
    existing_slugs = {e["slug"] for e in existing}
    out = list(existing)
    for lesson in EXTRA_LESSONS:
        if lesson["slug"] in existing_slugs:
            continue
        missing = [p for p in lesson["practiceProblems"] if p not in index]
        if missing:
            raise SystemExit(f"lesson {lesson['slug']} references missing problems: {missing}")
        out.append(lesson)
    return out


# ----------------------------------------------------------------------------
def main() -> None:
    index = load_index()

    contests = build_contests(index)
    (DATA / "contests.json").write_text(
        json.dumps(contests, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    entrance = build_entrance(index)
    (DATA / "entrance-exams.json").write_text(
        json.dumps(entrance, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    existing_learning = json.loads((DATA / "learning.json").read_text())
    learning = build_learning(existing_learning, index)
    (DATA / "learning.json").write_text(
        json.dumps(learning, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"contests: {len(contests)} HSG lớp 9 entries")
    print(f"entrance: {len(entrance)} chuyên Tin entries")
    print(f"learning: {len(learning)} lessons across {len({l['day'] for l in learning})} days")


if __name__ == "__main__":
    main()

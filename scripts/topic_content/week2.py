"""Week 2 — Day 8..14 — Tham lam / hai con trỏ / tổng tiền tố / nhị phân / quay lui / meet-in-middle."""


def register(C, R):
    C["greedy"] = dict(
        objectives=[
            "Phát biểu chiến lược tham lam: 'tại mỗi bước, chọn lựa tốt nhất cục bộ'",
            "Chứng minh tính đúng đắn bằng exchange argument hoặc invariant",
            "Bài 'activity selection' / xếp lịch / phân công công việc",
            "Bài 'ghép cặp tối ưu' — sort 2 đầu rồi ghép",
            "Bài 'ưu tiên theo deadline / theo trọng số' — heap (priority_queue)",
            "Cảnh giác khi tham lam fail: bài tương tự nhưng cần DP",
        ],
        requirements=[
            "Sort + comparator (Day 6)",
            "STL `priority_queue` (sẽ dùng nhiều, học sơ ở đây)",
        ],
        studyMethod=[
            "Trước khi code, chứng minh tay 'tại sao chiến lược này đúng'",
            "Phản ví dụ: thử nhỏ 3-4 ca xem có ca nào fail không",
            "Khi cần ghép tối ưu → sort 2 mảng, ghép theo đầu/đuôi (Stick Lengths, Ferris Wheel)",
            "Khi có deadline + reward → heap để giữ k phần tử tốt nhất",
        ],
        theoryFull=(
            "## Tham lam (Greedy)\n\n"
            "Một thuật toán tham lam đưa ra **lựa chọn tốt nhất cục bộ** tại mỗi bước với hy "
            "vọng đến cuối được nghiệm tối ưu toàn cục. Khác DP ở chỗ greedy không quay lại, "
            "không xét lại bước cũ.\n\n"
            "## Khi nào greedy đúng?\n\n"
            "Hai tính chất phải có:\n\n"
            "1. **Greedy choice property** — luôn có 1 nghiệm tối ưu chứa lựa chọn tham lam.\n"
            "2. **Optimal substructure** — sau khi chọn, bài toán còn lại cũng có nghiệm tối ưu.\n\n"
            "Cách chứng minh thông dụng:\n\n"
            "- **Exchange argument**: giả sử có nghiệm tối ưu khác greedy. Ta hoán đổi 1 cặp "
            "phần tử để biến nó thành nghiệm theo greedy mà không tệ hơn → greedy cũng tối ưu.\n\n"
            "## 3 pattern phải thuộc lớp 9\n\n"
            "**1. Activity Selection** (chọn nhiều hoạt động không xung đột nhất): sort theo "
            "thời điểm kết thúc tăng, duyệt và chọn nếu start > end của hoạt động cuối được chọn.\n\n"
            "**2. Job Scheduling với Deadline** (cực đại tổng lợi nhuận, mỗi job mất 1 đơn vị "
            "thời gian, có deadline): sort theo lợi nhuận giảm, dùng DSU/PQ để gán slot.\n\n"
            "**3. Huffman Coding** (ghép tối ưu với chi phí = tổng 2 cây nhỏ nhất): min-heap, "
            "lấy 2 phần tử nhỏ nhất, ghép, đẩy lại.\n\n"
            "## Khi greedy SAI\n\n"
            "Cảnh giác với bài 'Knapsack 0/1' (không phải Fractional Knapsack!), 'Coin Change tổng "
            "quát' — tham lam fail, phải DP.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Tham lam*: <https://wiki.vnoi.info/algo/basic/greedy>\n"
            "- USACO Guide Bronze — *Greedy Algorithms*: <https://usaco.guide/bronze/intro-greedy>\n"
            "- USACO Guide Silver — *Greedy Algorithms*: <https://usaco.guide/silver/greedy-sorting>\n"
            "- CP-Algorithms — *Greedy*: <https://cp-algorithms.com/algebra/scheduling.html>\n"
            "- GeeksforGeeks — *Greedy Algorithms*: <https://www.geeksforgeeks.org/greedy-algorithms/>\n"
        ),
        codeExample=(
            "// Activity Selection — sort theo end-time tăng\n"
            "struct Job { int s, e; };\n"
            "vector<Job> a(n);\n"
            "for (auto &j : a) cin >> j.s >> j.e;\n"
            "sort(a.begin(), a.end(), [](const Job& x, const Job& y) {\n"
            "    return x.e < y.e;\n"
            "});\n"
            "int cnt = 0, last_end = -1;\n"
            "for (auto &j : a)\n"
            "    if (j.s >= last_end) { ++cnt; last_end = j.e; }\n"
            "cout << cnt << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Stick Lengths", "https://cses.fi/problemset/task/1074", "CSES", "easy"),
            R("CSES — Movie Festival", "https://cses.fi/problemset/task/1629", "CSES", "easy"),
            R("CSES — Movie Festival II", "https://cses.fi/problemset/task/1632", "CSES", "medium"),
            R("CSES — Tasks and Deadlines", "https://cses.fi/problemset/task/1630", "CSES", "medium"),
            R("CSES — Reading Books", "https://cses.fi/problemset/task/1631", "CSES", "easy"),
            R("CSES — Apartments", "https://cses.fi/problemset/task/1084", "CSES", "easy"),
            R("CSES — Ferris Wheel", "https://cses.fi/problemset/task/1090", "CSES", "easy"),
            R("CF 545D — Queue", "https://codeforces.com/problemset/problem/545/D", "Codeforces", "easy"),
            R("CF 681C — Heap Operations", "https://codeforces.com/problemset/problem/681/C", "Codeforces", "medium"),
            R("CF 996A — Hit the Lottery", "https://codeforces.com/problemset/problem/996/A", "Codeforces", "easy"),
            R("CF 1051C — Three Pairs Or Not", "https://codeforces.com/problemset/problem/1051/C", "Codeforces", "medium"),
            R("CF 13C — Sequence (Slope Trick)", "https://codeforces.com/problemset/problem/13/C", "Codeforces", "hard"),
            R("AtCoder — ABC 091B Two Colors Card Game", "https://atcoder.jp/contests/abc091/tasks/abc091_b", "AtCoder", "easy"),
            R("AtCoder — ABC 121C Energy Drink Collector", "https://atcoder.jp/contests/abc121/tasks/abc121_c", "AtCoder", "easy"),
            R("AtCoder — ABC 159D Banned K", "https://atcoder.jp/contests/abc159/tasks/abc159_d", "AtCoder", "medium"),
            R("HackerRank — Greedy Florist", "https://www.hackerrank.com/challenges/greedy-florist/problem", "HackerRank", "medium"),
            R("HackerRank — Minimum Absolute Difference in Array", "https://www.hackerrank.com/challenges/minimum-absolute-difference-in-an-array/problem", "HackerRank", "easy"),
            R("LeetCode 455 — Assign Cookies", "https://leetcode.com/problems/assign-cookies/", "LeetCode", "easy"),
            R("LeetCode 435 — Non-overlapping Intervals", "https://leetcode.com/problems/non-overlapping-intervals/", "LeetCode", "medium"),
            R("VNOJ — TUONG: Tham lam ghép cặp", "https://oj.vnoi.info/problem/tuong", "VNOJ", "easy"),
        ],
    )

    C["two-pointers"] = dict(
        objectives=[
            "Hai con trỏ cùng chiều trên dãy đã sort — tìm cặp, ba số, đoạn con",
            "Hai con trỏ ngược chiều — pair-sum trên dãy sort",
            "Cửa sổ trượt dài thay đổi: tổng/đếm/max-thoả-điều-kiện",
            "Quan sát monotonic: khi L tăng, R không bao giờ giảm → 2-ptr",
            "Bài 'đoạn con dài nhất thoả P' với P đơn điệu",
            "Phân biệt 2-ptr (O(n)) vs binary search (O(n log n)) cho cùng bài",
        ],
        requirements=[
            "Mảng 1D + sort (Day 3 và 6)",
            "Tổng tiền tố cơ bản (Day 10 sẽ làm kỹ)",
        ],
        studyMethod=[
            "Vẽ thanh trượt `[L, R]` trên giấy, thử di chuyển từng bước cho 1 ví dụ",
            "Tự đặt câu hỏi: 'Khi L tăng, R cần thế nào?' — nếu R cũng tăng → 2-ptr",
            "Bài 'đoạn dài nhất tổng < S' (S > 0, a[i] > 0) là pattern kinh điển",
            "So sánh với binary search: 2-ptr ngắn hơn nhưng cần invariant monotonic",
        ],
        theoryFull=(
            "## Hai con trỏ (Two Pointers)\n\n"
            "Kỹ thuật dùng 2 chỉ số `L`, `R` di chuyển trên dãy. Mỗi chỉ số chỉ tăng → tổng "
            "số phép = O(n). Có 3 biến thể chính:\n\n"
            "### 1. Cùng chiều, cửa sổ trượt biến thiên\n\n"
            "```cpp\nint L = 0;\nlong long sum = 0;\nlong long best = 0;\nfor (int R = 0; R < n; ++R) {\n    sum += a[R];\n    while (sum > S && L <= R) sum -= a[L++];\n    best = max(best, (long long)(R - L + 1));\n}\n```\n\n"
            "Pattern: \"đoạn liên tiếp dài nhất thoả P\". P phải có tính chất: nếu `[L, R]` thoả "
            "thì `[L+1, R]` cũng thoả (P thoái lui khi cắt đầu). Khi đó R không cần lùi.\n\n"
            "### 2. Ngược chiều, sort + pair-sum\n\n"
            "Tìm cặp `(a[i], a[j])` với `a[i] + a[j] = target` trên dãy đã sort:\n\n"
            "```cpp\nint l = 0, r = n - 1;\nwhile (l < r) {\n    long long s = a[l] + a[r];\n    if (s == target) { /* found */ break; }\n    else if (s < target) ++l;\n    else --r;\n}\n```\n\n"
            "### 3. Merge 2 dãy đã sort (giống bước merge của merge sort)\n\n"
            "Dùng 2 chỉ số `i`, `j` trên 2 dãy, lấy phần tử nhỏ hơn rồi tăng chỉ số đó.\n\n"
            "## Khi nào nhận ra 2-ptr?\n\n"
            "- Đề có **'đoạn liên tiếp'** + một điều kiện monotonic (tổng tăng, max tăng, "
            "đếm tăng) → 2-ptr cùng chiều.\n"
            "- Đề **'tìm cặp/ba với tổng/tích'** trên dãy → sort + 2-ptr ngược chiều.\n\n"
            "## 2-ptr vs Binary Search\n\n"
            "Cả hai khai thác monotonic. 2-ptr O(n) nhanh hơn nhưng cần điều kiện chặt hơn "
            "(state phải cập nhật được khi tăng L hoặc R 1 đơn vị). Binary search O(n log n) "
            "linh hoạt hơn cho điều kiện phức tạp.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Two Pointers*: <https://wiki.vnoi.info/algo/two-pointers/two-pointers>\n"
            "- USACO Guide Silver — *Two Pointers*: <https://usaco.guide/silver/two-pointers>\n"
            "- CP-Algorithms — *Two pointers technique*: <https://cp-algorithms.com/others/maximum_average_segment.html>\n"
            "- GeeksforGeeks — *Two Pointers Technique*: <https://www.geeksforgeeks.org/two-pointers-technique/>\n"
        ),
        codeExample=(
            "// Đoạn con liên tiếp dài nhất có tổng <= S, a[i] > 0\n"
            "int L = 0; long long sum = 0; int best = 0;\n"
            "for (int R = 0; R < n; ++R) {\n"
            "    sum += a[R];\n"
            "    while (sum > S) sum -= a[L++];\n"
            "    best = max(best, R - L + 1);\n"
            "}\n"
            "cout << best << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Sum of Two Values", "https://cses.fi/problemset/task/1640", "CSES", "easy"),
            R("CSES — Sum of Three Values", "https://cses.fi/problemset/task/1641", "CSES", "medium"),
            R("CSES — Sum of Four Values", "https://cses.fi/problemset/task/1642", "CSES", "medium"),
            R("CSES — Maximum Subarray Sum II", "https://cses.fi/problemset/task/1644", "CSES", "medium"),
            R("CSES — Playlist", "https://cses.fi/problemset/task/1141", "CSES", "easy"),
            R("CSES — Subarray Sums I (positive)", "https://cses.fi/problemset/task/1660", "CSES", "easy"),
            R("CSES — Subarray Sums II", "https://cses.fi/problemset/task/1661", "CSES", "medium"),
            R("CSES — Subarray Divisibility", "https://cses.fi/problemset/task/1662", "CSES", "medium"),
            R("CF 224B — Array (Two Pointers)", "https://codeforces.com/problemset/problem/224/B", "Codeforces", "medium"),
            R("CF 6C — Alice, Bob and Chocolate", "https://codeforces.com/problemset/problem/6/C", "Codeforces", "easy"),
            R("CF 279B — Books", "https://codeforces.com/problemset/problem/279/B", "Codeforces", "easy"),
            R("CF 363B — Fence", "https://codeforces.com/problemset/problem/363/B", "Codeforces", "easy"),
            R("AtCoder — ABC 098D Xor Sum 2", "https://atcoder.jp/contests/abc098/tasks/arc098_b", "AtCoder", "medium"),
            R("AtCoder — ABC 032C Sequence", "https://atcoder.jp/contests/abc032/tasks/abc032_c", "AtCoder", "medium"),
            R("AtCoder — ABC 130D Enough Array", "https://atcoder.jp/contests/abc130/tasks/abc130_d", "AtCoder", "medium"),
            R("HackerRank — Pairs", "https://www.hackerrank.com/challenges/pairs/problem", "HackerRank", "medium"),
            R("LeetCode 167 — Two Sum II (sorted)", "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", "LeetCode", "medium"),
            R("LeetCode 3 — Longest Substring w/o Repeat", "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "LeetCode", "medium"),
            R("LeetCode 76 — Minimum Window Substring", "https://leetcode.com/problems/minimum-window-substring/", "LeetCode", "hard"),
            R("VNOJ — TWOPOINT: Hai con trỏ cơ bản", "https://oj.vnoi.info/problem/c11pttt", "VNOJ", "easy"),
        ],
    )

    C["prefix-sum"] = dict(
        objectives=[
            "Tổng tiền tố 1D: tính trước `pref[]`, trả lời tổng `[l, r]` trong O(1)",
            "Mảng hiệu (difference array): cập nhật đoạn O(1), xuất giá trị O(n)",
            "Đếm số đoạn liên tiếp có tổng = K bằng `pref + map`",
            "Tổng tiền tố trên `pref[r] - pref[l-1]` chuyển bài về tìm cặp `pref` thoả điều kiện",
            "Modular prefix sum: đếm cặp có hiệu chia hết K",
            "Tổng tiền tố trên xâu nhị phân (đếm '1' trong đoạn)",
        ],
        requirements=[
            "Mảng 1D (Day 3)",
            "Biết khi nào dùng `long long`",
        ],
        studyMethod=[
            "Quy ước 1-indexed: `pref[0] = 0`, `pref[i] = pref[i-1] + a[i]`",
            "Tổng `[l, r]` = `pref[r] - pref[l-1]` — luôn check biên",
            "Bài 'cập nhật đoạn rồi truy vấn giá trị cuối' → mảng hiệu (không cần BIT)",
            "Bài 'đếm đoạn tổng = K' → `cnt[pref[r] - K]` đã thấy ở đâu",
        ],
        theoryFull=(
            "## Tổng tiền tố 1D\n\n"
            "Tiền xử lý O(n): `pref[0] = 0; pref[i] = pref[i-1] + a[i]` (1-indexed). Sau đó:\n\n"
            "- Tổng `a[l..r]` (1-indexed) = `pref[r] - pref[l-1]` — O(1) mỗi truy vấn.\n\n"
            "Tổng số phép cho q truy vấn = O(n + q).\n\n"
            "## Mảng hiệu (Difference Array)\n\n"
            "Khi cần **cập nhật đoạn** `[l, r] += v` nhiều lần, **truy vấn giá trị cuối**:\n\n"
            "```cpp\nd[l]   += v;\nd[r+1] -= v;\n// sau tất cả cập nhật, lấy prefix sum:\nfor (int i = 1; i <= n; ++i) a[i] = a[i-1] + d[i];\n```\n\n"
            "Mỗi cập nhật O(1), tổng O(n + q). Đây là cách trả lời 'A[1] cộng X1, A[2..5] cộng X2, ...' "
            "rất nhanh, không cần segment tree.\n\n"
            "## Pattern: đếm đoạn có tổng = K\n\n"
            "Đếm số cặp `(l, r)` (1 ≤ l ≤ r ≤ n) với `a[l]+...+a[r] = K`. Dùng `pref`:\n\n"
            "`pref[r] - pref[l-1] = K` ⇔ `pref[l-1] = pref[r] - K`.\n\n"
            "Duyệt `r` tăng, đếm bao nhiêu `l-1 ≤ r` với `pref[l-1] = pref[r] - K`. Dùng "
            "`map<long long, int> cnt` để đếm:\n\n"
            "```cpp\nmap<long long, int> cnt;\ncnt[0] = 1; // tương ứng pref[0] = 0\nlong long pref = 0, ans = 0;\nfor (int i = 1; i <= n; ++i) {\n    pref += a[i];\n    ans += cnt[pref - K];\n    cnt[pref]++;\n}\n```\n\n"
            "## Pattern: đếm cặp có hiệu chia hết m\n\n"
            "`(pref[r] - pref[l-1]) % m == 0` ⇔ `pref[r] % m == pref[l-1] % m`. Đếm trên mảng "
            "tần số `cnt[r] = số chỉ số i với pref[i] % m == r`. Đáp số = `Σ C(cnt[r], 2)`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Prefix Sum & Difference Array*: <https://wiki.vnoi.info/algo/data-structures/prefix-sum-and-difference-array>\n"
            "- USACO Guide Silver — *Prefix Sums*: <https://usaco.guide/silver/prefix-sums>\n"
            "- USACO Guide Silver — *More Prefix Sums*: <https://usaco.guide/silver/more-prefix-sums>\n"
            "- CP-Algorithms — *Prefix sums*: <https://cp-algorithms.com/data_structures/sqrt_decomposition.html>\n"
        ),
        codeExample=(
            "// Đếm số đoạn liên tiếp có tổng = K\n"
            "int n; long long K; cin >> n >> K;\n"
            "vector<long long> a(n+1);\n"
            "for (int i = 1; i <= n; ++i) cin >> a[i];\n"
            "unordered_map<long long, long long> cnt;\n"
            "cnt[0] = 1;\n"
            "long long pref = 0, ans = 0;\n"
            "for (int i = 1; i <= n; ++i) {\n"
            "    pref += a[i];\n"
            "    auto it = cnt.find(pref - K);\n"
            "    if (it != cnt.end()) ans += it->second;\n"
            "    cnt[pref]++;\n"
            "}\n"
            "cout << ans << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Static Range Sum Queries", "https://cses.fi/problemset/task/1646", "CSES", "easy"),
            R("CSES — Range Update Queries", "https://cses.fi/problemset/task/1651", "CSES", "easy"),
            R("CSES — Forest Queries", "https://cses.fi/problemset/task/1652", "CSES", "easy"),
            R("CSES — Subarray Sums I", "https://cses.fi/problemset/task/1660", "CSES", "easy"),
            R("CSES — Subarray Sums II", "https://cses.fi/problemset/task/1661", "CSES", "medium"),
            R("CSES — Subarray Divisibility", "https://cses.fi/problemset/task/1662", "CSES", "medium"),
            R("CSES — Subarray Distinct Values", "https://cses.fi/problemset/task/2428", "CSES", "medium"),
            R("CSES — Range Xor Queries", "https://cses.fi/problemset/task/1650", "CSES", "easy"),
            R("CF 433B — Kuriyama Mirai's Stones", "https://codeforces.com/problemset/problem/433/B", "Codeforces", "easy"),
            R("CF 313B — Ilya and Queries", "https://codeforces.com/problemset/problem/313/B", "Codeforces", "easy"),
            R("CF 295A — Greg and Array", "https://codeforces.com/problemset/problem/295/A", "Codeforces", "medium"),
            R("CF 1234C — Pipes", "https://codeforces.com/problemset/problem/1234/C", "Codeforces", "easy"),
            R("AtCoder — ABC 122B ATCoder", "https://atcoder.jp/contests/abc122/tasks/abc122_b", "AtCoder", "easy"),
            R("AtCoder — ABC 037C 総和", "https://atcoder.jp/contests/abc037/tasks/abc037_c", "AtCoder", "easy"),
            R("AtCoder — ABC 188D Snuke Prime", "https://atcoder.jp/contests/abc188/tasks/abc188_d", "AtCoder", "medium"),
            R("HackerRank — Array Manipulation", "https://www.hackerrank.com/challenges/crush/problem", "HackerRank", "medium"),
            R("LeetCode 560 — Subarray Sum Equals K", "https://leetcode.com/problems/subarray-sum-equals-k/", "LeetCode", "medium"),
            R("LeetCode 974 — Subarray Sums Divisible by K", "https://leetcode.com/problems/subarray-sums-divisible-by-k/", "LeetCode", "medium"),
            R("VNOJ — PREFIX: Tổng tiền tố cơ bản", "https://oj.vnoi.info/problem/prefix", "VNOJ", "easy"),
        ],
    )

    C["binary-search"] = dict(
        objectives=[
            "Nhị phân tìm trên dãy đã sort: `lower_bound`, `upper_bound`",
            "Nhị phân trên đáp số (binary search on answer)",
            "Viết đúng template `[L, R]` không bị infinite loop",
            "Phân biệt 'tìm phần tử' vs 'tìm vị trí' vs 'tìm đáp số'",
            "Nhị phân với hàm `check(x)` monotonic — phổ biến trong HSG",
            "Cẩn thận tràn số trong `mid = L + (R - L) / 2`",
        ],
        requirements=[
            "Dãy sort + hiểu monotonic property",
            "Big-O O(n log n) ở mức cảm nhận tốt",
        ],
        studyMethod=[
            "Học thuộc 2 template: tìm `lower_bound` và tìm đáp số dạng `min/max x sao cho check(x)`",
            "Trước khi code, vẽ hàm `check(x)` ra giấy — phải đơn điệu tăng/giảm",
            "Đầu/cuối khoảng tìm phải bao chứa nghiệm: chọn `L = 0` (hoặc `-1`), `R = max + 1`",
            "Bug điển hình: `mid = (L + R) / 2` tràn → `L + (R - L) / 2`",
        ],
        theoryFull=(
            "## Tìm kiếm nhị phân (Binary Search)\n\n"
            "Khi dãy hoặc miền đáp số có tính **đơn điệu**, ta dò bằng cách chia đôi → "
            "O(log n) thay vì O(n). Đây là 1 trong 3 kỹ thuật quan trọng nhất lớp 9.\n\n"
            "## Template 1 — tìm trên dãy sort\n\n"
            "```cpp\n// Tìm vị trí đầu tiên a[i] >= x trong dãy sort tăng\nint l = 0, r = n; // hai biên\nwhile (l < r) {\n    int mid = l + (r - l) / 2;\n    if (a[mid] >= x) r = mid;\n    else l = mid + 1;\n}\n// l = r = vị trí thoả; nếu l == n thì không có\n```\n\n"
            "Tương đương `lower_bound(a.begin(), a.end(), x) - a.begin()`.\n\n"
            "## Template 2 — nhị phân trên đáp số\n\n"
            "Bài hỏi: \"tìm `x` nhỏ nhất sao cho `check(x) = true`\" với `check` đơn điệu (tăng).\n\n"
            "```cpp\nlong long lo = 1, hi = 1e9; // chọn miền đủ rộng\nwhile (lo < hi) {\n    long long mid = lo + (hi - lo) / 2;\n    if (check(mid)) hi = mid;\n    else lo = mid + 1;\n}\n// lo = đáp số\n```\n\n"
            "Hàm `check(x)` thường: \"với x là 'sức chứa' / 'thời gian' / 'số nhân công', "
            "có thoả ràng buộc không?\". Đáp số là `min x` thoả → `check(x)` tăng từ false → true.\n\n"
            "## Bẫy thường gặp\n\n"
            "- **Tràn số**: `(L + R) / 2` có thể tràn nếu L, R lớn. Luôn dùng `L + (R - L) / 2`.\n"
            "- **Infinite loop**: nếu viết `l = mid` thì phải `mid = l + (r - l + 1) / 2`, ngược "
            "lại cứ kẹt mãi.\n"
            "- **Chọn sai biên**: nếu đáp số có thể là 0, đặt `lo = 0`, không phải `lo = 1`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Tìm kiếm nhị phân*: <https://wiki.vnoi.info/algo/basic/binary-search>\n"
            "- USACO Guide Silver — *Binary Search*: <https://usaco.guide/silver/binary-search>\n"
            "- CP-Algorithms — *Binary Search*: <https://cp-algorithms.com/num_methods/binary_search.html>\n"
            "- GeeksforGeeks — *Binary Search*: <https://www.geeksforgeeks.org/binary-search/>\n"
        ),
        codeExample=(
            "// Nhị phân trên đáp số: tìm tốc độ ăn min sao cho ăn hết k bó cỏ trong h giờ\n"
            "auto canFinish = [&](long long speed) {\n"
            "    long long hours = 0;\n"
            "    for (long long p : piles) hours += (p + speed - 1) / speed;\n"
            "    return hours <= h;\n"
            "};\n"
            "long long lo = 1, hi = *max_element(piles.begin(), piles.end());\n"
            "while (lo < hi) {\n"
            "    long long mid = lo + (hi - lo) / 2;\n"
            "    if (canFinish(mid)) hi = mid; else lo = mid + 1;\n"
            "}\n"
            "cout << lo << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Factory Machines", "https://cses.fi/problemset/task/1620", "CSES", "medium"),
            R("CSES — Reading Books", "https://cses.fi/problemset/task/1631", "CSES", "easy"),
            R("CSES — Array Division", "https://cses.fi/problemset/task/1085", "CSES", "medium"),
            R("CSES — Subarray Sums (binary)", "https://cses.fi/problemset/task/1660", "CSES", "easy"),
            R("CSES — Concert Tickets", "https://cses.fi/problemset/task/1091", "CSES", "easy"),
            R("CSES — Nearest Smaller Values", "https://cses.fi/problemset/task/1645", "CSES", "easy"),
            R("CF 1118D2 — Coffee and Coursework", "https://codeforces.com/problemset/problem/1118/D2", "Codeforces", "medium"),
            R("CF 165B — Burning Midnight Oil", "https://codeforces.com/problemset/problem/165/B", "Codeforces", "easy"),
            R("CF 1107C — Brutality", "https://codeforces.com/problemset/problem/1107/C", "Codeforces", "easy"),
            R("CF 1199C — MP3", "https://codeforces.com/problemset/problem/1199/C", "Codeforces", "medium"),
            R("CF 1117C — Magic Ship", "https://codeforces.com/problemset/problem/1117/C", "Codeforces", "medium"),
            R("AtCoder — ABC 023D Squaring", "https://atcoder.jp/contests/abc023/tasks/abc023_d", "AtCoder", "medium"),
            R("AtCoder — ABC 081D Non-decreasing", "https://atcoder.jp/contests/abc081/tasks/arc086_b", "AtCoder", "medium"),
            R("AtCoder — ABC 144E Gluttony", "https://atcoder.jp/contests/abc144/tasks/abc144_e", "AtCoder", "medium"),
            R("HackerRank — Maximum Subarray Sum", "https://www.hackerrank.com/challenges/maximum-subarray-sum/problem", "HackerRank", "medium"),
            R("LeetCode 704 — Binary Search", "https://leetcode.com/problems/binary-search/", "LeetCode", "easy"),
            R("LeetCode 875 — Koko Eating Bananas", "https://leetcode.com/problems/koko-eating-bananas/", "LeetCode", "medium"),
            R("LeetCode 410 — Split Array Largest Sum", "https://leetcode.com/problems/split-array-largest-sum/", "LeetCode", "hard"),
            R("VNOJ — BINSEARCH: Nhị phân cơ bản", "https://oj.vnoi.info/problem/binsearch", "VNOJ", "easy"),
        ],
    )

    C["parametric-search"] = dict(
        objectives=[
            "Đặt câu hỏi 'tồn tại x?' và viết hàm `check(x)` monotonic",
            "Bài chia k phần với tổng max nhỏ nhất: bs trên giá trị",
            "Bài 'đặt n đối tượng cách nhau d, max d?': bs trên khoảng cách",
            "Bài 'tốc độ tối thiểu để hoàn thành trong t giờ'",
            "Phân biệt 'min x sao cho check' và 'max x sao cho check'",
            "Biết khi nào ràng buộc cho phép check() ở mỗi bước O(n) → tổng O(n log V)",
        ],
        requirements=[
            "Binary search cơ bản (Day 11)",
            "Tổng tiền tố nếu check() phải tính tổng đoạn",
        ],
        studyMethod=[
            "Đặt câu hỏi YES/NO trước: 'Với x = ?, ta có làm được không?'",
            "Chứng minh tính đơn điệu (nếu YES với x thì YES với x' lớn/nhỏ hơn)",
            "Code `check(x)` bằng vòng for O(n), tránh phép tính dư thừa",
            "Chọn miền `[lo, hi]` đủ rộng để chứa đáp số chắc chắn",
        ],
        theoryFull=(
            "## Parametric Search (nhị phân trên đáp số)\n\n"
            "Khi không thể tính đáp số trực tiếp nhưng dễ **kiểm tra** một giá trị có thoả không, "
            "ta đoán đáp số rồi nhị phân.\n\n"
            "Điều kiện: hàm `check(x)` (1 = đáp số x khả thi) phải **đơn điệu**.\n\n"
            "## 3 mẫu kinh điển HSG VN\n\n"
            "**Mẫu 1 — Chia bánh cho k đứa trẻ, max miếng nhỏ nhất**: cho dãy độ dài bánh, chia "
            "thành k mảnh sao cho mảnh nhỏ nhất lớn nhất. `check(x)` = có đủ k mảnh dài ≥ x không.\n\n"
            "**Mẫu 2 — Aggressive Cows / đặt n bò vào k chuồng, khoảng cách min lớn nhất**: bs trên "
            "khoảng cách `d`, `check(d)` = đặt được ≥ n bò sao cho mỗi cặp cách ≥ d không.\n\n"
            "**Mẫu 3 — Koko ăn chuối / Factory Machines**: cho machines + thời gian, hỏi tổng "
            "lượng tối đa làm được trong T giờ. BS trên tổng lượng, `check(p)` = T giờ có đủ làm "
            "p sản phẩm không.\n\n"
            "## Khung code\n\n"
            "```cpp\nauto check = [&](long long x) -> bool {\n    // x là đáp số ứng viên\n    // trả về true nếu x khả thi\n    ...\n};\nlong long lo = 0, hi = 1e18;\nwhile (lo < hi) {\n    long long mid = lo + (hi - lo + 1) / 2; // upper-mid khi tìm max x\n    if (check(mid)) lo = mid;\n    else hi = mid - 1;\n}\ncout << lo << '\\n';\n```\n\n"
            "Lưu ý: tìm `max x` thì dùng `mid = lo + (hi - lo + 1) / 2` (upper-mid), gán `lo = mid` "
            "khi check OK. Tìm `min x` thì dùng `mid = lo + (hi - lo) / 2`, gán `hi = mid`.\n\n"
            "## Khi nào dùng?\n\n"
            "- Đề có 'lớn nhất / nhỏ nhất' cộng với 1 điều kiện hậu định.\n"
            "- Tính trực tiếp khó nhưng kiểm tra nhanh.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Nhị phân trên đáp số*: <https://wiki.vnoi.info/algo/basic/binary-search-on-answer>\n"
            "- USACO Guide Silver — *Binary Search on Answer*: <https://usaco.guide/silver/binary-search>\n"
            "- CP-Algorithms — *Binary Search*: <https://cp-algorithms.com/num_methods/binary_search.html>\n"
        ),
        codeExample=(
            "// Aggressive Cows: đặt c con bò vào n chuồng, max khoảng cách min\n"
            "auto check = [&](long long d) -> bool {\n"
            "    int placed = 1; long long last = x[0];\n"
            "    for (int i = 1; i < n; ++i) if (x[i] - last >= d) {\n"
            "        ++placed; last = x[i];\n"
            "        if (placed >= c) return true;\n"
            "    }\n"
            "    return placed >= c;\n"
            "};\n"
            "sort(x.begin(), x.end());\n"
            "long long lo = 1, hi = x[n-1] - x[0];\n"
            "while (lo < hi) {\n"
            "    long long mid = lo + (hi - lo + 1) / 2;\n"
            "    if (check(mid)) lo = mid; else hi = mid - 1;\n"
            "}\n"
            "cout << lo << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Factory Machines", "https://cses.fi/problemset/task/1620", "CSES", "medium"),
            R("CSES — Array Division", "https://cses.fi/problemset/task/1085", "CSES", "medium"),
            R("CSES — Reading Books", "https://cses.fi/problemset/task/1631", "CSES", "easy"),
            R("CSES — Stick Lengths (nhị phân được)", "https://cses.fi/problemset/task/1074", "CSES", "easy"),
            R("CF 165B — Burning Midnight Oil", "https://codeforces.com/problemset/problem/165/B", "Codeforces", "easy"),
            R("CF 670D1 — Magic Powder 1", "https://codeforces.com/problemset/problem/670/D1", "Codeforces", "easy"),
            R("CF 1141E — Superhero Battle", "https://codeforces.com/problemset/problem/1141/E", "Codeforces", "medium"),
            R("CF 1208C — Magic Grid", "https://codeforces.com/problemset/problem/1208/C", "Codeforces", "medium"),
            R("CF 1118D2 — Coffee and Coursework", "https://codeforces.com/problemset/problem/1118/D2", "Codeforces", "medium"),
            R("CF 1611C — Polycarp Recovers", "https://codeforces.com/problemset/problem/1611/C", "Codeforces", "easy"),
            R("CF 1399E1 — Weights Division Easy", "https://codeforces.com/problemset/problem/1399/E1", "Codeforces", "medium"),
            R("AtCoder — ABC 023D Squaring", "https://atcoder.jp/contests/abc023/tasks/abc023_d", "AtCoder", "medium"),
            R("AtCoder — ABC 144E Gluttony", "https://atcoder.jp/contests/abc144/tasks/abc144_e", "AtCoder", "medium"),
            R("AtCoder — ARC 050B Two Coloring", "https://atcoder.jp/contests/arc050/tasks/arc050_b", "AtCoder", "medium"),
            R("SPOJ — AGGRCOW Aggressive Cows", "https://www.spoj.com/problems/AGGRCOW/", "SPOJ", "medium"),
            R("USACO Guide — Wormhole Sort", "https://usaco.guide/silver/binary-search", "USACO", "medium"),
            R("LeetCode 875 — Koko Eating Bananas", "https://leetcode.com/problems/koko-eating-bananas/", "LeetCode", "medium"),
            R("LeetCode 1011 — Capacity to Ship Packages", "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", "LeetCode", "medium"),
            R("VNOJ — VOSCAR: Nhị phân đáp số", "https://oj.vnoi.info/problem/voscar", "VNOJ", "medium"),
        ],
    )

    C["recursion-backtracking"] = dict(
        objectives=[
            "Viết hàm đệ quy với base case + recursive case rõ ràng",
            "Quay lui sinh hoán vị / tổ hợp / dãy nhị phân / k-permutation",
            "Cắt nhánh sớm khi không thể dẫn tới nghiệm tốt",
            "Tránh đếm lặp bằng cách 'i = pos + 1' hoặc 'visited[]'",
            "Biểu diễn state bằng `vector<int>` hoặc bitmask (n ≤ 20)",
            "Phân biệt đệ quy + bộ nhớ hoá (memoization) vs DP top-down",
        ],
        requirements=[
            "Mảng + vòng lặp",
            "Hàm có tham số (Day 1)",
        ],
        studyMethod=[
            "Vẽ cây đệ quy tay với n = 3, n = 4 — đếm đến đâu thì dừng",
            "Luôn viết: in/out, log, hoặc print state trong các bước đầu",
            "Cắt nhánh = if `notFeasible(state)` return ngay",
            "Khi n ≤ 20 → bitmask, khi n ≤ 12 → đệ quy thuần",
        ],
        theoryFull=(
            "## Đệ quy (Recursion)\n\n"
            "Một hàm tự gọi chính nó trên đầu vào nhỏ hơn. Khung cơ bản:\n\n"
            "```cpp\nvoid solve(int level, State s) {\n    if (level == n) { /* base case: process s */ return; }\n    for (auto choice : choices(s)) {\n        apply(s, choice);\n        solve(level + 1, s);\n        undo(s, choice); // backtrack\n    }\n}\n```\n\n"
            "## Quay lui (Backtracking)\n\n"
            "Mở rộng đệ quy: thử mọi lựa chọn, nếu fail thì hoàn tác.\n\n"
            "### 1. Sinh dãy nhị phân `00..0` đến `11..1`\n\n"
            "```cpp\nvoid gen(int i) {\n    if (i == n) { print(b); return; }\n    for (int v = 0; v <= 1; ++v) {\n        b[i] = v; gen(i + 1);\n    }\n}\n```\n\n"
            "### 2. Sinh hoán vị 1..n\n\n"
            "```cpp\nvoid perm(int i) {\n    if (i == n) { print(p); return; }\n    for (int v = 1; v <= n; ++v) if (!used[v]) {\n        p[i] = v; used[v] = true;\n        perm(i + 1);\n        used[v] = false;\n    }\n}\n```\n\n"
            "Lưu ý: dùng `next_permutation(p.begin(), p.end())` từ STL nếu chỉ cần list mọi hoán vị.\n\n"
            "### 3. Sinh tổ hợp k phần tử trong n\n\n"
            "```cpp\nvoid comb(int pos, int last) {\n    if (pos == k) { print(c); return; }\n    for (int v = last + 1; v <= n - (k - pos) + 1; ++v) {\n        c[pos] = v; comb(pos + 1, v);\n    }\n}\n```\n\n"
            "## Cắt nhánh — N-queens\n\n"
            "Bài cờ n × n đặt n quân hậu không tấn công nhau: ngoài kiểm tra cột, kiểm tra 2 "
            "đường chéo `i + j` (slash) và `i - j + n` (back-slash).\n\n"
            "## Khi nào backtracking?\n\n"
            "Khi `n ≤ 20`, mọi pattern (hoán vị, tổ hợp, subset) đều OK. Lớn hơn cần DP hoặc "
            "thuật toán đặc biệt.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Quay lui*: <https://wiki.vnoi.info/algo/basic/backtracking>\n"
            "- USACO Guide Bronze — *Complete Search with Recursion*: <https://usaco.guide/bronze/complete-rec>\n"
            "- CP-Algorithms — *Backtracking (N-Queens)*: <https://cp-algorithms.com/combinatorics/n-queens-bruteforce.html>\n"
            "- GeeksforGeeks — *Backtracking*: <https://www.geeksforgeeks.org/backtracking-algorithms/>\n"
        ),
        codeExample=(
            "// Sinh mọi tổ hợp chập k của 1..n\n"
            "int n, k; vector<int> c;\n"
            "void comb(int pos, int last) {\n"
            "    if ((int)c.size() == k) {\n"
            "        for (int v : c) cout << v << ' ';\n"
            "        cout << '\\n';\n"
            "        return;\n"
            "    }\n"
            "    for (int v = last + 1; v <= n; ++v) {\n"
            "        c.push_back(v);\n"
            "        comb(pos + 1, v);\n"
            "        c.pop_back();\n"
            "    }\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Apple Division", "https://cses.fi/problemset/task/1623", "CSES", "easy"),
            R("CSES — Chessboard and Queens", "https://cses.fi/problemset/task/1624", "CSES", "easy"),
            R("CSES — Permutations", "https://cses.fi/problemset/task/1070", "CSES", "easy"),
            R("CSES — Creating Strings I", "https://cses.fi/problemset/task/1622", "CSES", "easy"),
            R("CSES — Grid Paths", "https://cses.fi/problemset/task/1625", "CSES", "hard"),
            R("CF 1257A — Two Rival Students", "https://codeforces.com/problemset/problem/1257/A", "Codeforces", "easy"),
            R("CF 1335B — Construct the String", "https://codeforces.com/problemset/problem/1335/B", "Codeforces", "easy"),
            R("CF 165B — Burning Midnight Oil", "https://codeforces.com/problemset/problem/165/B", "Codeforces", "easy"),
            R("CF 1167B — Lost Numbers", "https://codeforces.com/problemset/problem/1167/B", "Codeforces", "medium"),
            R("CF 1364B — Most Socially-Distanced", "https://codeforces.com/problemset/problem/1364/B", "Codeforces", "easy"),
            R("AtCoder — ABC 144C Walk on Multiplication", "https://atcoder.jp/contests/abc144/tasks/abc144_c", "AtCoder", "easy"),
            R("AtCoder — ABC 196D Hanjo", "https://atcoder.jp/contests/abc196/tasks/abc196_d", "AtCoder", "medium"),
            R("AtCoder — ABC 113C ID", "https://atcoder.jp/contests/abc113/tasks/abc113_c", "AtCoder", "easy"),
            R("SPOJ — NQUEENS Hoàng hậu", "https://www.spoj.com/problems/NQUEEN/", "SPOJ", "medium"),
            R("HackerRank — Hourglass / Grid", "https://www.hackerrank.com/challenges/2d-array/problem", "HackerRank", "easy"),
            R("LeetCode 46 — Permutations", "https://leetcode.com/problems/permutations/", "LeetCode", "medium"),
            R("LeetCode 78 — Subsets", "https://leetcode.com/problems/subsets/", "LeetCode", "medium"),
            R("LeetCode 51 — N-Queens", "https://leetcode.com/problems/n-queens/", "LeetCode", "hard"),
            R("VNOJ — NQUEENS: Hậu", "https://oj.vnoi.info/problem/nqueens", "VNOJ", "medium"),
        ],
    )

    C["meet-in-middle"] = dict(
        objectives=[
            "Chia bài 'tìm subset có tổng = K' với n ≤ 40 thành 2 nửa n/2",
            "Sinh 2^(n/2) subset cho mỗi nửa, sort, rồi ghép bằng binary search",
            "Tổng độ phức tạp O(2^(n/2) · n) thay cho O(2^n)",
            "Áp dụng cho 'subset gần K nhất', 'subset có k phần tử và tổng = K'",
            "Quản lý bộ nhớ: 2^20 = 10⁶ subset OK trong RAM",
            "Đếm cặp `(L, R)` với `L + R = K` bằng `lower_bound + upper_bound`",
        ],
        requirements=[
            "Backtracking sinh subset (Day 13)",
            "Binary search (Day 11)",
        ],
        studyMethod=[
            "Bài 'n ≤ 40, tìm subset thoả' = tín hiệu meet-in-middle",
            "Sinh subset bằng bitmask `for m in 0..(1<<half)-1`",
            "Sort bên kia → binary search lower/upper bound",
            "Cẩn thận overflow khi tổng có thể tới 40 · 10⁹",
        ],
        theoryFull=(
            "## Meet in the Middle\n\n"
            "Khi n ≤ 40, thuật toán 2^n quá chậm nhưng 2^(n/2) thì OK. Ta chia tập thành 2 nửa, "
            "liệt kê toàn bộ subset của mỗi nửa, rồi kết hợp.\n\n"
            "## CSES — Sum of Two Sets (bài kinh điển)\n\n"
            "Cho n ≤ 40 số, đếm số subset có tổng = K.\n\n"
            "**Bước 1**: chia n số thành 2 nửa A (n/2) và B (n - n/2).\n\n"
            "**Bước 2**: sinh `S_A`, `S_B` — tất cả tổng subset của mỗi nửa, kích cỡ 2^(n/2).\n\n"
            "**Bước 3**: sort `S_B`. Với mỗi `s ∈ S_A`, đếm số phần tử `K - s` trong `S_B`:\n\n"
            "```cpp\nint left = lower_bound(SB.begin(), SB.end(), K - s) - SB.begin();\nint right = upper_bound(SB.begin(), SB.end(), K - s) - SB.begin();\nans += right - left;\n```\n\n"
            "Tổng O(2^(n/2) · log 2^(n/2)) ≈ O(n · 2^(n/2)). Với n = 40: 2^20 · 40 ≈ 4·10⁷, OK 1s.\n\n"
            "## Biến thể\n\n"
            "- **Subset có tổng gần K nhất**: thay đếm bằng `lower_bound`, so sánh 2 ứng viên.\n"
            "- **Subset có đúng k phần tử**: sinh subset có `popcount = k_1` và `k - k_1` cho 2 nửa.\n"
            "- **Đường đi trên đồ thị**: thay đếm subset bằng đếm path từ start nửa đường và "
            "  từ end nửa đường ngược, ghép tại điểm giữa.\n\n"
            "## Cảnh báo\n\n"
            "- 2^21 = 2·10⁶, RAM ~ 16-32 MB cho mảng `long long` — vừa đủ trên VNOJ.\n"
            "- Tổng có thể tràn `int` → dùng `long long`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Meet in the Middle*: <https://wiki.vnoi.info/algo/divide-and-conquer/meet-in-the-middle>\n"
            "- CP-Algorithms — *Meet in the middle*: <https://cp-algorithms.com/others/meet-in-the-middle.html>\n"
            "- USACO Guide Gold — *Meet in the Middle*: <https://usaco.guide/gold/meet-in-the-middle>\n"
            "- GeeksforGeeks — *Meet in the Middle*: <https://www.geeksforgeeks.org/meet-in-the-middle/>\n"
        ),
        codeExample=(
            "// Đếm subset có tổng = K, n ≤ 40\n"
            "int n; long long K; cin >> n >> K;\n"
            "vector<long long> a(n);\n"
            "for (auto &x : a) cin >> x;\n"
            "int h = n / 2;\n"
            "vector<long long> SA, SB;\n"
            "for (int m = 0; m < (1 << h); ++m) {\n"
            "    long long s = 0;\n"
            "    for (int i = 0; i < h; ++i) if (m >> i & 1) s += a[i];\n"
            "    SA.push_back(s);\n"
            "}\n"
            "for (int m = 0; m < (1 << (n - h)); ++m) {\n"
            "    long long s = 0;\n"
            "    for (int i = 0; i < n - h; ++i) if (m >> i & 1) s += a[h + i];\n"
            "    SB.push_back(s);\n"
            "}\n"
            "sort(SB.begin(), SB.end());\n"
            "long long ans = 0;\n"
            "for (long long s : SA) {\n"
            "    auto lo = lower_bound(SB.begin(), SB.end(), K - s);\n"
            "    auto hi = upper_bound(SB.begin(), SB.end(), K - s);\n"
            "    ans += hi - lo;\n"
            "}\n"
            "cout << ans << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Meet in the Middle", "https://cses.fi/problemset/task/1628", "CSES", "medium"),
            R("CSES — Sum of Four Values", "https://cses.fi/problemset/task/1642", "CSES", "medium"),
            R("CSES — Sum of Three Values", "https://cses.fi/problemset/task/1641", "CSES", "medium"),
            R("SPOJ — SUBSUMS", "https://www.spoj.com/problems/SUBSUMS/", "SPOJ", "medium"),
            R("CF 525E — Anya and Cubes", "https://codeforces.com/problemset/problem/525/E", "Codeforces", "hard"),
            R("CF 1006F — Xor-Paths", "https://codeforces.com/problemset/problem/1006/F", "Codeforces", "hard"),
            R("CF 888E — Maximum Subsequence", "https://codeforces.com/problemset/problem/888/E", "Codeforces", "medium"),
            R("CF 200B — Drinks", "https://codeforces.com/problemset/problem/200/B", "Codeforces", "easy"),
            R("CF 1006D — Two Strings Rotations", "https://codeforces.com/problemset/problem/1006/D", "Codeforces", "medium"),
            R("AtCoder — ABC 184F Programming Contest", "https://atcoder.jp/contests/abc184/tasks/abc184_f", "AtCoder", "hard"),
            R("AtCoder — ABC 271F XOR on Grid Path", "https://atcoder.jp/contests/abc271/tasks/abc271_f", "AtCoder", "hard"),
            R("AtCoder — ABC 326F Robot Rotation", "https://atcoder.jp/contests/abc326/tasks/abc326_f", "AtCoder", "hard"),
            R("USACO Guide — Closing the Farm", "https://usaco.guide/gold/meet-in-the-middle", "USACO", "medium"),
            R("HackerRank — Vertical Sticks", "https://www.hackerrank.com/challenges/vertical-sticks/problem", "HackerRank", "medium"),
            R("LeetCode 805 — Split Array With Same Avg", "https://leetcode.com/problems/split-array-with-same-average/", "LeetCode", "hard"),
            R("VNOJ — KMIN: Tổng bé nhất chia 2 nhóm", "https://oj.vnoi.info/problem/kmin", "VNOJ", "medium"),
        ],
    )

"""Week 4 — Day 22..28 — DP intro / knapsack / LIS-LCS / DP grid / number theory / sieve / string hash."""


def register(C, R):
    C["dp-intro"] = dict(
        objectives=[
            "Phát biểu trạng thái + chuyển trạng thái + đáp số",
            "Hai pattern: top-down (memo) và bottom-up (tabulation)",
            "DP 1D: dp[i] phụ thuộc dp[i-1], dp[i-2], ...",
            "Fibonacci, Climbing Stairs, Frog jumps (DP B Frog)",
            "Phân biệt DP vs Greedy: khi không thể tham lam",
            "Khôi phục lời giải qua mảng `from[i]`",
        ],
        requirements=[
            "Đệ quy (Day 13)",
            "Mảng 1D, vòng for",
        ],
        studyMethod=[
            "Trước khi code, viết: state, transition, base, answer",
            "Chuyển memo → tabulation khi quen — chạy nhanh hơn, không stack overflow",
            "Vẽ DAG transitions tay với n = 5 để kiểm tra logic",
            "Sau AC, viết lại bằng top-down/bottom-up còn lại — luyện cả 2 chiều",
        ],
        theoryFull=(
            "## Dynamic Programming (DP)\n\n"
            "DP = chia bài toán thành các bài con, lưu kết quả bài con để không tính lại. 2 yêu cầu:\n\n"
            "1. **Overlapping subproblems** — bài con xuất hiện nhiều lần.\n"
            "2. **Optimal substructure** — đáp số tối ưu của bài lớn = từ đáp số tối ưu của bài con.\n\n"
            "## Khung 4 bước (memo cho dễ học trước)\n\n"
            "1. **State**: đặt `dp[i]` là gì? Mô tả bằng 1 câu tiếng Việt.\n"
            "2. **Transition**: `dp[i] = f(dp[i-1], dp[i-2], ...)`. Viết công thức.\n"
            "3. **Base case**: `dp[0]`, `dp[1]` là gì?\n"
            "4. **Answer**: đáp số = `dp[n]` hoặc `max{dp[i]}` hoặc `Σ dp[i]`...\n\n"
            "## Ví dụ 1 — Climbing Stairs\n\n"
            "Lên cầu thang n bậc, mỗi bước nhảy 1 hoặc 2 bậc. Đếm số cách lên đến bậc n.\n\n"
            "- State: `dp[i]` = số cách lên đến bậc i.\n"
            "- Transition: `dp[i] = dp[i-1] + dp[i-2]`.\n"
            "- Base: `dp[0] = 1, dp[1] = 1`.\n"
            "- Answer: `dp[n]`.\n\n"
            "```cpp\nvector<long long> dp(n + 1);\ndp[0] = 1; dp[1] = 1;\nfor (int i = 2; i <= n; ++i) dp[i] = dp[i-1] + dp[i-2];\ncout << dp[n] << '\\n';\n```\n\n"
            "## Ví dụ 2 — Frog 1 (AtCoder DP A)\n\n"
            "Có n viên đá cao `h[i]`. Ếch bắt đầu ở 1, mỗi bước nhảy +1 hoặc +2, chi phí "
            "`|h[i] - h[j]|`. Tìm chi phí tối thiểu để đến viên n.\n\n"
            "- State: `dp[i]` = chi phí min từ viên 1 đến viên i.\n"
            "- Transition: `dp[i] = min(dp[i-1] + |h[i] - h[i-1]|, dp[i-2] + |h[i] - h[i-2]|)`.\n"
            "- Base: `dp[1] = 0`.\n"
            "- Answer: `dp[n]`.\n\n"
            "## Khôi phục lời giải\n\n"
            "Lưu thêm `from[i]` = chỉ số j tối ưu khi tính dp[i]. Truy ngược từ `n` về `1`.\n\n"
            "## Memo (top-down) vs Tabulation (bottom-up)\n\n"
            "Memo dễ viết khi mới học (giống đệ quy), nhưng chậm hơn ~2-3 lần và có thể stack "
            "overflow. Bottom-up nhanh và an toàn, ưu tiên khi đã hiểu state.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Quy hoạch động cơ bản*: <https://wiki.vnoi.info/algo/dp/basic-dp>\n"
            "- USACO Guide Gold — *Intro to DP*: <https://usaco.guide/gold/intro-dp>\n"
            "- CP-Algorithms — *DP*: <https://cp-algorithms.com/dynamic_programming/intro-to-dp.html>\n"
            "- AtCoder Educational DP: <https://atcoder.jp/contests/dp>\n"
        ),
        codeExample=(
            "// AtCoder DP A — Frog 1: chi phí min nhảy lên viên đá n\n"
            "int n; cin >> n;\n"
            "vector<int> h(n + 1);\n"
            "for (int i = 1; i <= n; ++i) cin >> h[i];\n"
            "vector<long long> dp(n + 1, LLONG_MAX);\n"
            "dp[1] = 0;\n"
            "for (int i = 2; i <= n; ++i) {\n"
            "    dp[i] = dp[i-1] + abs(h[i] - h[i-1]);\n"
            "    if (i >= 3) dp[i] = min(dp[i], dp[i-2] + abs(h[i] - h[i-2]));\n"
            "}\n"
            "cout << dp[n] << '\\n';\n"
        ),
        referenceProblems=[
            R("AtCoder — DP A Frog 1", "https://atcoder.jp/contests/dp/tasks/dp_a", "AtCoder", "easy"),
            R("AtCoder — DP B Frog 2", "https://atcoder.jp/contests/dp/tasks/dp_b", "AtCoder", "easy"),
            R("AtCoder — DP C Vacation", "https://atcoder.jp/contests/dp/tasks/dp_c", "AtCoder", "easy"),
            R("CSES — Dice Combinations", "https://cses.fi/problemset/task/1633", "CSES", "easy"),
            R("CSES — Minimizing Coins", "https://cses.fi/problemset/task/1634", "CSES", "easy"),
            R("CSES — Coin Combinations I", "https://cses.fi/problemset/task/1635", "CSES", "easy"),
            R("CSES — Coin Combinations II", "https://cses.fi/problemset/task/1636", "CSES", "easy"),
            R("CSES — Removing Digits", "https://cses.fi/problemset/task/1637", "CSES", "easy"),
            R("CF 580D — Kefa and Dishes", "https://codeforces.com/problemset/problem/580/D", "Codeforces", "hard"),
            R("CF 1077F1 — Pictures with Kittens (Easy)", "https://codeforces.com/problemset/problem/1077/F1", "Codeforces", "medium"),
            R("CF 1093D — Beautiful Graph", "https://codeforces.com/problemset/problem/1093/D", "Codeforces", "medium"),
            R("CF 1132C — Painting the Fence", "https://codeforces.com/problemset/problem/1132/C", "Codeforces", "medium"),
            R("AtCoder — ABC 099C Strange Bank", "https://atcoder.jp/contests/abc099/tasks/abc099_c", "AtCoder", "easy"),
            R("AtCoder — ABC 232D Weak Takahashi", "https://atcoder.jp/contests/abc232/tasks/abc232_d", "AtCoder", "easy"),
            R("HackerRank — Maximum Subarray (Kadane)", "https://www.hackerrank.com/challenges/maxsubarray/problem", "HackerRank", "medium"),
            R("HackerRank — Fibonacci Modified", "https://www.hackerrank.com/challenges/fibonacci-modified/problem", "HackerRank", "medium"),
            R("LeetCode 70 — Climbing Stairs", "https://leetcode.com/problems/climbing-stairs/", "LeetCode", "easy"),
            R("LeetCode 198 — House Robber", "https://leetcode.com/problems/house-robber/", "LeetCode", "medium"),
            R("LeetCode 322 — Coin Change", "https://leetcode.com/problems/coin-change/", "LeetCode", "medium"),
            R("VNOJ — QBSCHOOL: DP cơ bản", "https://oj.vnoi.info/problem/qbschool", "VNOJ", "medium"),
        ],
    )

    C["dp-knapsack"] = dict(
        objectives=[
            "0/1 Knapsack — mỗi vật tối đa 1 lần",
            "Unbounded Knapsack — mỗi vật vô hạn lần",
            "Bounded Knapsack — mỗi vật tối đa k_i lần",
            "Tối ưu bộ nhớ 0/1 knapsack: 1D với vòng for cap giảm dần",
            "Subset Sum / Partition / Targeted Sum",
            "Khôi phục tập đồ vật trong nghiệm tối ưu",
        ],
        requirements=[
            "DP intro (Day 22)",
            "Mảng 2D",
        ],
        studyMethod=[
            "Học thuộc state: `dp[i][c]` = max giá trị khi xét i vật, dung tích còn c",
            "Tối ưu 1D 0/1 knapsack: `for c from W downto w[i]` — chiều ngược chống dùng nhiều lần",
            "Unbounded: `for c from w[i] to W` — chiều thuận",
            "Bounded: tách 1/2/4/... món hoặc dùng deque",
        ],
        theoryFull=(
            "## 0/1 Knapsack — vấn đề cổ điển\n\n"
            "Có n vật, vật i có trọng `w[i]`, giá trị `v[i]`. Túi có dung tích W. Chọn tập "
            "vật để tổng trọng ≤ W và tổng giá trị max.\n\n"
            "**State**: `dp[i][c]` = giá trị max khi xét i vật đầu, dung tích c.\n\n"
            "**Transition**: với vật i (1-indexed):\n\n"
            "- Không lấy: `dp[i][c] = dp[i-1][c]`.\n"
            "- Lấy (nếu `c ≥ w[i]`): `dp[i][c] = max(dp[i-1][c], dp[i-1][c - w[i]] + v[i])`.\n\n"
            "**Base**: `dp[0][c] = 0`. **Answer**: `dp[n][W]`.\n\n"
            "Độ phức tạp: O(n · W). Bộ nhớ: O(n · W) → tối ưu 1D thành O(W):\n\n"
            "```cpp\nvector<long long> dp(W + 1, 0);\nfor (int i = 0; i < n; ++i)\n    for (int c = W; c >= w[i]; --c)\n        dp[c] = max(dp[c], dp[c - w[i]] + v[i]);\ncout << dp[W] << '\\n';\n```\n\n"
            "Quan trọng: vòng `c` chạy **ngược** từ W xuống w[i] để không lấy vật i quá 1 lần.\n\n"
            "## Unbounded Knapsack — không giới hạn\n\n"
            "Vẫn 1D, nhưng vòng `c` chạy **thuận**:\n\n"
            "```cpp\nfor (int i = 0; i < n; ++i)\n    for (int c = w[i]; c <= W; ++c)\n        dp[c] = max(dp[c], dp[c - w[i]] + v[i]);\n```\n\n"
            "Chiều thuận → khi xét `c`, đã có thể đã dùng vật i ở `c - w[i]` → đúng cho không giới hạn.\n\n"
            "## Subset Sum / Partition\n\n"
            "Cho dãy `a[]`, kiểm có tồn tại subset có tổng = K không. State `dp[c]` = boolean.\n\n"
            "```cpp\nvector<bool> dp(K + 1, false); dp[0] = true;\nfor (int i = 0; i < n; ++i)\n    for (int c = K; c >= a[i]; --c)\n        dp[c] = dp[c] || dp[c - a[i]];\n```\n\n"
            "## Khôi phục tập\n\n"
            "Sau khi điền `dp[][]`, truy ngược: tại `(i, c)`, nếu `dp[i][c] == dp[i-1][c]` thì "
            "không lấy vật i, else có lấy → chuyển sang `(i-1, c - w[i])`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Knapsack*: <https://wiki.vnoi.info/algo/dp/knapsack>\n"
            "- USACO Guide Gold — *Knapsack DP*: <https://usaco.guide/gold/knapsack>\n"
            "- CP-Algorithms — *Knapsack 0-1*: <https://cp-algorithms.com/algebra/big-integer.html>\n"
            "- AtCoder Educational DP D & E (Knapsack 1, 2): <https://atcoder.jp/contests/dp/tasks/dp_d>\n"
        ),
        codeExample=(
            "// 0/1 knapsack tối ưu 1D\n"
            "int n, W; cin >> n >> W;\n"
            "vector<int> w(n), v(n);\n"
            "for (int i = 0; i < n; ++i) cin >> w[i] >> v[i];\n"
            "vector<long long> dp(W + 1, 0);\n"
            "for (int i = 0; i < n; ++i)\n"
            "    for (int c = W; c >= w[i]; --c)\n"
            "        dp[c] = max(dp[c], dp[c - w[i]] + v[i]);\n"
            "cout << dp[W] << '\\n';\n"
        ),
        referenceProblems=[
            R("AtCoder — DP D Knapsack 1", "https://atcoder.jp/contests/dp/tasks/dp_d", "AtCoder", "easy"),
            R("AtCoder — DP E Knapsack 2", "https://atcoder.jp/contests/dp/tasks/dp_e", "AtCoder", "medium"),
            R("CSES — Book Shop", "https://cses.fi/problemset/task/1158", "CSES", "easy"),
            R("CSES — Money Sums", "https://cses.fi/problemset/task/1745", "CSES", "easy"),
            R("CSES — Two Sets II", "https://cses.fi/problemset/task/1093", "CSES", "medium"),
            R("CSES — Coin Combinations I / II", "https://cses.fi/problemset/task/1635", "CSES", "easy"),
            R("CSES — Counting Towers", "https://cses.fi/problemset/task/2413", "CSES", "medium"),
            R("CF 4D — Mysterious Present", "https://codeforces.com/problemset/problem/4/D", "Codeforces", "medium"),
            R("CF 489F — Hossam and Range Minimum Query", "https://codeforces.com/problemset/problem/489/F", "Codeforces", "hard"),
            R("CF 730J — Bottles", "https://codeforces.com/problemset/problem/730/J", "Codeforces", "medium"),
            R("CF 864E — Fire", "https://codeforces.com/problemset/problem/864/E", "Codeforces", "medium"),
            R("CF 1132E — Knapsack (số nhỏ, count multi)", "https://codeforces.com/problemset/problem/1132/E", "Codeforces", "hard"),
            R("AtCoder — ABC 232D Weak Takahashi", "https://atcoder.jp/contests/abc232/tasks/abc232_d", "AtCoder", "easy"),
            R("SPOJ — KNAPSACK", "https://www.spoj.com/problems/KNAPSACK/", "SPOJ", "medium"),
            R("SPOJ — TSORT (knapsack variation)", "https://www.spoj.com/problems/TSORT/", "SPOJ", "easy"),
            R("HackerRank — The Coin Change Problem", "https://www.hackerrank.com/challenges/coin-change/problem", "HackerRank", "medium"),
            R("LeetCode 416 — Partition Equal Subset Sum", "https://leetcode.com/problems/partition-equal-subset-sum/", "LeetCode", "medium"),
            R("LeetCode 474 — Ones and Zeroes", "https://leetcode.com/problems/ones-and-zeroes/", "LeetCode", "medium"),
            R("LeetCode 494 — Target Sum", "https://leetcode.com/problems/target-sum/", "LeetCode", "medium"),
            R("VNOJ — QBSHOP: Mua hàng tối ưu", "https://oj.vnoi.info/problem/qbshop", "VNOJ", "medium"),
        ],
    )

    C["dp-lis-lcs"] = dict(
        objectives=[
            "Longest Increasing Subsequence (LIS) — O(n²) và O(n log n)",
            "Longest Common Subsequence (LCS) — O(n·m)",
            "Edit Distance (Levenshtein) — O(n·m)",
            "Đếm số LIS / LCS",
            "Tái dựng dãy con từ bảng DP",
            "Phân biệt subsequence (không cần liên tiếp) vs substring (liên tiếp)",
        ],
        requirements=[
            "DP 2D (Day 22-23)",
            "Binary search (Day 11) — cho LIS O(n log n)",
        ],
        studyMethod=[
            "Học thuộc LIS O(n log n) — dùng `lower_bound` trên `tails[]`",
            "LCS code mẫu chỉ 10 dòng, dùng cho mọi biến thể",
            "Edit Distance: 3 transitions (insert, delete, replace)",
            "Đếm LIS: cài thêm `cnt[i]` = số LIS kết thúc tại i",
        ],
        theoryFull=(
            "## Longest Increasing Subsequence (LIS)\n\n"
            "Cho dãy `a[1..n]`, tìm dãy con không liên tiếp dài nhất sao cho các phần tử tăng "
            "ngặt (hoặc tăng dần).\n\n"
            "### Cách 1 — O(n²)\n\n"
            "```cpp\nvector<int> dp(n, 1);\nfor (int i = 1; i < n; ++i)\n    for (int j = 0; j < i; ++j)\n        if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);\nint ans = *max_element(dp.begin(), dp.end());\n```\n\n"
            "### Cách 2 — O(n log n) — Patience Sorting\n\n"
            "Duy trì `tails[]`: `tails[k]` = giá trị nhỏ nhất tại đó có thể kết thúc một LIS độ dài `k+1`.\n\n"
            "```cpp\nvector<int> tails;\nfor (int x : a) {\n    auto it = lower_bound(tails.begin(), tails.end(), x);\n    if (it == tails.end()) tails.push_back(x);\n    else *it = x;\n}\ncout << tails.size() << '\\n'; // độ dài LIS\n```\n\n"
            "Lưu ý: `lower_bound` cho **tăng ngặt**, `upper_bound` cho **không giảm**.\n\n"
            "## Longest Common Subsequence (LCS)\n\n"
            "Cho 2 dãy `a[1..n], b[1..m]`. Tìm dãy con không liên tiếp dài nhất xuất hiện trong "
            "cả hai (cùng thứ tự).\n\n"
            "**State**: `dp[i][j]` = LCS của `a[1..i]` và `b[1..j]`.\n\n"
            "**Transition**:\n"
            "- Nếu `a[i] == b[j]`: `dp[i][j] = dp[i-1][j-1] + 1`.\n"
            "- Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.\n\n"
            "**Answer**: `dp[n][m]`.\n\n"
            "```cpp\nvector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\nfor (int i = 1; i <= n; ++i)\n    for (int j = 1; j <= m; ++j) {\n        if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;\n        else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n    }\n```\n\n"
            "## Edit Distance\n\n"
            "Cho 2 xâu `s, t`. Tìm số phép tối thiểu (insert, delete, replace) biến `s` thành `t`.\n\n"
            "**State**: `dp[i][j]` = chi phí min biến `s[1..i]` thành `t[1..j]`.\n\n"
            "**Transition**:\n"
            "- Nếu `s[i] == t[j]`: `dp[i][j] = dp[i-1][j-1]`.\n"
            "- Else: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`.\n\n"
            "**Base**: `dp[0][j] = j`, `dp[i][0] = i`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *LIS-LCS-Edit Distance*: <https://wiki.vnoi.info/algo/dp/longest-increasing-subsequence>\n"
            "- USACO Guide Gold — *LIS*: <https://usaco.guide/gold/intro-dp>\n"
            "- CP-Algorithms — *LIS*: <https://cp-algorithms.com/sequences/longest_increasing_subsequence.html>\n"
            "- CP-Algorithms — *LCS*: <https://cp-algorithms.com/sequences/longest_common_subsequence.html>\n"
        ),
        codeExample=(
            "// LIS O(n log n) với patience sorting\n"
            "vector<int> tails;\n"
            "for (int x : a) {\n"
            "    auto it = lower_bound(tails.begin(), tails.end(), x);\n"
            "    if (it == tails.end()) tails.push_back(x);\n"
            "    else *it = x;\n"
            "}\n"
            "cout << (int)tails.size() << '\\n';\n"
        ),
        referenceProblems=[
            R("AtCoder — DP F LCS", "https://atcoder.jp/contests/dp/tasks/dp_f", "AtCoder", "easy"),
            R("CSES — Increasing Subsequence", "https://cses.fi/problemset/task/1145", "CSES", "medium"),
            R("CSES — Edit Distance", "https://cses.fi/problemset/task/1639", "CSES", "medium"),
            R("CSES — Removal Game", "https://cses.fi/problemset/task/1097", "CSES", "medium"),
            R("CSES — Counting Towers", "https://cses.fi/problemset/task/2413", "CSES", "medium"),
            R("CF 4D — Mysterious Present", "https://codeforces.com/problemset/problem/4/D", "Codeforces", "medium"),
            R("CF 269B — Greenhouse Effect", "https://codeforces.com/problemset/problem/269/B", "Codeforces", "medium"),
            R("CF 340D — Bubble Sort Graph", "https://codeforces.com/problemset/problem/340/D", "Codeforces", "medium"),
            R("CF 67D — Optimal Coin Toss Game", "https://codeforces.com/problemset/problem/67/D", "Codeforces", "hard"),
            R("CF 909C — Python Indentation", "https://codeforces.com/problemset/problem/909/C", "Codeforces", "medium"),
            R("AtCoder — DP T Permutation", "https://atcoder.jp/contests/dp/tasks/dp_t", "AtCoder", "hard"),
            R("AtCoder — ABC 134E Sequence Decomposing", "https://atcoder.jp/contests/abc134/tasks/abc134_e", "AtCoder", "medium"),
            R("AtCoder — ABC 165F LIS on Tree", "https://atcoder.jp/contests/abc165/tasks/abc165_f", "AtCoder", "hard"),
            R("SPOJ — IOIPALIN Palindrome", "https://www.spoj.com/problems/IOIPALIN/", "SPOJ", "medium"),
            R("HackerRank — Longest Common Subsequence", "https://www.hackerrank.com/challenges/dynamic-programming-classics-the-longest-common-subsequence/problem", "HackerRank", "medium"),
            R("LeetCode 300 — LIS", "https://leetcode.com/problems/longest-increasing-subsequence/", "LeetCode", "medium"),
            R("LeetCode 1143 — LCS", "https://leetcode.com/problems/longest-common-subsequence/", "LeetCode", "medium"),
            R("LeetCode 72 — Edit Distance", "https://leetcode.com/problems/edit-distance/", "LeetCode", "hard"),
            R("VNOJ — QBSEQ: LIS", "https://oj.vnoi.info/problem/qbseq", "VNOJ", "medium"),
        ],
    )

    C["dp-grid"] = dict(
        objectives=[
            "DP trên lưới 2D: số đường đi, đường đi tổng max/min",
            "Grid Path Counting với chướng ngại",
            "Min path sum / Max path sum trên ma trận",
            "Knapsack-like trên grid (Maximum Cherries, Cherry Pickup)",
            "Tối ưu bộ nhớ: lưu 2 hàng cuối thay vì cả ma trận",
            "Phân biệt 'đi xuống/phải' vs 'đi 4 hướng' (cần BFS/Dijkstra)",
        ],
        requirements=[
            "DP intro + DP 1D (Day 22)",
            "Mảng 2D (Day 4)",
        ],
        studyMethod=[
            "Vẽ tay lưới 3×3 và điền dp[][] để hiểu công thức",
            "Khi chỉ đi 2 hướng (xuống/phải) → DP đủ; nếu 4 hướng → BFS/Dijkstra",
            "Có chướng ngại → đặt dp[i][j] = 0 tại ô đó",
            "Bài 'số đường' thường modulo 10⁹+7",
        ],
        theoryFull=(
            "## DP trên lưới (Grid DP)\n\n"
            "Khi bài toán liên quan đến **lưới m×n** và chỉ cho phép đi 2 hướng (vd: xuống/phải), "
            "DP trên lưới là công cụ chính.\n\n"
            "## Bài 1 — Số đường đi từ (1,1) → (n,m), chỉ đi xuống/phải\n\n"
            "**State**: `dp[i][j]` = số cách đến ô `(i, j)`.\n\n"
            "**Transition**: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`.\n\n"
            "**Base**: `dp[1][1] = 1`. **Answer**: `dp[n][m]`.\n\n"
            "Có chướng ngại tại `(r, c)`: đặt `dp[r][c] = 0` (không thể vào).\n\n"
            "## Bài 2 — Min path sum\n\n"
            "Lưới giá `a[i][j]`. Min tổng đường đi từ (1,1) → (n,m), chỉ xuống/phải.\n\n"
            "```cpp\ndp[1][1] = a[1][1];\nfor (int i = 1; i <= n; ++i)\n    for (int j = 1; j <= m; ++j) {\n        if (i == 1 && j == 1) continue;\n        long long best = LLONG_MAX;\n        if (i > 1) best = min(best, dp[i-1][j]);\n        if (j > 1) best = min(best, dp[i][j-1]);\n        dp[i][j] = best + a[i][j];\n    }\n```\n\n"
            "## Bài 3 — Cherry Pickup (2 lần đi)\n\n"
            "Đi từ (1,1) → (n,n) → (1,1), thu cherry trên đường. Tối đa hoá tổng. Tương đương "
            "2 người đi cùng lúc từ (1,1) → (n,n). State 3D: `dp[step][r1][r2]` (cùng step thì "
            "`c1 = step - r1, c2 = step - r2`). Khi r1 == r2 (cùng ô) chỉ lấy 1 lần.\n\n"
            "## Tối ưu bộ nhớ\n\n"
            "DP grid 2D thường chỉ phụ thuộc hàng trước → lưu 2 hàng `prev[]` và `cur[]`, "
            "bộ nhớ O(m).\n\n"
            "## Khi nào KHÔNG dùng DP grid?\n\n"
            "- Cho phép đi 4 hướng (lên/xuống/trái/phải) → có thể có chu trình → BFS hoặc Dijkstra.\n"
            "- Cạnh có trọng số khác nhau → Dijkstra.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *DP trên lưới*: <https://wiki.vnoi.info/algo/dp/grid-dp>\n"
            "- AtCoder DP H Grid 1: <https://atcoder.jp/contests/dp/tasks/dp_h>\n"
            "- AtCoder DP Y Grid 2: <https://atcoder.jp/contests/dp/tasks/dp_y>\n"
            "- USACO Guide Silver — *DP on Grid*: <https://usaco.guide/silver/intro-dp>\n"
        ),
        codeExample=(
            "// Đếm số đường đi từ (1,1) đến (n,m) trên lưới có chướng ngại '*' (mod 1e9+7)\n"
            "const int MOD = 1e9 + 7;\n"
            "vector<vector<long long>> dp(n + 1, vector<long long>(m + 1, 0));\n"
            "dp[1][1] = (g[0][0] == '.') ? 1 : 0;\n"
            "for (int i = 1; i <= n; ++i)\n"
            "    for (int j = 1; j <= m; ++j) {\n"
            "        if (g[i-1][j-1] == '*') { dp[i][j] = 0; continue; }\n"
            "        if (i > 1) dp[i][j] = (dp[i][j] + dp[i-1][j]) % MOD;\n"
            "        if (j > 1) dp[i][j] = (dp[i][j] + dp[i][j-1]) % MOD;\n"
            "    }\n"
            "cout << dp[n][m] << '\\n';\n"
        ),
        referenceProblems=[
            R("AtCoder — DP H Grid 1", "https://atcoder.jp/contests/dp/tasks/dp_h", "AtCoder", "easy"),
            R("AtCoder — DP Y Grid 2 (Lucas)", "https://atcoder.jp/contests/dp/tasks/dp_y", "AtCoder", "hard"),
            R("CSES — Grid Paths (DP)", "https://cses.fi/problemset/task/1638", "CSES", "easy"),
            R("CSES — Rectangle Cutting", "https://cses.fi/problemset/task/1744", "CSES", "medium"),
            R("CSES — Counting Numbers", "https://cses.fi/problemset/task/2220", "CSES", "hard"),
            R("CSES — Mountain Range", "https://cses.fi/problemset/task/3217", "CSES", "medium"),
            R("CF 35D — Animals", "https://codeforces.com/problemset/problem/35/D", "Codeforces", "medium"),
            R("CF 1393B — Applejack and Storages", "https://codeforces.com/problemset/problem/1393/B", "Codeforces", "easy"),
            R("CF 1058D — Vasya and Triangle", "https://codeforces.com/problemset/problem/1058/D", "Codeforces", "medium"),
            R("CF 1437C — Chef Monocarp", "https://codeforces.com/problemset/problem/1437/C", "Codeforces", "medium"),
            R("AtCoder — ABC 211D Number of Shortest paths", "https://atcoder.jp/contests/abc211/tasks/abc211_d", "AtCoder", "medium"),
            R("AtCoder — ABC 184D Increment of Coins", "https://atcoder.jp/contests/abc184/tasks/abc184_d", "AtCoder", "medium"),
            R("AtCoder — ABC 196D Hanjo", "https://atcoder.jp/contests/abc196/tasks/abc196_d", "AtCoder", "medium"),
            R("HackerRank — Sam and Substrings (DP)", "https://www.hackerrank.com/challenges/sam-and-substrings/problem", "HackerRank", "medium"),
            R("HackerRank — Stock Maximize", "https://www.hackerrank.com/challenges/stockmax/problem", "HackerRank", "medium"),
            R("LeetCode 62 — Unique Paths", "https://leetcode.com/problems/unique-paths/", "LeetCode", "medium"),
            R("LeetCode 64 — Minimum Path Sum", "https://leetcode.com/problems/minimum-path-sum/", "LeetCode", "medium"),
            R("LeetCode 741 — Cherry Pickup", "https://leetcode.com/problems/cherry-pickup/", "LeetCode", "hard"),
            R("VNOJ — QBROBOT: Robot trên lưới", "https://oj.vnoi.info/problem/qbrobot", "VNOJ", "medium"),
        ],
    )

    C["number-theory"] = dict(
        objectives=[
            "GCD/LCM bằng Euclid: `gcd(a, b) = gcd(b, a % b)`",
            "Mod nhanh: `pow_mod(a, b, m)` bằng nâng lên luỹ thừa nhị phân O(log b)",
            "Kiểm tra số nguyên tố O(sqrt(n))",
            "Tổng/Số ước O(sqrt(n))",
            "Phân tích ra thừa số nguyên tố O(sqrt(n))",
            "Hệ thặng dư mod (Fermat little theorem cho mod nguyên tố)",
        ],
        requirements=[
            "Vòng for, hàm có tham số",
            "Long long khi cần (Day 1)",
        ],
        studyMethod=[
            "GCD đệ quy 2 dòng — học thuộc",
            "Pow mod 8 dòng — copy vào mọi bài tổ hợp/số học",
            "Nguyên tố O(sqrt(n)) chỉ duyệt số lẻ + 2",
            "Số ước = nhân (e_i + 1) với mọi mũ",
        ],
        theoryFull=(
            "## Số học cơ bản\n\n"
            "Mảng kiến thức nền cho khối số học HSG VN. Đa số bài Day 26-28 dùng kết hợp các kỹ thuật này.\n\n"
            "## GCD/LCM\n\n"
            "Thuật toán Euclid:\n\n"
            "```cpp\nlong long gcd(long long a, long long b) {\n    return b == 0 ? a : gcd(b, a % b);\n}\nlong long lcm(long long a, long long b) {\n    return a / gcd(a, b) * b; // chia trước nhân để tránh tràn\n}\n```\n\n"
            "C++17: dùng `__gcd(a, b)` hoặc `std::gcd(a, b)` (cần `<numeric>`).\n\n"
            "## Pow mod O(log b)\n\n"
            "```cpp\nlong long pow_mod(long long a, long long b, long long m) {\n    long long r = 1 % m;\n    a %= m; if (a < 0) a += m;\n    while (b > 0) {\n        if (b & 1) r = r * a % m;\n        a = a * a % m;\n        b >>= 1;\n    }\n    return r;\n}\n```\n\n"
            "Cẩn thận: `m` ≤ 10⁹ → `r * a` ≤ 10¹⁸ — trong `long long` OK. Nếu `m` lớn hơn, dùng "
            "`__int128` hoặc Montgomery / Barrett reduction.\n\n"
            "## Kiểm tra số nguyên tố O(√n)\n\n"
            "```cpp\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    if (n < 4) return true;\n    if (n % 2 == 0) return false;\n    for (long long i = 3; i * i <= n; i += 2)\n        if (n % i == 0) return false;\n    return true;\n}\n```\n\n"
            "Cho n ≤ 10¹⁸: dùng **Miller-Rabin** deterministic với 7 chứng nhân `{2, 325, 9375, "
            "28178, 450775, 9780504, 1795265022}`.\n\n"
            "## Phân tích thừa số O(√n)\n\n"
            "```cpp\nvector<pair<long long, int>> factor(long long n) {\n    vector<pair<long long, int>> f;\n    for (long long p = 2; p * p <= n; ++p) if (n % p == 0) {\n        int e = 0;\n        while (n % p == 0) { n /= p; ++e; }\n        f.push_back({p, e});\n    }\n    if (n > 1) f.push_back({n, 1});\n    return f;\n}\n```\n\n"
            "Số ước = `Π (e_i + 1)`. Tổng ước = `Π (1 + p_i + p_i² + ... + p_i^e_i)`.\n\n"
            "## Định lý Fermat nhỏ\n\n"
            "Với `p` nguyên tố và `gcd(a, p) = 1`: `a^(p-1) ≡ 1 (mod p)`. Suy ra "
            "`a^(-1) ≡ a^(p-2) (mod p)` — nghịch đảo modular.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Số học*: <https://wiki.vnoi.info/algo/math/number-theory>\n"
            "- USACO Guide Gold — *Modular Arithmetic*: <https://usaco.guide/gold/modular>\n"
            "- CP-Algorithms — *Modular Inverse*: <https://cp-algorithms.com/algebra/module-inverse.html>\n"
            "- CP-Algorithms — *Euclid GCD*: <https://cp-algorithms.com/algebra/euclid-algorithm.html>\n"
            "- GeeksforGeeks — *Number Theory*: <https://www.geeksforgeeks.org/number-theory-competitive-programming-cp/>\n"
        ),
        codeExample=(
            "// Pow mod & GCD\n"
            "long long gcd(long long a, long long b) { return b == 0 ? a : gcd(b, a % b); }\n"
            "long long pow_mod(long long a, long long b, long long m) {\n"
            "    long long r = 1 % m; a %= m;\n"
            "    while (b > 0) {\n"
            "        if (b & 1) r = r * a % m;\n"
            "        a = a * a % m;\n"
            "        b >>= 1;\n"
            "    }\n"
            "    return r;\n"
            "}\n"
            "// Số ước nguyên dương của n\n"
            "long long countDivisors(long long n) {\n"
            "    long long cnt = 1;\n"
            "    for (long long p = 2; p * p <= n; ++p) if (n % p == 0) {\n"
            "        int e = 0;\n"
            "        while (n % p == 0) { n /= p; ++e; }\n"
            "        cnt *= (e + 1);\n"
            "    }\n"
            "    if (n > 1) cnt *= 2;\n"
            "    return cnt;\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Exponentiation", "https://cses.fi/problemset/task/1095", "CSES", "easy"),
            R("CSES — Exponentiation II", "https://cses.fi/problemset/task/1712", "CSES", "easy"),
            R("CSES — Counting Divisors", "https://cses.fi/problemset/task/1713", "CSES", "easy"),
            R("CSES — Common Divisors", "https://cses.fi/problemset/task/1081", "CSES", "easy"),
            R("CSES — Sum of Divisors", "https://cses.fi/problemset/task/1082", "CSES", "medium"),
            R("CSES — Divisor Analysis", "https://cses.fi/problemset/task/2182", "CSES", "medium"),
            R("CSES — Prime Multiples", "https://cses.fi/problemset/task/2185", "CSES", "easy"),
            R("CSES — Counting Coprime Pairs", "https://cses.fi/problemset/task/2417", "CSES", "medium"),
            R("CF 230B — T-primes", "https://codeforces.com/problemset/problem/230/B", "Codeforces", "easy"),
            R("CF 615D — Multipliers", "https://codeforces.com/problemset/problem/615/D", "Codeforces", "medium"),
            R("CF 1199D — Welfare State (modular)", "https://codeforces.com/problemset/problem/1199/D", "Codeforces", "medium"),
            R("CF 1107E — Vasya and Binary String", "https://codeforces.com/problemset/problem/1107/E", "Codeforces", "hard"),
            R("AtCoder — ABC 052B Increment Decrement", "https://atcoder.jp/contests/abc052/tasks/abc052_b", "AtCoder", "easy"),
            R("AtCoder — ABC 142D Disjoint Set of Common Divisors", "https://atcoder.jp/contests/abc142/tasks/abc142_d", "AtCoder", "medium"),
            R("AtCoder — ABC 156E Roaming", "https://atcoder.jp/contests/abc156/tasks/abc156_e", "AtCoder", "medium"),
            R("SPOJ — FACT2 Integer Factorization (Pollard rho)", "https://www.spoj.com/problems/FACT2/", "SPOJ", "hard"),
            R("HackerRank — Modular Inverse (Fermat)", "https://www.hackerrank.com/challenges/ncr/problem", "HackerRank", "medium"),
            R("LeetCode 50 — Pow(x, n)", "https://leetcode.com/problems/powx-n/", "LeetCode", "medium"),
            R("LeetCode 1492 — kth Factor of n", "https://leetcode.com/problems/the-kth-factor-of-n/", "LeetCode", "medium"),
            R("VNOJ — POWMOD: Luỹ thừa nhanh", "https://oj.vnoi.info/problem/powmod", "VNOJ", "easy"),
        ],
    )

    C["sieve-factorization"] = dict(
        objectives=[
            "Sàng Eratosthenes O(N log log N) — đánh dấu mọi số nguyên tố ≤ N",
            "Sàng tuyến tính (Euler/Linear) O(N) — đánh dấu + lưu smallest prime factor",
            "Phân tích thừa số O(log n) sau khi có SPF",
            "Đếm hàm Euler `φ(n)`, số ước `τ(n)`, tổng ước `σ(n)` qua sàng tích các hàm",
            "Sàng `prime[]` trong [L, R] với R lớn (segmented sieve)",
            "Ứng dụng: số bán nguyên tố (T-primes), Mobius, đếm coprime",
        ],
        requirements=[
            "Number theory cơ bản (Day 26)",
            "Mảng + vòng for ngược",
        ],
        studyMethod=[
            "Sàng kinh điển 6 dòng — học thuộc cho 80% bài lớp 9 cần sàng",
            "SPF tốt hơn `isPrime[]` khi cần phân tích nhanh nhiều số",
            "Bài [L, R] với R lớn → segmented sieve",
            "Hàm tích phụ thuộc thừa số → sàng + DP trên SPF",
        ],
        theoryFull=(
            "## Sàng Eratosthenes\n\n"
            "Tìm mọi số nguyên tố ≤ N trong O(N log log N) (≈ O(N)).\n\n"
            "```cpp\nconst int N = 1e7 + 5;\nvector<bool> isComposite(N, false);\nvector<int> primes;\nfor (int i = 2; i < N; ++i) {\n    if (!isComposite[i]) {\n        primes.push_back(i);\n        for (long long j = (long long)i * i; j < N; j += i) isComposite[j] = true;\n    }\n}\n```\n\n"
            "Lưu ý: bắt đầu nội vòng từ `i*i` thay vì `2*i` để tránh đánh dấu lại.\n\n"
            "## Sàng tuyến tính + SPF\n\n"
            "**Smallest Prime Factor** `spf[n]` = thừa số nguyên tố nhỏ nhất của n. Sau tiền xử "
            "lý O(N), có thể phân tích n trong O(log n):\n\n"
            "```cpp\nvector<int> spf(N);\nvector<int> primes;\nfor (int i = 2; i < N; ++i) {\n    if (spf[i] == 0) { spf[i] = i; primes.push_back(i); }\n    for (int p : primes) {\n        if ((long long)p * i >= N || p > spf[i]) break;\n        spf[p * i] = p;\n    }\n}\n// Factorize n:\nwhile (n > 1) { f[spf[n]]++; n /= spf[n]; }\n```\n\n"
            "## Hàm Euler `φ(n)`\n\n"
            "Số nguyên trong `[1, n]` coprime với n. Tính qua sàng:\n\n"
            "```cpp\nvector<int> phi(N);\niota(phi.begin(), phi.end(), 0);\nfor (int i = 2; i < N; ++i) if (phi[i] == i) // i là prime\n    for (int j = i; j < N; j += i) phi[j] -= phi[j] / i;\n```\n\n"
            "## Số ước & tổng ước qua sàng\n\n"
            "```cpp\nvector<int> divCount(N, 0);\nfor (int i = 1; i < N; ++i)\n    for (int j = i; j < N; j += i) ++divCount[j];\n// O(N log N) — đếm số ước của mọi n ≤ N\n```\n\n"
            "## Segmented sieve\n\n"
            "Cho `[L, R]` với `R` lớn nhưng `R - L ≤ 10⁶`. Sàng các số nguyên tố ≤ √R bằng "
            "Eratosthenes thường, rồi mark composites trong `[L, R]`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Sàng Eratosthenes*: <https://wiki.vnoi.info/algo/math/sieve-of-eratosthenes>\n"
            "- CP-Algorithms — *Sieve of Eratosthenes*: <https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html>\n"
            "- CP-Algorithms — *Linear Sieve*: <https://cp-algorithms.com/algebra/prime-sieve-linear.html>\n"
            "- USACO Guide Gold — *Prime Factorization*: <https://usaco.guide/gold/divisibility>\n"
            "- GeeksforGeeks — *Sieve of Eratosthenes*: <https://www.geeksforgeeks.org/sieve-of-eratosthenes/>\n"
        ),
        codeExample=(
            "// Sàng SPF + phân tích thừa số\n"
            "const int N = 1e6 + 5;\n"
            "int spf[N];\n"
            "void buildSpf() {\n"
            "    for (int i = 2; i < N; ++i) if (spf[i] == 0)\n"
            "        for (long long j = i; j < N; j += i) if (spf[j] == 0) spf[j] = i;\n"
            "}\n"
            "vector<pair<int,int>> factor(int n) {\n"
            "    vector<pair<int,int>> res;\n"
            "    while (n > 1) {\n"
            "        int p = spf[n], e = 0;\n"
            "        while (n % p == 0) { n /= p; ++e; }\n"
            "        res.push_back({p, e});\n"
            "    }\n"
            "    return res;\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Counting Divisors", "https://cses.fi/problemset/task/1713", "CSES", "easy"),
            R("CSES — Prime Multiples", "https://cses.fi/problemset/task/2185", "CSES", "easy"),
            R("CSES — Counting Coprime Pairs", "https://cses.fi/problemset/task/2417", "CSES", "medium"),
            R("CSES — Divisor Analysis", "https://cses.fi/problemset/task/2182", "CSES", "medium"),
            R("CSES — Common Divisors", "https://cses.fi/problemset/task/1081", "CSES", "easy"),
            R("CSES — Sum of Divisors", "https://cses.fi/problemset/task/1082", "CSES", "medium"),
            R("CF 17A — Noldbach Problem", "https://codeforces.com/problemset/problem/17/A", "Codeforces", "easy"),
            R("CF 1051C — Distinctly Numbered", "https://codeforces.com/problemset/problem/1051/C", "Codeforces", "medium"),
            R("CF 1294D — MEX maximizing", "https://codeforces.com/problemset/problem/1294/D", "Codeforces", "medium"),
            R("CF 1117C — Magic Ship (primes & coprime)", "https://codeforces.com/problemset/problem/1117/C", "Codeforces", "medium"),
            R("CF 1454E — Number of Circles", "https://codeforces.com/problemset/problem/1454/E", "Codeforces", "hard"),
            R("AtCoder — ABC 084D 2017-like Number", "https://atcoder.jp/contests/abc084/tasks/abc084_d", "AtCoder", "medium"),
            R("AtCoder — ABC 152E Flatten (LCM)", "https://atcoder.jp/contests/abc152/tasks/abc152_e", "AtCoder", "medium"),
            R("AtCoder — ABC 170D Not Divisible", "https://atcoder.jp/contests/abc170/tasks/abc170_d", "AtCoder", "medium"),
            R("AtCoder — ABC 195D Shipping Center", "https://atcoder.jp/contests/abc195/tasks/abc195_d", "AtCoder", "medium"),
            R("SPOJ — PRIME1 Prime Generator (segmented)", "https://www.spoj.com/problems/PRIME1/", "SPOJ", "medium"),
            R("SPOJ — TDPRIMES Counting primes", "https://www.spoj.com/problems/TDPRIMES/", "SPOJ", "medium"),
            R("HackerRank — Project Euler #10 Primes ≤ 2M", "https://www.hackerrank.com/contests/projecteuler/challenges/euler010/problem", "HackerRank", "easy"),
            R("LeetCode 204 — Count Primes", "https://leetcode.com/problems/count-primes/", "LeetCode", "medium"),
            R("LeetCode 952 — Largest Component Size by Common Factor", "https://leetcode.com/problems/largest-component-size-by-common-factor/", "LeetCode", "hard"),
            R("VNOJ — NKPRIME: Sàng nguyên tố", "https://oj.vnoi.info/problem/nkprime", "VNOJ", "easy"),
        ],
    )

    C["string-hash"] = dict(
        objectives=[
            "Polynomial hash: chọn cơ số `B`, mod `M` (10⁹+7 hoặc 1<<61 - 1)",
            "Tính hash prefix → so sánh đoạn substring `O(1)`",
            "Double hashing để giảm tỷ lệ collision",
            "Bài: tìm xâu con xuất hiện trong xâu lớn",
            "Bài: kiểm 2 xâu có là rotation của nhau",
            "Khi nào Hash an toàn? (modulo random + cơ số random)",
        ],
        requirements=[
            "Xâu cơ bản (Day 5)",
            "Mod arithmetic (Day 26)",
        ],
        studyMethod=[
            "Học thuộc template hash 30 dòng — copy cho mọi bài hash",
            "Dùng 2 mod (10⁹+7 + 10⁹+9) hoặc mod 2^61-1 → safer trên CF",
            "Random base `B` để chống collision tấn công",
            "Bài 'so sánh substring O(1)' = hash; 'tìm pattern trong text' = hash hoặc KMP",
        ],
        theoryFull=(
            "## Polynomial Rolling Hash\n\n"
            "Mã hoá xâu `s = s_0 s_1 ... s_{n-1}` thành số:\n\n"
            "`H(s) = s_0 · B^(n-1) + s_1 · B^(n-2) + ... + s_{n-1} · B^0  (mod M)`\n\n"
            "với cơ số `B` lớn (vd `B = 131` hoặc random ≥ 256), mod `M` (`10⁹ + 7` hoặc "
            "`2⁶¹ - 1`).\n\n"
            "## Hash prefix\n\n"
            "`h[i+1] = h[i] * B + s[i]  (mod M)`. Sau O(n), có thể lấy hash của bất kỳ "
            "substring `s[l..r]` trong O(1):\n\n"
            "`hash(s[l..r]) = h[r+1] - h[l] * B^(r-l+1)  (mod M)`.\n\n"
            "Cần precompute `pow_B[i] = B^i mod M`.\n\n"
            "## Code template\n\n"
            "```cpp\nconst long long MOD = (1LL << 61) - 1;\nconst long long BASE = uniform_int_distribution<long long>(257, MOD - 1)(rng);\n// hoặc MOD = 1e9 + 7; BASE = 131;\nint n = s.size();\nvector<long long> h(n + 1, 0), pw(n + 1, 1);\nfor (int i = 0; i < n; ++i) {\n    h[i+1] = (__int128)h[i] * BASE % MOD + s[i];\n    h[i+1] %= MOD;\n    pw[i+1] = (__int128)pw[i] * BASE % MOD;\n}\nauto getHash = [&](int l, int r) -> long long {\n    long long x = h[r+1] - (__int128)h[l] * pw[r-l+1] % MOD;\n    return (x % MOD + MOD) % MOD;\n};\n```\n\n"
            "Note: với mod `2⁶¹ - 1`, dùng `__int128` để tránh tràn khi nhân.\n\n"
            "## Khi nào collision?\n\n"
            "Birthday paradox: với mod `M` và `n` truy vấn, xác suất có ít nhất 1 collision ≈ "
            "`n² / (2M)`. Với `M = 10⁹` và `n = 10⁵` → xác suất ~ 0.5%. Khá rủi ro!\n\n"
            "**Giải pháp**:\n"
            "- Double hashing (2 cặp (B, M) khác nhau), xác suất ≈ `n² / (2M²)`.\n"
            "- Mod = `2⁶¹ - 1` (Mersenne) — đủ rộng cho n ≤ 10⁶.\n"
            "- Random `B` mỗi run → đối thủ không thể craft input.\n\n"
            "## So sánh xâu\n\n"
            "Sau khi có `h[]`, **hash so sánh** thay cho strcmp:\n\n"
            "```cpp\nbool eq(int l1, int r1, int l2, int r2) {\n    return getHash(l1, r1) == getHash(l2, r2);\n}\n```\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Hash xâu*: <https://wiki.vnoi.info/algo/string/string-hashing>\n"
            "- CP-Algorithms — *String Hashing*: <https://cp-algorithms.com/string/string-hashing.html>\n"
            "- USACO Guide Plat — *String Hashing*: <https://usaco.guide/plat/string-hashing>\n"
            "- Codeforces Blog — *Anti-Hash Test*: <https://codeforces.com/blog/entry/60442>\n"
            "- GeeksforGeeks — *Polynomial Rolling Hash*: <https://www.geeksforgeeks.org/string-hashing-using-polynomial-rolling-hash-function/>\n"
        ),
        codeExample=(
            "// Polynomial hash prefix với mod 1e9+7\n"
            "const long long MOD = 1e9 + 7;\n"
            "const long long BASE = 131;\n"
            "int n = s.size();\n"
            "vector<long long> h(n + 1, 0), pw(n + 1, 1);\n"
            "for (int i = 0; i < n; ++i) {\n"
            "    h[i+1] = (h[i] * BASE + s[i]) % MOD;\n"
            "    pw[i+1] = pw[i] * BASE % MOD;\n"
            "}\n"
            "auto getHash = [&](int l, int r) -> long long {\n"
            "    long long x = (h[r+1] - h[l] * pw[r-l+1]) % MOD;\n"
            "    return (x % MOD + MOD) % MOD;\n"
            "};\n"
        ),
        referenceProblems=[
            R("CSES — String Matching (KMP/Hash)", "https://cses.fi/problemset/task/1753", "CSES", "medium"),
            R("CSES — Finding Borders", "https://cses.fi/problemset/task/1732", "CSES", "medium"),
            R("CSES — Finding Periods", "https://cses.fi/problemset/task/1733", "CSES", "medium"),
            R("CSES — Required Substring", "https://cses.fi/problemset/task/1112", "CSES", "hard"),
            R("CSES — Counting Patterns", "https://cses.fi/problemset/task/2103", "CSES", "medium"),
            R("CSES — Distinct Substrings", "https://cses.fi/problemset/task/2102", "CSES", "medium"),
            R("CSES — Palindrome Queries", "https://cses.fi/problemset/task/2420", "CSES", "hard"),
            R("CF 271D — Good Substrings", "https://codeforces.com/problemset/problem/271/D", "Codeforces", "medium"),
            R("CF 514C — Watto and Mechanism", "https://codeforces.com/problemset/problem/514/C", "Codeforces", "medium"),
            R("CF 835D — Palindromic characteristics", "https://codeforces.com/problemset/problem/835/D", "Codeforces", "hard"),
            R("CF 1107F — Sage's Birthday (Hash + DP)", "https://codeforces.com/problemset/problem/1107/F", "Codeforces", "hard"),
            R("AtCoder — ABC 141E Who Says a Pun?", "https://atcoder.jp/contests/abc141/tasks/abc141_e", "AtCoder", "medium"),
            R("AtCoder — ABC 284F Pond", "https://atcoder.jp/contests/abc284/tasks/abc284_f", "AtCoder", "hard"),
            R("AtCoder — ABC 331F Palindrome Update", "https://atcoder.jp/contests/abc331/tasks/abc331_f", "AtCoder", "hard"),
            R("SPOJ — SUBSTR Finding pattern", "https://www.spoj.com/problems/SUBSTR/", "SPOJ", "medium"),
            R("SPOJ — DISUBSTR Distinct Substrings", "https://www.spoj.com/problems/DISUBSTR/", "SPOJ", "medium"),
            R("HackerRank — Sherlock and Anagrams", "https://www.hackerrank.com/challenges/sherlock-and-anagrams/problem", "HackerRank", "medium"),
            R("LeetCode 28 — Find the Index of First Occurrence", "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", "LeetCode", "easy"),
            R("LeetCode 1044 — Longest Duplicate Substring", "https://leetcode.com/problems/longest-duplicate-substring/", "LeetCode", "hard"),
            R("VNOJ — HASHIT: Hash xâu cơ bản", "https://oj.vnoi.info/problem/hashit", "VNOJ", "medium"),
        ],
    )

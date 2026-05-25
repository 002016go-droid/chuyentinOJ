"""Week 5 — Day 29..30 — Tree DP intro / Mock exam."""


def register(C, R):
    C["tree-dp-intro"] = dict(
        objectives=[
            "Biểu diễn cây: danh sách kề vô hướng + root",
            "DFS trên cây: subtree size, depth, parent",
            "DP trên cây: dp[u] phụ thuộc dp[con(u)]",
            "Bài chuẩn: Subordinates (đếm nhân viên dưới quyền)",
            "Tree Matching (ghép cặp nhiều nhất)",
            "Rerooting technique (giới thiệu): dp 2 lần — dp subtree + dp toàn cây",
        ],
        requirements=[
            "DFS (Day 20)",
            "DP 1D (Day 22)",
        ],
        studyMethod=[
            "Vẽ tay cây 7 node, DFS từ root, ghi subtree_size và depth",
            "DP cây = DFS postorder: tính con trước, tính cha sau",
            "Rerooting: sau DFS thứ nhất (root 1), DFS thứ hai truyền thông tin từ cha xuống",
            "Bài 'tổng khoảng cách từ mỗi đỉnh' = rerooting kinh điển",
        ],
        theoryFull=(
            "## DP trên cây (Tree DP)\n\n"
            "Cây = đồ thị vô hướng liên thông không có chu trình, n đỉnh n-1 cạnh. Root tại "
            "đỉnh bất kỳ (thường đỉnh 1). DFS từ root, mỗi đỉnh `u` có các con `v_1, v_2, ...`.\n\n"
            "## Bài 1 — Subtree Size\n\n"
            "```cpp\nvector<int> sz(n + 1, 1);\nfunction<void(int, int)> dfs = [&](int u, int p) {\n    for (int v : adj[u]) if (v != p) {\n        dfs(v, u);\n        sz[u] += sz[v];\n    }\n};\ndfs(1, 0);\n```\n\n"
            "## Bài 2 — Tree Matching\n\n"
            "Chọn nhiều cạnh nhất sao cho không có 2 cạnh chung đỉnh.\n\n"
            "State: `dp[u][0]` = max matching trong subtree(u), u chưa ghép. `dp[u][1]` = u đã ghép "
            "với 1 con.\n\n"
            "```cpp\nvoid dfs(int u, int p) {\n    dp[u][0] = dp[u][1] = 0;\n    for (int v : adj[u]) if (v != p) {\n        dfs(v, u);\n        dp[u][0] += max(dp[v][0], dp[v][1]);\n    }\n    for (int v : adj[u]) if (v != p) {\n        int gain = 1 + dp[v][0] - max(dp[v][0], dp[v][1]);\n        dp[u][1] = max(dp[u][1], dp[u][0] + gain);\n    }\n}\n```\n\n"
            "Answer: `max(dp[1][0], dp[1][1])`.\n\n"
            "## Bài 3 — Rerooting (tổng khoảng cách)\n\n"
            "Cho cây n đỉnh, tính `f(u)` = tổng khoảng cách từ u đến mọi đỉnh khác.\n\n"
            "**DFS 1** (root = 1): tính `sz[u]` (subtree size) và `f[1]` = Σ depth(v).\n\n"
            "**DFS 2** (rerooting): khi chuyển root từ u sang con v:\n"
            "`f[v] = f[u] - sz[v] + (n - sz[v])`.\n\n"
            "Mỗi đỉnh v có `sz[v]` đỉnh trong subtree gần hơn 1, và `n - sz[v]` đỉnh xa hơn 1.\n\n"
            "```cpp\nvoid dfs2(int u, int p) {\n    for (int v : adj[u]) if (v != p) {\n        f[v] = f[u] - sz[v] + (n - sz[v]);\n        dfs2(v, u);\n    }\n}\n```\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *DP trên cây*: <https://wiki.vnoi.info/algo/dp/tree-dp>\n"
            "- USACO Guide Gold — *DP on Trees*: <https://usaco.guide/gold/dp-trees>\n"
            "- CP-Algorithms — *Rerooting technique*: <https://cp-algorithms.com/graph/dp-on-tree-rerooting.html>\n"
            "- AtCoder DP P-R: <https://atcoder.jp/contests/dp>\n"
            "- GeeksforGeeks — *Tree DP*: <https://www.geeksforgeeks.org/dynamic-programming-trees-set-1/>\n"
        ),
        codeExample=(
            "// Rerooting: tổng khoảng cách từ mỗi đỉnh\n"
            "vector<long long> f(n + 1);\n"
            "vector<int> sz(n + 1, 1);\n"
            "// DFS1: tính sz[] và f[1]\n"
            "function<void(int,int,int)> dfs1 = [&](int u, int p, int d) {\n"
            "    f[1] += d;\n"
            "    for (int v : adj[u]) if (v != p) {\n"
            "        dfs1(v, u, d + 1);\n"
            "        sz[u] += sz[v];\n"
            "    }\n"
            "};\n"
            "dfs1(1, 0, 0);\n"
            "// DFS2: rerooting\n"
            "function<void(int,int)> dfs2 = [&](int u, int p) {\n"
            "    for (int v : adj[u]) if (v != p) {\n"
            "        f[v] = f[u] - sz[v] + (n - sz[v]);\n"
            "        dfs2(v, u);\n"
            "    }\n"
            "};\n"
            "dfs2(1, 0);\n"
        ),
        referenceProblems=[
            R("CSES — Subordinates", "https://cses.fi/problemset/task/1674", "CSES", "easy"),
            R("CSES — Tree Matching", "https://cses.fi/problemset/task/1130", "CSES", "medium"),
            R("CSES — Tree Diameter", "https://cses.fi/problemset/task/1131", "CSES", "easy"),
            R("CSES — Tree Distances I", "https://cses.fi/problemset/task/1132", "CSES", "medium"),
            R("CSES — Tree Distances II (rerooting)", "https://cses.fi/problemset/task/1133", "CSES", "medium"),
            R("CSES — Subtree Queries", "https://cses.fi/problemset/task/1137", "CSES", "medium"),
            R("CSES — Path Queries", "https://cses.fi/problemset/task/1138", "CSES", "medium"),
            R("CSES — Company Queries I (LCA)", "https://cses.fi/problemset/task/1687", "CSES", "medium"),
            R("CSES — Distance Queries", "https://cses.fi/problemset/task/1135", "CSES", "medium"),
            R("CF 580C — Kefa and Park", "https://codeforces.com/problemset/problem/580/C", "Codeforces", "easy"),
            R("CF 1324F — Maximum White Subtree (rerooting)", "https://codeforces.com/problemset/problem/1324/F", "Codeforces", "medium"),
            R("CF 1084D — The Fair Nut and the Best Path", "https://codeforces.com/problemset/problem/1084/D", "Codeforces", "medium"),
            R("CF 161D — Distance in Tree (k edges)", "https://codeforces.com/problemset/problem/161/D", "Codeforces", "medium"),
            R("AtCoder — DP P Independent Set", "https://atcoder.jp/contests/dp/tasks/dp_p", "AtCoder", "medium"),
            R("AtCoder — DP V Subtree (rerooting)", "https://atcoder.jp/contests/dp/tasks/dp_v", "AtCoder", "hard"),
            R("AtCoder — ABC 220F Distance Sums 2 (rerooting)", "https://atcoder.jp/contests/abc220/tasks/abc220_f", "AtCoder", "hard"),
            R("AtCoder — ABC 138D Ki", "https://atcoder.jp/contests/abc138/tasks/abc138_d", "AtCoder", "medium"),
            R("HackerRank — Even Tree", "https://www.hackerrank.com/challenges/even-tree/problem", "HackerRank", "medium"),
            R("LeetCode 543 — Diameter of Binary Tree", "https://leetcode.com/problems/diameter-of-binary-tree/", "LeetCode", "easy"),
            R("LeetCode 834 — Sum of Distances in Tree", "https://leetcode.com/problems/sum-of-distances-in-tree/", "LeetCode", "hard"),
            R("VNOJ — QBTREE: DP trên cây", "https://oj.vnoi.info/problem/qbtree", "VNOJ", "medium"),
        ],
    )

    C["mock-exam"] = dict(
        objectives=[
            "Thi thử 120 phút — 4 bài theo format HSG VN chính thức",
            "Bài 1 dễ (T1): simulation hoặc array cơ bản",
            "Bài 2 vừa (T1-T2): DP 1D hoặc greedy + sort",
            "Bài 3 khó (T2): graph BFS/DFS hoặc DP 2D",
            "Bài 4 rất khó (T2-T3): number theory, segment tree, hoặc DP nâng cao",
            "Rà soát: phân tích sai lầm và kỹ thuật yếu sau thi",
        ],
        requirements=[
            "Đã hoàn thành Day 1..29 ở mức ≥ 60% mỗi node",
        ],
        studyMethod=[
            "Chia 120 phút: 25 + 30 + 35 + 30 phút cho 4 bài",
            "Đọc hết 4 bài trước khi code bất kỳ bài nào (5 phút đầu)",
            "Bài 4 quá khó → bỏ qua, tập trung sub nhẹ của bài 3",
            "Sau thi: code lại bài fail, viết editorial cho chính mình",
        ],
        theoryFull=(
            "## Mock Exam cuối lộ trình — HSG VN 120 phút\n\n"
            "Đề mẫu 4 bài:\n\n"
            "**Bài 1 — DAYSO (3 điểm)**: cho dãy a[1..n] (n ≤ 10⁵), đếm cặp `(i, j)` i < j "
            "sao cho `a[i] + a[j]` chia hết cho K. → Sort + frequency array + đếm.\n\n"
            "**Bài 2 — KNAPSACK (3 điểm)**: n vật, W ≤ 10⁴, tìm tổng giá trị max. → 0/1 "
            "knapsack 1D.\n\n"
            "**Bài 3 — GRAPH (3 điểm)**: đồ thị n ≤ 10⁵ đỉnh, m cạnh. Q truy vấn 'u → v có "
            "đường đi?' → DSU hoặc BFS offline.\n\n"
            "**Bài 4 — SIEVE (1 điểm)**: cho n ≤ 10⁶ số, mỗi truy vấn `(L, R)`, đếm số nguyên "
            "tố trong `[L, R]`. → Sàng Eratosthenes + prefix sum.\n\n"
            "## Chiến thuật thi\n\n"
            "1. **5 phút đầu**: đọc hết 4 bài, xếp hạng dễ → khó, chọn thứ tự làm.\n"
            "2. **Template I/O**: copy ngay template `freopen` + fast I/O.\n"
            "3. **Bài dễ trước**: AC bài 1 + 2 trước. 6 điểm an toàn.\n"
            "4. **Bài 3**: nếu kịp, focus sub nhỏ (brute force n ≤ 1000) lấy 1-2 điểm partial.\n"
            "5. **Bài 4**: chỉ nếu còn ≥ 30 phút. Lấy sub nhẹ.\n"
            "6. **5 phút cuối**: kiểm tra tên file, đường dẫn, format output.\n\n"
            "## Sau thi\n\n"
            "- Ghi log: bài nào AC, bài nào fail, lý do, thời gian mỗi bài.\n"
            "- Code lại bài fail từ đầu (không xem code cũ).\n"
            "- Viết editorial ngắn cho mỗi bài (1 đoạn: ý tưởng, state DP, complexity).\n"
            "- So sánh kết quả với mock tuần 1 (Day 7) → thấy tiến bộ.\n\n"
            "## Nguồn đề mock\n\n"
            "- VNOI — *Đề HSG các tỉnh*: <https://oj.vnoi.info/contest/>\n"
            "- Chuyentin.pro — *Đề HSG TP HCM*: <https://chuyentin.pro/>\n"
            "- USACO — *Past Contests*: <https://usaco.org/index.php?page=open>\n"
            "- AtCoder — *Beginner Contests*: <https://atcoder.jp/contests/archive?ratedType=1&category=0>\n"
        ),
        codeExample=(
            "// Template cho 1 bài mock exam\n"
            "#include <bits/stdc++.h>\n"
            "using namespace std;\n\n"
            "int main() {\n"
            "    ios_base::sync_with_stdio(false);\n"
            "    cin.tie(nullptr);\n"
            "    if (fopen(\"BAI1.INP\", \"r\")) {\n"
            "        freopen(\"BAI1.INP\", \"r\", stdin);\n"
            "        freopen(\"BAI1.OUT\", \"w\", stdout);\n"
            "    }\n"
            "    int n, K; cin >> n >> K;\n"
            "    vector<int> a(n);\n"
            "    for (auto &x : a) cin >> x;\n"
            "    vector<long long> cnt(K, 0);\n"
            "    for (int x : a) cnt[((x % K) + K) % K]++;\n"
            "    long long ans = cnt[0] * (cnt[0] - 1) / 2;\n"
            "    for (int r = 1; r < K; ++r) {\n"
            "        if (r + r == K) ans += cnt[r] * (cnt[r] - 1) / 2;\n"
            "        else if (r + r < K) ans += cnt[r] * cnt[K - r];\n"
            "    }\n"
            "    cout << ans << '\\n';\n"
            "    return 0;\n"
            "}\n"
        ),
        referenceProblems=[
            R("VNOJ — Đề ôn HSG (contest list)", "https://oj.vnoi.info/contests/", "VNOJ", "medium"),
            R("Chuyentin.pro — Tổng hợp đề HSG TP HCM", "https://chuyentin.pro/", "VNOJ", "medium"),
            R("USACO — Past Gold/Silver Contests", "https://usaco.org/index.php?page=open", "USACO", "medium"),
            R("AtCoder — ABC Archive", "https://atcoder.jp/contests/archive?ratedType=1&category=0", "AtCoder", "medium"),
            R("CSES — Full Problem Set", "https://cses.fi/problemset/list/", "CSES", "medium"),
        ],
    )

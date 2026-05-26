"""Week 3 — Day 15..21 — STL / Mono-stack / Mono-deque / DSU / Graph BFS-DFS / Shortest path."""


def register(C, R):
    C["stl-overview"] = dict(
        objectives=[
            "`vector`, `array`, `pair`, `tuple` — chứa dữ liệu cơ bản",
            "`set/multiset/unordered_set` — tập hợp, tìm/chèn/xoá O(log n) / O(1)",
            "`map/unordered_map` — bảng băm khóa-giá trị",
            "`stack/queue/deque/priority_queue` — ngăn xếp, hàng đợi, hàng đợi 2 đầu, heap",
            "`bitset<N>` — mảng bit, AND/OR/COUNT cực nhanh",
            "Lambda + `for_each`, `sort`, `find_if`, `count_if`",
        ],
        requirements=[
            "Mảng + sort + comparator (Days 3, 6)",
            "Pointer/iterator cơ bản",
        ],
        studyMethod=[
            "Đặt thực hành: chọn 1 bài, code 2 cách — không STL và có STL — so sánh số dòng",
            "Học `auto it = m.find(k)` thay vì `m[k]` (đỡ tạo entry mới)",
            "`priority_queue<int, vector<int>, greater<int>>` = min-heap",
            "`unordered_map` nhanh nhưng có thể bị Codeforces hash-hack — dùng custom hash khi thi",
        ],
        theoryFull=(
            "## STL — bộ thư viện chuẩn C++\n\n"
            "STL gồm 3 phần: **containers** (chứa dữ liệu), **algorithms** (xử lý), "
            "**iterators** (liên kết 2 phần). Học STL thành thạo = tiết kiệm 50% thời gian code.\n\n"
            "## Containers\n\n"
            "| Container | Truy cập | Chèn/Xoá | Sắp xếp | Ghi chú |\n"
            "|---|---|---|---|---|\n"
            "| `vector<T>` | O(1) | cuối O(1), giữa O(n) | không | mảng động |\n"
            "| `array<T,N>` | O(1) | không | không | mảng cố định |\n"
            "| `set<T>` | O(log n) | O(log n) | có | RB-tree |\n"
            "| `multiset<T>` | O(log n) | O(log n) | có | cho phép trùng |\n"
            "| `map<K,V>` | O(log n) | O(log n) | theo K | RB-tree |\n"
            "| `unordered_set` | O(1) avg | O(1) avg | không | hash |\n"
            "| `unordered_map` | O(1) avg | O(1) avg | không | hash |\n"
            "| `stack<T>` | top O(1) | push/pop O(1) | không | LIFO |\n"
            "| `queue<T>` | front O(1) | push/pop O(1) | không | FIFO |\n"
            "| `deque<T>` | O(1) 2 đầu | O(1) 2 đầu | không | hàng đợi 2 đầu |\n"
            "| `priority_queue<T>` | top O(1) | push/pop O(log n) | có | heap |\n"
            "| `bitset<N>` | O(1) | O(1) | không | N bits trong N/64 từ |\n\n"
            "## 5 thao tác phải nhớ\n\n"
            "**1. Loại trùng & sort 1 dòng**: `sort(v.begin(), v.end()); v.erase(unique(v.begin(), v.end()), v.end());`\n\n"
            "**2. Lower/upper bound**: `auto it = lower_bound(v.begin(), v.end(), x);` (v phải sort).\n\n"
            "**3. Min-heap**: `priority_queue<int, vector<int>, greater<int>> pq;`\n\n"
            "**4. Set đếm tần số sorted**: `map<int, int> cnt; ++cnt[x];` — iterate theo thứ tự khóa.\n\n"
            "**5. Bitset AND**: `bitset<N> a, b; auto c = a & b;` — O(N/64) phép.\n\n"
            "## Custom hash cho unordered_map (chống hack CF)\n\n"
            "```cpp\nstruct H {\n    size_t operator()(long long x) const {\n        x ^= x >> 33; x *= 0xff51afd7ed558ccd;\n        x ^= x >> 33;\n        return chrono::steady_clock::now().time_since_epoch().count() ^ x;\n    }\n};\nunordered_map<long long, int, H> m;\n```\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *STL Overview*: <https://wiki.vnoi.info/algo/data-structures/stl-overview>\n"
            "- USACO Guide Silver — *Intro to Sets & Maps*: <https://usaco.guide/silver/intro-sorted-sets>\n"
            "- CP-Algorithms — *Priority queues*: <https://cp-algorithms.com/data_structures/sparse-table.html>\n"
            "- cppreference — *Containers library*: <https://en.cppreference.com/w/cpp/container>\n"
        ),
        codeExample=(
            "// 5 STL pattern trong 1 bài: đọc n số, in tăng dần, sort, đếm tần số, top-3\n"
            "vector<int> a(n);\n"
            "for (auto &x : a) cin >> x;\n"
            "set<int> s(a.begin(), a.end());\n"
            "for (int v : s) cout << v << ' ';\n"
            "cout << '\\n';\n"
            "map<int,int> cnt;\n"
            "for (int v : a) ++cnt[v];\n"
            "priority_queue<pair<int,int>> pq;\n"
            "for (auto [val, c] : cnt) pq.push({c, val});\n"
            "for (int i = 0; i < 3 && !pq.empty(); ++i) {\n"
            "    auto [c, val] = pq.top(); pq.pop();\n"
            "    cout << val << \"(\" << c << \") \";\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Distinct Numbers", "https://cses.fi/problemset/task/1621", "CSES", "easy"),
            R("CSES — Apartments", "https://cses.fi/problemset/task/1084", "CSES", "easy"),
            R("CSES — Concert Tickets", "https://cses.fi/problemset/task/1091", "CSES", "easy"),
            R("CSES — Playlist", "https://cses.fi/problemset/task/1141", "CSES", "easy"),
            R("CSES — Towers", "https://cses.fi/problemset/task/1073", "CSES", "easy"),
            R("CSES — Sliding Median", "https://cses.fi/problemset/task/1076", "CSES", "medium"),
            R("CSES — Sliding Cost", "https://cses.fi/problemset/task/1077", "CSES", "medium"),
            R("CF 4C — Registration System (map)", "https://codeforces.com/problemset/problem/4/C", "Codeforces", "easy"),
            R("CF 525B — Pasha and String", "https://codeforces.com/problemset/problem/525/B", "Codeforces", "easy"),
            R("CF 580B — Kefa and Company", "https://codeforces.com/problemset/problem/580/B", "Codeforces", "medium"),
            R("CF 1352F — Binary String Reconstruction", "https://codeforces.com/problemset/problem/1352/F", "Codeforces", "medium"),
            R("CF 681B — Economy Game", "https://codeforces.com/problemset/problem/681/B", "Codeforces", "easy"),
            R("AtCoder — ABC 098C Attention", "https://atcoder.jp/contests/abc098/tasks/abc098_c", "AtCoder", "easy"),
            R("AtCoder — ABC 178B Product Max", "https://atcoder.jp/contests/abc178/tasks/abc178_b", "AtCoder", "easy"),
            R("HackerRank — Maps & Lookups", "https://www.hackerrank.com/challenges/cpp-maps/problem", "HackerRank", "easy"),
            R("HackerRank — Lower Bound STL", "https://www.hackerrank.com/challenges/cpp-lower-bound/problem", "HackerRank", "easy"),
            R("LeetCode 1 — Two Sum", "https://leetcode.com/problems/two-sum/", "LeetCode", "easy"),
            R("LeetCode 295 — Find Median from Data Stream", "https://leetcode.com/problems/find-median-from-data-stream/", "LeetCode", "hard"),
            R("VNOJ — CSESDIS: Distinct STL", "https://oj.vnoi.info/problem/csesdis", "VNOJ", "easy"),
        ],
    )

    C["monotonic-stack"] = dict(
        objectives=[
            "Duy trì stack giữ thứ tự đơn điệu (tăng hoặc giảm)",
            "Tìm 'phần tử lớn hơn / nhỏ hơn gần nhất bên trái/phải'",
            "Bài 'lớn nhất hình chữ nhật trong histogram'",
            "Bài 'mưa rơi giữa các cột' (Trapping Rain Water)",
            "Tổng các đoạn con với phần tử lớn nhất là `a[i]`",
            "Tính `next_greater[]` / `prev_smaller[]` trong O(n)",
        ],
        requirements=[
            "`stack`, `vector` STL (Day 15)",
            "Mảng 1D, vòng for ngược (Day 3)",
        ],
        studyMethod=[
            "Vẽ ví dụ 5-6 phần tử, mô phỏng stack từng bước",
            "Bài có 'lớn hơn / nhỏ hơn gần nhất' = mono stack",
            "Khi tính diện tích, dùng pattern 'trên đỉnh stack lúc pop là cao'",
            "Đặt sentinel `a[n] = -inf` để pop sạch stack ở cuối",
        ],
        theoryFull=(
            "## Monotonic Stack\n\n"
            "Stack với tính chất: các phần tử bên trong **đơn điệu tăng (hoặc giảm)** từ đáy lên "
            "đỉnh. Mỗi phần tử được push/pop ≤ 1 lần → tổng O(n).\n\n"
            "## Bài chuẩn 1: Next Greater Element\n\n"
            "Cho dãy `a[0..n-1]`. Với mỗi `i`, tìm chỉ số đầu tiên `j > i` mà `a[j] > a[i]` "
            "(không có → -1).\n\n"
            "```cpp\nstack<int> st; // chứa chỉ số\nvector<int> nge(n, -1);\nfor (int i = n - 1; i >= 0; --i) {\n    while (!st.empty() && a[st.top()] <= a[i]) st.pop();\n    if (!st.empty()) nge[i] = st.top();\n    st.push(i);\n}\n```\n\n"
            "Tương tự: Previous Smaller, Next Smaller, Previous Greater — chỉ thay đổi chiều "
            "duyệt và toán tử.\n\n"
            "## Bài chuẩn 2: Histogram lớn nhất\n\n"
            "Cho `n` cột chiều cao `h[i]`, tìm hình chữ nhật diện tích lớn nhất trong histogram.\n\n"
            "Ý tưởng: với mỗi cột `i`, tìm `L[i]` = chỉ số trái xa nhất có chiều cao ≥ `h[i]`, "
            "`R[i]` tương ứng. Diện tích = `h[i] * (R[i] - L[i] + 1)`. Cả hai tính bằng mono stack "
            "trong O(n).\n\n"
            "```cpp\nvector<int> L(n), R(n);\nstack<int> st;\nfor (int i = 0; i < n; ++i) {\n    while (!st.empty() && h[st.top()] >= h[i]) st.pop();\n    L[i] = st.empty() ? 0 : st.top() + 1;\n    st.push(i);\n}\nwhile (!st.empty()) st.pop();\nfor (int i = n - 1; i >= 0; --i) {\n    while (!st.empty() && h[st.top()] >= h[i]) st.pop();\n    R[i] = st.empty() ? n - 1 : st.top() - 1;\n    st.push(i);\n}\nlong long best = 0;\nfor (int i = 0; i < n; ++i) best = max(best, (long long)h[i] * (R[i] - L[i] + 1));\n```\n\n"
            "## Pattern nhận diện\n\n"
            "Đề có 'gần nhất bên trái/phải lớn hơn / nhỏ hơn' → mono stack chắc chắn.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Stack đơn điệu*: <https://wiki.vnoi.info/algo/data-structures/monotonic-stack>\n"
            "- USACO Guide Gold — *Monotonic Stack*: <https://usaco.guide/gold/monotonic-stack>\n"
            "- CP-Algorithms — *Stack with O(1) min*: <https://cp-algorithms.com/data_structures/stack_queue_modification.html>\n"
            "- GeeksforGeeks — *Next Greater Element*: <https://www.geeksforgeeks.org/next-greater-element/>\n"
        ),
        codeExample=(
            "// Largest rectangle in histogram\n"
            "vector<int> h(n);\n"
            "for (auto &x : h) cin >> x;\n"
            "stack<int> st;\n"
            "long long best = 0;\n"
            "h.push_back(0); // sentinel\n"
            "for (int i = 0; i <= n; ++i) {\n"
            "    while (!st.empty() && h[st.top()] > h[i]) {\n"
            "        int hh = h[st.top()]; st.pop();\n"
            "        int width = st.empty() ? i : i - st.top() - 1;\n"
            "        best = max(best, (long long)hh * width);\n"
            "    }\n"
            "    st.push(i);\n"
            "}\n"
            "cout << best << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Nearest Smaller Values", "https://cses.fi/problemset/task/1645", "CSES", "easy"),
            R("CSES — Subarray Minimum Sum", "https://cses.fi/problemset/task/3221", "CSES", "medium"),
            R("CF 1117C — Magic Ship", "https://codeforces.com/problemset/problem/1117/C", "Codeforces", "medium"),
            R("CF 1407D — Discrete Centrifugal Jumps", "https://codeforces.com/problemset/problem/1407/D", "Codeforces", "hard"),
            R("CF 5C — Longest Regular Bracket Sequence", "https://codeforces.com/problemset/problem/5/C", "Codeforces", "medium"),
            R("CF 911G — Mass Change Queries", "https://codeforces.com/problemset/problem/911/G", "Codeforces", "hard"),
            R("CF 1102E — Monotonic Renumeration", "https://codeforces.com/problemset/problem/1102/E", "Codeforces", "medium"),
            R("AtCoder — ABC 285F Substring of Sorted String", "https://atcoder.jp/contests/abc285/tasks/abc285_f", "AtCoder", "hard"),
            R("AtCoder — ABC 175E Picking Goods", "https://atcoder.jp/contests/abc175/tasks/abc175_e", "AtCoder", "medium"),
            R("AtCoder — ABC 224F Cards", "https://atcoder.jp/contests/abc224/tasks/abc224_f", "AtCoder", "hard"),
            R("SPOJ — HISTOGRA Largest Rectangle", "https://www.spoj.com/problems/HISTOGRA/", "SPOJ", "medium"),
            R("HackerRank — Largest Rectangle", "https://www.hackerrank.com/challenges/largest-rectangle/problem", "HackerRank", "medium"),
            R("HackerRank — Poisonous Plants", "https://www.hackerrank.com/challenges/poisonous-plants/problem", "HackerRank", "hard"),
            R("LeetCode 84 — Largest Rectangle in Histogram", "https://leetcode.com/problems/largest-rectangle-in-histogram/", "LeetCode", "hard"),
            R("LeetCode 85 — Maximal Rectangle", "https://leetcode.com/problems/maximal-rectangle/", "LeetCode", "hard"),
            R("LeetCode 42 — Trapping Rain Water", "https://leetcode.com/problems/trapping-rain-water/", "LeetCode", "hard"),
            R("LeetCode 496 — Next Greater Element", "https://leetcode.com/problems/next-greater-element-i/", "LeetCode", "easy"),
            R("VNOJ — VOSCAR / VOMARIO", "https://oj.vnoi.info/problem/vomario", "VNOJ", "medium"),
        ],
    )

    C["monotonic-deque"] = dict(
        objectives=[
            "Duy trì deque chứa chỉ số sao cho giá trị tương ứng đơn điệu",
            "Sliding Window Minimum/Maximum trong O(n)",
            "Sliding Median (medianstic) bằng 2 multiset hoặc sliding tricks",
            "Bài 'tổng cực đại trên cửa sổ thay đổi'",
            "Optimization DP: thay min/max chạy bằng deque",
            "Phân biệt deque đơn điệu vs Sparse Table",
        ],
        requirements=[
            "Cửa sổ trượt + mảng (Day 3)",
            "`deque` STL (Day 15)",
        ],
        studyMethod=[
            "Vẽ deque với cửa sổ size 3 trên dãy 8-9 phần tử",
            "Bài 'max/min trên mọi cửa sổ k phần tử' = pattern chuẩn",
            "Khi cập nhật DP có dạng `dp[i] = min(dp[j..i-1]) + cost(i)` → deque",
            "So sánh: Sparse Table O(1) truy vấn nhưng không cập nhật được; deque hỗ trợ trượt",
        ],
        theoryFull=(
            "## Monotonic Deque\n\n"
            "Mở rộng monotonic stack cho cửa sổ trượt: deque chứa chỉ số, các giá trị tương ứng "
            "đơn điệu. Mỗi phần tử push/pop ≤ 1 lần → O(n).\n\n"
            "## Sliding Window Minimum O(n)\n\n"
            "Cho dãy `a[0..n-1]` và cửa sổ size `k`. Với mỗi `i ∈ [k-1, n-1]`, tính min "
            "của `a[i-k+1..i]`.\n\n"
            "```cpp\ndeque<int> dq; // chứa chỉ số\nfor (int i = 0; i < n; ++i) {\n    // bỏ phần tử ngoài cửa sổ\n    while (!dq.empty() && dq.front() <= i - k) dq.pop_front();\n    // duy trì tăng dần từ đầu\n    while (!dq.empty() && a[dq.back()] >= a[i]) dq.pop_back();\n    dq.push_back(i);\n    if (i >= k - 1) cout << a[dq.front()] << ' ';\n}\n```\n\n"
            "Tổng số `push_back/pop_back` ≤ 2n → O(n).\n\n"
            "## Tối ưu DP\n\n"
            "Khi DP có dạng:\n\n"
            "`dp[i] = min(dp[i-k..i-1]) + cost(i)` với `k` cố định.\n\n"
            "Có thể giảm O(n·k) → O(n) bằng deque: duy trì deque chỉ số `j` trong cửa sổ "
            "`[i-k, i-1]` sao cho `dp[j]` đơn điệu tăng. `dp[i] = dp[dq.front()] + cost(i)`.\n\n"
            "## So sánh với Sparse Table\n\n"
            "| Cấu trúc | Tiền xử lý | Truy vấn | Cập nhật | Khi nào dùng |\n"
            "|---|---|---|---|---|\n"
            "| Sparse Table | O(n log n) | O(1) | không | Truy vấn idempotent (min/max/gcd) bất kỳ đoạn |\n"
            "| Mono Deque | O(n) | O(1) amortized | thêm/bỏ đầu/cuối | Cửa sổ trượt liên tiếp |\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Sliding Window*: <https://wiki.vnoi.info/algo/data-structures/sliding-window>\n"
            "- USACO Guide Gold — *Sliding Window*: <https://usaco.guide/gold/sliding-window>\n"
            "- CP-Algorithms — *Sliding Window Minimum*: <https://cp-algorithms.com/data_structures/stack_queue_modification.html>\n"
            "- GeeksforGeeks — *Sliding Window Max*: <https://www.geeksforgeeks.org/sliding-window-maximum-maximum-of-all-subarrays-of-size-k/>\n"
        ),
        codeExample=(
            "// Sliding window minimum size k, in ra mọi cực tiểu trên cửa sổ\n"
            "deque<int> dq;\n"
            "for (int i = 0; i < n; ++i) {\n"
            "    while (!dq.empty() && dq.front() <= i - k) dq.pop_front();\n"
            "    while (!dq.empty() && a[dq.back()] >= a[i]) dq.pop_back();\n"
            "    dq.push_back(i);\n"
            "    if (i >= k - 1) cout << a[dq.front()] << ' ';\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Sliding Window Minimum", "https://cses.fi/problemset/task/3221", "CSES", "medium"),
            R("CSES — Sliding Cost", "https://cses.fi/problemset/task/1077", "CSES", "medium"),
            R("CSES — Sliding Median", "https://cses.fi/problemset/task/1076", "CSES", "medium"),
            R("CSES — Reading Books (sliding view)", "https://cses.fi/problemset/task/1631", "CSES", "easy"),
            R("CF 940E — Cashback", "https://codeforces.com/problemset/problem/940/E", "Codeforces", "hard"),
            R("CF 372C — Watching Fireworks is Fun", "https://codeforces.com/problemset/problem/372/C", "Codeforces", "hard"),
            R("CF 1077F2 — Pictures with Kittens", "https://codeforces.com/problemset/problem/1077/F2", "Codeforces", "hard"),
            R("CF 514D — R2D2 and Droid Army", "https://codeforces.com/problemset/problem/514/D", "Codeforces", "medium"),
            R("CF 802O — April Fools' Problem", "https://codeforces.com/problemset/problem/802/O", "Codeforces", "hard"),
            R("AtCoder — ABC 062D 3N Numbers", "https://atcoder.jp/contests/abc062/tasks/arc074_b", "AtCoder", "medium"),
            R("AtCoder — DP B Frog 2", "https://atcoder.jp/contests/dp/tasks/dp_b", "AtCoder", "easy"),
            R("AtCoder — ABC 211D Number of Shortest paths", "https://atcoder.jp/contests/abc211/tasks/abc211_d", "AtCoder", "medium"),
            R("SPOJ — RMQSQ Range Min Query", "https://www.spoj.com/problems/RMQSQ/", "SPOJ", "medium"),
            R("HackerRank — Max Min", "https://www.hackerrank.com/challenges/angry-children/problem", "HackerRank", "medium"),
            R("LeetCode 239 — Sliding Window Maximum", "https://leetcode.com/problems/sliding-window-maximum/", "LeetCode", "hard"),
            R("LeetCode 480 — Sliding Window Median", "https://leetcode.com/problems/sliding-window-median/", "LeetCode", "hard"),
            R("LeetCode 862 — Shortest Subarray with Sum ≥ K", "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/", "LeetCode", "hard"),
            R("VNOJ — MINMAXP: Cửa sổ trượt", "https://oj.vnoi.info/problem/minmaxp", "VNOJ", "medium"),
        ],
    )

    C["dsu"] = dict(
        objectives=[
            "Cài đặt DSU với `parent[]` + `rank[]` + path compression",
            "Hợp 2 cây bằng `union by rank/size`",
            "Tìm gốc bằng `find(x)` với compression (gần O(1) amortized)",
            "Ứng dụng: đếm thành phần liên thông, kiểm chu trình trên đồ thị vô hướng",
            "Kruskal MST: sort cạnh + DSU",
            "Offline query: trả lời 'sau update nào x và y nối nhau'",
        ],
        requirements=[
            "Đồ thị cơ bản: cạnh + đỉnh + danh sách kề",
            "Hiểu khái niệm 'tổ tiên' / 'rễ cây'",
        ],
        studyMethod=[
            "Cài DSU 1 lần — học thuộc 20 dòng template, dùng cho 10 bài",
            "Vẽ tay union: hợp 2 cây, vẽ lại sau path compression",
            "Kruskal: sort cạnh tăng dần weight, dsu.union → nếu khác gốc thì lấy cạnh",
            "Bài 'có/không nối được a-b' qua nhiều thao tác → DSU",
        ],
        theoryFull=(
            "## Disjoint Set Union (DSU / Union-Find)\n\n"
            "Cấu trúc duy trì các tập rời nhau, hỗ trợ 2 thao tác:\n\n"
            "- `find(x)`: tìm 'đại diện' (root) của tập chứa `x`.\n"
            "- `unite(x, y)`: hợp 2 tập chứa `x` và `y`.\n\n"
            "Với 2 kỹ thuật **path compression** + **union by rank/size**, mỗi thao tác trung "
            "bình O(α(n)) ≈ O(1) (α là hàm Ackermann ngược, ≤ 4 với n ≤ 10⁹).\n\n"
            "## Cài đặt\n\n"
            "```cpp\nstruct DSU {\n    vector<int> p, r;\n    DSU(int n) : p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }\n    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }\n    bool unite(int x, int y) {\n        x = find(x); y = find(y);\n        if (x == y) return false;\n        if (r[x] < r[y]) swap(x, y);\n        p[y] = x;\n        if (r[x] == r[y]) ++r[x];\n        return true;\n    }\n};\n```\n\n"
            "## Ứng dụng\n\n"
            "### 1. Đếm thành phần liên thông\n\n"
            "```cpp\nDSU dsu(n);\nfor (auto [u, v] : edges) dsu.unite(u, v);\nset<int> roots;\nfor (int i = 0; i < n; ++i) roots.insert(dsu.find(i));\ncout << roots.size() << '\\n';\n```\n\n"
            "### 2. Kruskal MST O((n + m) log m)\n\n"
            "```cpp\nsort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a.w < b.w; });\nDSU dsu(n);\nlong long mst = 0;\nfor (auto& e : edges)\n    if (dsu.unite(e.u, e.v)) mst += e.w;\n```\n\n"
            "### 3. Kiểm chu trình\n\n"
            "Khi `unite(u, v)` trả về `false`, cạnh `(u, v)` tạo chu trình.\n\n"
            "### 4. Đảo ngược query (offline)\n\n"
            "Bài 'cho ban đầu mọi thứ nối; lần lượt xoá cạnh; sau mỗi lần xoá đếm thành phần'. "
            "Đảo: bắt đầu từ cuối, thêm cạnh, dùng DSU → tính nhanh.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *DSU*: <https://wiki.vnoi.info/algo/data-structures/disjoint-set-union>\n"
            "- USACO Guide Gold — *DSU*: <https://usaco.guide/gold/dsu>\n"
            "- CP-Algorithms — *Disjoint Set Union*: <https://cp-algorithms.com/data_structures/disjoint_set_union.html>\n"
            "- GeeksforGeeks — *Union-Find*: <https://www.geeksforgeeks.org/disjoint-set-data-structures/>\n"
        ),
        codeExample=(
            "// Đếm thành phần liên thông sau q truy vấn nối cạnh\n"
            "struct DSU {\n"
            "    vector<int> p, r;\n"
            "    DSU(int n) : p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }\n"
            "    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }\n"
            "    bool unite(int x, int y) {\n"
            "        x = find(x); y = find(y);\n"
            "        if (x == y) return false;\n"
            "        if (r[x] < r[y]) swap(x, y);\n"
            "        p[y] = x;\n"
            "        if (r[x] == r[y]) ++r[x];\n"
            "        return true;\n"
            "    }\n"
            "} dsu(n);\n"
            "int components = n;\n"
            "while (q--) {\n"
            "    int u, v; cin >> u >> v; --u; --v;\n"
            "    if (dsu.unite(u, v)) --components;\n"
            "    cout << components << '\\n';\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Road Construction", "https://cses.fi/problemset/task/1676", "CSES", "easy"),
            R("CSES — Building Roads", "https://cses.fi/problemset/task/1666", "CSES", "easy"),
            R("CSES — Road Reparation (MST)", "https://cses.fi/problemset/task/1675", "CSES", "medium"),
            R("CSES — New Roads Queries", "https://cses.fi/problemset/task/2101", "CSES", "medium"),
            R("CSES — Network Renovation", "https://cses.fi/problemset/task/1685", "CSES", "medium"),
            R("CF 25D — Roads not only in Berland", "https://codeforces.com/problemset/problem/25/D", "Codeforces", "medium"),
            R("CF 277A — Learning Languages", "https://codeforces.com/problemset/problem/277/A", "Codeforces", "easy"),
            R("CF 1167C — News Distribution", "https://codeforces.com/problemset/problem/1167/C", "Codeforces", "easy"),
            R("CF 891C — Envy", "https://codeforces.com/problemset/problem/891/C", "Codeforces", "hard"),
            R("CF 1213G — Path Queries", "https://codeforces.com/problemset/problem/1213/G", "Codeforces", "hard"),
            R("AtCoder — ABC 049D 連結", "https://atcoder.jp/contests/abc049/tasks/arc065_b", "AtCoder", "medium"),
            R("AtCoder — ABC 075C Bridge", "https://atcoder.jp/contests/abc075/tasks/abc075_c", "AtCoder", "medium"),
            R("AtCoder — ABC 120D Decayed Bridges", "https://atcoder.jp/contests/abc120/tasks/abc120_d", "AtCoder", "medium"),
            R("AtCoder — ABC 214D Sum of Maximum Weights", "https://atcoder.jp/contests/abc214/tasks/abc214_d", "AtCoder", "hard"),
            R("SPOJ — MST: Minimum Spanning Tree", "https://www.spoj.com/problems/MST/", "SPOJ", "medium"),
            R("HackerRank — Components in a graph", "https://www.hackerrank.com/challenges/components-in-graph/problem", "HackerRank", "medium"),
            R("LeetCode 547 — Number of Provinces", "https://leetcode.com/problems/number-of-provinces/", "LeetCode", "medium"),
            R("LeetCode 684 — Redundant Connection", "https://leetcode.com/problems/redundant-connection/", "LeetCode", "medium"),
            R("VNOJ — QBMST: Cây khung min", "https://oj.vnoi.info/problem/qbmst", "VNOJ", "medium"),
        ],
    )

    C["graph-bfs"] = dict(
        objectives=[
            "Biểu diễn đồ thị: ma trận kề, danh sách kề, `vector<vector<int>>`",
            "BFS từ một nguồn — tính khoảng cách (số cạnh ngắn nhất) đến mọi đỉnh",
            "BFS đa nguồn (multi-source BFS)",
            "Floodfill grid 4/8 hướng",
            "0-1 BFS với cạnh trọng số 0 hoặc 1 — dùng deque",
            "Đường đi ngắn nhất trên đồ thị không trọng (BFS)",
        ],
        requirements=[
            "Queue STL (Day 15)",
            "Mảng 2D + floodfill (Day 4)",
        ],
        studyMethod=[
            "Mỗi đỉnh có 1 trạng thái: `visited[]`",
            "BFS gọi 1 lần từ source duy nhất; nếu nhiều source, push tất cả vào queue lúc đầu",
            "Lưu `parent[]` để truy ngược đường đi",
            "Khi cạnh có weight 0 hoặc 1: dùng deque thay queue → 0-1 BFS",
        ],
        theoryFull=(
            "## Đồ thị (Graph)\n\n"
            "Đồ thị `G = (V, E)`: tập đỉnh `V` (kích cỡ n) và tập cạnh `E` (kích cỡ m). Biểu diễn:\n\n"
            "- **Ma trận kề** `adj[N][N]`: O(N²) bộ nhớ, OK khi N ≤ 1000.\n"
            "- **Danh sách kề** `vector<vector<int>> adj(N)`: O(N + M) bộ nhớ, dùng cho mọi N, M.\n\n"
            "## Breadth-First Search (BFS)\n\n"
            "Duyệt theo tầng. Khi đồ thị **không có trọng số** (hoặc trọng = 1), BFS cho khoảng "
            "cách (số cạnh) ngắn nhất từ nguồn đến mọi đỉnh trong O(N + M).\n\n"
            "```cpp\nvector<int> dist(n, INT_MAX);\nqueue<int> q;\nq.push(src); dist[src] = 0;\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : adj[u]) if (dist[v] == INT_MAX) {\n        dist[v] = dist[u] + 1;\n        q.push(v);\n    }\n}\n```\n\n"
            "## BFS đa nguồn (Multi-Source BFS)\n\n"
            "Cho k nguồn `s_1, ..., s_k`, tính khoảng cách từ mỗi đỉnh đến nguồn gần nhất. Cho "
            "tất cả nguồn vào queue cùng lúc, đặt `dist[s_i] = 0` cho mọi i, rồi BFS như bình "
            "thường. Tổng O(N + M) (không phải k · O(N+M)).\n\n"
            "Pattern: lửa cháy lan, virus lan, mưa từ nhiều nóc nhà.\n\n"
            "## 0-1 BFS\n\n"
            "Khi cạnh có trọng 0 hoặc 1, thay queue bằng deque:\n\n"
            "- Cạnh trọng 0: `dq.push_front(v)` (đi miễn phí).\n"
            "- Cạnh trọng 1: `dq.push_back(v)` (đi tốn 1).\n\n"
            "Vẫn O(N + M). Áp dụng: đảo bit trên grid, đi qua cửa khoá có chìa.\n\n"
            "## Truy đường đi\n\n"
            "Lưu `parent[v] = u` khi đi từ u → v. Truy ngược từ `dst` về `src` bằng `parent`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *BFS*: <https://wiki.vnoi.info/algo/graph-theory/breadth-first-search>\n"
            "- USACO Guide Silver — *Flood Fill*: <https://usaco.guide/silver/flood-fill>\n"
            "- CP-Algorithms — *BFS*: <https://cp-algorithms.com/graph/breadth-first-search.html>\n"
            "- GeeksforGeeks — *BFS Graph*: <https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/>\n"
        ),
        codeExample=(
            "// BFS đa nguồn — lửa cháy đến mọi ô\n"
            "int n, m; cin >> n >> m;\n"
            "vector<string> g(n);\n"
            "for (auto &s : g) cin >> s;\n"
            "vector<vector<int>> dist(n, vector<int>(m, -1));\n"
            "queue<pair<int,int>> q;\n"
            "for (int i = 0; i < n; ++i)\n"
            "    for (int j = 0; j < m; ++j) if (g[i][j] == 'F') {\n"
            "        dist[i][j] = 0;\n"
            "        q.push({i, j});\n"
            "    }\n"
            "int dx[] = {-1, 0, 1, 0}, dy[] = {0, 1, 0, -1};\n"
            "while (!q.empty()) {\n"
            "    auto [x, y] = q.front(); q.pop();\n"
            "    for (int d = 0; d < 4; ++d) {\n"
            "        int nx = x + dx[d], ny = y + dy[d];\n"
            "        if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;\n"
            "        if (g[nx][ny] == '#' || dist[nx][ny] != -1) continue;\n"
            "        dist[nx][ny] = dist[x][y] + 1;\n"
            "        q.push({nx, ny});\n"
            "    }\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Labyrinth", "https://cses.fi/problemset/task/1193", "CSES", "easy"),
            R("CSES — Counting Rooms", "https://cses.fi/problemset/task/1192", "CSES", "easy"),
            R("CSES — Message Route", "https://cses.fi/problemset/task/1667", "CSES", "easy"),
            R("CSES — Monsters", "https://cses.fi/problemset/task/1194", "CSES", "medium"),
            R("CSES — Building Teams", "https://cses.fi/problemset/task/1668", "CSES", "easy"),
            R("CSES — Round Trip", "https://cses.fi/problemset/task/1669", "CSES", "medium"),
            R("CF 580C — Kefa and Park", "https://codeforces.com/problemset/problem/580/C", "Codeforces", "easy"),
            R("CF 794D — Labelling Cities", "https://codeforces.com/problemset/problem/794/D", "Codeforces", "hard"),
            R("CF 1077E — Thematic Contests", "https://codeforces.com/problemset/problem/1077/E", "Codeforces", "medium"),
            R("CF 35C — Fire Again", "https://codeforces.com/problemset/problem/35/C", "Codeforces", "medium"),
            R("CF 877D — Olya and Energy Drinks", "https://codeforces.com/problemset/problem/877/D", "Codeforces", "medium"),
            R("AtCoder — ABC 168D .. (Robot Path Decoding)", "https://atcoder.jp/contests/abc168/tasks/abc168_d", "AtCoder", "medium"),
            R("AtCoder — ABC 170E Smart Infants", "https://atcoder.jp/contests/abc170/tasks/abc170_e", "AtCoder", "medium"),
            R("AtCoder — ABC 211D Number of Shortest paths", "https://atcoder.jp/contests/abc211/tasks/abc211_d", "AtCoder", "medium"),
            R("HackerRank — BFS Shortest Reach", "https://www.hackerrank.com/challenges/bfsshortreach/problem", "HackerRank", "medium"),
            R("HackerRank — Connected Cells in Grid", "https://www.hackerrank.com/challenges/connected-cell-in-a-grid/problem", "HackerRank", "medium"),
            R("LeetCode 1091 — Shortest Path in Binary Matrix", "https://leetcode.com/problems/shortest-path-in-binary-matrix/", "LeetCode", "medium"),
            R("LeetCode 994 — Rotting Oranges", "https://leetcode.com/problems/rotting-oranges/", "LeetCode", "medium"),
            R("VNOJ — BFS: Loang", "https://oj.vnoi.info/problem/bfs", "VNOJ", "easy"),
        ],
    )

    C["graph-dfs"] = dict(
        objectives=[
            "DFS đệ quy + DFS iterative (dùng `stack` thay đệ quy nếu n lớn)",
            "Tô màu / kiểm tra lưỡng phân (bipartite)",
            "Đếm thành phần liên thông trên đồ thị vô hướng",
            "Tô màu theo thứ tự duyệt DFS (preorder, postorder)",
            "Phát hiện chu trình trên đồ thị có hướng (3 màu)",
            "Tìm thành phần liên thông mạnh sơ cấp (chỉ giới thiệu)",
        ],
        requirements=[
            "Đồ thị + biểu diễn kề",
            "Quay lui & đệ quy (Day 13)",
        ],
        studyMethod=[
            "Code DFS từ đầu, đừng copy — gõ tay 3 lần",
            "Tô màu lưỡng phân: gán 0 cho src, mỗi cạnh gán màu khác",
            "Phát hiện chu trình có hướng: 3 màu (white/gray/black)",
            "Với n ≥ 10⁵ trên đồ thị đường thẳng, DFS đệ quy có thể stack overflow → tăng "
            "stack size hoặc đổi sang iterative",
        ],
        theoryFull=(
            "## Depth-First Search (DFS)\n\n"
            "Duyệt theo chiều sâu: từ một đỉnh, đi tiếp theo cạnh chưa duyệt cho tới cùng, "
            "rồi quay lại. Phù hợp cho: đếm thành phần liên thông, tìm cầu/khớp, sắp xếp "
            "topo, tô màu lưỡng phân.\n\n"
            "## Cài đặt đệ quy\n\n"
            "```cpp\nvector<bool> vis(n, false);\nvoid dfs(int u) {\n    vis[u] = true;\n    for (int v : adj[u]) if (!vis[v]) dfs(v);\n}\n```\n\n"
            "## Cài đặt iterative (khi n lớn ngại stack overflow)\n\n"
            "```cpp\nstack<int> st; st.push(src);\nwhile (!st.empty()) {\n    int u = st.top(); st.pop();\n    if (vis[u]) continue;\n    vis[u] = true;\n    for (int v : adj[u]) if (!vis[v]) st.push(v);\n}\n```\n\n"
            "## Đếm thành phần liên thông\n\n"
            "```cpp\nint cnt = 0;\nfor (int i = 0; i < n; ++i) if (!vis[i]) {\n    ++cnt; dfs(i);\n}\n```\n\n"
            "## Lưỡng phân (Bipartite)\n\n"
            "Tô màu 0 / 1 cho 2 phía. DFS gán `color[src] = 0`, mỗi cạnh `(u, v)` gán "
            "`color[v] = 1 - color[u]`. Nếu gặp `v` đã tô màu mà bằng `color[u]` → không lưỡng phân.\n\n"
            "## Phát hiện chu trình có hướng — 3 màu\n\n"
            "- `WHITE = 0` chưa thăm.\n"
            "- `GRAY = 1` đang ở trong DFS hiện tại.\n"
            "- `BLACK = 2` đã thăm xong.\n\n"
            "Trong DFS, nếu gặp đỉnh `v` đang ở trạng thái `GRAY` → có chu trình (cạnh quay lui).\n\n"
            "## Topological Sort (DAG)\n\n"
            "DFS xong, đẩy đỉnh vào stack tại bước postorder. Đảo ngược stack = thứ tự topo.\n\n"
            "## Stack overflow trên đường thẳng\n\n"
            "Với 10⁵ đỉnh đường thẳng, đệ quy DFS sẽ tràn stack (default ~ 1 MB). Cách khắc phục:\n\n"
            "- Đổi sang DFS iterative.\n"
            "- Trên VNOJ thêm `#pragma comment(linker, \"/STACK:...\")` (Windows).\n"
            "- Compile với `ulimit -s unlimited` (Linux).\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *DFS*: <https://wiki.vnoi.info/algo/graph-theory/depth-first-search>\n"
            "- USACO Guide Silver — *DFS*: <https://usaco.guide/silver/dfs>\n"
            "- CP-Algorithms — *DFS*: <https://cp-algorithms.com/graph/depth-first-search.html>\n"
            "- GeeksforGeeks — *DFS*: <https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/>\n"
        ),
        codeExample=(
            "// Kiểm tra đồ thị lưỡng phân bằng DFS\n"
            "vector<int> color(n, -1);\n"
            "bool ok = true;\n"
            "function<void(int, int)> dfs = [&](int u, int c) {\n"
            "    color[u] = c;\n"
            "    for (int v : adj[u]) {\n"
            "        if (color[v] == -1) dfs(v, 1 - c);\n"
            "        else if (color[v] == c) ok = false;\n"
            "    }\n"
            "};\n"
            "for (int i = 0; i < n; ++i) if (color[i] == -1) dfs(i, 0);\n"
            "cout << (ok ? \"YES\" : \"NO\") << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Counting Rooms", "https://cses.fi/problemset/task/1192", "CSES", "easy"),
            R("CSES — Round Trip", "https://cses.fi/problemset/task/1669", "CSES", "medium"),
            R("CSES — Building Teams (bipartite)", "https://cses.fi/problemset/task/1668", "CSES", "easy"),
            R("CSES — Course Schedule (topo)", "https://cses.fi/problemset/task/1679", "CSES", "medium"),
            R("CSES — Round Trip II", "https://cses.fi/problemset/task/1678", "CSES", "medium"),
            R("CSES — Coin Collector (SCC + DAG DP)", "https://cses.fi/problemset/task/1686", "CSES", "hard"),
            R("CF 1144F — Graph Without Long Directed Paths", "https://codeforces.com/problemset/problem/1144/F", "Codeforces", "medium"),
            R("CF 510B — Fox And Two Dots", "https://codeforces.com/problemset/problem/510/B", "Codeforces", "easy"),
            R("CF 246D — Colorful Graph", "https://codeforces.com/problemset/problem/246/D", "Codeforces", "medium"),
            R("CF 510B — Fox And Two Dots (4-cycle)", "https://codeforces.com/problemset/problem/510/B", "Codeforces", "easy"),
            R("AtCoder — ABC 070D Transit Tree Path", "https://atcoder.jp/contests/abc070/tasks/abc070_d", "AtCoder", "medium"),
            R("AtCoder — ABC 138D Ki", "https://atcoder.jp/contests/abc138/tasks/abc138_d", "AtCoder", "medium"),
            R("AtCoder — ABC 191E Come Back Quickly", "https://atcoder.jp/contests/abc191/tasks/abc191_e", "AtCoder", "hard"),
            R("AtCoder — DP G Longest Path", "https://atcoder.jp/contests/dp/tasks/dp_g", "AtCoder", "medium"),
            R("HackerRank — DFS Connected Cells", "https://www.hackerrank.com/challenges/ctci-connected-cell-in-a-grid/problem", "HackerRank", "medium"),
            R("LeetCode 200 — Number of Islands", "https://leetcode.com/problems/number-of-islands/", "LeetCode", "medium"),
            R("LeetCode 207 — Course Schedule (topo)", "https://leetcode.com/problems/course-schedule/", "LeetCode", "medium"),
            R("LeetCode 785 — Is Graph Bipartite?", "https://leetcode.com/problems/is-graph-bipartite/", "LeetCode", "medium"),
            R("VNOJ — DFSCONNECT: DFS đếm liên thông", "https://oj.vnoi.info/problem/dfsconnect", "VNOJ", "easy"),
        ],
    )

    C["shortest-path"] = dict(
        objectives=[
            "Dijkstra `O((n + m) log m)` cho cạnh không âm",
            "Bellman-Ford O(n · m) cho cạnh âm; phát hiện chu trình âm",
            "Floyd-Warshall O(n³) cho all-pairs shortest path khi n ≤ 500",
            "0-1 BFS với cạnh 0/1 (Day 19 đã giới thiệu, ôn lại)",
            "Tái dựng đường đi qua mảng `parent[]`",
            "Phân biệt loại cạnh để chọn thuật toán phù hợp",
        ],
        requirements=[
            "BFS/DFS (Day 19, 20)",
            "Priority queue (Day 15)",
        ],
        studyMethod=[
            "Học thuộc Dijkstra trong 25 dòng — dùng cho 80% bài shortest path HSG",
            "Floyd 3 vòng for lồng — chỉ 5 dòng, không bao giờ sai khi n ≤ 500",
            "Bellman-Ford chỉ khi cạnh âm + n nhỏ; nếu n lớn cộng cạnh âm → SPFA",
            "Vẽ tay 5-6 đỉnh, mô phỏng Dijkstra từng bước để hiểu vì sao greedy đúng",
        ],
        theoryFull=(
            "## Đường đi ngắn nhất\n\n"
            "3 thuật toán chính:\n\n"
            "| Tên | Cạnh âm | One-to-all | All-pairs | Độ phức tạp |\n"
            "|---|---|---|---|---|\n"
            "| BFS | không | có | không | O(N+M) |\n"
            "| Dijkstra | không | có | không | O((N+M) log N) |\n"
            "| Bellman-Ford | có | có | không | O(N·M) |\n"
            "| Floyd-Warshall | có | không | có | O(N³) |\n"
            "| 0-1 BFS | trọng {0,1} | có | không | O(N+M) |\n\n"
            "## Dijkstra (O((N+M) log N))\n\n"
            "```cpp\nvector<long long> dist(n, LLONG_MAX);\ndist[src] = 0;\npriority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;\npq.push({0, src});\nwhile (!pq.empty()) {\n    auto [d, u] = pq.top(); pq.pop();\n    if (d > dist[u]) continue;\n    for (auto [v, w] : adj[u]) if (dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        pq.push({dist[v], v});\n    }\n}\n```\n\n"
            "Lưu ý: nếu `d > dist[u]` thì bỏ qua (entry cũ trong PQ).\n\n"
            "## Bellman-Ford (O(N·M))\n\n"
            "```cpp\nvector<long long> dist(n, LLONG_MAX);\ndist[src] = 0;\nfor (int i = 0; i < n - 1; ++i)\n    for (auto& e : edges)\n        if (dist[e.u] != LLONG_MAX && dist[e.u] + e.w < dist[e.v])\n            dist[e.v] = dist[e.u] + e.w;\n// Lần n-th: nếu vẫn cập nhật → có chu trình âm tới được\n```\n\n"
            "## Floyd-Warshall (O(N³))\n\n"
            "```cpp\nvector<vector<long long>> d(n, vector<long long>(n, LLONG_MAX / 2));\nfor (int i = 0; i < n; ++i) d[i][i] = 0;\nfor (auto& e : edges) d[e.u][e.v] = min(d[e.u][e.v], (long long)e.w);\nfor (int k = 0; k < n; ++k)\n    for (int i = 0; i < n; ++i)\n        for (int j = 0; j < n; ++j)\n            if (d[i][k] + d[k][j] < d[i][j])\n                d[i][j] = d[i][k] + d[k][j];\n```\n\n"
            "## Khi nào dùng cái nào?\n\n"
            "- N, M ≤ 10⁵, cạnh không âm → **Dijkstra**.\n"
            "- N ≤ 500 → **Floyd** (all-pairs).\n"
            "- Có cạnh âm → **Bellman-Ford** (N ≤ 500).\n"
            "- Cạnh chỉ {0, 1} → **0-1 BFS**.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Đường đi ngắn nhất*: <https://wiki.vnoi.info/algo/graph-theory/shortest-path>\n"
            "- USACO Guide Gold — *Shortest Paths*: <https://usaco.guide/gold/shortest-paths>\n"
            "- CP-Algorithms — *Dijkstra*: <https://cp-algorithms.com/graph/dijkstra.html>\n"
            "- CP-Algorithms — *Bellman-Ford*: <https://cp-algorithms.com/graph/bellman_ford.html>\n"
            "- CP-Algorithms — *Floyd-Warshall*: <https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html>\n"
        ),
        codeExample=(
            "// Dijkstra với danh sách kề\n"
            "vector<vector<pair<int,int>>> adj(n);\n"
            "// adj[u] = {(v, w), ...}\n"
            "vector<long long> dist(n, LLONG_MAX);\n"
            "dist[src] = 0;\n"
            "priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;\n"
            "pq.push({0, src});\n"
            "while (!pq.empty()) {\n"
            "    auto [d, u] = pq.top(); pq.pop();\n"
            "    if (d > dist[u]) continue;\n"
            "    for (auto [v, w] : adj[u]) {\n"
            "        long long nd = d + w;\n"
            "        if (nd < dist[v]) {\n"
            "            dist[v] = nd;\n"
            "            pq.push({nd, v});\n"
            "        }\n"
            "    }\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Shortest Routes I (Dijkstra)", "https://cses.fi/problemset/task/1671", "CSES", "easy"),
            R("CSES — Shortest Routes II (Floyd)", "https://cses.fi/problemset/task/1672", "CSES", "medium"),
            R("CSES — High Score (Bellman-Ford)", "https://cses.fi/problemset/task/1673", "CSES", "medium"),
            R("CSES — Cycle Finding (neg cycle)", "https://cses.fi/problemset/task/1197", "CSES", "medium"),
            R("CSES — Flight Discount", "https://cses.fi/problemset/task/1195", "CSES", "medium"),
            R("CSES — Flight Routes Check", "https://cses.fi/problemset/task/1682", "CSES", "medium"),
            R("CSES — Flight Routes", "https://cses.fi/problemset/task/1196", "CSES", "hard"),
            R("CSES — Investigation", "https://cses.fi/problemset/task/1202", "CSES", "medium"),
            R("CF 20C — Dijkstra", "https://codeforces.com/problemset/problem/20/C", "Codeforces", "medium"),
            R("CF 295B — Greg and Graph (Floyd)", "https://codeforces.com/problemset/problem/295/B", "Codeforces", "medium"),
            R("CF 614A — Link/Cut Tree", "https://codeforces.com/problemset/problem/614/A", "Codeforces", "easy"),
            R("CF 1003E — Tree Constructing", "https://codeforces.com/problemset/problem/1003/E", "Codeforces", "hard"),
            R("AtCoder — ABC 022C Blue Bird", "https://atcoder.jp/contests/abc022/tasks/abc022_c", "AtCoder", "medium"),
            R("AtCoder — ABC 143E Travel by Car", "https://atcoder.jp/contests/abc143/tasks/abc143_e", "AtCoder", "medium"),
            R("AtCoder — ABC 192E Train", "https://atcoder.jp/contests/abc192/tasks/abc192_e", "AtCoder", "medium"),
            R("SPOJ — SHPATH The Shortest Path", "https://www.spoj.com/problems/SHPATH/", "SPOJ", "medium"),
            R("HackerRank — Floyd : City of Blinding Lights", "https://www.hackerrank.com/challenges/floyd-city-of-blinding-lights/problem", "HackerRank", "medium"),
            R("LeetCode 743 — Network Delay Time", "https://leetcode.com/problems/network-delay-time/", "LeetCode", "medium"),
            R("LeetCode 787 — Cheapest Flights w/ K Stops", "https://leetcode.com/problems/cheapest-flights-within-k-stops/", "LeetCode", "medium"),
            R("VNOJ — QBMAX: Đường đi cực đại", "https://oj.vnoi.info/problem/qbmax", "VNOJ", "medium"),
        ],
    )

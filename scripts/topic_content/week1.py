"""Week 1 — Day 1..7 — Cú pháp C++ + nền tảng (T1)."""


def register(C, R):
    C["io-complexity"] = dict(
        objectives=[
            "Bật fast I/O: `ios_base::sync_with_stdio(false); cin.tie(nullptr);`",
            "Dùng `freopen(\"BAI.INP\",\"r\",stdin); freopen(\"BAI.OUT\",\"w\",stdout);` đúng convention HSG VN",
            "Phân biệt `int` (≈ 2·10⁹) vs `long long` (≈ 9·10¹⁸), biết khi nào dùng",
            "Ước lượng thời gian: 1s ≈ 10⁸ phép, suy ra `O(?)` tối đa cho n cho trước",
            "Biểu diễn độ phức tạp Big-O cho vòng lặp lồng, while, đệ quy đơn",
            "Tránh tràn số: `(long long)a * b` khi a, b là `int` lớn",
        ],
        requirements=[
            "Biết viết và biên dịch chương trình C++ đơn giản (Hello World, đọc số)",
            "Quen với vòng lặp `for/while`, mệnh đề `if/else`, hàm có tham số",
        ],
        studyMethod=[
            "Tự gõ lại template I/O 5 lần trước khi tra cứu",
            "Trước khi code bài, viết Big-O ra giấy → quyết định thuật toán",
            "Làm 5 bài CSES Introductory không xem solution; nếu sai → tự tìm bug",
            "Đối chiếu `n` trong ràng buộc với bảng tham chiếu O(n²)/O(n log n)/O(n)",
        ],
        theoryFull=(
            "## Fast I/O — chuẩn HSG VN\n\n"
            "Mọi chương trình HSG C++ nên bắt đầu bằng:\n\n"
            "```cpp\nios_base::sync_with_stdio(false);\ncin.tie(nullptr);\n```\n\n"
            "Hai dòng này tắt đồng bộ giữa `cin/cout` và `scanf/printf`, giúp `cin/cout` "
            "chạy nhanh gần bằng `scanf/printf`. Sau đó, với đề HSG có file I/O:\n\n"
            "```cpp\nfreopen(\"BAI.INP\", \"r\", stdin);\nfreopen(\"BAI.OUT\", \"w\", stdout);\n```\n\n"
            "Sai tên file (kể cả viết hoa/thường khác đề) = 0 điểm — đề luôn nêu rõ tên file.\n\n"
            "## Big-O: bảng đối chiếu thực tế\n\n"
            "Trên máy chấm Themis/VNOJ (~10⁸ phép/giây cho C++ tối ưu), với giới hạn 1 giây:\n\n"
            "| n | Thuật toán tối đa cho phép |\n"
            "|---|---|\n"
            "| ≤ 10 | O(n!) — duyệt mọi hoán vị |\n"
            "| ≤ 20 | O(2ⁿ × n) — bitmask DP |\n"
            "| ≤ 500 | O(n³) — Floyd-Warshall, DP đoạn |\n"
            "| ≤ 5·10³ | O(n²) — knapsack, sort thường |\n"
            "| ≤ 10⁵ | O(n log n) — sort, segment tree, BIT |\n"
            "| ≤ 10⁶ | O(n) — prefix sum, two pointers, sàng |\n"
            "| ≤ 10⁸ | O(n) cực gọn (đọc/in nhanh, ít cấp phát) |\n\n"
            "## Tràn số\n\n"
            "Nguyên tắc vàng: nếu kết quả có thể > 2·10⁹ thì dùng `long long`. Khi nhân hai "
            "`int`, ép kiểu trước: `(long long)a * b`. `__int128` chỉ dùng khi thật sự cần "
            "(modular arithmetic với số rất lớn, ít dùng ở lớp 9).\n\n"
            "## Nguồn tham khảo chính\n\n"
            "- VNOI Wiki — *Độ phức tạp tính toán*: <https://wiki.vnoi.info/algo/basic/computational-complexity>\n"
            "- USACO Guide Bronze — *Time Complexity*: <https://usaco.guide/bronze/time-comp>\n"
            "- CP-Algorithms — *Asymptotic complexity*: <https://cp-algorithms.com/algebra/big_o.html>\n"
        ),
        codeExample=(
            "#include <bits/stdc++.h>\n"
            "using namespace std;\n\n"
            "int main() {\n"
            "    ios_base::sync_with_stdio(false);\n"
            "    cin.tie(nullptr);\n"
            "    if (fopen(\"BAI.INP\", \"r\")) {\n"
            "        freopen(\"BAI.INP\", \"r\", stdin);\n"
            "        freopen(\"BAI.OUT\", \"w\", stdout);\n"
            "    }\n"
            "    int n; cin >> n;\n"
            "    long long sum = 0;\n"
            "    for (int i = 1, x; i <= n; ++i) {\n"
            "        cin >> x;\n"
            "        sum += x;  // sum is long long → safe\n"
            "    }\n"
            "    cout << sum << '\\n';\n"
            "    return 0;\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Weird Algorithm", "https://cses.fi/problemset/task/1068", "CSES", "easy"),
            R("CSES — Missing Number", "https://cses.fi/problemset/task/1083", "CSES", "easy"),
            R("CSES — Increasing Array", "https://cses.fi/problemset/task/1094", "CSES", "easy"),
            R("CSES — Repetitions", "https://cses.fi/problemset/task/1069", "CSES", "easy"),
            R("CSES — Number Spiral", "https://cses.fi/problemset/task/1071", "CSES", "easy"),
            R("CSES — Two Knights", "https://cses.fi/problemset/task/1072", "CSES", "easy"),
            R("CSES — Bit Strings", "https://cses.fi/problemset/task/1617", "CSES", "easy"),
            R("CSES — Trailing Zeros", "https://cses.fi/problemset/task/1618", "CSES", "easy"),
            R("CF 4A — Watermelon", "https://codeforces.com/problemset/problem/4/A", "Codeforces", "easy"),
            R("CF 71A — Way Too Long Words", "https://codeforces.com/problemset/problem/71/A", "Codeforces", "easy"),
            R("CF 50A — Domino piling", "https://codeforces.com/problemset/problem/50/A", "Codeforces", "easy"),
            R("CF 158A — Next Round", "https://codeforces.com/problemset/problem/158/A", "Codeforces", "easy"),
            R("AtCoder — ABC081A Placing Marbles", "https://atcoder.jp/contests/abs/tasks/abc081_a", "AtCoder", "easy"),
            R("AtCoder — ABC081B Shift Only", "https://atcoder.jp/contests/abs/tasks/abc081_b", "AtCoder", "easy"),
            R("HackerRank — Solve Me First", "https://www.hackerrank.com/challenges/solve-me-first/problem", "HackerRank", "easy"),
            R("LeetCode 1480 — Running Sum of 1d Array", "https://leetcode.com/problems/running-sum-of-1d-array/", "LeetCode", "easy"),
            R("VNOJ — TONGUOC1: Tổng ước số đơn giản", "https://oj.vnoi.info/problem/tonguoc1", "VNOJ", "easy"),
            R("USACO Guide — Time Complexity (problemset)", "https://usaco.guide/bronze/time-comp", "USACO", "easy"),
        ],
    )

    C["simulation"] = dict(
        objectives=[
            "Mô phỏng quá trình mô tả trong đề bằng vòng lặp cộng/trừ/đếm",
            "Quản lý chỉ số đếm, vị trí hiện tại, hướng di chuyển trong ma trận 4/8 hướng",
            "Xử lý ngày tháng: kiểm tra năm nhuận, đếm ngày giữa hai mốc",
            "Triển khai trò chơi turn-based / vòng bàn (Josephus, cờ tỉnh)",
            "Quản lý thời gian/hàng đợi: tick-by-tick simulation",
            "Tránh off-by-one bằng việc tự vẽ tay 3 bước đầu trên giấy",
        ],
        requirements=[
            "Vòng lặp `for/while`, mảng 1D, `if/else` nhiều nhánh",
            "Đã quen với fast I/O từ Day 1",
        ],
        studyMethod=[
            "Đọc đề 2 lần — viết ra `state` cần lưu (tất cả biến cần thiết để mô phỏng)",
            "Code song song với ví dụ mẫu: bước nào sai → sửa ngay đó",
            "Khi `n` lớn (10⁹), không brute force — tìm chu kỳ / công thức",
            "Sau khi AC, viết lại comment 1 dòng cho mỗi vòng for/while",
        ],
        theoryFull=(
            "## Khi nào bài là simulation?\n\n"
            "Bài simulation **mô tả từng bước** một quá trình (di chuyển, đổi trạng thái, "
            "đếm sự kiện) và **không yêu cầu observation/optimization**. Cứ làm đúng như đề "
            "nói là AC.\n\n"
            "## Khung mô phỏng chuẩn\n\n"
            "1. **Đọc state**: dữ liệu vào → biến trạng thái (vị trí, hướng, danh sách, đếm…).\n"
            "2. **Vòng lặp chính**: mỗi vòng = 1 đơn vị thời gian / 1 thao tác.\n"
            "3. **Cập nhật state**: tính state mới từ state cũ + input.\n"
            "4. **Kiểm tra dừng**: điều kiện kết thúc.\n"
            "5. **Xuất kết quả**.\n\n"
            "## Bẫy thường gặp\n\n"
            "- **Off-by-one**: viết tay 2-3 bước đầu để chốt chỉ số bắt đầu (0 hay 1).\n"
            "- **Overflow**: nếu mô phỏng đến 10⁹ bước → dùng `long long` cho counter.\n"
            "- **Chu kỳ**: nếu state có hạn (modular, vòng bàn), tìm chu kỳ thay vì lặp.\n"
            "- **Hướng di chuyển**: dùng mảng `dx[4]/dy[4]` thay vì 4 if.\n\n"
            "## Mẫu di chuyển trên lưới\n\n"
            "```cpp\nint dx[] = {-1, 0, 1, 0};\nint dy[] = {0, 1, 0, -1};\nfor (int d = 0; d < 4; ++d) {\n    int nx = x + dx[d], ny = y + dy[d];\n}\n```\n\n"
            "## Năm nhuận\n\n"
            "Năm `y` nhuận khi `(y % 4 == 0 && y % 100 != 0) || y % 400 == 0`. Tháng 2 có 29 ngày.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Mô phỏng*: <https://wiki.vnoi.info/algo/basic/simulation>\n"
            "- USACO Guide Bronze — *Simulation*: <https://usaco.guide/bronze/simulation>\n"
            "- CP-Algorithms — *Logical and bitwise operators* (cho simulation thao tác bit): <https://cp-algorithms.com/algebra/bit-manipulation.html>\n"
        ),
        codeExample=(
            "// Robot di chuyển trên lưới, xoay phải khi gặp tường\n"
            "int x = 0, y = 0, d = 0; // d: 0=up, 1=right, 2=down, 3=left\n"
            "int dx[] = {-1, 0, 1, 0}, dy[] = {0, 1, 0, -1};\n"
            "for (int step = 0; step < k; ++step) {\n"
            "    int nx = x + dx[d], ny = y + dy[d];\n"
            "    if (nx < 0 || nx >= n || ny < 0 || ny >= m) {\n"
            "        d = (d + 1) % 4;        // quay phải\n"
            "    } else {\n"
            "        x = nx; y = ny;\n"
            "    }\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Tower of Hanoi", "https://cses.fi/problemset/task/2165", "CSES", "easy"),
            R("CSES — Coin Piles", "https://cses.fi/problemset/task/1754", "CSES", "easy"),
            R("CSES — Palindrome Reorder", "https://cses.fi/problemset/task/1755", "CSES", "easy"),
            R("CSES — Gray Code", "https://cses.fi/problemset/task/2205", "CSES", "easy"),
            R("CSES — Mex Grid Construction", "https://cses.fi/problemset/task/3358", "CSES", "easy"),
            R("CSES — Knight Moves Grid", "https://cses.fi/problemset/task/3217", "CSES", "easy"),
            R("CF 580A — Kefa and First Steps", "https://codeforces.com/problemset/problem/580/A", "Codeforces", "easy"),
            R("CF 144A — Arrival of the General", "https://codeforces.com/problemset/problem/144/A", "Codeforces", "easy"),
            R("CF 467A — George and Accommodation", "https://codeforces.com/problemset/problem/467/A", "Codeforces", "easy"),
            R("CF 405A — Gravity Flip", "https://codeforces.com/problemset/problem/405/A", "Codeforces", "easy"),
            R("CF 791A — Bear and Big Brother", "https://codeforces.com/problemset/problem/791/A", "Codeforces", "easy"),
            R("AtCoder — ABC 086A Product", "https://atcoder.jp/contests/abc086/tasks/abc086_a", "AtCoder", "easy"),
            R("AtCoder — ABC 087B Coins", "https://atcoder.jp/contests/abs/tasks/abc087_b", "AtCoder", "easy"),
            R("AtCoder — ABC 081B Shift Only", "https://atcoder.jp/contests/abs/tasks/abc081_b", "AtCoder", "easy"),
            R("HackerRank — Time Conversion", "https://www.hackerrank.com/challenges/time-conversion/problem", "HackerRank", "easy"),
            R("HackerRank — Apple and Orange", "https://www.hackerrank.com/challenges/apple-and-orange/problem", "HackerRank", "easy"),
            R("LeetCode 657 — Robot Return to Origin", "https://leetcode.com/problems/robot-return-to-origin/", "LeetCode", "easy"),
            R("VNOJ — DEMSO: Đếm số đơn giản", "https://oj.vnoi.info/problem/demso", "VNOJ", "easy"),
        ],
    )

    C["array-1d"] = dict(
        objectives=[
            "Khai báo và truy cập mảng 1D, `vector<int>` với `n` cố định hoặc động",
            "Tính max/min/sum/đếm trên mảng trong một lần duyệt O(n)",
            "Tìm vị trí phần tử thỏa điều kiện (đầu tiên/cuối/lớn nhất/…)",
            "Cửa sổ trượt cố định size — duy trì tổng/min/max khi trượt",
            "Đếm tần số bằng mảng `cnt[]` khi giá trị ≤ 10⁶",
            "Tổng tiền tố để trả lời truy vấn `[l, r]` O(1)",
        ],
        requirements=[
            "Vòng lặp + chỉ số 0/1-based",
            "Biết khi nào dùng `int` vs `long long` cho biến sum",
        ],
        studyMethod=[
            "Ghi nhớ template: đọc mảng, in mảng, đổi chỗ 2 phần tử",
            "Khi đụng truy vấn `[l, r]`, nghĩ ngay đến prefix sum",
            "Bài hỏi 'đoạn con dài k' → cửa sổ trượt cố định",
            "Bài giá trị bounded → mảng đếm tần số thay vì map",
        ],
        theoryFull=(
            "## Mảng 1D — công cụ nền tảng\n\n"
            "Mảng (`int a[N+5]`) hay `vector<int> a(n)` lưu n số liên tiếp. Truy cập "
            "`a[i]` mất O(1). Đây là cấu trúc cơ bản nhất nhưng nhiều biến thể tối ưu trên "
            "nó (prefix sum, cửa sổ trượt, two pointers) sẽ là nền cho cả lộ trình.\n\n"
            "## Bốn pattern phải thuộc\n\n"
            "**1. Duyệt-tổng-hợp** (max/min/sum/count):\n\n"
            "```cpp\nlong long sum = 0;\nint mx = INT_MIN;\nfor (int i = 0; i < n; ++i) {\n    sum += a[i];\n    mx = max(mx, a[i]);\n}\n```\n\n"
            "**2. Tổng tiền tố**: `pref[i] = a[0] + ... + a[i-1]`. Tổng `[l, r]` = `pref[r+1] - pref[l]`.\n\n"
            "**3. Cửa sổ trượt cố định size `k`**:\n\n"
            "```cpp\nlong long cur = 0;\nfor (int i = 0; i < k; ++i) cur += a[i];\nlong long best = cur;\nfor (int i = k; i < n; ++i) {\n    cur += a[i] - a[i-k];\n    best = max(best, cur);\n}\n```\n\n"
            "**4. Đếm tần số** (giá trị bị chặn V ≤ 10⁶):\n\n"
            "```cpp\nvector<int> cnt(V + 1, 0);\nfor (int x : a) ++cnt[x];\n```\n\n"
            "## Bẫy thường gặp\n\n"
            "- `INT_MIN/INT_MAX` không khởi tạo từ mảng — gán trước.\n"
            "- Đọc `n` rồi cấp `vector<int>(n)` — đừng dùng `a[n]` ngoài giới hạn.\n"
            "- Tổng có thể tràn → dùng `long long`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Mảng và phép cơ bản*: <https://wiki.vnoi.info/algo/data-structures/array>\n"
            "- USACO Guide Bronze — *Intro to Arrays*: <https://usaco.guide/bronze/intro-ds>\n"
            "- CP-Algorithms — *Sliding window minimum*: <https://cp-algorithms.com/data_structures/stack_queue_modification.html>\n"
        ),
        codeExample=(
            "// Cửa sổ trượt size k, tìm tổng lớn nhất\n"
            "int n, k; cin >> n >> k;\n"
            "vector<long long> a(n);\n"
            "for (auto &x : a) cin >> x;\n"
            "long long cur = 0;\n"
            "for (int i = 0; i < k; ++i) cur += a[i];\n"
            "long long best = cur;\n"
            "for (int i = k; i < n; ++i) {\n"
            "    cur += a[i] - a[i - k];\n"
            "    best = max(best, cur);\n"
            "}\n"
            "cout << best << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Distinct Numbers", "https://cses.fi/problemset/task/1621", "CSES", "easy"),
            R("CSES — Apartments", "https://cses.fi/problemset/task/1084", "CSES", "easy"),
            R("CSES — Concert Tickets", "https://cses.fi/problemset/task/1091", "CSES", "easy"),
            R("CSES — Maximum Subarray Sum", "https://cses.fi/problemset/task/1643", "CSES", "easy"),
            R("CSES — Stick Lengths", "https://cses.fi/problemset/task/1074", "CSES", "easy"),
            R("CSES — Playlist", "https://cses.fi/problemset/task/1141", "CSES", "easy"),
            R("CSES — Restaurant Customers", "https://cses.fi/problemset/task/1619", "CSES", "easy"),
            R("CF 339A — Helpful Maths", "https://codeforces.com/problemset/problem/339/A", "Codeforces", "easy"),
            R("CF 1352B — Same Parity Summands", "https://codeforces.com/problemset/problem/1352/B", "Codeforces", "easy"),
            R("CF 1352D — Alice, Bob and Candies", "https://codeforces.com/problemset/problem/1352/D", "Codeforces", "medium"),
            R("CF 32B — Borze", "https://codeforces.com/problemset/problem/32/B", "Codeforces", "easy"),
            R("AtCoder — ABC 088B Card Game for Two", "https://atcoder.jp/contests/abc088/tasks/abc088_b", "AtCoder", "easy"),
            R("AtCoder — ABC 098B Cut and Count", "https://atcoder.jp/contests/abc098/tasks/abc098_b", "AtCoder", "easy"),
            R("HackerRank — Diagonal Difference", "https://www.hackerrank.com/challenges/diagonal-difference/problem", "HackerRank", "easy"),
            R("HackerRank — Array Manipulation", "https://www.hackerrank.com/challenges/crush/problem", "HackerRank", "medium"),
            R("LeetCode 53 — Maximum Subarray", "https://leetcode.com/problems/maximum-subarray/", "LeetCode", "easy"),
            R("LeetCode 121 — Best Time to Buy and Sell Stock", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "LeetCode", "easy"),
            R("VNOJ — DAYSO: Dãy số đơn giản", "https://oj.vnoi.info/problem/dayso", "VNOJ", "easy"),
        ],
    )

    C["array-2d"] = dict(
        objectives=[
            "Khai báo mảng 2D `int a[N][M]` và `vector<vector<int>>`",
            "Duyệt theo dòng, theo cột, theo 2 đường chéo `i+j = const`, `i-j = const`",
            "Tổng tiền tố 2D — tính tổng vùng `[r1..r2][c1..c2]` trong O(1)",
            "Mảng hiệu 2D — cập nhật vùng O(1), tính giá trị cuối O(n·m)",
            "Floodfill cơ bản: tô vùng liên thông bằng BFS hoặc đệ quy",
            "Tính diện tích/chu vi vùng theo đếm ô",
        ],
        requirements=[
            "Mảng 1D + tổng tiền tố từ Day 3",
            "Hiểu vòng for lồng",
        ],
        studyMethod=[
            "Vẽ tay matrix 4×4 ra giấy, đánh `i+j` và `i-j` để thấy đường chéo",
            "Lập công thức prefix 2D bằng inclusion-exclusion trên giấy trước",
            "Bài cập nhật vùng + truy vấn vùng → mảng hiệu + prefix sum",
            "Floodfill kích cỡ vừa 10³×10³ → vẫn BFS được, an toàn về stack",
        ],
        theoryFull=(
            "## Mảng 2D\n\n"
            "Bài 2D thường liên quan đến: lưới, ảnh nhị phân, bản đồ. Hai pattern lớn nhất "
            "là **prefix sum 2D** và **floodfill BFS/DFS**.\n\n"
            "## Prefix sum 2D\n\n"
            "Với mảng `a[i][j]`:\n\n"
            "```cpp\np[i+1][j+1] = p[i][j+1] + p[i+1][j] - p[i][j] + a[i][j];\n```\n\n"
            "Tổng vùng `[r1..r2][c1..c2]` (inclusive):\n\n"
            "```cpp\nlong long S = p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1];\n```\n\n"
            "Công thức bao hàm-loại trừ (PIE) trên 2 chiều.\n\n"
            "## Mảng hiệu 2D (cập nhật vùng)\n\n"
            "Để cộng `v` vào toàn bộ ô trong vùng `[r1..r2][c1..c2]`:\n\n"
            "```cpp\nd[r1][c1]   += v;\nd[r1][c2+1] -= v;\nd[r2+1][c1] -= v;\nd[r2+1][c2+1] += v;\n```\n\n"
            "Sau khi cập nhật xong, lấy prefix sum 2D của `d` để có giá trị cuối.\n\n"
            "## Floodfill\n\n"
            "Tô vùng liên thông 4 hướng:\n\n"
            "```cpp\nqueue<pair<int,int>> q; q.push({r, c}); visited[r][c] = true;\nint dx[] = {-1, 0, 1, 0}, dy[] = {0, 1, 0, -1};\nwhile (!q.empty()) {\n    auto [x, y] = q.front(); q.pop();\n    for (int d = 0; d < 4; ++d) {\n        int nx = x + dx[d], ny = y + dy[d];\n        if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;\n        if (visited[nx][ny] || grid[nx][ny] != target) continue;\n        visited[nx][ny] = true;\n        q.push({nx, ny});\n    }\n}\n```\n\n"
            "Stack DFS đệ quy có thể tràn với `n·m = 10⁶`, BFS an toàn hơn.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Prefix sum 2D & mảng hiệu*: <https://wiki.vnoi.info/algo/data-structures/prefix-sum-and-difference-array>\n"
            "- USACO Guide Silver — *More Prefix Sums*: <https://usaco.guide/silver/more-prefix-sums>\n"
            "- CP-Algorithms — *Prefix sums and difference arrays*: <https://cp-algorithms.com/data_structures/sqrt_decomposition.html>\n"
            "- GeeksforGeeks — *Floodfill algorithm*: <https://www.geeksforgeeks.org/flood-fill-algorithm/>\n"
        ),
        codeExample=(
            "// 2D prefix sum: tổng vùng (r1..r2, c1..c2) trong O(1)\n"
            "int n, m; cin >> n >> m;\n"
            "vector<vector<long long>> a(n+1, vector<long long>(m+1, 0)), p(n+2, vector<long long>(m+2, 0));\n"
            "for (int i = 1; i <= n; ++i)\n"
            "    for (int j = 1; j <= m; ++j) cin >> a[i][j];\n"
            "for (int i = 1; i <= n; ++i)\n"
            "    for (int j = 1; j <= m; ++j)\n"
            "        p[i][j] = p[i-1][j] + p[i][j-1] - p[i-1][j-1] + a[i][j];\n"
            "int q; cin >> q;\n"
            "while (q--) {\n"
            "    int r1, c1, r2, c2; cin >> r1 >> c1 >> r2 >> c2;\n"
            "    cout << p[r2][c2] - p[r1-1][c2] - p[r2][c1-1] + p[r1-1][c1-1] << '\\n';\n"
            "}\n"
        ),
        referenceProblems=[
            R("CSES — Forest Queries", "https://cses.fi/problemset/task/1652", "CSES", "easy"),
            R("CSES — Counting Rooms", "https://cses.fi/problemset/task/1192", "CSES", "easy"),
            R("CSES — Labyrinth", "https://cses.fi/problemset/task/1193", "CSES", "easy"),
            R("CSES — Building Roads", "https://cses.fi/problemset/task/1666", "CSES", "easy"),
            R("CSES — Grid Paths (DP)", "https://cses.fi/problemset/task/1638", "CSES", "easy"),
            R("CSES — Sub-matrix Sum Queries", "https://cses.fi/problemset/task/3221", "CSES", "easy"),
            R("CF 1015C — Songs Compression", "https://codeforces.com/problemset/problem/1015/C", "Codeforces", "medium"),
            R("CF 1003D — Coins and Queries", "https://codeforces.com/problemset/problem/1003/D", "Codeforces", "medium"),
            R("CF 433B — Kuriyama Mirai's Stones", "https://codeforces.com/problemset/problem/433/B", "Codeforces", "easy"),
            R("AtCoder — ABC 005C Train", "https://atcoder.jp/contests/abc005/tasks/abc005_3", "AtCoder", "medium"),
            R("AtCoder — Educational DP H Grid 1", "https://atcoder.jp/contests/dp/tasks/dp_h", "AtCoder", "medium"),
            R("HackerRank — Larry's Array", "https://www.hackerrank.com/challenges/larrys-array/problem", "HackerRank", "medium"),
            R("HackerRank — Flipping the Matrix", "https://www.hackerrank.com/challenges/flipping-the-matrix/problem", "HackerRank", "medium"),
            R("LeetCode 200 — Number of Islands", "https://leetcode.com/problems/number-of-islands/", "LeetCode", "medium"),
            R("LeetCode 304 — Range Sum Query 2D - Immutable", "https://leetcode.com/problems/range-sum-query-2d-immutable/", "LeetCode", "medium"),
            R("LeetCode 542 — 01 Matrix", "https://leetcode.com/problems/01-matrix/", "LeetCode", "medium"),
            R("VNOJ — TONGHCN: Tổng theo hàng/cột", "https://oj.vnoi.info/problem/tonghcn", "VNOJ", "easy"),
            R("VNOJ — HCN: Hình chữ nhật nhỏ nhất", "https://oj.vnoi.info/problem/hcn", "VNOJ", "easy"),
        ],
    )

    C["string-basic"] = dict(
        objectives=[
            "Đọc/in `string` với `cin >> s` (1 từ) vs `getline(cin, s)` (cả dòng)",
            "Đảo, so sánh, nối, cắt xâu (`substr`, `find`, `replace`)",
            "Đếm tần số ký tự với mảng `cnt[26]` hoặc `cnt[256]`",
            "Kiểm tra anagram, palindrome — không dùng cấu trúc nâng cao",
            "Tách xâu theo dấu phân cách bằng `stringstream`",
            "Chuyển string ↔ số với `stoi/stoll/to_string`",
        ],
        requirements=[
            "Mảng 1D, vòng lặp",
            "Đã quen với `cin/cout` từ Day 1",
        ],
        studyMethod=[
            "Học thuộc 5 method: `size/length`, `substr`, `find`, `replace`, `compare`",
            "Khi đề có khoảng trắng trong xâu → ngay `getline` thay vì `>>`",
            "Mảng tần số 26 ký tự là vũ khí chính của bài lớp 9",
            "Bài hỏi 'có thể tạo thành?' (anagram) → so sánh tần số",
        ],
        theoryFull=(
            "## `string` trong C++\n\n"
            "`std::string` là dạng tự thay đổi kích cỡ. Các thao tác chính: `s.size()`, "
            "`s[i]`, `s += ...`, `s.substr(l, len)`, `s.find(sub)`, `s.replace(pos, len, new)`, "
            "`s.compare(t)`. Tất cả đều O(n).\n\n"
            "## Đọc xâu đúng cách\n\n"
            "- `cin >> s` đọc đến **whitespace** đầu tiên (1 từ).\n"
            "- `getline(cin, s)` đọc **cả dòng**. Nếu trước đó dùng `cin >> n`, phải "
            "  `cin.ignore()` để bỏ `\\n` còn lại trong buffer.\n\n"
            "## Mảng tần số ký tự — vũ khí #1 lớp 9\n\n"
            "```cpp\nint cnt[26] = {0};\nfor (char c : s) ++cnt[c - 'a'];\n```\n\n"
            "Dùng để: kiểm tra anagram (`cntA == cntB`), tìm ký tự xuất hiện nhiều nhất, "
            "đếm chữ cái khác nhau.\n\n"
            "## Palindrome — 2 con trỏ\n\n"
            "```cpp\nbool isPalin = true;\nfor (int i = 0, j = (int)s.size() - 1; i < j; ++i, --j)\n    if (s[i] != s[j]) { isPalin = false; break; }\n```\n\n"
            "## Tách xâu (`split`) bằng `stringstream`\n\n"
            "```cpp\nstringstream ss(s);\nstring tok;\nwhile (ss >> tok) {\n    // tok = 1 token tách bằng whitespace\n}\n```\n\n"
            "Tách theo dấu khác (vd `,`):\n\n"
            "```cpp\nwhile (getline(ss, tok, ',')) { ... }\n```\n\n"
            "## Chuyển string ↔ số\n\n"
            "- `int n = stoi(s);` — string → int\n"
            "- `long long x = stoll(s);` — string → long long\n"
            "- `string s = to_string(n);` — số → string\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Xâu ký tự cơ bản*: <https://wiki.vnoi.info/algo/string/basic>\n"
            "- USACO Guide Bronze — *Intro to Strings*: <https://usaco.guide/bronze/intro-strings>\n"
            "- CP-Algorithms — *String algorithms (overview)*: <https://cp-algorithms.com/string/string-hashing.html>\n"
            "- cppreference — *std::string*: <https://en.cppreference.com/w/cpp/string/basic_string>\n"
        ),
        codeExample=(
            "// Kiểm tra hai xâu có là anagram\n"
            "string a, b; cin >> a >> b;\n"
            "if (a.size() != b.size()) { cout << \"NO\\n\"; return 0; }\n"
            "int cntA[26] = {0}, cntB[26] = {0};\n"
            "for (char c : a) ++cntA[c - 'a'];\n"
            "for (char c : b) ++cntB[c - 'a'];\n"
            "bool ok = true;\n"
            "for (int i = 0; i < 26; ++i)\n"
            "    if (cntA[i] != cntB[i]) { ok = false; break; }\n"
            "cout << (ok ? \"YES\" : \"NO\") << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Repetitions", "https://cses.fi/problemset/task/1069", "CSES", "easy"),
            R("CSES — Creating Strings I", "https://cses.fi/problemset/task/1622", "CSES", "easy"),
            R("CSES — Palindrome Reorder", "https://cses.fi/problemset/task/1755", "CSES", "easy"),
            R("CSES — Word Combinations", "https://cses.fi/problemset/task/1731", "CSES", "medium"),
            R("CSES — Distinct Substrings", "https://cses.fi/problemset/task/2102", "CSES", "medium"),
            R("CF 4C — Registration System", "https://codeforces.com/problemset/problem/4/C", "Codeforces", "easy"),
            R("CF 96A — Football", "https://codeforces.com/problemset/problem/96/A", "Codeforces", "easy"),
            R("CF 118A — String Task", "https://codeforces.com/problemset/problem/118/A", "Codeforces", "easy"),
            R("CF 122A — Lucky Division", "https://codeforces.com/problemset/problem/122/A", "Codeforces", "easy"),
            R("CF 705A — Hulk", "https://codeforces.com/problemset/problem/705/A", "Codeforces", "easy"),
            R("AtCoder — ABC 049C 白昼夢", "https://atcoder.jp/contests/abs/tasks/arc065_a", "AtCoder", "easy"),
            R("AtCoder — ABC 064B Divisible Substring", "https://atcoder.jp/contests/abc064/tasks/abc064_b", "AtCoder", "easy"),
            R("HackerRank — Pangrams", "https://www.hackerrank.com/challenges/pangrams/problem", "HackerRank", "easy"),
            R("HackerRank — Anagram", "https://www.hackerrank.com/challenges/anagram/problem", "HackerRank", "easy"),
            R("HackerRank — Sherlock and the Valid String", "https://www.hackerrank.com/challenges/sherlock-and-valid-string/problem", "HackerRank", "medium"),
            R("LeetCode 125 — Valid Palindrome", "https://leetcode.com/problems/valid-palindrome/", "LeetCode", "easy"),
            R("LeetCode 242 — Valid Anagram", "https://leetcode.com/problems/valid-anagram/", "LeetCode", "easy"),
            R("VNOJ — STRPALIN: Xâu đối xứng", "https://oj.vnoi.info/problem/strpalin", "VNOJ", "easy"),
        ],
    )

    C["sort"] = dict(
        objectives=[
            "Gọi `std::sort` với comparator lambda; sắp giảm dần; sắp theo nhiều khóa",
            "Phân biệt `sort` (O(n log n)) vs `stable_sort` (giữ thứ tự bằng nhau)",
            "`nth_element` để tìm phần tử thứ k nhanh O(n)",
            "Quan sát: sau khi sắp xếp, các phần tử bằng nhau đứng cạnh nhau → đếm nhóm",
            "Sắp xếp theo cặp `(a, b)` với khóa lexicographic",
            "Counting sort O(n + V) khi V nhỏ",
        ],
        requirements=[
            "Mảng 1D, `vector` từ Day 3",
            "Hàm và lambda C++ cơ bản",
        ],
        studyMethod=[
            "Học thuộc 3 form sort: tăng, giảm, custom",
            "Khi đề có 'sắp theo X giảm dần, X bằng nhau thì Y tăng' → comparator 2 khóa",
            "Quan sát: sau sort, max/min ở 2 đầu, các cặp gần nhau dễ so sánh",
            "Counting sort cực nhanh khi V ≤ 10⁶, không cần n log n",
        ],
        theoryFull=(
            "## `std::sort` — sắp tăng dần\n\n"
            "```cpp\nsort(a.begin(), a.end());\n```\n\n"
            "O(n log n) average, in-place. Không stable (thứ tự các phần tử bằng nhau có thể "
            "thay đổi). Nếu cần stable, dùng `stable_sort` (O(n log² n)).\n\n"
            "## Sắp giảm dần\n\n"
            "```cpp\nsort(a.begin(), a.end(), greater<int>());\n```\n\n"
            "## Comparator lambda — sắp theo nhiều khóa\n\n"
            "```cpp\nsort(v.begin(), v.end(), [](const pair<int,int>& a, const pair<int,int>& b) {\n    if (a.first != b.first) return a.first < b.first;\n    return a.second > b.second;\n});\n```\n\n"
            "## `nth_element` — tìm thứ k O(n)\n\n"
            "Khi chỉ cần phần tử lớn thứ k mà không cần sort toàn bộ:\n\n"
            "```cpp\nnth_element(a.begin(), a.begin() + k, a.end());\n// a[k] giờ là phần tử thứ k (0-indexed) khi sắp tăng\n```\n\n"
            "## Counting sort — sắp số bị chặn O(n + V)\n\n"
            "Khi giá trị trong [0, V] với V ≤ 10⁶:\n\n"
            "```cpp\nvector<int> cnt(V + 1, 0);\nfor (int x : a) ++cnt[x];\nint i = 0;\nfor (int v = 0; v <= V; ++v)\n    while (cnt[v]--) a[i++] = v;\n```\n\n"
            "## Tư duy 'sau khi sắp'\n\n"
            "Rất nhiều bài chỉ cần observation: \"nếu sắp lại, mọi cặp tốt nhất nằm cạnh nhau\".\n"
            "Pattern điển hình: \"chia n học sinh thành cặp sao cho tổng chênh nhỏ nhất\" — sort "
            "rồi ghép `(0,1), (2,3), ...`.\n\n"
            "## Nguồn tham khảo\n\n"
            "- VNOI Wiki — *Sắp xếp*: <https://wiki.vnoi.info/algo/basic/sort>\n"
            "- USACO Guide Bronze — *Sorting*: <https://usaco.guide/bronze/sorting-custom>\n"
            "- CP-Algorithms — *Sortings*: <https://cp-algorithms.com/sequences/longest_increasing_subsequence.html>\n"
            "- cppreference — *std::sort*: <https://en.cppreference.com/w/cpp/algorithm/sort>\n"
        ),
        codeExample=(
            "// Sort theo điểm giảm dần, điểm bằng thì tên tăng dần\n"
            "struct Student { string name; int score; };\n"
            "vector<Student> a(n);\n"
            "for (auto &s : a) cin >> s.name >> s.score;\n"
            "sort(a.begin(), a.end(), [](const Student& x, const Student& y) {\n"
            "    if (x.score != y.score) return x.score > y.score;\n"
            "    return x.name < y.name;\n"
            "});\n"
            "for (auto &s : a) cout << s.name << ' ' << s.score << '\\n';\n"
        ),
        referenceProblems=[
            R("CSES — Ferris Wheel", "https://cses.fi/problemset/task/1090", "CSES", "easy"),
            R("CSES — Restaurant Customers", "https://cses.fi/problemset/task/1619", "CSES", "easy"),
            R("CSES — Movie Festival", "https://cses.fi/problemset/task/1629", "CSES", "easy"),
            R("CSES — Towers", "https://cses.fi/problemset/task/1073", "CSES", "easy"),
            R("CSES — Reading Books", "https://cses.fi/problemset/task/1631", "CSES", "easy"),
            R("CSES — Tasks and Deadlines", "https://cses.fi/problemset/task/1630", "CSES", "medium"),
            R("CSES — Collecting Numbers", "https://cses.fi/problemset/task/2216", "CSES", "easy"),
            R("CF 1037B — Reach Median", "https://codeforces.com/problemset/problem/1037/B", "Codeforces", "medium"),
            R("CF 466A — Cheap Travel", "https://codeforces.com/problemset/problem/466/A", "Codeforces", "easy"),
            R("CF 977B — Two-gram", "https://codeforces.com/problemset/problem/977/B", "Codeforces", "easy"),
            R("CF 230B — T-primes", "https://codeforces.com/problemset/problem/230/B", "Codeforces", "easy"),
            R("AtCoder — ABC 074B Symmetric Grid", "https://atcoder.jp/contests/abc074/tasks/abc074_b", "AtCoder", "easy"),
            R("AtCoder — ABC 088C Takahashi's Information", "https://atcoder.jp/contests/abc088/tasks/abc088_c", "AtCoder", "easy"),
            R("HackerRank — Sorting: Bubble Sort", "https://www.hackerrank.com/challenges/ctci-bubble-sort/problem", "HackerRank", "easy"),
            R("HackerRank — Closest Numbers", "https://www.hackerrank.com/challenges/closest-numbers/problem", "HackerRank", "easy"),
            R("LeetCode 56 — Merge Intervals", "https://leetcode.com/problems/merge-intervals/", "LeetCode", "medium"),
            R("LeetCode 215 — Kth Largest Element", "https://leetcode.com/problems/kth-largest-element-in-an-array/", "LeetCode", "medium"),
            R("VNOJ — SORT: Sắp xếp cơ bản", "https://oj.vnoi.info/problem/sort", "VNOJ", "easy"),
        ],
    )

    C["week1-review"] = dict(
        objectives=[
            "Tổng hợp 6 chuyên đề: I/O, complexity, simulation, array 1D/2D, string, sort",
            "Thi thử 90 phút với 3 bài: 1 simulation, 1 array/prefix, 1 string/sort",
            "Phân tích lại tất cả lỗi sau khi nộp — không bỏ qua lỗi 'lỗi cẩu thả'",
            "So sánh thời gian giải với mục tiêu (30/30/30 phút)",
            "Lập danh sách 5 lỗi hay mắc và cách phòng tránh cho tuần 2",
        ],
        requirements=[
            "Đã hoàn thành Day 1..6 ở mức 70% mỗi node",
        ],
        studyMethod=[
            "Chia 90 phút thành 3 phiên 30 phút, 1 phiên/bài, không liếc lời giải",
            "Sau giờ thi, code lại bài fail từ đầu — không copy code đáp án",
            "Ghi log: bài nào tự giải được, bài nào cần hint, bài nào không nghĩ ra cách",
            "Đặt mục tiêu tuần 2 dựa trên kết quả mock — ưu tiên nhánh yếu nhất",
        ],
        theoryFull=(
            "## Mock Tuần 1 — định dạng HSG VN\n\n"
            "Phiên thi 90 phút, 3 bài. Tên file `BAI1.CPP/BAI1.INP/BAI1.OUT`, etc. Đề ra mỗi bài:\n\n"
            "1. **BAI1 — Simulation** (3 điểm): mô phỏng hệ thống đơn giản, n ≤ 10⁵.\n"
            "2. **BAI2 — Array + Prefix Sum** (3 điểm): xử lý dãy, q truy vấn `[l, r]`.\n"
            "3. **BAI3 — String** (4 điểm): xử lý xâu + sort/đếm.\n\n"
            "## Phương pháp khi gặp bài\n\n"
            "1. Đọc đề 2 lần. Tóm tắt INPUT/OUTPUT trên giấy.\n"
            "2. Ước lượng n → chọn O(?) trước khi code.\n"
            "3. Code đúng template I/O (`freopen` + fast I/O).\n"
            "4. Test với input mẫu — debug ngay nếu fail.\n"
            "5. Submit, đọc kết quả. Nếu WA/TLE → suy luận lý do, không đoán bừa.\n\n"
            "## Sau khi thi\n\n"
            "Viết log:\n\n"
            "- Bài nào AC? Mất bao nhiêu phút? Có lỗi gì giữa các submit?\n"
            "- Bài nào fail? Lý do (sai đề, sai thuật, sai code)?\n"
            "- 3 lỗi nhỏ tái diễn ở nhiều bài (off-by-one, không reset state, không clear input)?\n\n"
            "## Nguồn ôn thi\n\n"
            "- VNOI — *Đề HSG các tỉnh*: <https://oj.vnoi.info/contest/>\n"
            "- ChuyenTin.pro — *Tổng hợp đề HSG TP HCM, Hà Nội, các tỉnh*: <https://chuyentin.pro/>\n"
            "- USACO Guide Bronze — *Practice Roundup*: <https://usaco.guide/bronze>\n"
        ),
        codeExample=(
            "// Template đề HSG VN — copy 1 lần, dùng cả 3 bài\n"
            "#include <bits/stdc++.h>\n"
            "using namespace std;\n\n"
            "int main() {\n"
            "    ios_base::sync_with_stdio(false);\n"
            "    cin.tie(nullptr);\n"
            "    if (fopen(\"BAI.INP\", \"r\")) {\n"
            "        freopen(\"BAI.INP\", \"r\", stdin);\n"
            "        freopen(\"BAI.OUT\", \"w\", stdout);\n"
            "    }\n"
            "    // ----- code here -----\n"
            "    return 0;\n"
            "}\n"
        ),
        referenceProblems=[
            R("VNOJ — Đề ôn HSG (contest list)", "https://oj.vnoi.info/contests/", "VNOJ", "medium"),
            R("Chuyentin.pro — Đề HSG TP HCM 2023-24", "https://chuyentin.pro/2024/01/de-hsg-tp-hcm.html", "VNOJ", "medium"),
            R("Chuyentin.pro — Đề HSG Hà Nội 2024", "https://chuyentin.pro/2025/01/e-thi-hoc-sinh-gioi-thanh-pho-ha-noi_17.html", "VNOJ", "medium"),
            R("CSES — Sorting and Searching set", "https://cses.fi/problemset/list/", "CSES", "easy"),
            R("USACO Guide — Bronze Roundup", "https://usaco.guide/bronze", "USACO", "easy"),
        ],
    )

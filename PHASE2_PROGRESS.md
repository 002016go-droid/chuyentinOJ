# ChuyenTinOJ Phase 2 – Progress & Resume Plan

Branch: `devin/1779078569-phase2-content-expansion`
Last updated: 2026-05-18

Phase 2 mở rộng nội dung lớn theo `ChuyenTinOJ_Phase2_Prompt.md`:
- Schema v3 + types (Problem v2, Topic v2)
- 127 techniques + 24 advanced topics
- 30-day roadmap đầy đủ
- 900+ bài tập (đang sinh dần)
- Trang `/techniques`, `/sources`, profile/settings nâng cấp
- Cập nhật `problemLoader`, build & push `docs/`

Sinh đề dùng framework Node tại `/home/ubuntu/gen/problems/` (đã commit ngoài repo).
Mỗi topic có `topic-*.js`; `run-batch.js` ghép kết quả vào `public/data/problems/` và
attach vào `public/data/roadmap.json`.

## Đã làm (commit đã có trên branch)

- Commit 1 — Schema upgrade (`src/lib/db.ts` v3, `src/lib/types.ts` Problem v2)
- Commit 2a — `public/data/techniques.json` (127 entries, nhóm B1–B14)
- Commit 2b — `public/data/advanced-topics.json` (24 chủ đề, nhóm A–E)
- Commit 3 — Rewrite `public/data/roadmap.json` (30 nodes, Days 1–30)
- Commit 4 — io-complexity (8) + simulation (10) + array-1d (10) = 28 bài
- Commit 5 — array-2d (10) + string-basic (10) + sort (10) = 30 bài
- Commit 6 — greedy (10) + two-pointers (10) + prefix-sum (10) + binary-search (10) = 40 bài
- Commit 7 — parametric (6) + recursion (10) + MITM (6) + STL (10) = 32 bài
- Commit 8 — monotonic-stack (5) + monotonic-deque (5) + DSU (5) = 15 bài

Tổng bài đến hiện tại: **145** (mục tiêu 900+).

## Còn lại (cần làm tiếp ở session sau)

### Sinh nội dung bài tập
- [ ] Commit 9 — graph-bfs / graph-dfs / shortest-path (52 bài)
- [ ] Commit 10 — dp-intro / dp-knapsack / dp-lis-lcs (66 bài)
- [ ] Commit 11 — dp-grid / number-theory / sieve / hash / tree (75 bài)
- [ ] Commit 12 — mock exams (T1×8, T2×8, T3×4) + advanced-topics 9 bài (~153 bài)
  - Mock exam path khuyên: thư mục riêng `public/data/mock/<slug>.json`, mỗi đề 4 bài.

### UI mới
- [ ] Commit 13 — Trang `/techniques`: list + filter (B1..B14) + search + import progress.
- [ ] Commit 14 — Trang `/sources`: 3 tab (đề thi tỉnh / Bộ / quốc tế), 30+ entries, 8 tài liệu PDF/link.
- [ ] Commit 15 — Profile page: skill bars (S1..S4), tier progress (T1..T4), badges techniques nắm vững.
- [ ] Commit 16 — Settings page: Judge0 host + token + lang map, lưu localStorage.

### Tích hợp & ship
- [ ] Commit 17 — `src/lib/problemLoader.ts`: load advanced-topics + techniques + cache.
- [ ] Commit 18 — `npm run lint && npm run build`, push thư mục `docs/` cho GitHub Pages.
- [ ] Verify 3 bài random từ mỗi commit bài tập theo checklist (≥150 chữ, 3 subtasks, ≥2 samples, ≥20 tests, hint mỗi subtask, editorial, fileIO đúng, tier/skills/topicId hợp lệ).
- [ ] Tạo / cập nhật PR (branch hiện tại đã push).
- [ ] Đợi CI, fix nếu fail.
- [ ] Smoke test local `npm run dev`.
- [ ] Cập nhật blueprint môi trường.
- [ ] Báo cáo cuối + gợi ý test app.

## Cách tiếp tục ở session sau

1. Checkout đúng branch:
   ```bash
   cd /home/ubuntu/repos/chuyentinOJ
   git fetch origin
   git checkout devin/1779078569-phase2-content-expansion
   git pull --ff-only
   ```
2. Phục hồi framework sinh đề (ngoài repo) hoặc clone lại từ commit ghi chú này.
   Các file `gen/problems/*.js` từ session trước cần khôi phục: `base.js`, `lib-solvers.js`,
   `factory.js`, `run-batch.js`, và các `topic-*.js` đã sinh: io, simulation, array-1d/2d,
   string, sort, greedy, two-pointers, prefix-sum, binary-search, parametric, recursion,
   mitm, stl, monotonic-stack, monotonic-deque, dsu.
3. Tạo các `topic-*.js` tiếp theo theo thứ tự Commit 9 → 12, mỗi commit chạy:
   ```bash
   node /home/ubuntu/gen/problems/run-batch.js <topic1> <topic2> ...
   git add public/data/problems/ public/data/roadmap.json
   git commit -m "Commit N: <mô tả> (<count> problems)"
   ```
4. Sau hết commit nội dung, làm UI (Commit 13–16), tích hợp loader (Commit 17), build & push docs (Commit 18).
5. `git push` thường xuyên; tạo / cập nhật PR sau mỗi nhóm commit lớn.

## Ghi chú quan trọng

- Mỗi bài JSON phải đầy đủ: statement tiếng Việt ≥150 chữ, đúng 3 subtasks (30-30-40), ≥2 samples, ≥20 test cases, hint mỗi subtask, editorial, fileIO (`SLUG.INP`/`SLUG.OUT`), tier+skills+topicId hợp lệ.
- Test sinh deterministic bằng Mulberry32 (`base.js`) — không dùng `Math.random()`.
- File I/O đặt tên viết hoa từ slug: `sim-daylight` → `DAYLIGHT.INP/OUT`.
- Ngữ cảnh: tên Việt (Minh, Hoa, An, Nam, Linh, Tuấn, Khoa, Bảo), địa danh (Đà Nẵng, Quảng Nam, sông Hàn…), tiền VNĐ, đơn vị mét/km.
- Không sửa test để pass; không gộp / bỏ commit.
- Không push thẳng main; PR vào main qua branch hiện tại.

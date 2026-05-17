# ChuyenTinOJ

> Một nền tảng luyện thi olympic tin học cá nhân — đứa con tinh thần của một học sinh chuyên tin Đà Nẵng đang trên đường chinh phục Quốc gia & vào chuyên tin Nguyễn Bỉnh Khiêm.

ChuyenTinOJ là một **online judge tĩnh, một người dùng** chạy 100% trên trình duyệt (deploy GitHub Pages), tích hợp với Judge0 CE qua Docker để auto-judging C++. Không có backend, không có database server — mọi tiến trình lưu vào IndexedDB của bạn.

🌐 **Live demo:** sẽ cập nhật sau khi enable GitHub Pages
📦 **Repo:** https://github.com/002016go-droid/chuyentinOJ

---

## ✨ Tính năng

- 🗺 **Roadmap thuật toán** — 40+ chủ đề từ I/O cơ bản tới IOI-level, có sơ đồ phụ thuộc.
- 📝 **Bộ đề HSG & tuyển sinh 10** — Đà Nẵng, Quảng Nam, NBK, kèm chế độ luyện thi đếm ngược.
- 🤖 **Auto-judging C++** — qua Judge0 CE, hiển thị verdict / subtask / điểm / sao.
- ⭐ **Hệ thống sao** — mỗi bài tối đa 5 sao; mỗi hint trừ sao theo độ khó.
- 📊 **Heatmap & thống kê** — biểu đồ hoạt động 6 tháng, streak, badges, profile export.
- 📚 **Module 80% kiến thức** — chương trình 2 ngày kèm template thuật toán có code C++.
- 🎨 **Orbital Dark design system** — tối, gọn, font Syne + Space Grotesk + JetBrains Mono.
- 🌀 **7 easter eggs ẩn** — Konami, logo, VNOI, 3WA, midnight, hover x10, level complete.
- ⌨ **Keyboard shortcuts** — `Ctrl+K`, `Ctrl+Enter`, `Ctrl+R`, `[`/`]`, `?`, `F`, `T`.
- 📱 **PWA** — cài vào điện thoại, dùng offline.

## 🧱 Kiến trúc

```
[ React 18 + TypeScript + Vite ]    ← UI, HashRouter
            │
            ├── IndexedDB (Dexie.js) ← submissions, savedCode, progress, stars, hints
            ├── localStorage ← session, passwordHash, draftCode
            ├── /public/data/*.json ← problems, contests, roadmap (static)
            └── fetch → Judge0 CE @ localhost:2358 (Docker)

Deploy: `npm run build` → /docs → GitHub Pages
```

Không có server-side code. Tất cả logic chạy trên trình duyệt của bạn.

## 🚀 Bắt đầu nhanh

```bash
git clone https://github.com/002016go-droid/chuyentinOJ.git
cd chuyentinOJ
npm install
npm run dev
# → mở http://localhost:5173/chuyentinOJ/

# Mật khẩu mặc định: chuyentin2025
```

Để bật Judge0 (cần Docker):

```bash
docker compose up -d
# Judge0 chạy ở http://localhost:2358
```

Xem [JUDGE_SETUP.md](./JUDGE_SETUP.md) để biết chi tiết.

## 🛠 Build & deploy

```bash
npm run build       # tsc + vite build → output ra /docs
git add docs && git commit -m "deploy" && git push
# → Settings → Pages → Source: Deploy from a branch → main / docs
```

## 📂 Cấu trúc thư mục

```
chuyentinOJ/
├── public/data/         ← JSON tĩnh: roadmap, contests, problems, ...
├── src/
│   ├── pages/           ← Login, Dashboard, Roadmap, Problem, ...
│   ├── components/      ← layout, problem UI, easter eggs
│   ├── lib/             ← db, auth, judge0, problemLoader, types
│   ├── hooks/
│   └── styles/
├── docs/                ← build output (GitHub Pages source)
├── docker-compose.yml   ← Judge0 stack
└── judge0.conf
```

## ➕ Thêm bài mới

Hai cách:
1. Vào `/admin` trong app → dán JSON → tải về → đặt vào `public/data/problems/`.
2. Tự viết file `public/data/problems/<slug>.json` theo template ở [ADDING_PROBLEMS.md](./ADDING_PROBLEMS.md) và thêm slug vào `public/data/problems/index.json`.

## 🤝 Đóng góp

Đây là nền tảng cá nhân (single-user), nên mục tiêu chính là phục vụ chủ nhân của nó. Nhưng nếu bạn muốn fork và tự thêm bài cho mình thì rất hoan nghênh.

## 📜 Giấy phép

MIT — tự do dùng, sửa, chia sẻ. Xem [LICENSE](./LICENSE).

---

_Built with stubborn focus, late-night confetti, and the conviction that the next bài đỡ rớt._

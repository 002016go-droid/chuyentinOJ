# Cài đặt Judge0 cho ChuyenTinOJ

ChuyenTinOJ sử dụng [Judge0 CE](https://github.com/judge0/judge0) để chấm code C++ tự động. Bạn cần chạy Judge0 trên cùng máy với trình duyệt (mặc định ở `http://localhost:2358`).

## Yêu cầu

- Docker 24+ và Docker Compose v2.
- Linux / macOS / WSL2. Trên macOS cần bật privileged trong Docker Desktop.
- Khoảng 4GB RAM trống cho Judge0.

## Cách chạy

Trong thư mục repo:

```bash
docker compose up -d
```

Kiểm tra:

```bash
curl http://localhost:2358/about
```

Nếu trả về JSON metadata thì Judge0 đã chạy ngon.

## Cấu hình cgroups (chỉ Linux)

Judge0 cần cgroups v1 để sandbox. Trên Ubuntu mới có thể cần:

```bash
# /etc/default/grub
GRUB_CMDLINE_LINUX="systemd.unified_cgroup_hierarchy=0"

sudo update-grub
sudo reboot
```

## Tắt Judge0

```bash
docker compose down
# giữ dữ liệu:  docker compose down
# xoá hết:      docker compose down -v
```

## Trouble-shooting

- **"Sandbox error" / verdict "Internal error"** → kiểm tra cgroups (Linux) hoặc privileged (macOS Docker Desktop).
- **CORS lỗi khi gọi từ trang GitHub Pages** → mặc định Judge0 không có CORS. Chạy ChuyenTinOJ trên localhost (`npm run dev`) để chấm; hoặc đặt reverse proxy có CORS phía trước.
- **Port 2358 bị chiếm** → đổi cổng trong `docker-compose.yml` (`"3000:2358"`) và sửa `JUDGE0_URL` trong `src/lib/judge0.ts`.

## Thay đổi limit chấm

Sửa `judge0.conf` (`MEMORY_LIMIT`, `CPU_TIME_LIMIT`, ...) rồi `docker compose restart server workers`.

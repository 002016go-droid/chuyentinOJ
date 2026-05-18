import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
      <div className="mx-auto max-w-[1400px] space-y-2 px-6">
        <div>
          <span className="font-display">ChuyenTinOJ</span> — mission control cho dân chuyên Tin
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link to="/roadmap" className="hover:text-[var(--text-primary)]">
            Lộ trình 30 ngày
          </Link>
          <span>·</span>
          <Link to="/techniques" className="hover:text-[var(--text-primary)]">
            127 kỹ thuật
          </Link>
          <span>·</span>
          <Link to="/sources" className="hover:text-[var(--text-primary)]">
            Đề & tài liệu
          </Link>
          <span>·</span>
          <Link to="/settings" className="hover:text-[var(--text-primary)]">
            Cài đặt
          </Link>
          <span>·</span>
          <a
            href="https://wiki.vnoi.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)]"
          >
            VNOI Wiki ↗
          </a>
          <span>·</span>
          <a
            href="https://cp-algorithms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-primary)]"
          >
            CP-Algorithms ↗
          </a>
        </div>
      </div>
    </footer>
  )
}

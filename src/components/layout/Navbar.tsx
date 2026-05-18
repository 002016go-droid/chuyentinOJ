import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Search, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getUsername, logout } from '../../lib/auth'
import { classNames, deterministicAvatar } from '../../lib/utils'
import { useJudgeStatus } from '../../hooks/useJudgeStatus'

interface NavItem {
  to: string
  label: string
}

const ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard' },
  { to: '/roadmap', label: 'Lộ trình' },
  { to: '/contests', label: 'Đề thi HSG' },
  { to: '/entrance', label: 'Tuyển sinh' },
  { to: '/learning', label: '80% kiến thức' },
  { to: '/techniques', label: 'Kỹ thuật' },
  { to: '/sources', label: 'Nguồn' },
  { to: '/ranking', label: 'Đánh giá' },
  { to: '/profile', label: 'Hồ sơ' },
]

interface Props {
  onOpenSearch: () => void
  ratingHoverCount: number
  onRatingHover: () => void
  hiddenUnlocked: boolean
  logoStarBadge: boolean
  onLogoClick: () => void
}

export function Navbar({
  onOpenSearch,
  onRatingHover,
  hiddenUnlocked,
  logoStarBadge,
  onLogoClick,
}: Props) {
  const username = getUsername()
  const navigate = useNavigate()
  const [spin, setSpin] = useState(false)
  const judgeOnline = useJudgeStatus()

  useEffect(() => {
    if (!spin) return
    const t = setTimeout(() => setSpin(false), 800)
    return () => clearTimeout(t)
  }, [spin])

  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--border)] glass">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3">
        <button
          className="flex items-center gap-2"
          onClick={() => {
            setSpin(true)
            onLogoClick()
            navigate('/')
          }}
          aria-label="ChuyenTinOJ"
        >
          <motion.div
            animate={spin ? { rotate: 720 } : { rotate: 0 }}
            transition={{ duration: 0.7 }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-coral)] font-display text-base text-[#1a1a1a] shadow"
          >
            CT
          </motion.div>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="font-display text-base text-[var(--text-primary)]">
              ChuyenTinOJ
              {logoStarBadge && (
                <Star
                  size={12}
                  className="ml-1 inline text-[var(--star-gold)]"
                  fill="currentColor"
                />
              )}
            </span>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--accent-glow)] px-1.5 py-[1px] text-[9px] font-mono uppercase tracking-wider text-[var(--accent-primary)]">
              beta
            </span>
          </div>
        </button>

        <div className="ml-2 hidden flex-1 items-center gap-1 lg:flex">
          {ITEMS.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onMouseEnter={it.to === '/ranking' ? onRatingHover : undefined}
              end={it.to === '/'}
              className={({ isActive }) =>
                classNames(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
          {hiddenUnlocked && (
            <NavLink
              to="/hidden"
              className={({ isActive }) =>
                classNames(
                  'rounded-md px-3 py-1.5 text-sm font-semibold transition',
                  isActive
                    ? 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]'
                    : 'text-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/15',
                )
              }
            >
              👁️ Bài ẩn
            </NavLink>
          )}
        </div>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:border-[var(--border-strong)]"
        >
          <Search size={14} />
          <span className="hidden md:inline">Tìm bài...</span>
          <kbd className="ml-2 rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-mono">
            Ctrl K
          </kbd>
        </button>

        <div
          className="hidden md:flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs"
          title={
            judgeOnline === null
              ? 'Judge: đang kiểm tra...'
              : judgeOnline
                ? 'Judge online (localhost:2358)'
                : 'Judge offline — chạy: docker-compose up -d'
          }
        >
          <span
            className={classNames(
              'status-dot',
              judgeOnline === null
                ? 'unknown'
                : judgeOnline
                  ? 'online'
                  : 'offline',
            )}
          />
          <span className="font-mono text-[var(--text-muted)]">
            {judgeOnline === null ? 'Judge…' : judgeOnline ? 'Judge' : 'Judge offline'}
          </span>
        </div>

        <div className="flex items-center gap-2 border-l border-[var(--border)] pl-4">
          <img
            src={deterministicAvatar(username, 32)}
            alt={username}
            className="h-8 w-8 rounded-lg"
          />
          <div className="hidden md:block leading-tight">
            <div className="text-sm font-semibold">{username.split(' ').slice(-1)[0]}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Đăng nhập</div>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="ml-1 rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--accent-red)]"
            aria-label="Đăng xuất"
            title="Đăng xuất"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import toast from 'react-hot-toast'
import { isLoggedIn, login, DEFAULT_PASSWORD } from '../lib/auth'

export function LoginPage() {
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoggedIn()) navigate('/', { replace: true })
  }, [navigate])

  if (isLoggedIn()) return <Navigate to="/" replace />

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setTimeout(() => {
      if (login(password)) {
        toast.success('Đăng nhập thành công!')
        const from = (location.state as any)?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        toast.error('Mật khẩu không đúng.')
      }
      setPending(false)
    }, 250)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(74,158,255,0.15), transparent 55%), radial-gradient(circle at 70% 80%, rgba(232,149,109,0.1), transparent 55%)',
        }}
      />
      <div className="grid min-h-screen place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card glass w-full max-w-md p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-coral)] font-display text-xl text-white shadow-glow">
              CT
            </div>
            <div>
              <h1 className="font-display text-2xl">ChuyenTinOJ</h1>
              <p className="text-xs text-[var(--text-muted)]">
                Mission control · NBK · IOI 2030
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Mật khẩu
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="Mặc định: chuyentin2025"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--border-glow)]"
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="btn btn-primary w-full justify-center text-base"
            >
              <Terminal size={16} />
              {pending ? 'Đang xác thực...' : 'Vào hệ thống'}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]/60 p-3 text-xs text-[var(--text-muted)]">
            <p>
              💡 Đây là tài khoản cá nhân (1 user). Mặc định:{' '}
              <code className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[var(--accent-cyan)]">
                {DEFAULT_PASSWORD}
              </code>
              . Đổi mật khẩu trong trang{' '}
              <em>Hồ sơ</em> sau khi vào.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

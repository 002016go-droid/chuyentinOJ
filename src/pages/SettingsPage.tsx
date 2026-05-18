import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Cloud, Server, Settings as Cog, RefreshCw, Save, Wifi } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  CPP20_ID,
  type JudgeMode,
  RAPIDAPI_JUDGE0_URL,
  getJudge0Config,
  judgePing,
  resetJudge0Config,
  setJudge0Config,
} from '../lib/judge0'
import { fadeUp } from '../lib/motion'

const LANGUAGE_OPTIONS: { id: number; label: string }[] = [
  { id: 54, label: 'C++ (GCC 9.2.0)' },
  { id: 76, label: 'C++ (Clang 7.0.1)' },
  { id: 52, label: 'C++ (GCC 7.4.0)' },
  { id: 71, label: 'Python 3.8.1' },
  { id: 62, label: 'Java (OpenJDK 13.0.1)' },
]

export function SettingsPage() {
  const [mode, setMode] = useState<JudgeMode>('rapidapi')
  const [url, setUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [languageId, setLanguageId] = useState<number>(CPP20_ID)
  const [pingState, setPingState] = useState<'idle' | 'pinging' | 'ok' | 'fail'>('idle')

  useEffect(() => {
    const cfg = getJudge0Config()
    setMode(cfg.useRapidAPI ? 'rapidapi' : 'local')
    setUrl(cfg.url)
    setApiKey(cfg.apiKey ?? '')
    setLanguageId(cfg.languageId ?? CPP20_ID)
  }, [])

  async function save() {
    const trimmedKey = apiKey.trim()
    if (mode === 'rapidapi') {
      if (!trimmedKey) {
        toast.error('Chưa cấu hình API Key — dán key từ RapidAPI vào ô bên dưới')
        return
      }
      setJudge0Config({
        url: url.trim().replace(/\/$/, '') || 'http://localhost:2358',
        apiKey: trimmedKey,
        languageId,
        useRapidAPI: true,
      })
      setPingState('idle')
      toast.success('Đã lưu cấu hình — chấm qua RapidAPI Judge0')
      return
    }
    const trimmedUrl = url.trim().replace(/\/$/, '')
    if (!trimmedUrl) {
      toast.error('Vui lòng nhập URL Judge0')
      return
    }
    setJudge0Config({
      url: trimmedUrl,
      apiKey: trimmedKey || undefined,
      languageId,
      useRapidAPI: false,
    })
    setPingState('idle')
    toast.success('Đã lưu cấu hình — chấm qua Judge0 local')
  }

  async function ping() {
    setPingState('pinging')
    const ok = await judgePing({
      url: url.trim().replace(/\/$/, '') || 'http://localhost:2358',
      apiKey: apiKey.trim() || undefined,
      useRapidAPI: mode === 'rapidapi',
    })
    setPingState(ok ? 'ok' : 'fail')
    if (ok) toast.success(mode === 'rapidapi' ? 'RapidAPI Judge0 trả lời OK' : 'Judge0 local trả lời OK')
    else if (mode === 'rapidapi')
      toast.error(
        apiKey.trim()
          ? 'Key không hợp lệ hoặc hết quota — kiểm tra lại trên RapidAPI'
          : 'Chưa có API Key — dán key từ RapidAPI vào ô bên dưới',
      )
    else toast.error('Không kết nối được tới Judge0 — chạy `docker-compose up -d`?')
  }

  function reset() {
    if (!confirm('Đặt lại cấu hình Judge0 về mặc định?')) return
    resetJudge0Config()
    setMode('rapidapi')
    setUrl('http://localhost:2358')
    setApiKey('')
    setLanguageId(CPP20_ID)
    setPingState('idle')
    toast.success('Đã reset cấu hình')
  }

  return (
    <PageTransition>
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <Card>
          <Badge tone="purple">Cấu hình hệ thống</Badge>
          <h1 className="mt-2 font-display text-3xl">
            <Cog size={22} className="mr-2 inline" />
            Cài đặt
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
            Cấu hình Judge0 endpoint, API key, và ngôn ngữ mặc định. Tất cả cài đặt
            lưu trong localStorage trên trình duyệt — không gửi lên server.
          </p>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-4">
        <Card>
          <h2 className="font-display text-lg">
            <Wifi size={16} className="mr-1 inline" />
            Máy chấm (Judge0)
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Chọn chấm qua RapidAPI Judge0 CE (khuyến nghị, hoạt động trên GitHub
            Pages) hoặc qua Judge0 tự host bằng <code className="font-mono">docker-compose</code>.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode('rapidapi')}
              className={
                'flex items-start gap-3 rounded-lg border px-3 py-3 text-left transition ' +
                (mode === 'rapidapi'
                  ? 'border-[var(--border-glow)] bg-[var(--bg-surface)] shadow-glow'
                  : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-glow)]')
              }
            >
              <Cloud size={18} className="mt-0.5 shrink-0 text-[var(--accent-primary)]" />
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  RapidAPI Cloud
                  <Badge tone="green">Khuyến nghị</Badge>
                </span>
                <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                  Chấm trực tiếp trên website tĩnh — chỉ cần dán API Key
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode('local')}
              className={
                'flex items-start gap-3 rounded-lg border px-3 py-3 text-left transition ' +
                (mode === 'local'
                  ? 'border-[var(--border-glow)] bg-[var(--bg-surface)] shadow-glow'
                  : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-glow)]')
              }
            >
              <Server size={18} className="mt-0.5 shrink-0 text-[var(--accent-secondary)]" />
              <span>
                <span className="block text-sm font-semibold">Local Docker / VPS</span>
                <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                  Judge0 tự host qua <code className="font-mono">docker-compose up -d</code>
                </span>
              </span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {mode === 'rapidapi' ? (
              <>
                <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-xs text-[var(--text-muted)]">
                  Endpoint: <code className="font-mono text-[var(--text)]">{RAPIDAPI_JUDGE0_URL}</code>
                  <br />
                  Lấy key miễn phí (50 submissions/ngày) tại{' '}
                  <a
                    href="https://rapidapi.com/judge0-official/api/judge0-ce/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-primary)] hover:underline"
                  >
                    rapidapi.com/judge0-official/api/judge0-ce
                  </a>
                  , subscribe Basic plan, sao chép trường <code className="font-mono">X-RapidAPI-Key</code>.
                </div>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    X-RapidAPI-Key
                  </span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="dán key từ RapidAPI đây"
                    className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--border-glow)]"
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Base URL
                  </span>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="http://localhost:2358"
                    className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--border-glow)]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    X-Auth-Token (tùy chọn, chỉ cần nếu Judge0 bật auth)
                  </span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="X-Auth-Token (không bắt buộc)"
                    className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--border-glow)]"
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Ngôn ngữ mặc định
              </span>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(parseInt(e.target.value, 10))}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--border-glow)]"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} (id={l.id})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button onClick={save}>
              <Save size={14} /> Lưu cấu hình
            </Button>
            <Button onClick={ping}>
              <RefreshCw
                size={14}
                className={pingState === 'pinging' ? 'animate-spin' : ''}
              />
              Test kết nối
            </Button>
            <button onClick={reset} className="btn btn-ghost">
              Reset mặc định
            </button>
            {pingState === 'ok' && (
              <Badge tone="green">
                {mode === 'rapidapi' ? 'RapidAPI online · key hợp lệ' : 'Judge0 OK · /about trả 200'}
              </Badge>
            )}
            {pingState === 'fail' && (
              <Badge tone="red">
                {mode === 'rapidapi'
                  ? apiKey.trim()
                    ? 'Key không hợp lệ / hết quota'
                    : 'Chưa cấu hình API Key'
                  : 'Không kết nối được'}
              </Badge>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg">📖 Hướng dẫn nhanh</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--text-muted)]">
            <li>
              <strong>Local development:</strong> Chạy{' '}
              <code className="font-mono">docker-compose up -d</code> ở thư mục
              gốc dự án. Judge0 sẽ lắng nghe tại{' '}
              <code className="font-mono">http://localhost:2358</code>.
            </li>
            <li>
              <strong>Self-hosted VPS:</strong> Deploy Judge0 (xem{' '}
              <a
                href="https://github.com/judge0/judge0/blob/master/CHANGELOG.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] hover:underline"
              >
                docs
              </a>
              ), nhập URL HTTPS vào ô Base URL.
            </li>
            <li>
              <strong>RapidAPI / Judge0 CE:</strong> Đăng ký key tại{' '}
              <a
                href="https://rapidapi.com/judge0-official/api/judge0-ce/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] hover:underline"
              >
                rapidapi.com
              </a>
              , dùng URL{' '}
              <code className="font-mono">https://judge0-ce.p.rapidapi.com</code>{' '}
              và dán key.
            </li>
            <li>
              <strong>Chấm offline:</strong> Nếu Judge0 không sẵn sàng, hệ thống
              vẫn cho phép nộp code; chỉ phần chấm test mới bị disable.
            </li>
          </ol>
        </Card>
      </motion.div>
    </PageTransition>
  )
}

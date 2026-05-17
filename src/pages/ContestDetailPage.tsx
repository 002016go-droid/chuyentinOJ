import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { StarRating } from '../components/ui/StarRating'
import { VerdictBadge } from '../components/ui/VerdictBadge'
import { loadAllProblems, loadContests } from '../lib/problemLoader'
import type { Contest, Problem } from '../lib/types'
import { db } from '../lib/db'

interface TimerState {
  contestId: string
  startTime: number
  duration: number
}

const TIMER_KEY = 'chuyentin:contestTimer'

export function ContestDetailPage() {
  const { contestId } = useParams<{ contestId: string }>()
  const [searchParams] = useSearchParams()
  const [contest, setContest] = useState<Contest | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [timer, setTimer] = useState<TimerState | null>(null)
  const [now, setNow] = useState(Date.now())

  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []
  const stars = useLiveQuery(() => db.problemStars.toArray(), []) ?? []

  useEffect(() => {
    Promise.all([loadContests(), loadAllProblems()]).then(([cs, ps]) => {
      const c = cs.find((x) => x.id === contestId) ?? null
      setContest(c)
      if (c) setProblems(ps.filter((p) => c.problems.includes(p.slug)))
    })
  }, [contestId])

  useEffect(() => {
    const raw = localStorage.getItem(TIMER_KEY)
    if (raw) {
      try {
        const t = JSON.parse(raw) as TimerState
        if (t.contestId === contestId) setTimer(t)
      } catch {}
    }
  }, [contestId])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const mode = searchParams.get('mode') === 'timed' ? 'timed' : 'practice'

  function startTimer() {
    if (!contest) return
    const t: TimerState = {
      contestId: contest.id,
      startTime: Date.now(),
      duration: contest.duration * 60 * 1000,
    }
    localStorage.setItem(TIMER_KEY, JSON.stringify(t))
    setTimer(t)
  }

  function stopTimer() {
    localStorage.removeItem(TIMER_KEY)
    setTimer(null)
  }

  const verdictByProblem = useMemo(() => {
    const m = new Map<string, ReturnType<typeof Object> extends never ? never : (typeof subs)[number]>()
    for (const s of subs) {
      const prev = m.get(s.problemSlug)
      if (!prev) m.set(s.problemSlug, s)
      else if (s.score > prev.score) m.set(s.problemSlug, s)
    }
    return m
  }, [subs])

  const starsByProblem = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of stars) m.set(s.problemSlug, s.starsEarned)
    return m
  }, [stars])

  const remaining = useMemo(() => {
    if (!timer) return null
    const r = timer.startTime + timer.duration - now
    return Math.max(0, r)
  }, [timer, now])

  function fmt(ms: number) {
    const s = Math.floor(ms / 1000)
    const hh = Math.floor(s / 3600)
    const mm = Math.floor((s % 3600) / 60)
    const ss = s % 60
    return [hh, mm, ss].map((x) => String(x).padStart(2, '0')).join(':')
  }

  if (!contest) {
    return (
      <PageTransition>
        <p className="text-sm text-[var(--text-muted)]">Đang tải đề thi...</p>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            to="/contests"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)]"
          >
            ← Trở về danh sách đề
          </Link>
          <h1 className="mt-1 font-display text-3xl">
            {contest.flag} {contest.title}
          </h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge tone="blue">{contest.year}</Badge>
            {contest.grade && <Badge tone="muted">Lớp {contest.grade}</Badge>}
            <Badge tone="amber">Thời lượng {contest.duration} phút</Badge>
            <Badge tone="muted">{contest.problems.length} bài</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {mode === 'timed' && !timer && (
            <button className="btn btn-primary" onClick={startTimer}>
              ⏱ Bắt đầu thi thử
            </button>
          )}
          {timer && (
            <button className="btn btn-ghost" onClick={stopTimer}>
              Kết thúc thi
            </button>
          )}
        </div>
      </div>

      {timer && remaining != null && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`fixed bottom-6 right-6 z-30 rounded-xl border px-4 py-2 font-mono text-lg shadow-glow ${
            remaining < 10 * 60 * 1000
              ? 'border-[var(--accent-amber)] bg-[rgba(251,191,36,0.1)] text-[var(--accent-amber)] flame'
              : 'border-[var(--border-glow)] bg-[var(--bg-surface)]'
          }`}
        >
          ⏱ {fmt(remaining)} còn lại
        </motion.div>
      )}

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Bài</th>
              <th className="px-3 py-2 text-left">Độ khó</th>
              <th className="px-3 py-2 text-left">Tags</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-left">Sao</th>
            </tr>
          </thead>
          <tbody>
            {contest.problems.map((slug, i) => {
              const p = problems.find((pp) => pp.slug === slug)
              if (!p) {
                return (
                  <tr key={slug} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2 font-mono">{i + 1}</td>
                    <td className="px-3 py-2 text-[var(--text-muted)]">
                      {slug} (đang biên soạn)
                    </td>
                    <td colSpan={4} />
                  </tr>
                )
              }
              const sub = verdictByProblem.get(p.slug)
              const earned = starsByProblem.get(p.slug) ?? 0
              return (
                <tr
                  key={slug}
                  className="border-t border-[var(--border)] hover:bg-[var(--bg-elevated)]"
                >
                  <td className="px-3 py-2 font-mono text-[var(--text-muted)]">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link
                      to={`/problem/${p.slug}`}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-cyan)]"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <StarRating value={p.difficulty / 2} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((t) => (
                        <Badge key={t} tone="muted">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {sub ? <VerdictBadge verdict={sub.verdict} /> : <Badge>Chưa nộp</Badge>}
                  </td>
                  <td className="px-3 py-2">
                    <StarRating value={earned} showNumber />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </PageTransition>
  )
}

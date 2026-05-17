import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { CheckCircle2, Flame, Star, Trophy, ArrowRight } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { VerdictBadge } from '../components/ui/VerdictBadge'
import { Heatmap } from '../components/ui/Heatmap'
import { db } from '../lib/db'
import { useAggregateStats } from '../hooks/useStats'
import { getUsername } from '../lib/auth'
import { dailyQuote, dateKey, greeting } from '../lib/utils'
import { QUOTES } from '../lib/quotes'
import { staggerContainer, fadeUp } from '../lib/motion'
import { loadAllProblems, loadRoadmap } from '../lib/problemLoader'

export function DashboardPage() {
  const stats = useAggregateStats()
  const recent = useLiveQuery(
    () => db.submissions.orderBy('submittedAt').reverse().limit(5).toArray(),
    [],
  ) ?? []
  const progress = useLiveQuery(() => db.progress.toArray(), []) ?? []
  const [counts, setCounts] = useState({ problems: 0, topics: 0 })

  useEffect(() => {
    Promise.all([loadAllProblems(), loadRoadmap()])
      .then(([p, r]) => setCounts({ problems: p.length, topics: r.nodes.length }))
      .catch(() => {})
  }, [])

  const username = getUsername()
  const hour = greeting()
  const quote = dailyQuote(QUOTES)
  const heatmap: Record<string, number> = {}
  for (const s of recent) {
    const k = dateKey(new Date(s.submittedAt))
    heatmap[k] = (heatmap[k] ?? 0) + 1
  }
  const subsAll = useLiveQuery(() => db.submissions.toArray(), []) ?? []
  for (const s of subsAll) {
    const k = dateKey(new Date(s.submittedAt))
    heatmap[k] = (heatmap[k] ?? 0) + 1
  }

  const completedTopics = progress.filter((p) => p.status === 'completed').length
  const inProgressTopics = progress.filter((p) => p.status === 'in_progress').length

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <motion.div variants={fadeUp}>
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl">
                  Chào buổi {hour}, <span className="text-[var(--accent-cyan)]">{username}</span>! 🔥
                </h1>
                <p className="mt-1 max-w-xl text-sm italic text-[var(--text-muted)]">
                  "{quote}"
                </p>
              </div>
              {stats.currentStreak >= 1 && (
                <div className="flex items-center gap-2 rounded-xl border border-[var(--accent-amber)]/40 bg-[rgba(251,191,36,0.08)] px-4 py-2">
                  <span className={stats.currentStreak >= 3 ? 'flame text-xl' : 'text-xl'}>🔥</span>
                  <div>
                    <div className="font-display text-2xl text-[var(--accent-amber)]">
                      {stats.currentStreak}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                      ngày liên tiếp
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            icon={<CheckCircle2 size={20} className="text-[var(--accent-green)]" />}
            label="Bài đã giải"
            value={stats.uniqueSolved}
            sub={`trên ${counts.problems || '—'} bài`}
            tone="green"
          />
          <StatCard
            icon={<Star size={20} className="text-[var(--star-gold)]" />}
            label="Tổng sao"
            value={stats.totalStars.toFixed(1)}
            sub={`TB ${stats.averageStars.toFixed(2)} ★/bài`}
            tone="amber"
          />
          <StatCard
            icon={<Trophy size={20} className="text-[var(--accent-blue)]" />}
            label="Submissions"
            value={stats.totalSubmissions}
            sub={`AC rate ${stats.totalSubmissions ? ((stats.totalAccepted / stats.totalSubmissions) * 100).toFixed(0) : 0}%`}
            tone="blue"
          />
          <StatCard
            icon={<Flame size={20} className="text-[var(--accent-coral)]" />}
            label="Streak"
            value={`${stats.currentStreak}d`}
            sub={`kỷ lục ${stats.bestStreak}d`}
            tone="coral"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card>
            <h2 className="mb-3 font-display text-lg">📅 Hoạt động 6 tháng gần đây</h2>
            <Heatmap months={6} data={heatmap} />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">
          <Card hover>
            <h2 className="mb-3 font-display text-lg">📈 Tiến độ học</h2>
            <ProgressBar
              label="Lộ trình thuật toán"
              value={completedTopics}
              max={Math.max(counts.topics, 1)}
              extra={`${inProgressTopics} đang học`}
            />
            <ProgressBar
              label="Đề HSG / Tuyển sinh"
              value={stats.uniqueSolved}
              max={Math.max(counts.problems, 1)}
            />
            <ProgressBar
              label="80% kiến thức trọng tâm"
              value={Math.min(stats.uniqueSolved, 10)}
              max={10}
              extra="theo timeline 2 ngày"
            />
            <div className="mt-4">
              <Link to="/roadmap" className="btn btn-ghost">
                Mở lộ trình <ArrowRight size={14} />
              </Link>
            </div>
          </Card>

          <Card hover>
            <h2 className="mb-3 font-display text-lg">📝 Submission gần đây</h2>
            {recent.length === 0 ? (
              <div className="py-6 text-center text-sm text-[var(--text-muted)]">
                Chưa có submission nào. Bắt đầu với{' '}
                <Link to="/learning" className="text-[var(--accent-cyan)]">
                  80% kiến thức trọng tâm
                </Link>
                .
              </div>
            ) : (
              <ul className="space-y-2">
                {recent.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]/60 px-3 py-2"
                  >
                    <Link
                      to={`/problem/${s.problemSlug}`}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-cyan)]"
                    >
                      {s.problemSlug}
                    </Link>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {s.score}/100
                      </span>
                      <VerdictBadge verdict={s.verdict} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card hover>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge tone="coral">Tiếp tục từ đây</Badge>
                <h2 className="mt-2 font-display text-xl">Mục tiêu: Chuyên NBK Đà Nẵng 2026</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Bắt đầu với timeline 2 ngày học 80% kiến thức trọng tâm.
                </p>
              </div>
              <Link to="/learning" className="btn btn-primary">
                Mở Learning <ArrowRight size={16} />
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}

interface StatProps {
  icon: React.ReactNode
  label: string
  value: number | string
  sub: string
  tone: 'green' | 'amber' | 'blue' | 'coral'
}

function StatCard({ icon, label, value, sub }: StatProps) {
  return (
    <Card hover className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
      </div>
      <div className="font-display text-3xl">{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{sub}</div>
    </Card>
  )
}

function ProgressBar({
  label,
  value,
  max,
  extra,
}: {
  label: string
  value: number
  max: number
  extra?: string
}) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100))
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono text-[var(--text-muted)]">
          {value}/{max} · {pct}% {extra && `· ${extra}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, var(--accent-blue), var(--accent-coral))',
          }}
        />
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { StarRating } from '../components/ui/StarRating'
import { VerdictBadge } from '../components/ui/VerdictBadge'
import { Heatmap } from '../components/ui/Heatmap'
import { loadAllProblems } from '../lib/problemLoader'
import type { Problem } from '../lib/types'
import { db } from '../lib/db'
import { dateKey } from '../lib/utils'
import { useAggregateStats } from '../hooks/useStats'

type DiffFilter = 'all' | 'easy' | 'medium' | 'hard'
type ModuleFilter = 'all' | 'roadmap' | 'contest' | 'entrance' | 'learning'
type SortKey = 'difficulty' | 'attempts' | 'stars'

export function RankingPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []
  const stars = useLiveQuery(() => db.problemStars.toArray(), []) ?? []
  const stats = useAggregateStats()

  const [search, setSearch] = useState('')
  const [diff, setDiff] = useState<DiffFilter>('all')
  const [mod, setMod] = useState<ModuleFilter>('all')
  const [sort, setSort] = useState<SortKey>('difficulty')

  useEffect(() => {
    loadAllProblems().then(setProblems)
  }, [])

  const heatmap: Record<string, number> = useMemo(() => {
    const h: Record<string, number> = {}
    for (const s of subs) {
      const k = dateKey(new Date(s.submittedAt))
      h[k] = (h[k] ?? 0) + 1
    }
    return h
  }, [subs])

  const attemptsMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of subs) m.set(s.problemSlug, (m.get(s.problemSlug) ?? 0) + 1)
    return m
  }, [subs])

  const starsMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of stars) m.set(s.problemSlug, s.starsEarned)
    return m
  }, [stars])

  const verdictMap = useMemo(() => {
    const m = new Map<string, (typeof subs)[number]>()
    for (const s of subs) {
      const prev = m.get(s.problemSlug)
      if (!prev || s.score > prev.score) m.set(s.problemSlug, s)
    }
    return m
  }, [subs])

  const filtered = useMemo(() => {
    let arr = [...problems]
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      arr = arr.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    if (diff !== 'all') {
      arr = arr.filter((p) => {
        if (diff === 'easy') return p.difficulty <= 3
        if (diff === 'medium') return p.difficulty >= 4 && p.difficulty <= 6
        return p.difficulty >= 7
      })
    }
    if (mod !== 'all') arr = arr.filter((p) => p.module === mod)
    arr.sort((a, b) => {
      if (sort === 'difficulty') return b.difficulty - a.difficulty
      if (sort === 'attempts')
        return (attemptsMap.get(b.slug) ?? 0) - (attemptsMap.get(a.slug) ?? 0)
      return (starsMap.get(b.slug) ?? 0) - (starsMap.get(a.slug) ?? 0)
    })
    return arr
  }, [problems, search, diff, mod, sort, attemptsMap, starsMap])

  return (
    <PageTransition>
      <h1 className="font-display text-3xl">📊 Đánh giá & Lịch sử nộp</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Tất cả bài đã có trong hệ thống, với trạng thái, sao đạt được và sortable theo nhiều tiêu chí.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] p-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Tìm bài, tag..."
              className="flex-1 min-w-[180px] rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-sm outline-none focus:border-[var(--border-glow)]"
            />
            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value as DiffFilter)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-sm"
            >
              <option value="all">Tất cả độ khó</option>
              <option value="easy">Dễ (1-3)</option>
              <option value="medium">Vừa (4-6)</option>
              <option value="hard">Khó (7-10)</option>
            </select>
            <select
              value={mod}
              onChange={(e) => setMod(e.target.value as ModuleFilter)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-sm"
            >
              <option value="all">Tất cả module</option>
              <option value="roadmap">Roadmap</option>
              <option value="contest">Contest</option>
              <option value="entrance">Tuyển sinh</option>
              <option value="learning">80% kiến thức</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-sm"
            >
              <option value="difficulty">Sắp theo độ khó</option>
              <option value="attempts">Số lần nộp</option>
              <option value="stars">Sao đạt được</option>
            </select>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--bg-elevated)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="px-3 py-2 text-left">Bài</th>
                  <th className="px-3 py-2 text-left">Module</th>
                  <th className="px-3 py-2 text-left">Khó</th>
                  <th className="px-3 py-2 text-left">Verdict</th>
                  <th className="px-3 py-2 text-left">Lần nộp</th>
                  <th className="px-3 py-2 text-left">Sao</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const sub = verdictMap.get(p.slug)
                  const att = attemptsMap.get(p.slug) ?? 0
                  const earned = starsMap.get(p.slug) ?? 0
                  return (
                    <tr
                      key={p.slug}
                      className="border-t border-[var(--border)] hover:bg-[var(--bg-elevated)]"
                    >
                      <td className="px-3 py-2">
                        <Link
                          to={`/problem/${p.slug}`}
                          className="font-medium hover:text-[var(--accent-cyan)]"
                        >
                          {p.title}
                        </Link>
                        <div className="text-[10px] text-[var(--text-muted)]">{p.source}</div>
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          tone={
                            p.module === 'entrance'
                              ? 'coral'
                              : p.module === 'contest'
                                ? 'blue'
                                : p.module === 'learning'
                                  ? 'amber'
                                  : 'purple'
                          }
                        >
                          {p.module}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        <StarRating value={p.difficulty / 2} />
                      </td>
                      <td className="px-3 py-2">
                        {sub ? <VerdictBadge verdict={sub.verdict} /> : <Badge>—</Badge>}
                      </td>
                      <td className="px-3 py-2 font-mono">{att}</td>
                      <td className="px-3 py-2">
                        <StarRating value={earned} showNumber />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-display text-lg">Tổng quan</h3>
            <ul className="space-y-2 text-sm">
              <Stat label="Bài đã thử" value={attemptsMap.size} />
              <Stat label="Bài AC" value={stats.uniqueSolved} />
              <Stat label="Submissions" value={stats.totalSubmissions} />
              <Stat label="Sao trung bình" value={stats.averageStars.toFixed(2)} />
              <Stat label="Streak hiện tại" value={`${stats.currentStreak}d`} />
              <Stat label="Kỷ lục streak" value={`${stats.bestStreak}d`} />
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 font-display text-base">Heatmap 6 tháng</h3>
            <Heatmap months={6} data={heatmap} cellSize={10} />
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <li className="flex items-center justify-between border-b border-[var(--border)] pb-1.5 last:border-0">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </li>
  )
}

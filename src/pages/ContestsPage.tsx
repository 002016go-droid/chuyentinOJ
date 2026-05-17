import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { ExternalLink, Play, Timer, Trophy } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { loadAllProblems, loadContests } from '../lib/problemLoader'
import type { Contest, Problem } from '../lib/types'
import { db } from '../lib/db'
import { staggerContainer, fadeUp } from '../lib/motion'

export function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []

  useEffect(() => {
    Promise.all([loadContests(), loadAllProblems()]).then(([c, p]) => {
      setContests(c)
      setProblems(p)
    })
  }, [])

  const solvedSet = useMemo(() => {
    const s = new Set<string>()
    for (const x of subs) if (x.verdict === 'AC') s.add(x.problemSlug)
    return s
  }, [subs])

  const provinces = useMemo(() => {
    const map = new Map<string, Contest[]>()
    for (const c of contests) {
      if (c.type === 'gym') continue
      if (!map.has(c.province)) map.set(c.province, [])
      map.get(c.province)!.push(c)
    }
    return Array.from(map.entries())
  }, [contests])

  const gym = contests.filter((c) => c.type === 'gym')

  return (
    <PageTransition>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">🏆 Đề thi HSG các tỉnh</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Luyện tập với đề HSG Tin học của các tỉnh thành — chế độ luyện tập hoặc thi thử có
            đồng hồ.
          </p>
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
        {provinces.map(([province, items]) => (
          <motion.section key={province} variants={fadeUp}>
            <h2 className="mb-3 font-display text-xl">
              {items[0]?.flag ?? ''} {province}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((c) => (
                <ContestCard
                  key={c.id}
                  contest={c}
                  problems={problems}
                  solvedSet={solvedSet}
                />
              ))}
            </div>
          </motion.section>
        ))}

        {gym.length > 0 && (
          <motion.section variants={fadeUp}>
            <h2 className="mb-3 font-display text-xl text-[var(--accent-red)]">🔴 CF Gym</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gym.map((c) => (
                <Card key={c.id} hover>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge tone="red">External</Badge>
                      <h3 className="mt-2 font-display text-lg leading-tight">{c.title}</h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{c.province} · {c.year}</p>
                    </div>
                  </div>
                  {c.external && (
                    <a
                      href={c.external.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost mt-4"
                    >
                      Mở trên Codeforces <ExternalLink size={14} />
                    </a>
                  )}
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </PageTransition>
  )
}

function ContestCard({
  contest,
  problems,
  solvedSet,
}: {
  contest: Contest
  problems: Problem[]
  solvedSet: Set<string>
}) {
  const items = problems.filter((p) => contest.problems.includes(p.slug))
  const solved = items.filter((p) => solvedSet.has(p.slug)).length
  const total = contest.problems.length
  const pct = total ? (solved / total) * 100 : 0

  const diffDist = useMemo(() => {
    let easy = 0
    let medium = 0
    let hard = 0
    let extreme = 0
    for (const p of items) {
      if (p.difficulty <= 3) easy++
      else if (p.difficulty <= 6) medium++
      else if (p.difficulty <= 8) hard++
      else extreme++
    }
    const sum = items.length || 1
    return {
      easy: (easy / sum) * 100,
      medium: (medium / sum) * 100,
      hard: (hard / sum) * 100,
      extreme: (extreme / sum) * 100,
    }
  }, [items])

  return (
    <Card hover>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="blue">{contest.year}</Badge>
            {contest.grade && <Badge tone="muted">Lớp {contest.grade}</Badge>}
            <Badge tone={contest.type === 'hsg-city' ? 'amber' : 'coral'}>{contest.type}</Badge>
          </div>
          <h3 className="mt-2 font-display text-lg leading-tight">{contest.title}</h3>
        </div>
        <Trophy size={20} className="text-[var(--star-gold)]" />
      </div>

      <div className="mt-3">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Phân bố độ khó
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
          <div style={{ width: `${diffDist.easy}%`, background: 'var(--accent-green)' }} />
          <div style={{ width: `${diffDist.medium}%`, background: 'var(--accent-amber)' }} />
          <div style={{ width: `${diffDist.hard}%`, background: 'var(--accent-coral)' }} />
          <div style={{ width: `${diffDist.extreme}%`, background: 'var(--accent-red)' }} />
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span>Tiến độ</span>
          <span className="font-mono text-[var(--text-muted)]">
            {solved}/{total} bài
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg,var(--accent-green),var(--accent-blue))',
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link to={`/contests/${contest.id}`} className="btn btn-ghost flex-1 justify-center">
          <Play size={14} /> Luyện tập
        </Link>
        <Link
          to={`/contests/${contest.id}?mode=timed`}
          className="btn btn-primary flex-1 justify-center"
        >
          <Timer size={14} /> Thi thử
        </Link>
      </div>
    </Card>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { GraduationCap, Target } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { loadAllProblems, loadEntranceExams } from '../lib/problemLoader'
import type { EntranceExam, Problem } from '../lib/types'
import { db } from '../lib/db'
import { staggerContainer, fadeUp } from '../lib/motion'

export function EntrancePage() {
  const [exams, setExams] = useState<EntranceExam[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []

  useEffect(() => {
    Promise.all([loadEntranceExams(), loadAllProblems()]).then(([e, p]) => {
      setExams(e)
      setProblems(p)
    })
  }, [])

  const solvedSet = useMemo(() => {
    const s = new Set<string>()
    for (const x of subs) if (x.verdict === 'AC') s.add(x.problemSlug)
    return s
  }, [subs])

  const target = new Date('2026-05-31')
  const daysLeft = Math.max(0, Math.ceil((target.getTime() - Date.now()) / (24 * 3600 * 1000)))

  const grouped = useMemo(() => {
    const map = new Map<string, EntranceExam[]>()
    for (const e of exams) {
      if (!map.has(e.school)) map.set(e.school, [])
      map.get(e.school)!.push(e)
    }
    return Array.from(map.entries())
  }, [exams])

  return (
    <PageTransition>
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mb-6"
      >
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-4">
            <Target className="text-[var(--accent-coral)]" size={28} />
            <div className="flex-1 min-w-[200px]">
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                🎯 Mục tiêu chính
              </div>
              <h2 className="font-display text-2xl">
                Chuyên Nguyễn Bỉnh Khiêm — Đà Nẵng
              </h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Cận kề kỳ tuyển sinh lớp 10 chuyên Tin.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--accent-coral)]/40 bg-[rgba(232,149,109,0.08)] px-4 py-2 text-center">
              <div className="font-display text-3xl text-[var(--accent-coral)]">{daysLeft}</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                ngày tới ngày thi
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
        {grouped.map(([school, items]) => (
          <motion.section key={school} variants={fadeUp}>
            <h2 className="mb-3 font-display text-xl">
              <GraduationCap size={18} className="mr-1 inline" />
              {school}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((e) => {
                const present = e.problems.filter((slug) =>
                  problems.find((p) => p.slug === slug),
                ).length
                const solved = e.problems.filter((slug) => solvedSet.has(slug)).length
                const pct = e.problems.length ? (solved / e.problems.length) * 100 : 0
                return (
                  <Link key={e.id} to={`/entrance/${e.id}`} className="block">
                    <Card hover>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <Badge tone="coral">{e.year}</Badge>
                            <Badge tone="muted">{e.province}</Badge>
                            {e.difficultyLabel && (
                              <Badge tone="amber">{e.difficultyLabel}</Badge>
                            )}
                          </div>
                          <h3 className="mt-2 font-display text-lg leading-tight">
                            {e.title}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)]">
                            {present}/{e.problems.length} bài đã có · {solved} AC
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              'linear-gradient(90deg,var(--accent-coral),var(--accent-amber))',
                          }}
                        />
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </motion.section>
        ))}
      </motion.div>
    </PageTransition>
  )
}

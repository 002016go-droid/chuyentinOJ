import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { Compass, CalendarClock, GitBranch } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { loadAllProblems, loadExternalPractice, loadLearning } from '../lib/problemLoader'
import type { ExternalPractice, LearningItem, Problem } from '../lib/types'
import { db } from '../lib/db'
import toast from 'react-hot-toast'
import { staggerContainer, fadeUp } from '../lib/motion'

export function LearningPage() {
  const [items, setItems] = useState<LearningItem[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const [external, setExternal] = useState<ExternalPractice[]>([])
  const progress = useLiveQuery(() => db.learning.toArray(), []) ?? []
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []

  useEffect(() => {
    Promise.all([loadLearning(), loadAllProblems(), loadExternalPractice()]).then(
      ([l, p, ex]) => {
        setItems(l)
        setProblems(p)
        setExternal(ex)
      },
    )
  }, [])

  const solvedSet = useMemo(() => {
    const s = new Set<string>()
    for (const x of subs) if (x.verdict === 'AC') s.add(x.problemSlug)
    return s
  }, [subs])

  const statusMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const p of progress) m.set(p.itemSlug, p.status)
    return m
  }, [progress])

  async function setStatus(slug: string, status: 'not_started' | 'in_progress' | 'template_mastered' | 'ac') {
    const existing = await db.learning.where('itemSlug').equals(slug).first()
    if (existing) {
      await db.learning.update(existing.id!, { status, updatedAt: new Date() })
    } else {
      await db.learning.add({ itemSlug: slug, status, updatedAt: new Date() })
    }
    toast.success('Đã cập nhật tiến độ')
  }

  const day1 = items.filter((i) => i.day === 1).sort((a, b) => sortBlock(a, b))
  const day2 = items.filter((i) => i.day === 2).sort((a, b) => sortBlock(a, b))

  const acCount = items.filter((i) => statusMap.get(i.slug) === 'ac').length

  return (
    <PageTransition>
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mb-6"
      >
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="amber">80% kiến thức trọng tâm — 2 ngày</Badge>
              <h1 className="mt-2 font-display text-3xl">⚡ Học gấp tới NBK Đà Nẵng</h1>
              <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
                Lộ trình 2 ngày tập trung vào 8 chủ đề chiếm ~80% điểm trong đề chuyên Tin
                NBK / Quảng Nam: I/O, sorting, two-pointer, prefix sum, binary search, greedy, DP cơ
                bản, BFS/DFS.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="font-display text-3xl text-[var(--accent-green)]">
                {acCount}/{items.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                bài đạt AC
              </div>
              <Link to="/learning/templates" className="btn btn-ghost mt-1">
                <GitBranch size={14} /> Templates
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <DayBlock
          title="📅 Ngày 1 — Nền tảng"
          items={day1}
          statusMap={statusMap}
          solvedSet={solvedSet}
          problems={problems}
          setStatus={setStatus}
        />
        <DayBlock
          title="📅 Ngày 2 — DP & Đồ thị"
          items={day2}
          statusMap={statusMap}
          solvedSet={solvedSet}
          problems={problems}
          setStatus={setStatus}
        />

        {external.length > 0 && (
          <motion.section variants={fadeUp}>
            <h2 className="mb-3 font-display text-xl">
              <Compass size={18} className="mr-1 inline" />
              Luyện tập bên ngoài
            </h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {external.map((e) => (
                <a
                  key={e.slug}
                  href={e.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card hover>
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="blue">{e.sourceName}</Badge>
                      <Badge tone="muted">Khó {e.difficulty}/10</Badge>
                    </div>
                    <h3 className="mt-2 font-display text-base">{e.title}</h3>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {e.topic} · {e.note}
                    </p>
                  </Card>
                </a>
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </PageTransition>
  )
}

function sortBlock(a: LearningItem, b: LearningItem) {
  const order = ['sáng', 'chiều', 'tối']
  return order.indexOf(a.block) - order.indexOf(b.block)
}

interface DayProps {
  title: string
  items: LearningItem[]
  statusMap: Map<string, string>
  solvedSet: Set<string>
  problems: Problem[]
  setStatus: (slug: string, status: 'not_started' | 'in_progress' | 'template_mastered' | 'ac') => void
}

function DayBlock({ title, items, statusMap, solvedSet, problems, setStatus }: DayProps) {
  return (
    <motion.section variants={fadeUp}>
      <h2 className="mb-3 font-display text-xl">
        <CalendarClock size={18} className="mr-1 inline" /> {title}
      </h2>
      <div className="space-y-3">
        {items.map((it) => {
          const status = statusMap.get(it.slug) ?? 'not_started'
          const solvedPracticeCount = it.practiceProblems.filter((s) => solvedSet.has(s)).length
          return (
            <Card key={it.slug} hover>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="amber">{it.block}</Badge>
                    <Badge tone="muted">{it.duration}</Badge>
                    <Badge
                      tone={
                        status === 'ac'
                          ? 'green'
                          : status === 'template_mastered'
                            ? 'blue'
                            : status === 'in_progress'
                              ? 'amber'
                              : 'muted'
                      }
                    >
                      {status}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-display text-lg">{it.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{it.goal}</p>

                  <div className="mt-2 flex flex-wrap gap-1 text-xs">
                    {it.practiceProblems.map((slug) => {
                      const p = problems.find((pp) => pp.slug === slug)
                      if (!p)
                        return (
                          <span
                            key={slug}
                            className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[var(--text-muted)]"
                          >
                            {slug} (TBA)
                          </span>
                        )
                      const isSolved = solvedSet.has(slug)
                      return (
                        <Link
                          key={slug}
                          to={`/problem/${slug}`}
                          className={`rounded-md border px-2 py-0.5 ${
                            isSolved
                              ? 'border-[var(--accent-green)]/40 bg-[rgba(74,222,128,0.08)] text-[var(--accent-green)]'
                              : 'border-[var(--border)] hover:border-[var(--border-glow)]'
                          }`}
                        >
                          {isSolved ? '✓' : '○'} {p.title}
                        </Link>
                      )
                    })}
                  </div>
                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    {solvedPracticeCount}/{it.practiceProblems.length} bài đã AC
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <button
                    className="btn btn-ghost py-1"
                    onClick={() => setStatus(it.slug, 'in_progress')}
                  >
                    Đang học
                  </button>
                  <button
                    className="btn btn-ghost py-1"
                    onClick={() => setStatus(it.slug, 'template_mastered')}
                  >
                    Đã nhớ template
                  </button>
                  <button
                    className="btn btn-primary py-1"
                    onClick={() => setStatus(it.slug, 'ac')}
                  >
                    Đã AC bài chính
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </motion.section>
  )
}

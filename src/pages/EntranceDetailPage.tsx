import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { StarRating } from '../components/ui/StarRating'
import { VerdictBadge } from '../components/ui/VerdictBadge'
import { loadAllProblems, loadEntranceExams } from '../lib/problemLoader'
import type { EntranceExam, Problem } from '../lib/types'
import { db } from '../lib/db'

export function EntranceDetailPage() {
  const { examId } = useParams<{ examId: string }>()
  const [exam, setExam] = useState<EntranceExam | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []

  useEffect(() => {
    Promise.all([loadEntranceExams(), loadAllProblems()]).then(([es, ps]) => {
      const e = es.find((x) => x.id === examId) ?? null
      setExam(e)
      if (e) setProblems(ps.filter((p) => e.problems.includes(p.slug)))
    })
  }, [examId])

  if (!exam) {
    return (
      <PageTransition>
        <p className="text-sm text-[var(--text-muted)]">Đang tải đề tuyển sinh...</p>
      </PageTransition>
    )
  }

  const verdictMap = new Map<string, (typeof subs)[number]>()
  for (const s of subs) {
    const prev = verdictMap.get(s.problemSlug)
    if (!prev || s.score > prev.score) verdictMap.set(s.problemSlug, s)
  }

  return (
    <PageTransition>
      <Link to="/entrance" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)]">
        ← Trở về danh sách đề tuyển sinh
      </Link>
      <h1 className="mt-1 font-display text-3xl">{exam.title}</h1>
      <div className="mt-1 flex flex-wrap gap-2">
        <Badge tone="coral">{exam.year}</Badge>
        <Badge tone="muted">{exam.school}</Badge>
        <Badge tone="amber">{exam.duration} phút</Badge>
        {exam.difficultyLabel && <Badge tone="red">{exam.difficultyLabel}</Badge>}
      </div>

      <Card className="mt-6 p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Bài</th>
              <th className="px-3 py-2 text-left">Khó</th>
              <th className="px-3 py-2 text-left">Tags</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {exam.problems.map((slug, idx) => {
              const p = problems.find((pp) => pp.slug === slug)
              if (!p) {
                return (
                  <tr key={slug} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2 font-mono">{idx + 1}</td>
                    <td className="px-3 py-2 text-[var(--text-muted)]">
                      {slug} (TBA — bài đang biên soạn)
                    </td>
                    <td colSpan={3} />
                  </tr>
                )
              }
              const sub = verdictMap.get(slug)
              return (
                <tr
                  key={slug}
                  className="border-t border-[var(--border)] hover:bg-[var(--bg-elevated)]"
                >
                  <td className="px-3 py-2 font-mono text-[var(--text-muted)]">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <Link
                      to={`/problem/${slug}`}
                      className="font-medium hover:text-[var(--accent-cyan)]"
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
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </PageTransition>
  )
}

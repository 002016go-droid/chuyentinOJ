import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { loadAllProblems } from '../lib/problemLoader'
import type { Problem } from '../lib/types'

export function HiddenPage({ unlocked }: { unlocked: boolean }) {
  const [problems, setProblems] = useState<Problem[]>([])
  useEffect(() => {
    loadAllProblems().then((all) => {
      setProblems(all.filter((p) => p.module === 'hidden' || p.tags.includes('hidden')))
    })
  }, [])

  if (!unlocked) return <Navigate to="/" replace />

  return (
    <PageTransition>
      <h1 className="font-display text-3xl">👁 Bài ẩn</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Top 0.1% mới giải được — bộ sưu tập các bài đặc biệt khó.
      </p>
      {problems.length === 0 ? (
        <Card className="mt-6">
          <p className="text-sm text-[var(--text-muted)]">
            Khu vực này hiện chưa có bài. Hãy quay lại sau hoặc tự thêm qua{' '}
            <Link to="/admin" className="text-[var(--accent-cyan)]">
              /admin
            </Link>
            .
          </p>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {problems.map((p) => (
            <Link key={p.slug} to={`/problem/${p.slug}`} className="block">
              <Card hover>
                <Badge tone="purple">Hidden</Badge>
                <h3 className="mt-2 font-display text-lg">{p.title}</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {p.source} · Khó {p.difficulty}/10
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageTransition>
  )
}

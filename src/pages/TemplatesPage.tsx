import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Copy, GitBranch } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { loadAllProblems, loadTemplates } from '../lib/problemLoader'
import type { AlgoTemplate, Problem } from '../lib/types'
import { db } from '../lib/db'

export function TemplatesPage() {
  const [templates, setTemplates] = useState<AlgoTemplate[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []

  useEffect(() => {
    Promise.all([loadTemplates(), loadAllProblems()]).then(([t, p]) => {
      setTemplates(t)
      setProblems(p)
      if (t[0]) setActive(t[0].slug)
    })
  }, [])

  const activeTpl = templates.find((t) => t.slug === active) ?? null
  const solvedSet = new Set(subs.filter((s) => s.verdict === 'AC').map((s) => s.problemSlug))

  function copyCode(code: string, slug: string) {
    navigator.clipboard.writeText(code)
    setCopied(slug)
    setTimeout(() => setCopied(null), 1500)
    toast.success('Đã copy template')
  }

  return (
    <PageTransition>
      <Link to="/learning" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)]">
        ← Trở về Learning
      </Link>
      <h1 className="mt-1 font-display text-3xl">
        <GitBranch size={24} className="mr-1 inline" />
        Template Library
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        Các template C++ thường dùng — nhớ thuộc, áp dụng nhanh trong phòng thi.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="p-2">
          <ul className="space-y-1">
            {templates.map((t) => (
              <li key={t.slug}>
                <button
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm ${
                    active === t.slug
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'
                  }`}
                  onClick={() => setActive(t.slug)}
                >
                  <span>{t.name}</span>
                  <Badge tone="muted">{t.complexity}</Badge>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {activeTpl && (
          <Card>
            <h2 className="font-display text-2xl">{activeTpl.name}</h2>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge tone="blue">{activeTpl.complexity}</Badge>
              <span className="text-xs text-[var(--text-muted)]">{activeTpl.whenToUse}</span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
              <Info title="🔍 Dấu hiệu" body={activeTpl.signs} />
              <Info title="💡 Ý tưởng" body={activeTpl.idea} />
              <Info title="❗ Lỗi thường gặp" body={activeTpl.commonMistakes} />
              <Info title="🧮 Độ phức tạp" body={activeTpl.complexity} />
            </div>
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg-void)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                  template.cpp
                </span>
                <button
                  className="btn btn-ghost py-1 px-2 text-xs"
                  onClick={() => copyCode(activeTpl.code, activeTpl.slug)}
                >
                  {copied === activeTpl.slug ? <Check size={12} /> : <Copy size={12} />} Copy
                </button>
              </div>
              <pre className="max-h-[50vh] overflow-auto p-3 text-xs">
                <code className="font-mono">{activeTpl.code}</code>
              </pre>
            </div>
            <h3 className="mt-4 font-display text-base">Bài luyện áp dụng</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeTpl.practiceProblems.map((slug) => {
                const p = problems.find((pp) => pp.slug === slug)
                if (!p)
                  return (
                    <span
                      key={slug}
                      className="rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                    >
                      {slug} (TBA)
                    </span>
                  )
                const ac = solvedSet.has(slug)
                return (
                  <Link
                    key={slug}
                    to={`/problem/${slug}`}
                    className={`rounded-md border px-2 py-0.5 text-xs ${
                      ac
                        ? 'border-[var(--accent-green)] bg-[rgba(74,222,128,0.08)] text-[var(--accent-green)]'
                        : 'border-[var(--border)] hover:border-[var(--border-glow)]'
                    }`}
                  >
                    {ac ? '✓' : '○'} {p.title}
                  </Link>
                )
              })}
            </div>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-3">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {title}
      </div>
      <div className="text-sm">{body}</div>
    </div>
  )
}

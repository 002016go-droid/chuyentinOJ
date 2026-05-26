import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {
  ArrowLeft,
  BookOpen,
  Target,
  ListChecks,
  ExternalLink,
  Code2,
  Library,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Badge } from '../components/ui/Badge'
import { loadProblem, loadRoadmap, loadTheoryDeep } from '../lib/problemLoader'
import { db, type Verdict } from '../lib/db'
import type { ExternalRef, Problem, RoadmapData, RoadmapNode, TheoryDeep } from '../lib/types'

const TIER_TONE: Record<RoadmapNode['difficulty'], 'green' | 'blue' | 'amber' | 'red' | 'purple'> = {
  basic: 'green',
  intermediate: 'blue',
  advanced: 'amber',
  expert: 'red',
  ioi: 'purple',
}

const DIFF_TONE: Record<string, 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'muted'> = {
  easy: 'green',
  medium: 'blue',
  hard: 'red',
}

function refTone(ref: ExternalRef): 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'muted' {
  if (ref.difficulty) {
    return DIFF_TONE[ref.difficulty] ?? 'muted'
  }
  return 'muted'
}

function ReferenceRow({ item }: { item: ExternalRef }) {
  return (
    <li className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm transition hover:bg-[var(--bg-hover)]">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center gap-2 text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
      >
        <ExternalLink size={14} className="text-[var(--text-muted)]" />
        <span>{item.label}</span>
      </a>
      {item.source && (
        <span className="rounded bg-[var(--bg-elevated)] px-1.5 py-[1px] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          {item.source}
        </span>
      )}
      {item.difficulty && <Badge tone={refTone(item)}>{item.difficulty}</Badge>}
    </li>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="card mb-4">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-[var(--text-primary)]">
        <Icon size={18} className="text-[var(--accent-primary)]" />
        {title}
      </h2>
      {children}
    </section>
  )
}

export function TopicPage() {
  const params = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<RoadmapData | null>(null)
  const [problemMeta, setProblemMeta] = useState<Record<string, Problem>>({})
  const [theoryDeep, setTheoryDeep] = useState<TheoryDeep | null>(null)
  const submissions = useLiveQuery(() => db.submissions.toArray(), []) ?? []

  useEffect(() => {
    loadRoadmap().then(setData).catch(() => {})
  }, [])

  useEffect(() => {
    if (!params.topicId) return
    setTheoryDeep(null)
    loadTheoryDeep(params.topicId)
      .then((td) => setTheoryDeep(td))
      .catch(() => setTheoryDeep(null))
  }, [params.topicId])

  const node = useMemo<RoadmapNode | null>(() => {
    if (!data || !params.topicId) return null
    return data.nodes.find((n) => n.id === params.topicId) ?? null
  }, [data, params.topicId])

  useEffect(() => {
    if (!node) return
    const missing = node.problems.filter((s) => !problemMeta[s])
    if (missing.length === 0) return
    Promise.all(missing.map((s) => loadProblem(s).catch(() => null))).then((results) => {
      setProblemMeta((prev) => {
        const next = { ...prev }
        results.forEach((p, idx) => {
          if (p) next[missing[idx]] = p
        })
        return next
      })
    })
  }, [node, problemMeta])

  const bestVerdictMap = useMemo(() => {
    const m = new Map<string, Verdict>()
    const order: Record<Verdict, number> = {
      AC: 6,
      WA: 5,
      TLE: 4,
      MLE: 3,
      RE: 2,
      CE: 1,
      Pending: 0,
    }
    for (const s of submissions) {
      const cur = m.get(s.problemSlug)
      if (!cur || order[s.verdict] > order[cur]) m.set(s.problemSlug, s.verdict)
    }
    return m
  }, [submissions])

  if (!data) {
    return (
      <PageTransition>
        <div className="grid h-[60vh] place-items-center text-sm text-[var(--text-muted)]">
          Đang tải lý thuyết...
        </div>
      </PageTransition>
    )
  }

  if (!node) {
    return (
      <PageTransition>
        <div className="card mx-auto max-w-2xl text-center">
          <h1 className="font-display text-2xl">Không tìm thấy chuyên đề</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Slug <code>{params.topicId}</code> không có trong lộ trình.
          </p>
          <button
            type="button"
            onClick={() => navigate('/roadmap')}
            className="btn btn-primary mt-4"
          >
            ← Về Lộ trình
          </button>
        </div>
      </PageTransition>
    )
  }

  const prereqNodes = node.prerequisites
    .map((id) => data.nodes.find((n) => n.id === id))
    .filter((n): n is RoadmapNode => Boolean(n))

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link to="/roadmap" className="flex items-center gap-1 hover:text-[var(--accent-primary)]">
            <ArrowLeft size={14} /> Lộ trình
          </Link>
          <span>/</span>
          <span className="font-mono text-xs uppercase tracking-wider">{node.label}</span>
        </div>

        {/* Header */}
        <div className="card mb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                {node.day ? `Day ${node.day} · ` : ''}
                {node.label}
              </div>
              <h1 className="mt-1 font-display text-3xl text-[var(--text-primary)]">{node.labelVi}</h1>
              <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
                {node.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={TIER_TONE[node.difficulty]}>{node.difficulty}</Badge>
              <Badge tone="muted">{node.complexity}</Badge>
              {node.tier && <Badge tone="purple">{node.tier}</Badge>}
              {node.skills?.map((s) => (
                <Badge key={s} tone="blue">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            {/* Objectives */}
            {node.objectives && node.objectives.length > 0 && (
              <Section icon={Target} title="Bạn sẽ học được gì?">
                <ul className="space-y-1.5 text-sm text-[var(--text-primary)]">
                  {node.objectives.map((o, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--accent-primary)]">•</span>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <span>{children}</span>,
                          code: ({ children }) => (
                            <code className="rounded bg-[var(--bg-elevated)] px-1 py-0.5 font-mono text-[12px]">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {o}
                      </ReactMarkdown>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Theory */}
            {node.theoryFull && (
              <Section icon={BookOpen} title="Lý thuyết">
                <div className="topic-markdown text-sm leading-relaxed text-[var(--text-primary)]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{node.theoryFull}</ReactMarkdown>
                </div>
              </Section>
            )}

            {/* Deep theory crawled from VNOI Wiki / CP-Algorithms */}
            {theoryDeep && theoryDeep.sources.length > 0 && (
              <Section icon={Library} title="Tài liệu chuyên sâu (đã tổng hợp)">
                <p className="mb-3 text-xs text-[var(--text-muted)]">
                  Nội dung được tổng hợp lại từ các nguồn mở (CC-BY-SA). Mở rộng để đọc, kèm hình minh
                  hoạ và code gốc. Mỗi mục có link tới bài gốc để bạn xem định dạng đầy đủ.
                </p>
                <div className="space-y-2">
                  {theoryDeep.sources.map((src) => (
                    <details
                      key={src.url}
                      className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)]"
                    >
                      <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-[var(--bg-hover)]">
                        <span className="flex flex-wrap items-center gap-2">
                          <ChevronDown size={14} className="text-[var(--text-muted)]" />
                          <span className="font-semibold text-[var(--text-primary)]">{src.title}</span>
                          <span className="rounded bg-[var(--bg-elevated)] px-1.5 py-[1px] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                            {src.source}
                          </span>
                        </span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline"
                        >
                          <ExternalLink size={12} /> bài gốc
                        </a>
                      </summary>
                      <div className="border-t border-[var(--border)] px-4 py-3">
                        <div className="topic-markdown text-sm leading-relaxed text-[var(--text-primary)]">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {src.markdown}
                          </ReactMarkdown>
                        </div>
                        {src.license && (
                          <p className="mt-3 border-t border-dashed border-[var(--border)] pt-2 text-[11px] text-[var(--text-muted)]">
                            Nguồn: <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--accent-primary)] hover:underline"
                            >
                              {src.title}
                            </a>{' '}
                            · Giấy phép: {src.license}
                          </p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </Section>
            )}

            {/* Code example */}
            {node.codeExample && (
              <Section icon={Code2} title="Code mẫu">
                <pre className="overflow-auto rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[12px]">
                  <code className="font-mono">{node.codeExample}</code>
                </pre>
              </Section>
            )}

            {/* Reference problems */}
            {node.referenceProblems && node.referenceProblems.length > 0 && (
              <Section
                icon={ExternalLink}
                title={`Bài tham khảo bên ngoài (${node.referenceProblems.length})`}
              >
                <ul className="space-y-2">
                  {node.referenceProblems.map((r, i) => (
                    <ReferenceRow key={`${r.url}-${i}`} item={r} />
                  ))}
                </ul>
              </Section>
            )}

            {/* Internal study problems */}
            {node.problems.length > 0 && (
              <Section icon={ListChecks} title={`Bài luyện nội bộ (${node.problems.length})`}>
                <ul className="space-y-2">
                  {node.problems.map((slug) => {
                    const meta = problemMeta[slug]
                    const verdict = bestVerdictMap.get(slug)
                    return (
                      <li key={slug}>
                        <Link
                          to={`/problem/${slug}`}
                          className={`problem-card block ${verdict ? `verdict-${verdict}` : ''}`}
                        >
                          <span className="verdict-stripe" />
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                              {meta?.title ?? slug}
                            </span>
                            {verdict && (
                              <span
                                className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold"
                                style={{
                                  color: `var(--verdict-${verdict.toLowerCase()})`,
                                  background: `var(--verdict-${verdict.toLowerCase()}-bg)`,
                                }}
                              >
                                {verdict}
                              </span>
                            )}
                          </div>
                          {meta && (
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                              <span className="font-mono">{'★'.repeat(meta.difficulty)}</span>
                              {meta.tags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="rounded bg-[var(--bg-elevated)] px-1.5 py-[1px] font-mono"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </Section>
            )}
          </div>

          <aside className="space-y-4">
            {/* Requirements */}
            {node.requirements && node.requirements.length > 0 && (
              <div className="card">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Yêu cầu
                </h3>
                <ul className="space-y-1 text-sm text-[var(--text-primary)]">
                  {node.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--accent-amber)]">▸</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prereqNodes.length > 0 && (
              <div className="card">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Chuyên đề trước
                </h3>
                <ul className="space-y-1 text-sm">
                  {prereqNodes.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/topic/${p.id}`}
                        className="flex items-center gap-1 text-[var(--accent-primary)] hover:underline"
                      >
                        ← {p.labelVi}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Study method */}
            {node.studyMethod && node.studyMethod.length > 0 && (
              <div className="card">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Cách học
                </h3>
                <ol className="list-decimal space-y-1 pl-4 text-sm text-[var(--text-primary)]">
                  {node.studyMethod.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Legacy resources */}
            {node.resources && node.resources.length > 0 && (
              <div className="card">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Tài liệu thêm
                </h3>
                <ul className="space-y-1 text-sm">
                  {node.resources.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent-primary)] hover:underline"
                      >
                        ↗ {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}

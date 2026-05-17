import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Download, FileText, Upload, Save, Trash2 } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProblemStatement } from '../components/problem/ProblemStatement'
import type { Problem, TestCase, Subtask, SampleIO } from '../lib/types'
import { loadAllProblems, loadProblem } from '../lib/problemLoader'
import { db } from '../lib/db'

const DRAFT_KEY = 'chuyentin:admin:drafts'

interface Draft {
  slug: string
  json: string
  updatedAt: string
}

function readDrafts(): Draft[] {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '[]')
  } catch {
    return []
  }
}
function writeDrafts(d: Draft[]) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(d))
}

const TEMPLATE: Problem = {
  slug: 'new-problem',
  title: 'Tên bài mới',
  module: 'roadmap',
  difficulty: 5,
  maxStars: 5,
  tags: ['array'],
  source: 'Thủ công',
  statement: '## Đề bài\n\nMô tả bài toán ở đây. Có thể dùng KaTeX: $a^2 + b^2 = c^2$.',
  subtasks: [
    {
      id: 'subtask-1',
      label: 'Subtask 1',
      points: 30,
      constraint: 'N ≤ 1000',
      hint: { id: 'h1', content: 'Gợi ý 1', starCost: 0.5 },
    },
    {
      id: 'subtask-2',
      label: 'Subtask 2',
      points: 30,
      constraint: 'N ≤ 100000',
      hint: { id: 'h2', content: 'Gợi ý 2', starCost: 1 },
    },
    {
      id: 'subtask-3',
      label: 'Subtask 3',
      points: 40,
      constraint: 'N ≤ 1000000',
      hint: { id: 'h3', content: 'Gợi ý 3', starCost: 1.5 },
    },
  ],
  samples: [{ input: '1\n', output: '1\n', explanation: '' }],
  testCases: [{ id: 1, subtaskId: 'subtask-1', input: '1\n', output: '1\n' }],
  timeLimitMs: 1000,
  memoryLimitKB: 262144,
}

interface ValidationResult {
  ok: boolean
  errors: string[]
  warnings: string[]
}

function validate(p: Problem): ValidationResult {
  const errs: string[] = []
  const warns: string[] = []
  if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) errs.push('Slug phải là kebab-case (a-z, 0-9, -)')
  if (!p.title?.trim()) errs.push('Thiếu tiêu đề')
  if (!p.statement?.trim()) errs.push('Thiếu đề bài')
  if (!Array.isArray(p.subtasks) || p.subtasks.length === 0)
    errs.push('Thiếu subtasks')
  else {
    const total = p.subtasks.reduce((a, b) => a + (b.points ?? 0), 0)
    if (total !== 100) errs.push(`Tổng điểm subtask phải = 100 (hiện ${total})`)
  }
  if (!Array.isArray(p.testCases) || p.testCases.length === 0)
    errs.push('Cần ít nhất 1 test case')
  if (!Array.isArray(p.samples) || p.samples.length === 0)
    warns.push('Nên có ít nhất 1 sample IO')
  if ((p.difficulty ?? 0) < 1 || p.difficulty > 10)
    warns.push('Độ khó nên ở [1..10]')
  return { ok: errs.length === 0, errors: errs, warnings: warns }
}

export function AdminPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [jsonText, setJsonText] = useState('')
  const [allProblems, setAllProblems] = useState<Problem[]>([])
  const [drafts, setDrafts] = useState<Draft[]>(readDrafts())
  const [parsed, setParsed] = useState<Problem | null>(null)
  const [validation, setValidation] = useState<ValidationResult>({
    ok: true,
    errors: [],
    warnings: [],
  })

  const submissions = useLiveQuery(() => db.submissions.count(), [])

  useEffect(() => {
    loadAllProblems().then(setAllProblems).catch(() => {})
  }, [])

  useEffect(() => {
    try {
      const obj = JSON.parse(jsonText) as Problem
      setParsed(obj)
      setValidation(validate(obj))
    } catch (e) {
      setParsed(null)
      setValidation({ ok: false, errors: [String(e)], warnings: [] })
    }
  }, [jsonText])

  function loadTemplate() {
    setActiveSlug('new')
    setJsonText(JSON.stringify(TEMPLATE, null, 2))
  }

  async function loadExisting(slug: string) {
    const p = await loadProblem(slug)
    setActiveSlug(slug)
    setJsonText(JSON.stringify(p, null, 2))
  }

  function saveDraft() {
    if (!parsed) return
    const slug = parsed.slug
    const next = drafts.filter((d) => d.slug !== slug).concat({
      slug,
      json: jsonText,
      updatedAt: new Date().toISOString(),
    })
    writeDrafts(next)
    setDrafts(next)
    toast.success(`Đã lưu draft ${slug}`)
  }

  function loadDraft(slug: string) {
    const d = drafts.find((x) => x.slug === slug)
    if (d) {
      setActiveSlug(slug)
      setJsonText(d.json)
    }
  }

  function deleteDraft(slug: string) {
    if (!confirm(`Xoá draft ${slug}?`)) return
    const next = drafts.filter((d) => d.slug !== slug)
    writeDrafts(next)
    setDrafts(next)
  }

  function downloadJson() {
    if (!parsed) return
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${parsed.slug}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function uploadJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then((t) => {
      try {
        const obj = JSON.parse(t) as Problem
        setActiveSlug(obj.slug)
        setJsonText(JSON.stringify(obj, null, 2))
        toast.success(`Đã nạp ${obj.slug}`)
      } catch (e) {
        toast.error(`File không hợp lệ: ${String(e)}`)
      }
    })
  }

  return (
    <PageTransition>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl">🛠 Admin / Tự thêm bài</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Tạo bài, sửa bài, validate JSON, preview live trước khi cam kết vào{' '}
            <code>public/data/problems/</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={loadTemplate}>
            <FileText size={14} /> Bài mới
          </Button>
          <label className="btn btn-ghost cursor-pointer">
            <Upload size={14} /> Tải JSON...
            <input type="file" accept=".json" className="hidden" onChange={uploadJson} />
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr_1fr]">
        <Card className="p-2">
          <h3 className="mb-2 px-2 pt-1 font-display text-sm">📚 Bài hiện có ({allProblems.length})</h3>
          <ul className="max-h-[26vh] overflow-y-auto">
            {allProblems.map((p) => (
              <li key={p.slug}>
                <button
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-[var(--bg-elevated)] ${
                    activeSlug === p.slug ? 'bg-[var(--bg-elevated)]' : ''
                  }`}
                  onClick={() => loadExisting(p.slug)}
                >
                  <span className="truncate">{p.title}</span>
                  <Badge tone="muted">{p.module}</Badge>
                </button>
              </li>
            ))}
          </ul>
          <h3 className="mt-3 mb-2 px-2 font-display text-sm">📝 Drafts ({drafts.length})</h3>
          <ul className="max-h-[26vh] overflow-y-auto">
            {drafts.map((d) => (
              <li
                key={d.slug}
                className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-[var(--bg-elevated)]"
              >
                <button
                  className="flex-1 truncate text-left text-xs"
                  onClick={() => loadDraft(d.slug)}
                >
                  {d.slug}
                </button>
                <button
                  className="rounded p-1 text-[var(--text-muted)] hover:text-[var(--accent-red)]"
                  onClick={() => deleteDraft(d.slug)}
                >
                  <Trash2 size={12} />
                </button>
              </li>
            ))}
            {drafts.length === 0 && (
              <li className="px-2 text-[10px] text-[var(--text-muted)]">
                Chưa có draft nào.
              </li>
            )}
          </ul>
          <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-2 text-[10px] text-[var(--text-muted)]">
            DB stats: {submissions ?? 0} submission(s) trong IndexedDB.
            <br />
            <Link to="/profile" className="text-[var(--accent-cyan)]">
              Backup/Restore →
            </Link>
          </div>
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-2 text-xs">
            <span className="font-mono text-[var(--text-muted)]">
              {activeSlug ?? '(chưa chọn bài)'}
            </span>
            <div className="flex gap-1">
              <Button onClick={saveDraft} variant="ghost" disabled={!parsed}>
                <Save size={12} /> Lưu draft
              </Button>
              <Button onClick={downloadJson} disabled={!validation.ok}>
                <Download size={12} /> Tải JSON
              </Button>
            </div>
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Dán/viết JSON bài tập ở đây..."
            spellCheck={false}
            className="h-[70vh] w-full resize-none rounded-md border-0 bg-[var(--bg-void)] p-3 font-mono text-xs outline-none"
          />
        </Card>

        <Card className="p-3 overflow-y-auto" style={{ maxHeight: '78vh' }}>
          <h3 className="mb-2 font-display text-base">👁 Preview</h3>
          <div className="mb-2 space-y-1 text-xs">
            {validation.errors.map((e, i) => (
              <div key={i} className="rounded-md border border-[var(--accent-red)]/40 bg-[rgba(248,113,113,0.08)] px-2 py-1 text-[var(--accent-red)]">
                ❌ {e}
              </div>
            ))}
            {validation.warnings.map((w, i) => (
              <div key={i} className="rounded-md border border-[var(--accent-amber)]/40 bg-[rgba(251,191,36,0.08)] px-2 py-1 text-[var(--accent-amber)]">
                ⚠️ {w}
              </div>
            ))}
            {validation.ok && validation.warnings.length === 0 && (
              <div className="rounded-md border border-[var(--accent-green)]/40 bg-[rgba(74,222,128,0.08)] px-2 py-1 text-[var(--accent-green)]">
                ✅ Hợp lệ — có thể tải xuống và đặt vào public/data/problems/
              </div>
            )}
          </div>
          {parsed && (
            <div>
              <h2 className="font-display text-xl">{parsed.title}</h2>
              <div className="mt-1 flex flex-wrap gap-1">
                <Badge tone="muted">{parsed.source}</Badge>
                <Badge tone="blue">{parsed.module}</Badge>
                <Badge tone="amber">Khó {parsed.difficulty}/10</Badge>
                {parsed.tags?.map((t) => (
                  <Badge key={t} tone="purple">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <ProblemStatement content={parsed.statement || ''} />
              </div>
              <h3 className="mt-3 font-display text-sm">Subtasks</h3>
              <ul className="space-y-1 text-xs">
                {parsed.subtasks?.map((s: Subtask) => (
                  <li key={s.id} className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1">
                    <strong>{s.label}</strong> — {s.points}đ — {s.constraint}
                  </li>
                ))}
              </ul>
              <h3 className="mt-3 font-display text-sm">
                {parsed.testCases?.length ?? 0} test · {parsed.samples?.length ?? 0} sample
              </h3>
              {parsed.samples?.[0] && (
                <pre className="mt-1 max-h-32 overflow-auto rounded-md border border-[var(--border)] bg-[var(--bg-void)] p-2 text-[10px]">
                  <code className="font-mono">
                    in:
                    {'\n'}
                    {(parsed.samples[0] as SampleIO).input}
                    {'\n'}out:{'\n'}
                    {(parsed.samples[0] as SampleIO).output}
                  </code>
                </pre>
              )}
              <h3 className="mt-3 font-display text-sm">
                {parsed.testCases?.length ?? 0} test case{(parsed.testCases?.length ?? 0) > 1 && 's'}
              </h3>
              <ul className="mt-1 grid grid-cols-5 gap-1">
                {(parsed.testCases ?? []).map((t: TestCase) => (
                  <li
                    key={t.id}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-1 py-0.5 text-center text-[10px]"
                  >
                    #{t.id} ({t.subtaskId})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </PageTransition>
  )
}

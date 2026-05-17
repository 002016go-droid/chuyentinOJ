import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { Play, RefreshCw, Rocket, Maximize2, History, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { StarRating } from '../components/ui/StarRating'
import { VerdictBadge } from '../components/ui/VerdictBadge'
import { TestCaseGrid } from '../components/ui/TestCaseGrid'
import { Modal } from '../components/ui/Modal'
import { CodeEditor } from '../components/editor/CodeEditor'
import { ProblemStatement } from '../components/problem/ProblemStatement'
import { SubtaskTable } from '../components/problem/SubtaskTable'
import { HintAccordion } from '../components/problem/HintAccordion'
import { SampleIOBlock } from '../components/problem/SampleIO'
import { VerdictPanel } from '../components/judge/VerdictPanel'
import {
  loadAllProblems,
  loadContests,
  loadEntranceExams,
  loadProblem,
} from '../lib/problemLoader'
import type { Problem, TestCase } from '../lib/types'
import { db, type Submission, type Verdict, type TestResult } from '../lib/db'
import { runBatch, judgePing, runTest, JUDGE0_URL } from '../lib/judge0'
import { useShortcut } from '../hooks/useKeyboardShortcuts'

interface Props {
  onThreeWA: () => void
}

interface CellState {
  verdict: Verdict | null
  time?: number
  memory?: number
  subtaskId?: string
  stdout?: string
  expected?: string
}

export function ProblemPage({ onThreeWA }: Props) {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [running, setRunning] = useState<'sample' | 'full' | null>(null)
  const [judgeDown, setJudgeDown] = useState(false)
  const [results, setResults] = useState<Record<number, CellState>>({})
  const [currentSummary, setCurrentSummary] = useState<{
    verdict: Verdict
    score: number
    stars: number
    time: number | null
    memory: number | null
  } | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [fullEditor, setFullEditor] = useState(false)
  const [tagsRevealed, setTagsRevealed] = useState(false)
  const [pendingTagReveal, setPendingTagReveal] = useState(false)
  const [testDetailId, setTestDetailId] = useState<number | null>(null)
  const [neighbors, setNeighbors] = useState<{ prev?: string; next?: string }>({})
  const [allowFullResultDetails, setAllowFullResultDetails] = useState(false)

  const hintUsage = useLiveQuery(
    async () =>
      slug ? db.hintUsage.where('problemSlug').equals(slug).toArray() : Promise.resolve([]),
    [slug],
  ) ?? []
  const history = useLiveQuery(
    async () =>
      slug
        ? db.submissions
            .where('problemSlug')
            .equals(slug)
            .reverse()
            .sortBy('submittedAt')
            .then((arr) => arr.slice(0, 50))
        : Promise.resolve([]),
    [slug],
  ) ?? []

  useEffect(() => {
    if (!slug) return
    loadProblem(slug)
      .then((p) => {
        setProblem(p)
        setResults({})
        setCurrentSummary(null)
        setTagsRevealed(false)
        setAllowFullResultDetails(false)
      })
      .catch(() => setProblem(null))
  }, [slug])

  useEffect(() => {
    if (!problem) return
    Promise.all([loadContests(), loadEntranceExams(), loadAllProblems()]).then(
      ([cs, es, all]) => {
        const list =
          cs.find((c) => c.problems.includes(problem.slug))?.problems ??
          es.find((e) => e.problems.includes(problem.slug))?.problems ??
          all.map((p) => p.slug)
        const idx = list.indexOf(problem.slug)
        setNeighbors({
          prev: idx > 0 ? list[idx - 1] : undefined,
          next: idx < list.length - 1 ? list[idx + 1] : undefined,
        })
      },
    )
  }, [problem])

  const hintDeducted = useMemo(
    () => hintUsage.reduce((a, b) => a + b.starsDeducted, 0),
    [hintUsage],
  )
  const tagPenalty = tagsRevealed ? 0.5 : 0
  const maxStars = problem ? Math.max(0, problem.maxStars - hintDeducted - tagPenalty) : 5

  const lastSub: Submission | null = history[0] ?? null

  async function runSamples() {
    if (!problem) return
    setBusy(true)
    setRunning('sample')
    setResults({})
    setCurrentSummary({ verdict: 'Pending', score: 0, stars: 0, time: null, memory: null })
    try {
      const ok = await judgePing()
      if (!ok) {
        setJudgeDown(true)
        setBusy(false)
        setRunning(null)
        setCurrentSummary(null)
        return
      }
      const samples = problem.samples
      let acAll = true
      let totalTime = 0
      let maxMem = 0
      for (let i = 0; i < samples.length; i++) {
        const s = samples[i]
        const r = await runTest({
          sourceCode: code,
          stdin: s.input,
          expectedOutput: s.output,
          timeLimit: (problem.timeLimitMs ?? 1000) / 1000,
          memoryLimit: problem.memoryLimitKB ?? 262144,
        })
        const id = -1 - i
        setResults((prev) => ({
          ...prev,
          [id]: {
            verdict: r.verdict,
            time: r.time,
            memory: r.memory,
            stdout: r.stdout,
            expected: s.output,
          },
        }))
        if (r.verdict !== 'AC') acAll = false
        totalTime += r.time
        maxMem = Math.max(maxMem, r.memory)
      }
      setCurrentSummary({
        verdict: acAll ? 'AC' : 'WA',
        score: acAll ? 100 : 0,
        stars: acAll ? maxStars : 0,
        time: totalTime,
        memory: maxMem,
      })
      toast.success(acAll ? 'Test mẫu PASS! Sẵn sàng nộp bài.' : 'Test mẫu FAIL — debug đi nhé.')
    } catch (e) {
      toast.error(`Lỗi judge: ${String(e)}`)
    }
    setBusy(false)
    setRunning(null)
  }

  async function submit() {
    if (!problem) return
    setBusy(true)
    setRunning('full')
    setResults({})
    setCurrentSummary({ verdict: 'Pending', score: 0, stars: 0, time: null, memory: null })
    try {
      const ok = await judgePing()
      if (!ok) {
        setJudgeDown(true)
        setBusy(false)
        setRunning(null)
        setCurrentSummary(null)
        return
      }
      const tests: TestCase[] = problem.testCases
      const collected: Record<number, CellState> = {}
      let maxMem = 0
      let totalTime = 0
      await runBatch(
        code,
        tests.map((t) => ({
          id: t.id,
          input: t.input,
          output: t.output,
          subtaskId: t.subtaskId,
          timeLimit: (problem.timeLimitMs ?? 1000) / 1000,
        })),
        (testId, r) => {
          collected[testId] = {
            verdict: r.verdict,
            time: r.time,
            memory: r.memory,
            subtaskId: tests.find((t) => t.id === testId)?.subtaskId,
          }
          if (r.memory > maxMem) maxMem = r.memory
          totalTime += r.time
          setResults((prev) => ({ ...prev, [testId]: collected[testId] }))
        },
        6,
      )

      // Compute per-subtask score
      let totalScore = 0
      const subtaskResults: TestResult[] = tests.map((t) => {
        const r = collected[t.id]
        return {
          testId: t.id,
          verdict: (r?.verdict ?? 'RE') as TestResult['verdict'],
          time: r?.time ?? 0,
          memory: r?.memory ?? 0,
          subtaskId: t.subtaskId,
        }
      })
      for (const st of problem.subtasks) {
        const rs = subtaskResults.filter((r) => r.subtaskId === st.id)
        if (rs.length > 0 && rs.every((r) => r.verdict === 'AC')) totalScore += st.points
      }
      // Determine final verdict (use worst non-AC)
      let finalVerdict: Verdict = 'AC'
      for (const r of subtaskResults) {
        if (r.verdict !== 'AC') {
          finalVerdict = r.verdict as Verdict
          break
        }
      }
      const stars = totalScore === 100 ? maxStars : (totalScore / 100) * maxStars
      setCurrentSummary({
        verdict: finalVerdict,
        score: totalScore,
        stars,
        time: totalTime,
        memory: maxMem,
      })
      await db.submissions.add({
        problemSlug: problem.slug,
        code,
        language: 'cpp',
        verdict: finalVerdict,
        score: totalScore,
        starsEarned: stars,
        testResults: subtaskResults,
        time: totalTime,
        memory: maxMem,
        submittedAt: new Date(),
      })
      // Update problemStars
      const existing = await db.problemStars
        .where('problemSlug')
        .equals(problem.slug)
        .first()
      if (existing) {
        if (stars > existing.starsEarned) {
          await db.problemStars.update(existing.id!, {
            starsEarned: stars,
            maxStars: problem.maxStars,
            solvedAt: finalVerdict === 'AC' ? new Date() : existing.solvedAt,
          })
        }
      } else {
        await db.problemStars.add({
          problemSlug: problem.slug,
          starsEarned: stars,
          maxStars: problem.maxStars,
          solvedAt: finalVerdict === 'AC' ? new Date() : undefined,
        })
      }

      if (finalVerdict === 'AC') {
        setAllowFullResultDetails(true)
        toast.success(`✅ Accepted! ${totalScore}/100 — ${stars.toFixed(1)} sao`)
      } else if (totalScore > 0) {
        toast(`Partial: ${totalScore}/100 — tiếp tục tối ưu nhé`)
      } else {
        toast.error(`${finalVerdict} — 0/100`)
      }

      const recentWAs = await db.submissions
        .where('problemSlug')
        .equals(problem.slug)
        .reverse()
        .sortBy('submittedAt')
        .then((arr) => arr.slice(0, 3))
      if (recentWAs.length === 3 && recentWAs.every((s) => s.verdict === 'WA')) {
        onThreeWA()
      }
    } catch (e) {
      toast.error(`Lỗi judge: ${String(e)}`)
    }
    setBusy(false)
    setRunning(null)
  }

  useShortcut('ctrl+enter', (e) => {
    e.preventDefault()
    if (!busy) submit()
  }, true)
  useShortcut('ctrl+r', (e) => {
    e.preventDefault()
    if (!busy) runSamples()
  }, true)
  useShortcut('[', () => {
    if (neighbors.prev) navigate(`/problem/${neighbors.prev}`)
  })
  useShortcut(']', () => {
    if (neighbors.next) navigate(`/problem/${neighbors.next}`)
  })
  useShortcut('f', () => setFullEditor((v) => !v))
  useShortcut('t', () => {
    if (!tagsRevealed) setPendingTagReveal(true)
    else setTagsRevealed(false)
  })

  if (!problem) {
    return (
      <PageTransition>
        <p className="text-sm text-[var(--text-muted)]">Đang tải bài...</p>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link to="/contests" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)]">
          ← Trở về danh sách
        </Link>
        <div className="flex items-center gap-1 text-xs">
          {neighbors.prev && (
            <Link to={`/problem/${neighbors.prev}`} className="btn btn-ghost py-1 px-2">
              <ChevronLeft size={14} /> [
            </Link>
          )}
          {neighbors.next && (
            <Link to={`/problem/${neighbors.next}`} className="btn btn-ghost py-1 px-2">
              ] <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </div>

      <div className={`grid gap-4 ${fullEditor ? '' : 'lg:grid-cols-[55%_45%]'}`}>
        {!fullEditor && (
          <div className="space-y-4 min-w-0">
            <Card>
              <h1 className="font-display text-2xl">{problem.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone="muted">{problem.source}</Badge>
                <StarRating value={problem.difficulty / 2} />
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  Độ khó {problem.difficulty}/10
                </span>
                <Badge tone="amber">Sao tối đa: {maxStars.toFixed(1)}</Badge>
                {problem.timeLimitMs && (
                  <Badge tone="muted">⏱ {problem.timeLimitMs}ms</Badge>
                )}
                {problem.memoryLimitKB && (
                  <Badge tone="muted">💾 {(problem.memoryLimitKB / 1024).toFixed(0)}MB</Badge>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {tagsRevealed ? (
                  problem.tags.map((t) => (
                    <Badge key={t} tone="purple">
                      {t}
                    </Badge>
                  ))
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost py-1 px-2 text-xs"
                    onClick={() => setPendingTagReveal(true)}
                  >
                    🏷️ Xem tags (-0.5 ⭐)
                  </button>
                )}
              </div>
              <hr className="my-4 border-[var(--border)]" />
              <ProblemStatement content={problem.statement} />
            </Card>

            <Card>
              <h3 className="mb-3 font-display text-base">📊 Subtasks</h3>
              <SubtaskTable subtasks={problem.subtasks} lastSubmission={lastSub} />
            </Card>

            <Card>
              <h3 className="mb-3 font-display text-base">💡 Gợi ý</h3>
              <HintAccordion
                problemSlug={problem.slug}
                subtasks={problem.subtasks}
                onHintUsed={() => {}}
              />
            </Card>

            <Card>
              <h3 className="mb-3 font-display text-base">🧪 Test mẫu</h3>
              <SampleIOBlock samples={problem.samples} />
            </Card>

            {problem.editorial && allowFullResultDetails && (
              <Card>
                <h3 className="mb-3 font-display text-base">📖 Editorial</h3>
                <ProblemStatement content={problem.editorial} />
                {problem.referenceCpp && (
                  <pre className="mt-2 max-h-72 overflow-auto rounded-md border border-[var(--border)] bg-[var(--bg-void)] p-3 text-[12px]">
                    <code className="font-mono">{problem.referenceCpp}</code>
                  </pre>
                )}
              </Card>
            )}
          </div>
        )}

        <div className="space-y-4 min-w-0">
          <Card className="p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <select
                disabled
                className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-xs"
              >
                <option>C++20 (GCC, Judge0)</option>
              </select>
              <button
                onClick={runSamples}
                disabled={busy}
                className="btn btn-ghost"
                title="Chạy trên test mẫu (Ctrl+R)"
              >
                <Play size={14} /> Chạy mẫu
              </button>
              <button
                onClick={submit}
                disabled={busy}
                className="btn btn-primary"
                title="Nộp bài (Ctrl+Enter)"
              >
                <Rocket size={14} />
                {running === 'full' ? 'Đang chấm...' : 'Nộp bài'}
              </button>
              <button
                onClick={() => {
                  if (confirm('Xoá toàn bộ code? Hành động này không thể hoàn tác.')) {
                    setCode('')
                  }
                }}
                className="btn btn-ghost"
              >
                <RefreshCw size={14} /> Reset
              </button>
              <button
                onClick={() => setFullEditor((v) => !v)}
                className="btn btn-ghost ml-auto"
                title="Toàn màn hình (F)"
              >
                <Maximize2 size={14} />
              </button>
              <button onClick={() => setShowHistory(true)} className="btn btn-ghost">
                <History size={14} /> Lịch sử ({history.length})
              </button>
            </div>
            <CodeEditor
              problemSlug={problem.slug}
              value={code}
              onChange={setCode}
              height={fullEditor ? '80vh' : '52vh'}
            />
          </Card>

          {currentSummary && (
            <VerdictPanel
              verdict={currentSummary.verdict}
              score={currentSummary.score}
              stars={currentSummary.stars}
              time={currentSummary.time}
              memory={currentSummary.memory}
            />
          )}

          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base">🔲 Test cases</h3>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {problem.testCases.length} test · {problem.subtasks.length} subtasks
              </span>
            </div>
            <TestCaseGrid
              total={problem.testCases.length}
              results={results}
              onSelect={(id) => setTestDetailId(id)}
            />

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              {problem.subtasks.map((st) => {
                const rs = problem.testCases
                  .filter((t) => t.subtaskId === st.id)
                  .map((t) => results[t.id])
                const passed = rs.length > 0 && rs.every((r) => r?.verdict === 'AC')
                const failed = rs.some((r) => r && r.verdict !== 'AC' && r.verdict !== 'Pending')
                const pts = passed ? st.points : 0
                return (
                  <div
                    key={st.id}
                    className={`rounded-lg border px-2 py-1.5 ${
                      passed
                        ? 'border-[var(--accent-green)] text-[var(--accent-green)]'
                        : failed
                          ? 'border-[var(--accent-red)] text-[var(--accent-red)]'
                          : 'border-[var(--border)]'
                    }`}
                  >
                    <div className="font-mono">{st.label}</div>
                    <div className="font-display">
                      {pts}/{st.points}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Tag reveal modal */}
      <Modal
        open={pendingTagReveal}
        onClose={() => setPendingTagReveal(false)}
        title="Xem tags?"
        footer={
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={() => setPendingTagReveal(false)}>
              Huỷ
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setTagsRevealed(true)
                setPendingTagReveal(false)
              }}
            >
              Xem tags
            </button>
          </div>
        }
      >
        <p className="text-sm">
          Xem tags sẽ trừ <strong>0.5 sao</strong>. Tiếp tục?
        </p>
      </Modal>

      {/* Test details modal */}
      <Modal
        open={testDetailId != null}
        onClose={() => setTestDetailId(null)}
        title={`Test #${testDetailId}`}
        size="lg"
      >
        {testDetailId != null &&
          (() => {
            const isSample = testDetailId < 0
            if (isSample) {
              const idx = -testDetailId - 1
              const s = problem.samples[idx]
              const r = results[testDetailId]
              return (
                <div className="space-y-3 text-sm">
                  <PreBlock title="Input" content={s.input} />
                  <PreBlock title="Expected" content={s.output} />
                  <PreBlock title="Actual" content={r?.stdout ?? '(trống)'} />
                </div>
              )
            }
            const t = problem.testCases.find((tt) => tt.id === testDetailId)
            const r = results[testDetailId]
            if (!t) return null
            const show = allowFullResultDetails
            return (
              <div className="space-y-3 text-sm">
                <div className="text-xs text-[var(--text-muted)]">
                  Subtask {t.subtaskId} · {r?.verdict ?? 'chưa chạy'}{' '}
                  {r?.time != null && `· ${Math.round(r.time)}ms`}
                </div>
                {show ? (
                  <>
                    <PreBlock title="Input" content={t.input} />
                    <PreBlock title="Expected" content={t.output} />
                  </>
                ) : (
                  <div className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-muted)]">
                    🔒 Dữ liệu test bị ẩn cho đến khi bạn đạt AC trên bài này. Chỉ test mẫu mới
                    hiển thị input/output đầy đủ.
                  </div>
                )}
              </div>
            )
          })()}
      </Modal>

      {/* Submission history */}
      <Modal
        open={showHistory}
        onClose={() => setShowHistory(false)}
        title="Lịch sử nộp bài"
        size="xl"
      >
        {history.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Chưa có submission nào.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {new Date(s.submittedAt).toLocaleString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono">{s.score}/100</span>
                    <VerdictBadge verdict={s.verdict} />
                  </span>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-[var(--accent-cyan)]">
                    Xem code
                  </summary>
                  <pre className="mt-2 max-h-72 overflow-auto rounded-md border border-[var(--border)] bg-[var(--bg-void)] p-3 text-[12px]">
                    <code className="font-mono">{s.code}</code>
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Judge down modal */}
      <Modal
        open={judgeDown}
        onClose={() => setJudgeDown(false)}
        title="⚠️ Judge chưa khởi động"
        footer={
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-ghost"
              onClick={() => {
                navigator.clipboard.writeText('docker-compose up -d')
                toast.success('Đã copy `docker-compose up -d`')
              }}
            >
              Copy command
            </button>
            <button className="btn btn-primary" onClick={() => setJudgeDown(false)}>
              Đã hiểu
            </button>
          </div>
        }
      >
        <p className="text-sm">
          Không kết nối được Judge0 tại <code>{JUDGE0_URL}</code>. Chạy lệnh sau ở thư mục dự án
          rồi thử lại:
        </p>
        <pre className="mt-2 rounded-md border border-[var(--border)] bg-[var(--bg-void)] p-3 text-xs">
          <code className="font-mono">docker-compose up -d</code>
        </pre>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Xem chi tiết tại <code>JUDGE_SETUP.md</code> ở repo.
        </p>
      </Modal>
    </PageTransition>
  )
}

function PreBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-void)]">
      <div className="border-b border-[var(--border)] px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
        {title}
      </div>
      <pre className="max-h-48 overflow-auto p-3 text-xs">
        <code className="font-mono whitespace-pre-wrap">{content}</code>
      </pre>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import toast from 'react-hot-toast'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { CheckCircle2, Lock, Zap, X } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { loadRoadmap } from '../lib/problemLoader'
import { db } from '../lib/db'
import type { RoadmapData, RoadmapNode } from '../lib/types'
import { slideRight } from '../lib/motion'

interface Props {
  onLevelComplete: (level: number) => void
}

const TIER_COLOR: Record<RoadmapNode['difficulty'], string> = {
  basic: 'var(--accent-green)',
  intermediate: 'var(--accent-blue)',
  advanced: 'var(--accent-amber)',
  expert: 'var(--accent-red)',
  ioi: 'var(--accent-purple)',
}

function AlgoNode({ data }: NodeProps) {
  const { label, labelVi, difficulty, status, locked } = data as {
    label: string
    labelVi: string
    difficulty: RoadmapNode['difficulty']
    status: 'not_started' | 'in_progress' | 'completed'
    locked: boolean
  }
  const color = TIER_COLOR[difficulty]
  const brightness =
    status === 'completed' ? 1 : locked ? 0.4 : status === 'in_progress' ? 0.9 : 0.7
  const pulse = difficulty === 'ioi' ? 'pulse-ring' : ''

  return (
    <div
      className={`relative w-[170px] rounded-xl border bg-[var(--bg-surface)] px-3 py-2 ${pulse}`}
      style={{
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}33, 0 0 16px ${color}33`,
        filter: `brightness(${brightness})`,
        pointerEvents: locked ? 'none' : 'auto',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color }} />
      <div className="text-[10px] font-mono uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </div>
      <div className="text-sm font-semibold leading-tight">{labelVi}</div>
      <div className="absolute right-1.5 top-1.5 text-xs">
        {status === 'completed' && <CheckCircle2 size={14} className="text-[var(--accent-green)]" />}
        {status === 'in_progress' && <Zap size={14} className="text-[var(--accent-amber)]" />}
        {locked && <Lock size={14} className="text-[var(--text-dim)]" />}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color }} />
    </div>
  )
}

const nodeTypes = { algo: AlgoNode }

export function RoadmapPage({ onLevelComplete }: Props) {
  const [data, setData] = useState<RoadmapData | null>(null)
  const params = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const progress = useLiveQuery(() => db.progress.toArray(), []) ?? []

  useEffect(() => {
    loadRoadmap().then(setData).catch(() => {})
  }, [])

  const progressMap = useMemo(() => {
    const m = new Map<string, 'not_started' | 'in_progress' | 'completed'>()
    for (const p of progress) m.set(p.topicSlug, p.status)
    return m
  }, [progress])

  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] }
    const COLS = 4
    const X = 280
    const Y = 140
    const byLevel = new Map<number, RoadmapNode[]>()
    for (const n of data.nodes) {
      if (!byLevel.has(n.level)) byLevel.set(n.level, [])
      byLevel.get(n.level)!.push(n)
    }
    const positions = new Map<string, { x: number; y: number }>()
    const sortedLevels = [...byLevel.keys()].sort((a, b) => a - b)
    sortedLevels.forEach((lvl) => {
      const arr = byLevel.get(lvl)!
      arr.forEach((n, idx) => {
        const col = idx % COLS
        const row = lvl * 2 + Math.floor(idx / COLS)
        positions.set(n.id, { x: col * X, y: row * Y })
      })
    })

    const flowNodes: Node[] = data.nodes.map((n) => {
      const status = progressMap.get(n.id) ?? 'not_started'
      const locked = n.prerequisites.some(
        (p) => (progressMap.get(p) ?? 'not_started') !== 'completed',
      )
      return {
        id: n.id,
        type: 'algo',
        position: positions.get(n.id) ?? { x: 0, y: 0 },
        data: { label: n.label, labelVi: n.labelVi, difficulty: n.difficulty, status, locked },
      }
    })
    const flowEdges: Edge[] = data.edges.map((e) => {
      const src = data.nodes.find((n) => n.id === e.source)
      const color = src ? TIER_COLOR[src.difficulty] : 'var(--border-glow)'
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: color, strokeOpacity: 0.55 },
        markerEnd: { type: MarkerType.ArrowClosed, color },
      }
    })
    return { nodes: flowNodes, edges: flowEdges }
  }, [data, progressMap])

  const selected = useMemo(
    () => data?.nodes.find((n) => n.id === params.topicId) ?? null,
    [data, params.topicId],
  )

  async function setStatus(
    topic: RoadmapNode,
    status: 'not_started' | 'in_progress' | 'completed',
  ) {
    const existing = await db.progress.where('topicSlug').equals(topic.id).first()
    if (existing) {
      await db.progress.update(existing.id!, {
        status,
        completedAt: status === 'completed' ? new Date() : undefined,
      })
    } else {
      await db.progress.add({
        topicSlug: topic.id,
        status,
        completedAt: status === 'completed' ? new Date() : undefined,
      })
    }
    toast.success(
      status === 'completed'
        ? `Đã hoàn thành: ${topic.labelVi}!`
        : status === 'in_progress'
          ? `Đang học: ${topic.labelVi}`
          : 'Đã đặt lại',
    )
    if (status === 'completed' && data) {
      const sameLevel = data.nodes.filter((n) => n.level === topic.level)
      const lvlMap = new Map(progressMap)
      lvlMap.set(topic.id, 'completed')
      if (sameLevel.every((n) => lvlMap.get(n.id) === 'completed')) {
        onLevelComplete(topic.level)
      }
    }
  }

  return (
    <PageTransition>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">🗺 Lộ trình thuật toán</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Từ I/O đến IOI — đi qua từng level, mở khoá tuần tự.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {(['basic', 'intermediate', 'advanced', 'expert', 'ioi'] as const).map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: TIER_COLOR[t] }}
              />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div
        className="card relative h-[640px] overflow-hidden p-0"
        style={{ background: 'var(--bg-deep)' }}
      >
        {data ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            onNodeClick={(_, n) => navigate(`/roadmap/${n.id}`)}
            proOptions={{ hideAttribution: true }}
            minZoom={0.3}
            maxZoom={1.5}
          >
            <Background color="#1e2d45" gap={24} />
            <MiniMap
              maskColor="rgba(5,8,16,0.7)"
              nodeColor={(n) =>
                TIER_COLOR[((n.data as any).difficulty as RoadmapNode['difficulty']) ?? 'basic']
              }
              style={{ background: 'var(--bg-void)' }}
            />
            <Controls
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </ReactFlow>
        ) : (
          <div className="grid h-full place-items-center text-sm text-[var(--text-muted)]">
            Đang tải lộ trình...
          </div>
        )}

        <AnimatePresence>
          {selected && (
            <motion.aside
              key={selected.id}
              variants={slideRight}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute right-0 top-0 z-10 h-full w-[380px] border-l border-[var(--border)] glass p-5 overflow-y-auto"
            >
              <button
                onClick={() => navigate('/roadmap')}
                className="absolute right-3 top-3 rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]"
              >
                <X size={16} />
              </button>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {selected.label}
              </div>
              <h2 className="mt-1 font-display text-2xl">{selected.labelVi}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  tone={
                    selected.difficulty === 'basic'
                      ? 'green'
                      : selected.difficulty === 'intermediate'
                        ? 'blue'
                        : selected.difficulty === 'advanced'
                          ? 'amber'
                          : selected.difficulty === 'expert'
                            ? 'red'
                            : 'purple'
                  }
                >
                  {selected.difficulty}
                </Badge>
                <Badge tone="muted">{selected.complexity}</Badge>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-[var(--text-primary)]">
                {selected.description}
              </p>
              <div className="mt-3">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Code mẫu
                </div>
                <pre className="max-h-48 overflow-auto rounded-md border border-[var(--border)] bg-[var(--bg-void)] p-3 text-[12px]">
                  <code className="font-mono">{selected.theory}</code>
                </pre>
              </div>
              {selected.resources.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Tài liệu
                  </div>
                  <ul className="space-y-1 text-sm">
                    {selected.resources.map((r) => (
                      <li key={r.url}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                          ↗ {r.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selected.problems.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Bài luyện
                  </div>
                  <ul className="space-y-1">
                    {selected.problems.map((slug) => (
                      <li key={slug}>
                        <Link
                          to={`/problem/${slug}`}
                          className="block rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1.5 text-sm hover:border-[var(--border-glow)]"
                        >
                          → {slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => setStatus(selected, 'in_progress')}>
                  Đánh dấu đang học
                </Button>
                <Button onClick={() => setStatus(selected, 'completed')}>
                  Hoàn thành ✓
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

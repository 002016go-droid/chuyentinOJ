import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Filter } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { loadTechniques } from '../lib/problemLoader'
import type { Technique, TechniqueGroup, ExamTier, Skill } from '../lib/types'
import { fadeUp, staggerContainer } from '../lib/motion'

const GROUPS: TechniqueGroup[] = [
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
  'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14',
]

const TIERS: ExamTier[] = ['T1', 'T2', 'T3', 'T4']
const SKILLS: Skill[] = ['S1', 'S2', 'S3', 'S4']

const TIER_TONES: Record<ExamTier, 'green' | 'blue' | 'amber' | 'purple'> = {
  T1: 'green',
  T2: 'blue',
  T3: 'amber',
  T4: 'purple',
}

export function TechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState<TechniqueGroup | 'ALL'>('ALL')
  const [activeTier, setActiveTier] = useState<ExamTier | 'ALL'>('ALL')
  const [activeSkill, setActiveSkill] = useState<Skill | 'ALL'>('ALL')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadTechniques().then(setTechniques).catch(() => setTechniques([]))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return techniques.filter((t) => {
      if (activeGroup !== 'ALL' && t.group !== activeGroup) return false
      if (activeTier !== 'ALL' && t.tier !== activeTier) return false
      if (activeSkill !== 'ALL' && !t.skills.includes(activeSkill)) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.titleVi.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.groupName.toLowerCase().includes(q)
      )
    })
  }, [techniques, query, activeGroup, activeTier, activeSkill])

  const groupCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const t of techniques) m.set(t.group, (m.get(t.group) ?? 0) + 1)
    return m
  }, [techniques])

  function toggle(id: string) {
    const s = new Set(expanded)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setExpanded(s)
  }

  return (
    <PageTransition>
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="purple">127 kỹ thuật · B1 → B14</Badge>
              <h1 className="mt-2 font-display text-3xl">
                <BookOpen size={22} className="mr-2 inline" />
                Kho kỹ thuật & template
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
                Tổng hợp 127 kỹ thuật cốt lõi cho HSG lớp 9 và chuyên Tin lớp 10. Mỗi
                kỹ thuật có mô tả ngắn, code mẫu, mức độ Tier (T1-T4) và kỹ năng
                (S1-S4). Lọc theo nhóm B1-B14 hoặc tìm kiếm tự do.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="font-display text-3xl text-[var(--accent-purple)]">
                {filtered.length}/{techniques.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                kỹ thuật khớp lọc
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
        <motion.div variants={fadeUp}>
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5">
                <Search size={14} className="text-[var(--text-muted)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên, mô tả, ID..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Filter size={12} className="text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)]">Tier:</span>
                <FilterChip
                  active={activeTier === 'ALL'}
                  onClick={() => setActiveTier('ALL')}
                  label="Tất cả"
                />
                {TIERS.map((t) => (
                  <FilterChip
                    key={t}
                    active={activeTier === t}
                    onClick={() => setActiveTier(t)}
                    label={t}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)]">Skill:</span>
                <FilterChip
                  active={activeSkill === 'ALL'}
                  onClick={() => setActiveSkill('ALL')}
                  label="Tất cả"
                />
                {SKILLS.map((s) => (
                  <FilterChip
                    key={s}
                    active={activeSkill === s}
                    onClick={() => setActiveSkill(s)}
                    label={s}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <FilterChip
                active={activeGroup === 'ALL'}
                onClick={() => setActiveGroup('ALL')}
                label={`Tất cả (${techniques.length})`}
              />
              {GROUPS.map((g) => (
                <FilterChip
                  key={g}
                  active={activeGroup === g}
                  onClick={() => setActiveGroup(g)}
                  label={`${g} (${groupCounts.get(g) ?? 0})`}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--text-muted)]">
              Không có kỹ thuật nào khớp bộ lọc. Thử mở rộng phạm vi tìm kiếm.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {filtered.map((t) => {
              const isOpen = expanded.has(t.id)
              return (
                <motion.div key={t.id} variants={fadeUp}>
                  <Card hover>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone="purple">{t.group}</Badge>
                        <Badge tone={TIER_TONES[t.tier]}>{t.tier}</Badge>
                        {t.skills.map((s) => (
                          <Badge key={s} tone="muted">{s}</Badge>
                        ))}
                      </div>
                      <code className="text-[10px] text-[var(--text-muted)]">{t.id}</code>
                    </div>
                    <h3 className="mt-2 font-display text-base">{t.titleVi}</h3>
                    <p className="text-[11px] text-[var(--text-muted)]">{t.title}</p>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">{t.groupName}</p>
                    <p className="mt-2 text-sm leading-relaxed">
                      {isOpen ? t.description : truncate(t.description, 220)}
                    </p>
                    {isOpen && (
                      <>
                        <pre className="mt-3 overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-[11px] leading-snug">
                          <code>{t.codeExample}</code>
                        </pre>
                        {t.vnRelevance && (
                          <p className="mt-2 text-xs italic text-[var(--accent-amber)]">
                            🇻🇳 {t.vnRelevance}
                          </p>
                        )}
                        {t.references.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                            {t.references.map((r) => (
                              <a
                                key={r.url}
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded border border-[var(--border)] px-2 py-0.5 hover:border-[var(--border-glow)]"
                              >
                                {r.label} ↗
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => toggle(t.id)}
                      className="mt-3 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                    >
                      {isOpen ? 'Thu gọn ▲' : 'Xem chi tiết ▼'}
                    </button>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </PageTransition>
  )
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s
  return s.slice(0, n).trim() + '…'
}

interface ChipProps {
  active: boolean
  onClick: () => void
  label: string
}

function FilterChip({ active, onClick, label }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'rounded-md border border-[var(--border-glow)] bg-[var(--accent-glow)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-primary)]'
          : 'rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
      }
    >
      {label}
    </button>
  )
}

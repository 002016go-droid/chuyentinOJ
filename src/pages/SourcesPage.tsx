import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, FileText, Library, MessageCircle, Search } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { loadSources } from '../lib/problemLoader'
import type { ExamSource, MentorTip, SourcesData, StudyResource } from '../lib/types'
import { fadeUp, staggerContainer } from '../lib/motion'

type Tab = 'exams' | 'resources' | 'tips'

const TYPE_LABEL: Record<ExamSource['type'], string> = {
  'hsg-city': 'HSG TP',
  'hsg-province': 'HSG Tỉnh',
  entrance: 'Tuyển sinh',
  national: 'HSG QG',
}

const TYPE_TONE: Record<ExamSource['type'], 'green' | 'amber' | 'blue' | 'purple'> = {
  'hsg-city': 'green',
  'hsg-province': 'amber',
  entrance: 'blue',
  national: 'purple',
}

export function SourcesPage() {
  const [data, setData] = useState<SourcesData | null>(null)
  const [tab, setTab] = useState<Tab>('exams')
  const [query, setQuery] = useState('')
  const [examType, setExamType] = useState<ExamSource['type'] | 'ALL'>('ALL')

  useEffect(() => {
    loadSources()
      .then(setData)
      .catch(() => setData({ exams: [], studyResources: [], mentorTips: [] }))
  }, [])

  const filteredExams = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    return data.exams.filter((e) => {
      if (examType !== 'ALL' && e.type !== examType) return false
      if (!q) return true
      return (
        e.title.toLowerCase().includes(q) ||
        (e.province ?? '').toLowerCase().includes(q) ||
        (e.school ?? '').toLowerCase().includes(q) ||
        String(e.year).includes(q) ||
        (e.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [data, query, examType])

  const filteredResources = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    if (!q) return data.studyResources
    return data.studyResources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    )
  }, [data, query])

  const filteredTips = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    if (!q) return data.mentorTips
    return data.mentorTips.filter(
      (t) =>
        t.author.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q),
    )
  }, [data, query])

  return (
    <PageTransition>
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <Card>
          <Badge tone="blue">Đề thi · Tài liệu · Lời khuyên</Badge>
          <h1 className="mt-2 font-display text-3xl">
            <Library size={22} className="mr-2 inline" />
            Nguồn ôn luyện
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
            Tổng hợp đề thi HSG / chuyên Tin từ các tỉnh, các tài liệu wiki/sách
            chuẩn cho CP, và lời khuyên thực chiến từ HLV, cựu HSG. Bấm vào liên
            kết để mở trên tab mới.
          </p>
        </Card>
      </motion.div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TabButton
          active={tab === 'exams'}
          onClick={() => setTab('exams')}
          icon={<FileText size={14} />}
          label={`Đề thi (${data?.exams.length ?? 0})`}
        />
        <TabButton
          active={tab === 'resources'}
          onClick={() => setTab('resources')}
          icon={<Library size={14} />}
          label={`Tài liệu (${data?.studyResources.length ?? 0})`}
        />
        <TabButton
          active={tab === 'tips'}
          onClick={() => setTab('tips')}
          icon={<MessageCircle size={14} />}
          label={`Lời khuyên (${data?.mentorTips.length ?? 0})`}
        />
        <div className="ml-auto flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5">
          <Search size={14} className="text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm trong tab này..."
            className="bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {tab === 'exams' && (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)]">Loại:</span>
                <FilterChip
                  active={examType === 'ALL'}
                  onClick={() => setExamType('ALL')}
                  label="Tất cả"
                />
                {(['hsg-city', 'hsg-province', 'entrance', 'national'] as const).map(
                  (t) => (
                    <FilterChip
                      key={t}
                      active={examType === t}
                      onClick={() => setExamType(t)}
                      label={TYPE_LABEL[t]}
                    />
                  ),
                )}
              </div>
            </Card>
          </motion.div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredExams.map((e) => (
              <motion.div key={e.id} variants={fadeUp}>
                <Card hover>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge tone={TYPE_TONE[e.type]}>{TYPE_LABEL[e.type]}</Badge>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {e.year}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base">{e.title}</h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {e.school ? `${e.school} · ` : ''}
                    {e.province}
                  </p>
                  {e.note && (
                    <p className="mt-2 text-xs leading-relaxed">{e.note}</p>
                  )}
                  {e.tags && e.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {e.url && (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                    >
                      <ExternalLink size={12} /> Mở đề / lời giải
                    </a>
                  )}
                </Card>
              </motion.div>
            ))}
            {filteredExams.length === 0 && (
              <Card>
                <p className="text-sm text-[var(--text-muted)]">Không có đề nào khớp bộ lọc.</p>
              </Card>
            )}
          </div>
        </motion.div>
      )}

      {tab === 'resources' && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-3 md:grid-cols-2"
        >
          {filteredResources.map((r) => (
            <motion.div key={r.id} variants={fadeUp}>
              <ResourceCard r={r} />
            </motion.div>
          ))}
          {filteredResources.length === 0 && (
            <Card>
              <p className="text-sm text-[var(--text-muted)]">Không có tài liệu nào khớp bộ lọc.</p>
            </Card>
          )}
        </motion.div>
      )}

      {tab === 'tips' && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-3 md:grid-cols-2"
        >
          {filteredTips.map((t) => (
            <motion.div key={t.id} variants={fadeUp}>
              <TipCard t={t} />
            </motion.div>
          ))}
          {filteredTips.length === 0 && (
            <Card>
              <p className="text-sm text-[var(--text-muted)]">Không có lời khuyên nào khớp tìm kiếm.</p>
            </Card>
          )}
        </motion.div>
      )}
    </PageTransition>
  )
}

function ResourceCard({ r }: { r: StudyResource }) {
  return (
    <Card hover>
      <div className="flex items-center justify-between gap-2">
        <Badge tone={r.language === 'vi' ? 'green' : 'blue'}>
          {r.language === 'vi' ? 'Tiếng Việt' : 'English'}
        </Badge>
        <span className="text-[10px] text-[var(--text-muted)]">{r.category}</span>
      </div>
      <h3 className="mt-2 font-display text-base">{r.title}</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{r.description}</p>
      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
      >
        <ExternalLink size={12} /> Mở tài liệu
      </a>
    </Card>
  )
}

function TipCard({ t }: { t: MentorTip }) {
  return (
    <Card hover>
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent-glow)] font-display text-sm text-[var(--accent-primary)]">
          {t.author
            .split(' ')
            .map((p) => p[0])
            .slice(-2)
            .join('')}
        </div>
        <div>
          <div className="text-sm font-display">{t.author}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{t.role}</div>
        </div>
      </div>
      <blockquote className="mt-3 border-l-2 border-[var(--accent-amber)] pl-3 text-sm italic leading-relaxed">
        &ldquo;{t.content}&rdquo;
      </blockquote>
      {t.source && (
        <p className="mt-2 text-[10px] text-[var(--text-muted)]">— {t.source}</p>
      )}
    </Card>
  )
}

interface TabBtnProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function TabButton({ active, onClick, icon, label }: TabBtnProps) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'flex items-center gap-1.5 rounded-md border border-[var(--border-glow)] bg-[var(--accent-glow)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-primary)]'
          : 'flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:border-[var(--border-strong)]'
      }
    >
      {icon}
      {label}
    </button>
  )
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

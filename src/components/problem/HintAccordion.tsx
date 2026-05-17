import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '../../lib/db'
import { Modal } from '../ui/Modal'
import type { Subtask } from '../../lib/types'

interface Props {
  problemSlug: string
  subtasks: Subtask[]
  onHintUsed: () => void
}

export function HintAccordion({ problemSlug, subtasks, onHintUsed }: Props) {
  const [usedMap, setUsedMap] = useState<Record<string, boolean>>({})
  const [pendingHint, setPendingHint] = useState<Subtask | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  async function refresh() {
    const u = await db.hintUsage.where('problemSlug').equals(problemSlug).toArray()
    const m: Record<string, boolean> = {}
    for (const x of u) m[x.hintId] = true
    setUsedMap(m)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemSlug])

  async function confirmReveal() {
    if (!pendingHint) return
    const hint = pendingHint.hint
    await db.hintUsage.add({
      problemSlug,
      hintId: hint.id,
      starsDeducted: hint.starCost,
      usedAt: new Date(),
    })
    setUsedMap((m) => ({ ...m, [hint.id]: true }))
    setExpanded((m) => ({ ...m, [hint.id]: true }))
    toast.success(`Đã trừ ${hint.starCost} sao cho gợi ý ${pendingHint.label}`)
    setPendingHint(null)
    onHintUsed()
  }

  return (
    <div className="space-y-2">
      {subtasks.map((st) => {
        const isUsed = !!usedMap[st.hint.id]
        const isOpen = !!expanded[st.hint.id]
        return (
          <div
            key={st.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm"
              onClick={() => {
                if (isUsed) setExpanded((m) => ({ ...m, [st.hint.id]: !isOpen }))
                else setPendingHint(st)
              }}
            >
              <span className="flex items-center gap-2">
                <Lightbulb size={14} className="text-[var(--accent-amber)]" />
                <span>
                  💡 Xem gợi ý <span className="font-mono">{st.label}</span>
                  {!isUsed && (
                    <span className="ml-2 text-[var(--accent-coral)]">
                      (-{st.hint.starCost} ⭐)
                    </span>
                  )}
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {isUsed && isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-[var(--border)]"
                >
                  <div className="px-3 py-2 text-sm text-[var(--text-primary)]">
                    {st.hint.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
      <Modal
        open={!!pendingHint}
        onClose={() => setPendingHint(null)}
        title="Sử dụng gợi ý?"
        footer={
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={() => setPendingHint(null)}>
              Huỷ
            </button>
            <button className="btn btn-primary" onClick={confirmReveal}>
              Đồng ý xem gợi ý
            </button>
          </div>
        }
      >
        {pendingHint && (
          <p className="text-sm">
            Xem gợi ý này sẽ trừ <strong>{pendingHint.hint.starCost}</strong> sao từ điểm tối đa của
            bài. Tiếp tục?
          </p>
        )}
      </Modal>
    </div>
  )
}

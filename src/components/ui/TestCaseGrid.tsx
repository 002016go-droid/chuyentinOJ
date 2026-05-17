import { motion } from 'framer-motion'
import { Verdict } from '../../lib/db'

interface CellState {
  verdict: Verdict | null
  time?: number
  subtaskId?: string
}

interface Props {
  total: number
  results: Record<number, CellState>
  onSelect?: (testId: number) => void
}

function bg(v: Verdict | null): string {
  switch (v) {
    case 'AC':
      return 'var(--accent-green)'
    case 'WA':
      return 'var(--accent-red)'
    case 'TLE':
      return 'var(--accent-amber)'
    case 'MLE':
      return 'var(--accent-purple)'
    case 'RE':
      return 'var(--accent-coral)'
    case 'CE':
      return 'var(--accent-coral)'
    case 'Pending':
      return 'var(--accent-blue)'
    default:
      return 'var(--bg-elevated)'
  }
}

export function TestCaseGrid({ total, results, onSelect }: Props) {
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${Math.min(10, total)}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }).map((_, idx) => {
        const id = idx + 1
        const r = results[id]
        const v = r?.verdict ?? null
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onSelect?.(id)}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.012 }}
            title={
              r
                ? `Test #${id} — ${v} — ${r.time ? Math.round(r.time) : 0}ms`
                : `Test #${id} — Chưa chạy`
            }
            className="aspect-square rounded-md border border-[var(--border)]/60 text-[10px] font-mono font-bold text-white/85"
            style={{ background: bg(v) }}
          >
            {id}
          </motion.button>
        )
      })}
    </div>
  )
}

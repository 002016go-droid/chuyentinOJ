import { motion } from 'framer-motion'
import type { Verdict } from '../../lib/db'
import { StarRating } from '../ui/StarRating'
import { formatKB, formatMs } from '../../lib/utils'

interface Props {
  verdict: Verdict
  score: number
  stars: number
  time: number | null
  memory: number | null
}

const VERDICT_TEXT: Record<Verdict, string> = {
  AC: '✅ ACCEPTED',
  WA: '❌ WRONG ANSWER',
  TLE: '⏱ TIME LIMIT',
  MLE: '💾 MEMORY LIMIT',
  RE: '⚠️ RUNTIME ERROR',
  CE: '🛠 COMPILE ERROR',
  Pending: '⏳ ĐANG CHẤM',
}

export function VerdictPanel({ verdict, score, stars, time, memory }: Props) {
  const verdictKey = verdict === 'Pending' ? 'CE' : verdict
  const color = `var(--verdict-${verdictKey.toLowerCase()})`

  return (
    <motion.div
      key={`${verdict}-${score}`}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`verdict-${verdictKey} rounded-xl p-4 ${verdict === 'WA' ? 'shake' : ''}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-xl" style={{ color }}>
            {VERDICT_TEXT[verdict]}
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">
            Điểm: <strong className="text-[var(--text-primary)]">{score}</strong>/100
          </div>
        </div>
        <StarRating value={stars} showNumber />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1.5">
          ⏱ {formatMs(time)}
        </div>
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1.5">
          💾 {formatKB(memory)}
        </div>
      </div>
    </motion.div>
  )
}

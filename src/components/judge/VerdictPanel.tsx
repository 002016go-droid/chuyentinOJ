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
  const color =
    verdict === 'AC'
      ? 'var(--accent-green)'
      : verdict === 'TLE'
        ? 'var(--accent-amber)'
        : verdict === 'MLE'
          ? 'var(--accent-purple)'
          : verdict === 'CE'
            ? 'var(--accent-coral)'
            : verdict === 'Pending'
              ? 'var(--accent-blue)'
              : 'var(--accent-red)'

  return (
    <motion.div
      key={`${verdict}-${score}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`rounded-xl border p-3 ${verdict === 'WA' ? 'shake' : ''}`}
      style={{
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}55, 0 8px 24px ${color}22`,
        background: `linear-gradient(180deg, ${color}11, transparent)`,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-xl" style={{ color }}>
            {VERDICT_TEXT[verdict]}
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            Điểm: <strong className="text-[var(--text-primary)]">{score}</strong>/100
          </div>
        </div>
        <StarRating value={stars} showNumber />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
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

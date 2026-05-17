import { ReactNode } from 'react'
import { classNames } from '../../lib/utils'

interface Props {
  children: ReactNode
  tone?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'coral' | 'muted'
  className?: string
}

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  blue: 'border-[var(--accent-blue)] text-[var(--accent-blue)] bg-[rgba(74,158,255,0.08)]',
  green: 'border-[var(--accent-green)] text-[var(--accent-green)] bg-[rgba(74,222,128,0.08)]',
  red: 'border-[var(--accent-red)] text-[var(--accent-red)] bg-[rgba(248,113,113,0.08)]',
  amber: 'border-[var(--accent-amber)] text-[var(--accent-amber)] bg-[rgba(251,191,36,0.08)]',
  purple: 'border-[var(--accent-purple)] text-[var(--accent-purple)] bg-[rgba(167,139,250,0.08)]',
  coral: 'border-[var(--accent-coral)] text-[var(--accent-coral)] bg-[rgba(232,149,109,0.08)]',
  muted: 'border-[var(--border)] text-[var(--text-muted)] bg-[var(--bg-elevated)]',
}

export function Badge({ children, tone = 'muted', className }: Props) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

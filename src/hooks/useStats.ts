import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import { dateKey } from '../lib/utils'

export interface AggregateStats {
  totalSubmissions: number
  totalAccepted: number
  uniqueSolved: number
  totalStars: number
  averageStars: number
  bestStreak: number
  currentStreak: number
}

export function useAggregateStats(): AggregateStats {
  const data = useLiveQuery(async () => {
    const subs = await db.submissions.toArray()
    const stars = await db.problemStars.toArray()

    const solvedSet = new Set<string>()
    for (const s of subs) if (s.verdict === 'AC') solvedSet.add(s.problemSlug)

    const totalStars = stars.reduce((a, b) => a + (b.starsEarned ?? 0), 0)
    const averageStars = stars.length ? totalStars / stars.length : 0

    const daySet = new Set(subs.map((s) => dateKey(new Date(s.submittedAt))))
    const today = new Date()
    let cur = 0
    for (let i = 0; ; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      if (daySet.has(dateKey(d))) cur++
      else break
    }

    const sortedDays = Array.from(daySet).sort()
    let best = 0
    let run = 0
    let prev: Date | null = null
    for (const d of sortedDays) {
      const cd = new Date(d)
      if (prev) {
        const diff = Math.round((cd.getTime() - prev.getTime()) / 86400000)
        run = diff === 1 ? run + 1 : 1
      } else {
        run = 1
      }
      best = Math.max(best, run)
      prev = cd
    }

    return {
      totalSubmissions: subs.length,
      totalAccepted: subs.filter((s) => s.verdict === 'AC').length,
      uniqueSolved: solvedSet.size,
      totalStars,
      averageStars,
      bestStreak: best,
      currentStreak: cur,
    }
  }, [])

  return (
    data ?? {
      totalSubmissions: 0,
      totalAccepted: 0,
      uniqueSolved: 0,
      totalStars: 0,
      averageStars: 0,
      bestStreak: 0,
      currentStreak: 0,
    }
  )
}

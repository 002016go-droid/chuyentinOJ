import { useMemo } from 'react'
import { dateKey } from '../../lib/utils'

interface Props {
  months: number
  data: Record<string, number>
  cellSize?: number
}

function levelColor(level: number): string {
  if (level === 0) return 'var(--bg-elevated)'
  if (level === 1) return 'rgba(74,158,255,0.25)'
  if (level === 2) return 'rgba(74,158,255,0.45)'
  if (level === 3) return 'rgba(74,158,255,0.7)'
  return 'rgba(74,158,255,1)'
}

function intensityLevel(n: number): number {
  if (n === 0) return 0
  if (n <= 2) return 1
  if (n <= 5) return 2
  if (n <= 9) return 3
  return 4
}

export function Heatmap({ months = 6, data, cellSize = 12 }: Props) {
  const cells = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setMonth(today.getMonth() - months)
    start.setDate(1)
    // adjust to nearest Monday before start
    const dow = (start.getDay() + 6) % 7
    start.setDate(start.getDate() - dow)
    const arr: { date: Date; count: number }[] = []
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const k = dateKey(d)
      arr.push({ date: new Date(d), count: data[k] ?? 0 })
    }
    return arr
  }, [data, months])

  const columns: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7))

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-[2px]">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[2px]">
            {col.map((c) => (
              <div
                key={c.date.toISOString()}
                className="rounded-[2px]"
                title={`${c.date.toLocaleDateString('vi-VN')} — ${c.count} lần nộp`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: levelColor(intensityLevel(c.count)),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

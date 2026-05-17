import { Star } from 'lucide-react'

interface Props {
  value: number
  max?: number
  size?: number
  showNumber?: boolean
}

export function StarRating({ value, max = 5, size = 16, showNumber = false }: Props) {
  const full = Math.floor(value)
  const half = value - full >= 0.25 && value - full < 0.75
  const filled = half ? full + 0.5 : Math.round(value)
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const isFull = i + 1 <= Math.floor(filled)
        const isHalf = !isFull && filled - i >= 0.5
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute inset-0 text-[var(--text-dim)]"
              strokeWidth={1.5}
            />
            {(isFull || isHalf) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? size / 2 : size }}
              >
                <Star
                  size={size}
                  className="text-[var(--star-gold)]"
                  fill="currentColor"
                  strokeWidth={1.5}
                />
              </span>
            )}
          </span>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-xs font-mono text-[var(--text-muted)]">
          {value.toFixed(1)}
        </span>
      )}
    </span>
  )
}

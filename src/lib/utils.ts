export const BASE = import.meta.env.BASE_URL // e.g. '/chuyentinOJ/'

export function asset(p: string): string {
  const trimmed = p.replace(/^\//, '')
  return `${BASE}${trimmed}`
}

export function classNames(...xs: Array<string | false | null | undefined>): string {
  return xs.filter(Boolean).join(' ')
}

export function pluralVN(n: number, singular: string, plural?: string): string {
  return `${n} ${n === 1 ? singular : plural ?? singular}`
}

export function dateKey(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

export function greeting(now = new Date()): string {
  const h = now.getHours()
  if (h < 11) return 'sáng'
  if (h < 14) return 'trưa'
  if (h < 18) return 'chiều'
  return 'tối'
}

export function formatMs(ms: number | null): string {
  if (ms == null) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export function formatKB(kb: number | null): string {
  if (kb == null) return '—'
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function hashStringToInt(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function deterministicAvatar(name: string, size = 64): string {
  // Generate a deterministic SVG avatar (radial gradient + initial)
  const h = hashStringToInt(name)
  const hue1 = h % 360
  const hue2 = (h * 31) % 360
  const initial = (name.trim()[0] ?? '?').toUpperCase()
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'>
    <defs>
      <radialGradient id='g' cx='30%' cy='30%' r='80%'>
        <stop offset='0%' stop-color='hsl(${hue1},80%,55%)'/>
        <stop offset='100%' stop-color='hsl(${hue2},65%,18%)'/>
      </radialGradient>
    </defs>
    <rect width='${size}' height='${size}' rx='${size / 6}' fill='url(#g)'/>
    <text x='50%' y='54%' text-anchor='middle' dominant-baseline='middle' font-family='Syne, sans-serif' font-weight='800' font-size='${size * 0.45}' fill='#fff'>${initial}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function dailyQuote(quotes: string[], today = new Date()): string {
  const idx = hashStringToInt(dateKey(today)) % quotes.length
  return quotes[idx]
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

export function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): F {
  let t: ReturnType<typeof setTimeout> | null = null
  return ((...args: any[]) => {
    if (t) clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }) as F
}

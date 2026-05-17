import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { loadAllProblems } from '../../lib/problemLoader'
import type { Problem } from '../../lib/types'
import { Badge } from '../ui/Badge'

interface Props {
  open: boolean
  onClose: () => void
}

export function GlobalSearch({ open, onClose }: Props) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      loadAllProblems().then(setProblems).catch(() => setProblems([]))
      setTimeout(() => inputRef.current?.focus(), 30)
      setQuery('')
      setActive(0)
    }
  }, [open])

  const fuse = useMemo(
    () =>
      new Fuse(problems, {
        keys: ['title', 'slug', 'tags', 'source'],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [problems],
  )

  const results = useMemo(() => {
    if (!query.trim()) return problems.slice(0, 12)
    return fuse.search(query.trim()).slice(0, 25).map((r) => r.item)
  }, [fuse, problems, query])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => Math.max(0, a - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const r = results[active]
        if (r) {
          navigate(`/problem/${r.slug}`)
          onClose()
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, active, results, navigate, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative w-full max-w-2xl card glass"
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                placeholder="Tìm bài tập, tag, nguồn..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-dim)]"
              />
              <kbd className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-mono">
                ESC
              </kbd>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="p-4 text-center text-sm text-[var(--text-muted)]">
                  Không tìm thấy. Hãy thử nhập một thuật toán hoặc tỉnh.
                </li>
              )}
              {results.map((p, idx) => (
                <li key={p.slug}>
                  <button
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => {
                      navigate(`/problem/${p.slug}`)
                      onClose()
                    }}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left ${
                      idx === active ? 'bg-[var(--bg-elevated)]' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {p.source} · độ khó {p.difficulty}/10
                      </div>
                    </div>
                    <Badge
                      tone={p.module === 'entrance' ? 'coral' : p.module === 'contest' ? 'blue' : 'purple'}
                    >
                      {p.module}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

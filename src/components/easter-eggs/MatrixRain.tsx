import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const WORDS = [
  'vector', 'map', 'pair', 'dp', 'dfs', 'bfs', 'memo', 'trie', 'seg', 'dsu',
  'sort', 'lower_bound', 'priority_queue', 'emplace_back', 'auto', 'binary',
  'unordered_map', 'queue', 'stack', 'tuple', 'modpow', 'sieve', 'tree',
  'graph', 'edges', 'visited', 'state',
]

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const fontSize = 18
    const columns = Math.floor(w / 110)
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50)

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    const draw = () => {
      ctx.fillStyle = 'rgba(5,8,16,0.18)'
      ctx.fillRect(0, 0, w, h)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`
      for (let i = 0; i < columns; i++) {
        const word = WORDS[(i + Math.floor(drops[i])) % WORDS.length]
        const x = i * 110 + 6
        const y = drops[i] * fontSize
        ctx.fillStyle =
          y > h - fontSize * 4
            ? 'rgba(232,237,245,0.95)'
            : 'rgba(74,222,128,0.85)'
        ctx.fillText(word, x, y)
        if (y > h && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.6
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-[80] pointer-events-none"
      style={{ background: 'rgba(5,8,16,0.9)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </motion.div>
  )
}

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Star {
  x: number
  y: number
  z: number
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: (Math.random() * 2 - 1) * w,
      y: (Math.random() * 2 - 1) * h,
      z: Math.random() * w,
    }))
    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    let raf = 0
    const draw = () => {
      ctx.fillStyle = 'rgba(5,8,16,0.4)'
      ctx.fillRect(0, 0, w, h)
      ctx.translate(w / 2, h / 2)
      for (const s of stars) {
        s.z -= 6
        if (s.z <= 1) {
          s.x = (Math.random() * 2 - 1) * w
          s.y = (Math.random() * 2 - 1) * h
          s.z = w
        }
        const k = 128 / s.z
        const x = s.x * k
        const y = s.y * k
        const size = (1 - s.z / w) * 2.5
        ctx.fillStyle = `rgba(232,237,245,${1 - s.z / w})`
        ctx.fillRect(x, y, size, size)
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
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
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-[70] pointer-events-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="rounded-2xl border border-[var(--border-glow)] glass px-8 py-6">
          <div className="font-display text-2xl">✨ Code đêm khuya</div>
          <div className="text-sm text-[var(--text-muted)]">
            = Programmer thực thụ. Ngủ sau nhé!
          </div>
        </div>
      </div>
    </motion.div>
  )
}

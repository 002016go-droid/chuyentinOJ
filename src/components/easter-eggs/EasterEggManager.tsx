import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import { MatrixRain } from './MatrixRain'
import { FoxMascot } from './FoxMascot'
import { ShibaMascot } from './ShibaMascot'
import { Starfield } from './Starfield'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export interface EasterEggApi {
  triggerLogoSpin: () => void
  triggerLevelComplete: (level: number) => void
  triggerThreeWA: () => void
  noteRatingHover: () => void
  logoStarBadge: boolean
  hiddenUnlocked: boolean
}

export interface EasterEggBundle {
  api: EasterEggApi
  overlays: ReactNode
}

export function useEasterEggs(): EasterEggBundle {
  const [matrix, setMatrix] = useState(false)
  const [stars, setStars] = useState(false)
  const [foxVisible, setFoxVisible] = useState(false)
  const [shibaVisible, setShibaVisible] = useState(false)
  const [logoStarBadge, setLogoStarBadge] = useState(false)
  const [hiddenUnlocked, setHiddenUnlocked] = useState(false)
  const ratingHoverCount = useRef(0)
  const logoClicks = useRef<number[]>([])
  const buf = useRef<string[]>([])
  const vnoiBuf = useRef<string[]>([])
  const lastLevelToast = useRef(0)

  useEffect(() => {
    function key(e: KeyboardEvent) {
      // Konami
      buf.current.push(e.key)
      if (buf.current.length > KONAMI.length) buf.current.shift()
      if (
        buf.current.length === KONAMI.length &&
        buf.current.every(
          (k, i) => k.toLowerCase() === KONAMI[i].toLowerCase(),
        )
      ) {
        setMatrix(true)
        toast.success("🎮 Konami Code activated! You're a true programmer.")
        buf.current = []
        setTimeout(() => setMatrix(false), 6000)
      }
      // VNOI buffer - only outside inputs
      const t = e.target as HTMLElement | null
      const inField =
        !!t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable ||
          !!t.closest?.('.monaco-editor'))
      if (!inField && /^[a-zA-Z]$/.test(e.key)) {
        vnoiBuf.current.push(e.key.toUpperCase())
        if (vnoiBuf.current.length > 4) vnoiBuf.current.shift()
        if (vnoiBuf.current.join('') === 'VNOI') {
          setFoxVisible(true)
          vnoiBuf.current = []
        }
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])

  useEffect(() => {
    // Midnight star field
    function check() {
      const d = new Date()
      const h = d.getHours()
      const m = d.getMinutes()
      if (h === 0 && m < 5) {
        setStars(true)
        setTimeout(() => setStars(false), 10000)
      }
    }
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [])

  const triggerLogoSpin = useCallback(() => {
    const now = Date.now()
    logoClicks.current.push(now)
    logoClicks.current = logoClicks.current.filter((t) => now - t < 2000)
    if (logoClicks.current.length >= 5) {
      logoClicks.current = []
      setLogoStarBadge(true)
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.3 } })
      toast.success('🎯 Easter Egg #2 tìm thấy! Logo: unlocked.')
    }
  }, [])

  const triggerLevelComplete = useCallback((level: number) => {
    if (lastLevelToast.current === level) return
    lastLevelToast.current = level
    for (let i = 0; i < 5; i++) {
      setTimeout(
        () => confetti({ particleCount: 60, spread: 90, origin: { y: 0.3 } }),
        i * 250,
      )
    }
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)() as AudioContext
      ;[523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        gain.gain.value = 0.05
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.start(ctx.currentTime + i * 0.3)
        osc.stop(ctx.currentTime + i * 0.3 + 0.25)
      })
    } catch {}
    toast.success(`🎉 Xuất sắc! Hoàn thành Level ${level}!`, { duration: 6000 })
  }, [])

  const triggerThreeWA = useCallback(() => {
    setShibaVisible(true)
    setTimeout(() => setShibaVisible(false), 5500)
  }, [])

  const noteRatingHover = useCallback(() => {
    ratingHoverCount.current++
    if (ratingHoverCount.current >= 10 && !hiddenUnlocked) {
      setHiddenUnlocked(true)
      toast.success('👁️ Bạn đã mở khoá "Bài ẩn" — top 0.1% mới giải được!')
    }
  }, [hiddenUnlocked])

  return {
    api: {
      triggerLogoSpin,
      triggerLevelComplete,
      triggerThreeWA,
      noteRatingHover,
      logoStarBadge,
      hiddenUnlocked,
    },
    overlays: (
      <>
        <AnimatePresence>{matrix && <MatrixRain />}</AnimatePresence>
        <AnimatePresence>{stars && <Starfield />}</AnimatePresence>
        <AnimatePresence>
          {foxVisible && <FoxMascot onDismiss={() => setFoxVisible(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {shibaVisible && <ShibaMascot onDismiss={() => setShibaVisible(false)} />}
        </AnimatePresence>
      </>
    ),
  }
}

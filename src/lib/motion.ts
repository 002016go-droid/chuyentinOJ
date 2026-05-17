import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.07 } },
}

export const springScale: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.15 } },
}

export const slideRight: Variants = {
  initial: { x: 380, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 28 } },
  exit: { x: 380, opacity: 0, transition: { duration: 0.2 } },
}

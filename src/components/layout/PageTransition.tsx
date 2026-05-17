import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/motion'

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-[1400px] px-6 py-8"
    >
      {children}
    </motion.div>
  )
}

import { motion } from 'framer-motion'

export function FoxMascot({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onDismiss}
      className="fixed bottom-6 right-6 z-[60] flex items-end gap-2"
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
    >
      <div className="rounded-2xl rounded-br-none border border-[var(--border-glow)] bg-[var(--bg-surface)] px-3 py-2 text-sm shadow-glow">
        📚 VNOI Wiki là bạn của bạn! 🦊
      </div>
      <svg viewBox="0 0 64 64" width="56" height="56" aria-label="VNOI Fox">
        <ellipse cx="32" cy="50" rx="20" ry="8" fill="#3d1d10" opacity=".35" />
        <path d="M16 30 L8 14 L16 18 Z M48 30 L56 14 L48 18 Z" fill="#e8956d" />
        <circle cx="32" cy="34" r="20" fill="#e8956d" />
        <path d="M22 36 a4 4 0 1 0 .1 0 z M42 36 a4 4 0 1 0 .1 0 z" fill="#0a0f1e" />
        <ellipse cx="32" cy="44" rx="3" ry="2" fill="#0a0f1e" />
        <circle cx="32" cy="34" r="20" fill="none" stroke="#ffd700" strokeWidth=".5" />
      </svg>
    </motion.button>
  )
}

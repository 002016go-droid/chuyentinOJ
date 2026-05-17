import { motion } from 'framer-motion'

export function ShibaMascot({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onDismiss}
      className="fixed bottom-6 right-6 z-[60] flex items-end gap-2"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 230, damping: 18 }}
    >
      <div className="rounded-2xl rounded-br-none border border-[var(--accent-amber)] bg-[var(--bg-surface)] px-3 py-2 text-sm shadow-[0_0_0_1px_var(--accent-amber)]">
        Đừng nản! Debug lại nhé 🐕 kiểm tra edge case!
      </div>
      <motion.svg
        viewBox="0 0 64 64"
        width="56"
        height="56"
        animate={{ x: [0, -3, 3, -3, 3, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.2 }}
        aria-label="Shiba Inu"
      >
        <ellipse cx="32" cy="52" rx="20" ry="6" fill="#3d1d10" opacity=".35" />
        <path d="M20 24 L14 12 L22 18 Z M44 24 L50 12 L42 18 Z" fill="#d4a373" />
        <circle cx="32" cy="34" r="18" fill="#e8b88a" />
        <path d="M20 38 q12 8 24 0" fill="none" stroke="#0a0f1e" strokeWidth="1.5" />
        <circle cx="25" cy="32" r="2" fill="#0a0f1e" />
        <circle cx="39" cy="32" r="2" fill="#0a0f1e" />
        <ellipse cx="32" cy="38" rx="2" ry="1.5" fill="#0a0f1e" />
      </motion.svg>
    </motion.button>
  )
}

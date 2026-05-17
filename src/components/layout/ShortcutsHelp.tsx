import { Modal } from '../ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
}

const SHORTCUTS: { combo: string; label: string }[] = [
  { combo: 'Ctrl + K', label: 'Mở tìm kiếm toàn cục' },
  { combo: '?', label: 'Hiện danh sách phím tắt' },
  { combo: 'Ctrl + Enter', label: 'Nộp bài (trên trang bài)' },
  { combo: 'Ctrl + R', label: 'Chạy thử trên test mẫu' },
  { combo: '[ / ]', label: 'Bài trước / sau trong contest' },
  { combo: 'H', label: 'Bật / tắt gợi ý' },
  { combo: 'F', label: 'Editor toàn màn hình' },
  { combo: 'T', label: 'Bật / tắt tag (trừ sao)' },
]

export function ShortcutsHelp({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="⌨️ Phím tắt">
      <ul className="space-y-2">
        {SHORTCUTS.map((s) => (
          <li
            key={s.combo}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2"
          >
            <span className="text-sm">{s.label}</span>
            <kbd className="rounded bg-[var(--bg-elevated)] px-2 py-1 font-mono text-xs text-[var(--accent-cyan)]">
              {s.combo}
            </kbd>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

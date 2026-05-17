import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import JSZip from 'jszip'
import toast from 'react-hot-toast'
import { Download, Save, Upload } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { db } from '../lib/db'
import { changePassword, getUsername, setUsername } from '../lib/auth'
import { deterministicAvatar } from '../lib/utils'
import { useAggregateStats } from '../hooks/useStats'

interface BadgeDef {
  id: string
  label: string
  emoji: string
  tone: 'green' | 'amber' | 'blue' | 'purple' | 'coral' | 'red'
  earned: (stats: ReturnType<typeof useAggregateStats>) => boolean
  hint: string
}

const BADGES: BadgeDef[] = [
  { id: 'first-blood', label: 'First Blood', emoji: '🩸', tone: 'red', hint: 'Bài AC đầu tiên', earned: (s) => s.uniqueSolved >= 1 },
  { id: 'ten-ac', label: '10 AC', emoji: '🥉', tone: 'amber', hint: 'Đạt 10 bài AC', earned: (s) => s.uniqueSolved >= 10 },
  { id: 'thirty-ac', label: '30 AC', emoji: '🥈', tone: 'blue', hint: 'Đạt 30 bài AC', earned: (s) => s.uniqueSolved >= 30 },
  { id: 'hundred-ac', label: '100 AC', emoji: '🥇', tone: 'green', hint: 'Đạt 100 bài AC', earned: (s) => s.uniqueSolved >= 100 },
  { id: 'streak-7', label: 'Streak 7d', emoji: '🔥', tone: 'coral', hint: '7 ngày luyện liên tục', earned: (s) => s.bestStreak >= 7 },
  { id: 'streak-30', label: 'Streak 30d', emoji: '🌋', tone: 'red', hint: '30 ngày luyện liên tục', earned: (s) => s.bestStreak >= 30 },
  { id: 'fifty-stars', label: '50 ⭐', emoji: '✨', tone: 'amber', hint: 'Đạt 50 sao tổng', earned: (s) => s.totalStars >= 50 },
  { id: 'perfectionist', label: 'Perfectionist', emoji: '💎', tone: 'purple', hint: 'TB ≥ 4.5 sao/bài (≥10 bài)', earned: (s) => s.uniqueSolved >= 10 && s.averageStars >= 4.5 },
]

export function ProfilePage() {
  const [name, setName] = useState(getUsername())
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const stats = useAggregateStats()
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []

  async function exportAll() {
    const zip = new JSZip()
    zip.file('submissions.json', JSON.stringify(subs, null, 2))
    zip.file('progress.json', JSON.stringify(await db.progress.toArray(), null, 2))
    zip.file('saved-code.json', JSON.stringify(await db.savedCode.toArray(), null, 2))
    zip.file('hints.json', JSON.stringify(await db.hintUsage.toArray(), null, 2))
    zip.file('stars.json', JSON.stringify(await db.problemStars.toArray(), null, 2))
    zip.file('learning.json', JSON.stringify(await db.learning.toArray(), null, 2))
    zip.file(
      'meta.json',
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          username: getUsername(),
          stats,
        },
        null,
        2,
      ),
    )
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chuyentin-progress-${new Date().toISOString().slice(0, 10)}.zip`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã xuất tiến độ thành file ZIP.')
  }

  async function importAll(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!confirm('Import sẽ XOÁ toàn bộ dữ liệu hiện tại. Tiếp tục?')) {
      e.target.value = ''
      return
    }
    try {
      const zip = await JSZip.loadAsync(file)
      const read = async (name: string) => {
        const f = zip.file(name)
        return f ? JSON.parse(await f.async('text')) : null
      }
      await Promise.all([
        db.submissions.clear(),
        db.progress.clear(),
        db.savedCode.clear(),
        db.hintUsage.clear(),
        db.problemStars.clear(),
        db.learning.clear(),
      ])
      const subs = await read('submissions.json')
      const prog = await read('progress.json')
      const sav = await read('saved-code.json')
      const hint = await read('hints.json')
      const star = await read('stars.json')
      const lrn = await read('learning.json')
      if (Array.isArray(subs))
        await db.submissions.bulkAdd(
          subs.map((s) => ({ ...s, submittedAt: new Date(s.submittedAt) })),
        )
      if (Array.isArray(prog))
        await db.progress.bulkAdd(
          prog.map((s) => ({
            ...s,
            completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
          })),
        )
      if (Array.isArray(sav))
        await db.savedCode.bulkAdd(
          sav.map((s) => ({ ...s, updatedAt: new Date(s.updatedAt) })),
        )
      if (Array.isArray(hint))
        await db.hintUsage.bulkAdd(
          hint.map((s) => ({ ...s, usedAt: new Date(s.usedAt) })),
        )
      if (Array.isArray(star))
        await db.problemStars.bulkAdd(
          star.map((s) => ({
            ...s,
            solvedAt: s.solvedAt ? new Date(s.solvedAt) : undefined,
          })),
        )
      if (Array.isArray(lrn))
        await db.learning.bulkAdd(
          lrn.map((s) => ({ ...s, updatedAt: new Date(s.updatedAt) })),
        )
      toast.success('Đã khôi phục tiến độ.')
    } catch (e) {
      toast.error(`Import lỗi: ${String(e)}`)
    }
  }

  function savePw(e: React.FormEvent) {
    e.preventDefault()
    if (!newPw || newPw.length < 6) {
      toast.error('Mật khẩu mới cần ≥ 6 ký tự')
      return
    }
    if (changePassword(oldPw, newPw)) {
      toast.success('Đã đổi mật khẩu')
      setOldPw('')
      setNewPw('')
    } else {
      toast.error('Mật khẩu cũ không đúng')
    }
  }

  return (
    <PageTransition>
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card>
          <div className="flex flex-col items-center">
            <motion.img
              key={name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={deterministicAvatar(name, 96)}
              alt={name}
              className="h-24 w-24 rounded-2xl shadow-glow"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                setUsername(name)
                toast.success('Đã lưu tên')
              }}
              className="mt-3 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-center text-base font-display outline-none focus:border-[var(--border-glow)]"
            />
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Avatar được sinh tự động từ tên.
            </p>
          </div>
          <hr className="my-4 border-[var(--border)]" />
          <h3 className="mb-2 font-display text-base">Đổi mật khẩu</h3>
          <form onSubmit={savePw} className="space-y-2">
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              placeholder="Mật khẩu cũ"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm outline-none"
            />
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Mật khẩu mới (≥6 ký tự)"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm outline-none"
            />
            <Button type="submit" className="w-full justify-center">
              <Save size={14} /> Đổi mật khẩu
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-display text-lg">🏅 Huy hiệu</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {BADGES.map((b) => {
                const earned = b.earned(stats)
                return (
                  <div
                    key={b.id}
                    title={b.hint}
                    className={`flex flex-col items-center rounded-xl border p-3 text-center ${
                      earned
                        ? 'border-[var(--border-glow)] shadow-glow'
                        : 'border-[var(--border)] opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-3xl">{b.emoji}</div>
                    <Badge tone={b.tone} className="mt-2">
                      {b.label}
                    </Badge>
                    <p className="mt-1 text-[10px] text-[var(--text-muted)]">{b.hint}</p>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-lg">📦 Backup & Khôi phục</h3>
            <p className="mb-3 text-xs text-[var(--text-muted)]">
              Toàn bộ tiến độ lưu cục bộ trong IndexedDB. Xuất file ZIP để backup hoặc chuyển máy.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={exportAll}>
                <Download size={14} /> Xuất tiến độ (.zip)
              </Button>
              <label className="btn btn-ghost cursor-pointer">
                <Upload size={14} /> Import...
                <input type="file" accept=".zip" className="hidden" onChange={importAll} />
              </label>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-lg">⚙️ Khu vực nguy hiểm</h3>
            <Button
              variant="danger"
              onClick={async () => {
                if (!confirm('Xoá TOÀN BỘ tiến độ? Không thể hoàn tác.')) return
                if (!confirm('Bạn chắc chắn? Tất cả submission/sao/saved code sẽ mất.')) return
                await Promise.all([
                  db.submissions.clear(),
                  db.progress.clear(),
                  db.savedCode.clear(),
                  db.hintUsage.clear(),
                  db.problemStars.clear(),
                  db.learning.clear(),
                ])
                toast.success('Đã xoá toàn bộ tiến độ.')
              }}
            >
              Xoá toàn bộ dữ liệu
            </Button>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}

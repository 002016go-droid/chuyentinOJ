import type { Subtask } from '../../lib/types'
import type { Submission } from '../../lib/db'

interface Props {
  subtasks: Subtask[]
  lastSubmission?: Submission | null
}

export function SubtaskTable({ subtasks, lastSubmission }: Props) {
  function statusForSubtask(st: Subtask) {
    if (!lastSubmission) return { label: '⏳ Chưa nộp', tone: 'muted' as const }
    const rs = lastSubmission.testResults.filter((t) => t.subtaskId === st.id)
    if (rs.length === 0) return { label: '⏳ Chưa nộp', tone: 'muted' as const }
    if (rs.every((r) => r.verdict === 'AC')) return { label: '✅ AC', tone: 'green' as const }
    return { label: '❌ Sai', tone: 'red' as const }
  }
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--bg-elevated)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          <tr>
            <th className="px-3 py-2 text-left">Subtask</th>
            <th className="px-3 py-2 text-left">Điểm</th>
            <th className="px-3 py-2 text-left">Ràng buộc</th>
            <th className="px-3 py-2 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {subtasks.map((s) => {
            const st = statusForSubtask(s)
            return (
              <tr key={s.id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2 font-mono text-xs">{s.label}</td>
                <td className="px-3 py-2 font-mono">{s.points}</td>
                <td className="px-3 py-2 font-mono text-xs">{s.constraint}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      st.tone === 'green'
                        ? 'text-[var(--accent-green)]'
                        : st.tone === 'red'
                          ? 'text-[var(--accent-red)]'
                          : 'text-[var(--text-muted)]'
                    }
                  >
                    {st.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

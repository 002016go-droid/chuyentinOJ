import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { SampleIO as Sample } from '../../lib/types'

export function SampleIOBlock({ samples }: { samples: Sample[] }) {
  return (
    <div className="space-y-3">
      {samples.map((s, idx) => (
        <div key={idx} className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="border-b border-[var(--border)] px-3 py-1.5 text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Test mẫu #{idx + 1}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <Block title="Input" content={s.input} />
            <Block title="Output" content={s.output} />
          </div>
          {s.explanation && (
            <div className="border-t border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
              💡 {s.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Block({ title, content }: { title: string; content: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <div className="relative">
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </span>
        <button
          onClick={copy}
          className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--accent-cyan)]"
          title="Copy"
          type="button"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <pre className="overflow-auto px-3 pb-3 text-xs">
        <code className="font-mono whitespace-pre-wrap">{content}</code>
      </pre>
    </div>
  )
}

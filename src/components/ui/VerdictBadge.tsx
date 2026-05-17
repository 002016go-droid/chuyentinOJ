import { Verdict } from '../../lib/db'
import { Badge } from './Badge'

const verdictLabel: Record<Verdict, string> = {
  AC: '✅ AC',
  WA: '❌ WA',
  TLE: '⏱ TLE',
  MLE: '💾 MLE',
  RE: '⚠️ RE',
  CE: '🛠 CE',
  Pending: '⏳ Đang chờ',
}

const verdictTone: Record<Verdict, Parameters<typeof Badge>[0]['tone']> = {
  AC: 'green',
  WA: 'red',
  TLE: 'amber',
  MLE: 'purple',
  RE: 'red',
  CE: 'coral',
  Pending: 'muted',
}

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return <Badge tone={verdictTone[verdict]}>{verdictLabel[verdict]}</Badge>
}

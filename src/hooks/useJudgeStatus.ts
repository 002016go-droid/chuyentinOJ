import { useEffect, useState } from 'react'
import { judgePing } from '../lib/judge0'

/**
 * Polls the local Judge0 instance every 30s and returns:
 *   null     → first check has not completed yet
 *   true     → judge is reachable
 *   false    → judge is unreachable (likely not running)
 */
export function useJudgeStatus(): boolean | null {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function check() {
      const ok = await judgePing()
      if (!cancelled) setOnline(ok)
    }
    check()
    const id = setInterval(check, 30_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return online
}

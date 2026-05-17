import type { Verdict } from './db'

export const JUDGE0_URL = 'http://localhost:2358'
export const CPP20_ID = 54 // GCC

export interface Judge0Result {
  token?: string
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  status: { id: number; description: string }
  time: string | null
  memory: number | null
}

export interface SubmitOptions {
  sourceCode: string
  stdin: string
  expectedOutput?: string
  timeLimit?: number // seconds
  memoryLimit?: number // KB
}

export function mapVerdict(statusId: number): Verdict {
  const map: Record<number, Verdict> = {
    3: 'AC',
    4: 'WA',
    5: 'TLE',
    6: 'CE',
    7: 'RE',
    8: 'RE',
    9: 'RE',
    10: 'RE',
    11: 'RE',
    12: 'RE',
    13: 'RE',
    14: 'RE',
  }
  return map[statusId] ?? 'RE'
}

async function postSubmission(opts: SubmitOptions): Promise<Judge0Result> {
  const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: opts.sourceCode,
      language_id: CPP20_ID,
      stdin: opts.stdin,
      expected_output: opts.expectedOutput,
      cpu_time_limit: opts.timeLimit ?? 1.0,
      memory_limit: opts.memoryLimit ?? 262144,
      compiler_options: '-O2 -std=c++20',
    }),
  })
  if (!response.ok) {
    throw new Error(`Judge0 error: HTTP ${response.status}`)
  }
  return response.json()
}

export async function judgePing(): Promise<boolean> {
  try {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 3000)
    const r = await fetch(`${JUDGE0_URL}/about`, { signal: ctl.signal })
    clearTimeout(timer)
    return r.ok
  } catch {
    return false
  }
}

export interface JudgeTestResult {
  verdict: Verdict
  time: number
  memory: number
  stdout: string
  stderr: string
  compileOutput: string
}

export async function runTest(opts: SubmitOptions): Promise<JudgeTestResult> {
  const r = await postSubmission(opts)
  const verdict = mapVerdict(r.status.id)
  return {
    verdict,
    time: parseFloat(r.time ?? '0') * 1000, // ms
    memory: r.memory ?? 0,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
    compileOutput: r.compile_output ?? '',
  }
}

export async function runBatch(
  sourceCode: string,
  tests: { id: number; input: string; output: string; subtaskId: string; timeLimit?: number }[],
  onProgress: (testId: number, result: JudgeTestResult) => void,
  batchSize = 6,
): Promise<void> {
  let i = 0
  while (i < tests.length) {
    const slice = tests.slice(i, i + batchSize)
    await Promise.allSettled(
      slice.map(async (t) => {
        try {
          const r = await runTest({
            sourceCode,
            stdin: t.input,
            expectedOutput: t.output,
            timeLimit: t.timeLimit ?? 1.0,
          })
          onProgress(t.id, r)
        } catch (e) {
          onProgress(t.id, {
            verdict: 'RE',
            time: 0,
            memory: 0,
            stdout: '',
            stderr: String(e),
            compileOutput: '',
          })
        }
      }),
    )
    i += batchSize
  }
}

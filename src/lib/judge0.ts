import type { Verdict } from './db'

const DEFAULT_JUDGE0_URL = 'http://localhost:2358'
const STORAGE_KEY = 'chuyentin.judge0.config'

export interface Judge0Config {
  url: string
  apiKey?: string
  languageId?: number
}

export function getJudge0Config(): Judge0Config {
  if (typeof localStorage === 'undefined') {
    return { url: DEFAULT_JUDGE0_URL }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { url: DEFAULT_JUDGE0_URL }
    const parsed = JSON.parse(raw) as Partial<Judge0Config>
    return {
      url: parsed.url ?? DEFAULT_JUDGE0_URL,
      apiKey: parsed.apiKey,
      languageId: parsed.languageId,
    }
  } catch {
    return { url: DEFAULT_JUDGE0_URL }
  }
}

export function setJudge0Config(cfg: Judge0Config) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
}

export function resetJudge0Config() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export const JUDGE0_URL = DEFAULT_JUDGE0_URL
export const CPP20_ID = 54 // GCC

function getEffectiveUrl(): string {
  return getJudge0Config().url || DEFAULT_JUDGE0_URL
}

function getEffectiveLanguageId(): number {
  return getJudge0Config().languageId ?? CPP20_ID
}

function getHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  const cfg = getJudge0Config()
  if (cfg.apiKey) {
    h['X-Auth-Token'] = cfg.apiKey
    h['X-RapidAPI-Key'] = cfg.apiKey
  }
  return h
}

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
  const url = getEffectiveUrl()
  const response = await fetch(`${url}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      source_code: opts.sourceCode,
      language_id: getEffectiveLanguageId(),
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

export async function judgePing(customUrl?: string): Promise<boolean> {
  const url = customUrl ?? getEffectiveUrl()
  try {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 3000)
    const r = await fetch(`${url}/about`, { signal: ctl.signal, headers: getHeaders() })
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

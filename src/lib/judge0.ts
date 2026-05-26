import type { Verdict } from './db'

const DEFAULT_JUDGE0_URL = 'http://localhost:2358'
const RAPIDAPI_URL = 'https://judge0-ce.p.rapidapi.com'
const RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com'
const STORAGE_KEY = 'chuyentin.judge0.config'

export type JudgeMode = 'rapidapi' | 'local'

export interface Judge0Config {
  /** Base URL used when mode = 'local' (self-hosted). Ignored when useRapidAPI=true. */
  url: string
  /** API key. Required for RapidAPI mode; optional for self-hosted local Judge0. */
  apiKey?: string
  /** Judge0 language id (default C++ GCC 9.2.0). */
  languageId?: number
  /** When true, route requests through RapidAPI Judge0-CE instead of `url`. */
  useRapidAPI?: boolean
}

export const RAPIDAPI_JUDGE0_URL = RAPIDAPI_URL
export const RAPIDAPI_JUDGE0_HOST = RAPIDAPI_HOST

export function getJudge0Config(): Judge0Config {
  if (typeof localStorage === 'undefined') {
    return { url: DEFAULT_JUDGE0_URL, useRapidAPI: true }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { url: DEFAULT_JUDGE0_URL, useRapidAPI: true }
    const parsed = JSON.parse(raw) as Partial<Judge0Config>
    return {
      url: parsed.url ?? DEFAULT_JUDGE0_URL,
      apiKey: parsed.apiKey,
      languageId: parsed.languageId,
      useRapidAPI: parsed.useRapidAPI ?? false,
    }
  } catch {
    return { url: DEFAULT_JUDGE0_URL, useRapidAPI: true }
  }
}

export function getJudgeMode(cfg: Judge0Config = getJudge0Config()): JudgeMode {
  return cfg.useRapidAPI ? 'rapidapi' : 'local'
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

function effectiveUrl(cfg: Judge0Config): string {
  if (cfg.useRapidAPI) return RAPIDAPI_URL
  return cfg.url || DEFAULT_JUDGE0_URL
}

function effectiveHeaders(cfg: Judge0Config): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cfg.useRapidAPI) {
    h['X-RapidAPI-Host'] = RAPIDAPI_HOST
    if (cfg.apiKey) h['X-RapidAPI-Key'] = cfg.apiKey
  } else if (cfg.apiKey) {
    h['X-Auth-Token'] = cfg.apiKey
  }
  return h
}

function getEffectiveLanguageId(): number {
  return getJudge0Config().languageId ?? CPP20_ID
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

function submissionBody(opts: SubmitOptions) {
  return {
    source_code: opts.sourceCode,
    language_id: getEffectiveLanguageId(),
    stdin: opts.stdin,
    expected_output: opts.expectedOutput,
    cpu_time_limit: opts.timeLimit ?? 1.0,
    memory_limit: opts.memoryLimit ?? 262144,
    compiler_options: '-O2 -std=c++20',
  }
}

async function fetchJudge(
  url: string,
  init: RequestInit,
  retries = 2,
): Promise<Response> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const r = await fetch(url, init)
      // RapidAPI free tier sometimes returns 429 (rate-limited) — back off and retry.
      if (r.status === 429 && attempt < retries) {
        await new Promise((res) => setTimeout(res, 500 * (attempt + 1)))
        continue
      }
      return r
    } catch (e) {
      lastErr = e
      if (attempt === retries) throw e
      await new Promise((res) => setTimeout(res, 300 * (attempt + 1)))
    }
  }
  throw lastErr ?? new Error('Judge0: network error')
}

async function pollSubmission(
  cfg: Judge0Config,
  url: string,
  token: string,
): Promise<Judge0Result> {
  // ~24s max wait (40 * 600ms). Judge0 free tier usually finishes in <5s.
  for (let i = 0; i < 40; i++) {
    await new Promise((res) => setTimeout(res, 600))
    const r = await fetchJudge(
      `${url}/submissions/${token}?base64_encoded=false`,
      { headers: effectiveHeaders(cfg) },
    )
    if (!r.ok) continue
    const data = (await r.json()) as Judge0Result
    const sid = data?.status?.id
    // Judge0 status: 1=In Queue, 2=Processing, 3+=terminal.
    if (typeof sid === 'number' && sid >= 3) return data
  }
  throw new Error('Judge0: poll timeout (kết quả không về sau 24s)')
}

async function postSubmission(opts: SubmitOptions): Promise<Judge0Result> {
  const cfg = getJudge0Config()
  const url = effectiveUrl(cfg)
  const body = submissionBody(opts)

  // 1) Fast path: POST with wait=true (works on self-hosted + paid RapidAPI tiers).
  try {
    const response = await fetchJudge(
      `${url}/submissions?base64_encoded=false&wait=true`,
      {
        method: 'POST',
        headers: effectiveHeaders(cfg),
        body: JSON.stringify(body),
      },
    )
    if (response.ok) {
      const data = (await response.json()) as Judge0Result
      // Some RapidAPI plans silently drop ?wait=true and return only { token }.
      // Detect that and fall through to the poll path.
      const sid = data?.status?.id
      if (typeof sid === 'number' && sid >= 3) return data
      if (data?.token) return await pollSubmission(cfg, url, data.token)
    } else if (response.status !== 400 && response.status !== 422) {
      // 400/422 = malformed body, do not fall back. Otherwise try wait=false path.
      // Surface a small slice of body for debugging.
      const text = await response.text().catch(() => '')
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Judge0 ${response.status} (sai/expired API key) — vào Settings cập nhật khoá RapidAPI.`,
        )
      }
      console.warn(`[judge0] wait=true HTTP ${response.status}; falling back. ${text.slice(0, 120)}`)
    } else {
      const text = await response.text().catch(() => '')
      throw new Error(`Judge0 HTTP ${response.status}: ${text.slice(0, 200)}`)
    }
  } catch (e) {
    // Network-level error from wait=true — try the poll path below before giving up.
    console.warn('[judge0] wait=true failed, trying poll fallback:', e)
  }

  // 2) Fallback: POST with wait=false then poll the token (free-tier RapidAPI).
  const submit = await fetchJudge(
    `${url}/submissions?base64_encoded=false&wait=false`,
    {
      method: 'POST',
      headers: effectiveHeaders(cfg),
      body: JSON.stringify(body),
    },
  )
  if (!submit.ok) {
    const text = await submit.text().catch(() => '')
    if (submit.status === 401 || submit.status === 403) {
      throw new Error(
        `Judge0 ${submit.status} (sai/expired API key) — vào Settings cập nhật khoá RapidAPI.`,
      )
    }
    throw new Error(`Judge0 submit HTTP ${submit.status}: ${text.slice(0, 200)}`)
  }
  const json = (await submit.json()) as { token?: string }
  if (!json.token) throw new Error('Judge0: thiếu submission token trong response')
  return await pollSubmission(cfg, url, json.token)
}

/**
 * Probe a Judge0 endpoint and return whether it answered OK.
 * If `override` is provided, it is merged onto the saved config so the
 * Settings page can test pending form values before saving them.
 */
export async function judgePing(override?: Partial<Judge0Config>): Promise<boolean> {
  const cfg: Judge0Config = { ...getJudge0Config(), ...(override ?? {}) }
  const url = effectiveUrl(cfg)
  // RapidAPI gates /about behind the key and counts it against quota; /languages
  // works on both self-hosted Judge0 and RapidAPI and validates the key too.
  const path = cfg.useRapidAPI ? '/languages' : '/about'
  try {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 5000)
    const r = await fetch(`${url}${path}`, {
      signal: ctl.signal,
      headers: effectiveHeaders(cfg),
    })
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
          // Surface the actual error so the user can tell judge-side issues
          // (network, expired API key, rate limit) apart from real RE in their
          // own program. We still report verdict='RE' for verdict-counting, but
          // the stderr/compileOutput strings carry the real message.
          const msg = e instanceof Error ? e.message : String(e)
          onProgress(t.id, {
            verdict: 'RE',
            time: 0,
            memory: 0,
            stdout: '',
            stderr: `[Lỗi judge — không phải lỗi code của bạn]\n${msg}`,
            compileOutput: '',
          })
        }
      }),
    )
    i += batchSize
  }
}

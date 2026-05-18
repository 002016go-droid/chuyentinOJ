import type {
  AdvancedTopic,
  AlgoTemplate,
  Contest,
  EntranceExam,
  ExternalPractice,
  Hint,
  LearningItem,
  Problem,
  RoadmapData,
  RoadmapNode,
  SourcesData,
  Subtask,
  Technique,
} from './types'
import { asset } from './utils'

const cache: {
  roadmap?: Promise<RoadmapData>
  contests?: Promise<Contest[]>
  exams?: Promise<EntranceExam[]>
  problemIndex?: Promise<string[]>
  learning?: Promise<LearningItem[]>
  templates?: Promise<AlgoTemplate[]>
  external?: Promise<ExternalPractice[]>
  techniques?: Promise<Technique[]>
  advancedTopics?: Promise<AdvancedTopic[]>
  sources?: Promise<SourcesData>
  problems: Map<string, Promise<Problem>>
} = { problems: new Map() }

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(asset(path))
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

// Some data files were written with a richer schema than `types.ts` expects.
// Roadmap nodes may list `problems` as either an array of slug strings (legacy)
// or an array of `{ slug, ... }` objects (v3 content expansion). Coerce to
// `string[]` so the rest of the app can treat them uniformly.
function normalizeRoadmap(data: RoadmapData): RoadmapData {
  const nodes: RoadmapNode[] = (data.nodes ?? []).map((n) => {
    const rawProblems = (n as RoadmapNode & { problems?: unknown }).problems
    let problems: string[] = []
    if (Array.isArray(rawProblems)) {
      problems = rawProblems
        .map((p) => {
          if (typeof p === 'string') return p
          if (p && typeof p === 'object' && typeof (p as { slug?: unknown }).slug === 'string') {
            return (p as { slug: string }).slug
          }
          return ''
        })
        .filter((s) => s.length > 0)
    }
    return { ...n, problems }
  })
  return { ...data, nodes, edges: data.edges ?? [] }
}

// Problem v3 JSON stores subtasks as `{ id, title, points, constraint }` with
// hints in a parallel `hints[]` array keyed by `subtaskId`. The UI expects
// `Subtask = { id, label, points, constraint, hint }`. Normalize so legacy and
// v3 payloads both render correctly.
function normalizeProblem(p: Problem & { hints?: Hint[] }): Problem {
  const hintsBySubtask = new Map<string, Hint>()
  const looseHints: Hint[] = []
  for (const h of p.hints ?? []) {
    if (h.subtaskId) hintsBySubtask.set(h.subtaskId, h)
    else looseHints.push(h)
  }
  const subtasks: Subtask[] = (p.subtasks ?? []).map((st, idx) => {
    const raw = st as Subtask & { title?: string; label?: string; hint?: Hint }
    const label = raw.label ?? raw.title ?? `Subtask ${idx + 1}`
    const fallback: Hint = {
      id: `${p.slug}-st${idx + 1}-hint`,
      content: '',
      starCost: 0,
      subtaskId: st.id,
    }
    const hint: Hint = raw.hint ?? hintsBySubtask.get(st.id) ?? looseHints[idx] ?? fallback
    return {
      id: st.id,
      label,
      points: st.points,
      constraint: st.constraint,
      hint,
    }
  })
  return { ...p, subtasks }
}

export function loadRoadmap(): Promise<RoadmapData> {
  return (cache.roadmap ??= fetchJSON<RoadmapData>('data/roadmap.json').then(normalizeRoadmap))
}

export function loadContests(): Promise<Contest[]> {
  return (cache.contests ??= fetchJSON<Contest[]>('data/contests.json'))
}

export function loadEntranceExams(): Promise<EntranceExam[]> {
  return (cache.exams ??= fetchJSON<EntranceExam[]>('data/entrance-exams.json'))
}

export function loadProblemIndex(): Promise<string[]> {
  return (cache.problemIndex ??= fetchJSON<string[]>('data/problems/index.json'))
}

export function loadProblem(slug: string): Promise<Problem> {
  let p = cache.problems.get(slug)
  if (!p) {
    p = fetchJSON<Problem>(`data/problems/${slug}.json`).then(normalizeProblem)
    cache.problems.set(slug, p)
  }
  return p
}

export function loadLearning(): Promise<LearningItem[]> {
  return (cache.learning ??= fetchJSON<LearningItem[]>('data/learning.json'))
}

export function loadTemplates(): Promise<AlgoTemplate[]> {
  return (cache.templates ??= fetchJSON<AlgoTemplate[]>('data/templates.json'))
}

export function loadExternalPractice(): Promise<ExternalPractice[]> {
  return (cache.external ??= fetchJSON<ExternalPractice[]>('data/external-practice.json'))
}

interface TechniquesFile {
  techniques: Technique[]
}

interface AdvancedTopicsFile {
  topics: AdvancedTopic[]
}

export function loadTechniques(): Promise<Technique[]> {
  return (cache.techniques ??= fetchJSON<TechniquesFile>('data/techniques.json').then(
    (d) => d.techniques,
  ))
}

export function loadAdvancedTopics(): Promise<AdvancedTopic[]> {
  return (cache.advancedTopics ??= fetchJSON<AdvancedTopicsFile>(
    'data/advanced-topics.json',
  ).then((d) => d.topics))
}

export function loadSources(): Promise<SourcesData> {
  return (cache.sources ??= fetchJSON<SourcesData>('data/sources.json'))
}

export async function loadAllProblems(): Promise<Problem[]> {
  const idx = await loadProblemIndex()
  return Promise.all(idx.map((s) => loadProblem(s)))
}

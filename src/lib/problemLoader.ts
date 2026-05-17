import type {
  AlgoTemplate,
  Contest,
  EntranceExam,
  ExternalPractice,
  LearningItem,
  Problem,
  RoadmapData,
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
  problems: Map<string, Promise<Problem>>
} = { problems: new Map() }

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(asset(path))
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export function loadRoadmap(): Promise<RoadmapData> {
  return (cache.roadmap ??= fetchJSON<RoadmapData>('data/roadmap.json'))
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
    p = fetchJSON<Problem>(`data/problems/${slug}.json`)
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

export async function loadAllProblems(): Promise<Problem[]> {
  const idx = await loadProblemIndex()
  return Promise.all(idx.map((s) => loadProblem(s)))
}

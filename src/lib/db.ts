import Dexie, { Table } from 'dexie'

export type Verdict = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'Pending'

export interface TestResult {
  testId: number
  verdict: Exclude<Verdict, 'Pending' | 'CE'>
  time: number
  memory: number
  subtaskId: string
}

export interface Submission {
  id?: number
  problemSlug: string
  code: string
  language: string
  verdict: Verdict
  score: number
  starsEarned: number
  testResults: TestResult[]
  time: number | null
  memory: number | null
  submittedAt: Date
}

export interface UserProgress {
  id?: number
  topicSlug: string
  status: 'not_started' | 'in_progress' | 'completed'
  completedAt?: Date
}

export interface SavedCode {
  id?: number
  problemSlug: string
  code: string
  updatedAt: Date
}

export interface HintUsage {
  id?: number
  problemSlug: string
  hintId: string
  starsDeducted: number
  usedAt: Date
}

export interface ProblemStar {
  id?: number
  problemSlug: string
  starsEarned: number
  maxStars: number
  solvedAt?: Date
}

export interface LearningProgress {
  id?: number
  itemSlug: string
  status: 'not_started' | 'in_progress' | 'template_mastered' | 'ac'
  updatedAt: Date
}

export class ChuyenTinDB extends Dexie {
  submissions!: Table<Submission, number>
  progress!: Table<UserProgress, number>
  savedCode!: Table<SavedCode, number>
  hintUsage!: Table<HintUsage, number>
  problemStars!: Table<ProblemStar, number>
  learning!: Table<LearningProgress, number>

  constructor() {
    super('ChuyenTinOJ')
    this.version(1).stores({
      submissions: '++id, problemSlug, verdict, submittedAt',
      progress: '++id, topicSlug, status',
      savedCode: '++id, problemSlug',
      hintUsage: '++id, problemSlug, hintId',
      problemStars: '++id, problemSlug',
    })
    this.version(2).stores({
      submissions: '++id, problemSlug, verdict, submittedAt',
      progress: '++id, topicSlug, status',
      savedCode: '++id, problemSlug',
      hintUsage: '++id, problemSlug, hintId',
      problemStars: '++id, problemSlug',
      learning: '++id, itemSlug, status',
    })
  }
}

export const db = new ChuyenTinDB()

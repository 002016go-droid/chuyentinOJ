export type DifficultyTier = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'ioi'

export interface Subtask {
  id: string
  label: string
  points: number
  constraint: string
  hint: { id: string; content: string; starCost: number }
}

export interface SampleIO {
  input: string
  output: string
  explanation?: string
}

export interface TestCase {
  id: number
  subtaskId: string
  input: string
  output: string
}

export interface Problem {
  slug: string
  title: string
  module: 'roadmap' | 'contest' | 'entrance' | 'learning' | 'hidden'
  contestId?: string
  difficulty: number // 1-10
  maxStars: number // typically 5.0
  tags: string[]
  source: string
  statement: string
  subtasks: Subtask[]
  samples: SampleIO[]
  testCases: TestCase[]
  expectedAlgorithm?: string
  expectedComplexity?: string
  whyThisAlgorithm?: string
  bruteForceSubtask?: string
  optimizedSubtask?: string
  editorial?: string
  referenceCpp?: string
  timeLimitMs?: number
  memoryLimitKB?: number
}

export interface Contest {
  id: string
  title: string
  province: string
  flag?: string
  year: number
  grade?: number
  type: 'hsg-city' | 'entrance' | 'gym' | 'national' | 'olympic-trẻ'
  problems: string[]
  duration: number // minutes
  external?: { name: string; url: string }
}

export interface EntranceExam {
  id: string
  title: string
  school: string
  province: string
  year: string
  type: 'entrance'
  problems: string[]
  duration: number
  difficultyLabel?: string
}

export interface RoadmapNode {
  id: string
  level: number
  label: string
  labelVi: string
  difficulty: DifficultyTier
  description: string
  complexity: string
  prerequisites: string[]
  resources: { label: string; url: string }[]
  problems: string[]
  theory: string
}

export interface RoadmapEdge {
  id: string
  source: string
  target: string
}

export interface RoadmapData {
  nodes: RoadmapNode[]
  edges: RoadmapEdge[]
}

export interface LearningItem {
  slug: string
  title: string
  day: 1 | 2
  block: 'sáng' | 'chiều' | 'tối'
  duration: string // e.g. "120 phút"
  goal: string
  templateSlugs: string[]
  practiceProblems: string[]
}

export interface AlgoTemplate {
  slug: string
  name: string
  whenToUse: string
  signs: string
  idea: string
  complexity: string
  code: string
  commonMistakes: string
  practiceProblems: string[]
}

export interface ExternalPractice {
  slug: string
  title: string
  sourceName: string
  sourceUrl: string
  topic: string
  difficulty: number
  note: string
}

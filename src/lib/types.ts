export type DifficultyTier = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'ioi'
export type ExamTier = 'T1' | 'T2' | 'T3' | 'T4'
export type Skill = 'S1' | 'S2' | 'S3' | 'S4'

export interface Hint {
  id: string
  content: string
  starCost: number
  subtaskId?: string
}

export interface Subtask {
  id: string
  label: string
  points: number
  constraint: string
  hint: Hint
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

export interface FileIO {
  inputFile: string
  outputFile: string
}

export interface Problem {
  slug: string
  title: string
  titleEn?: string
  module: 'roadmap' | 'contest' | 'entrance' | 'learning' | 'hidden' | 'technique'
  topicId?: string
  tier?: ExamTier
  skills?: Skill[]
  contestId?: string
  difficulty: number // 1-10
  maxStars: number // typically 5.0
  tags: string[]
  source: string
  sourceUrl?: string
  isExternal?: boolean
  statement: string
  vnPattern?: string
  fileIO?: FileIO
  subtasks: Subtask[]
  samples: SampleIO[]
  testCases: TestCase[]
  hints?: Hint[]
  expectedAlgorithm?: string
  expectedComplexity?: string
  whyThisAlgorithm?: string
  bruteForceSubtask?: string
  optimizedSubtask?: string
  editorial?: string
  solutionSketch?: string
  referenceCpp?: string
  timeLimit?: number // seconds (new schema)
  memoryLimit?: number // MB (new schema)
  timeLimitMs?: number // legacy
  memoryLimitKB?: number // legacy
  createdAt?: string
}

export interface Contest {
  id: string
  title: string
  province: string
  flag?: string
  year: number
  grade?: number
  type: 'hsg-city' | 'hsg-province' | 'entrance' | 'gym' | 'national' | 'olympic-trẻ'
  problems: string[]
  duration: number // minutes
  external?: { name?: string; url: string; platform?: string }
}

export interface EntranceExam {
  id: string
  title: string
  school: string
  province: string
  year: string | number
  type: 'entrance' | 'primary-target' | 'secondary-target'
  problems: string[]
  duration: number
  difficultyLabel?: string
}

export interface Resource {
  label: string
  url: string
}

export interface ExternalRef {
  label: string
  url: string
  difficulty?: 'easy' | 'medium' | 'hard'
  source?: 'CSES' | 'Codeforces' | 'VNOJ' | 'USACO' | 'AtCoder' | string
}

export interface RoadmapNode {
  id: string
  day?: number // 1-30 in v2
  level: number
  label: string
  labelVi: string
  tier?: ExamTier
  skills?: Skill[]
  difficulty: DifficultyTier
  description: string
  complexity: string
  vnPattern?: string
  prerequisites: string[]
  resources: Resource[]
  problems: string[]
  theory: string // legacy — TopicPanel reads this
  theorySnippet?: string // v2 alias
  referenceProblem?: ExternalRef[]
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
  templateSlugs?: string[]
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

export type TechniqueGroup =
  | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7'
  | 'B8' | 'B9' | 'B10' | 'B11' | 'B12' | 'B13' | 'B14'

export interface Technique {
  id: string
  group: TechniqueGroup
  groupName: string
  title: string
  titleVi: string
  tier: ExamTier
  skills: Skill[]
  description: string
  codeExample: string
  vnRelevance: string
  references: Resource[]
}

export interface AdvancedTopic {
  id: string
  group: 'A' | 'B' | 'C' | 'D' | 'E'
  groupName: string
  title: string
  titleVi: string
  tier: ExamTier
  skills: Skill[]
  difficulty: DifficultyTier
  description: string
  codeExample: string
  complexity: string
  prerequisites: string[]
  vnPattern?: string
  references: Resource[]
  problems: string[]
  referenceProblem: ExternalRef[]
}

export interface ExamSource {
  id: string
  title: string
  type: 'hsg-city' | 'hsg-province' | 'entrance' | 'national'
  province?: string
  school?: string
  year: number | string
  url?: string
  tags?: string[]
  note?: string
}

export interface StudyResource {
  id: string
  title: string
  url: string
  language: 'vi' | 'en'
  category: string
  description: string
}

export interface MentorTip {
  id: string
  author: string
  role: string
  content: string
  source?: string
}

export interface SourcesData {
  exams: ExamSource[]
  studyResources: StudyResource[]
  mentorTips: MentorTip[]
}

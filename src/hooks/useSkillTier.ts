import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import { loadAllProblems } from '../lib/problemLoader'
import type { ExamTier, Problem, Skill } from '../lib/types'

const SKILLS: Skill[] = ['S1', 'S2', 'S3', 'S4']
const TIERS: ExamTier[] = ['T1', 'T2', 'T3', 'T4']

export interface SkillStat {
  skill: Skill
  totalProblems: number
  solved: number
  totalStars: number
  maxStars: number
}

export interface TierStat {
  tier: ExamTier
  totalProblems: number
  solved: number
  totalStars: number
  maxStars: number
}

export interface SkillTierStats {
  skills: SkillStat[]
  tiers: TierStat[]
  ready: boolean
}

export function useSkillTierStats(): SkillTierStats {
  const [problems, setProblems] = useState<Problem[]>([])
  const [ready, setReady] = useState(false)
  const subs = useLiveQuery(() => db.submissions.toArray(), []) ?? []
  const stars = useLiveQuery(() => db.problemStars.toArray(), []) ?? []

  useEffect(() => {
    loadAllProblems()
      .then((p) => {
        setProblems(p)
        setReady(true)
      })
      .catch(() => setReady(true))
  }, [])

  return useMemo(() => {
    const solvedSet = new Set<string>()
    for (const s of subs) if (s.verdict === 'AC') solvedSet.add(s.problemSlug)

    const starsBySlug = new Map<string, number>()
    for (const r of stars) starsBySlug.set(r.problemSlug, r.starsEarned ?? 0)

    const skillMap = new Map<Skill, SkillStat>()
    for (const sk of SKILLS) {
      skillMap.set(sk, { skill: sk, totalProblems: 0, solved: 0, totalStars: 0, maxStars: 0 })
    }
    const tierMap = new Map<ExamTier, TierStat>()
    for (const t of TIERS) {
      tierMap.set(t, { tier: t, totalProblems: 0, solved: 0, totalStars: 0, maxStars: 0 })
    }

    for (const p of problems) {
      const earned = starsBySlug.get(p.slug) ?? 0
      const max = p.maxStars ?? 5
      const isSolved = solvedSet.has(p.slug)
      if (p.skills && p.skills.length > 0) {
        for (const sk of p.skills) {
          const cur = skillMap.get(sk)
          if (cur) {
            cur.totalProblems += 1
            cur.maxStars += max
            if (isSolved) cur.solved += 1
            cur.totalStars += earned
          }
        }
      }
      if (p.tier) {
        const tCur = tierMap.get(p.tier)
        if (tCur) {
          tCur.totalProblems += 1
          tCur.maxStars += max
          if (isSolved) tCur.solved += 1
          tCur.totalStars += earned
        }
      }
    }

    return {
      skills: SKILLS.map((s) => skillMap.get(s)!),
      tiers: TIERS.map((t) => tierMap.get(t)!),
      ready,
    }
  }, [problems, subs, stars, ready])
}

export const SKILL_NAMES: Record<Skill, string> = {
  S1: 'Áp dụng CTDL/Thuật toán',
  S2: 'Đọc đề & Phân tích độ phức tạp',
  S3: 'Đổi góc nhìn & Tối ưu hoá',
  S4: 'Quản lý trạng thái',
}

export const TIER_NAMES: Record<ExamTier, string> = {
  T1: 'HSG TP / Tỉnh (lớp 9)',
  T2: 'Chuyên Tin (lớp 10)',
  T3: 'HSG Quốc gia (VOI)',
  T4: 'IOI / Advanced',
}

export const SKILL_TONES: Record<Skill, 'green' | 'blue' | 'amber' | 'purple'> = {
  S1: 'green',
  S2: 'blue',
  S3: 'amber',
  S4: 'purple',
}

export const TIER_TONES: Record<ExamTier, 'green' | 'blue' | 'amber' | 'purple'> = {
  T1: 'green',
  T2: 'blue',
  T3: 'amber',
  T4: 'purple',
}

/**
 * leetcode.ts — LeetCode stats fetcher via alfa-leetcode-api
 * Called at build time via Next.js ISR (revalidates every 3600s).
 * Displayed as the "timing tower" trackside element on the circuit.
 *
 * Phase 9: set LEETCODE_USERNAME env var to activate.
 */

import type { LeetCodeStats } from '@/types'

const LEETCODE_API = 'https://alfa-leetcode-api.onrender.com'

/**
 * Fetches LeetCode solved stats for the configured username.
 */
export async function fetchLeetCodeStats(): Promise<LeetCodeStats> {
  const username = process.env.LEETCODE_USERNAME
  if (!username) return getDefaultStats()

  try {
    const res = await fetch(`${LEETCODE_API}/${username}/solved`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`)

    const data = await res.json()

    return {
      totalSolved: data.solvedProblem ?? 0,
      easySolved: data.easySolved ?? 0,
      mediumSolved: data.mediumSolved ?? 0,
      hardSolved: data.hardSolved ?? 0,
      streak: data.streak ?? 0,
    }
  } catch {
    return getDefaultStats()
  }
}

function getDefaultStats(): LeetCodeStats {
  return {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    streak: 0,
  }
}

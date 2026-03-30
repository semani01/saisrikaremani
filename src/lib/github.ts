/**
 * github.ts — GitHub REST API fetcher
 * Called at build time via Next.js ISR (revalidates every 3600s).
 * Populates the githubStats object in portfolio.ts.
 *
 * Phase 9: wire up to real API with GITHUB_TOKEN env var.
 */

import type { GitHubStats } from '@/types'

const GITHUB_USERNAME = 'semani01'
const GITHUB_API = 'https://api.github.com'

/**
 * Fetches GitHub stats for semani01.
 * Uses GITHUB_TOKEN if available (increases rate limit from 60 to 5000 req/hr).
 */
export async function fetchGitHubStats(): Promise<GitHubStats> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  }

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, { headers, next: { revalidate: 3600 } }),
      fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ])

    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API fetch failed')

    const user = await userRes.json()
    const repos = await reposRes.json()

    // Tally language bytes across all repos
    const langBytes: Record<string, number> = {}
    for (const repo of repos) {
      if (repo.language) {
        langBytes[repo.language] = (langBytes[repo.language] ?? 0) + (repo.size ?? 0)
      }
    }

    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0)
    const topLanguages = Object.entries(langBytes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100),
      }))

    const totalStars = repos.reduce(
      (sum: number, repo: { stargazers_count?: number }) => sum + (repo.stargazers_count ?? 0),
      0
    )

    return {
      totalRepos: user.public_repos ?? repos.length,
      totalStars,
      topLanguages,
      commitFrequency: 0, // Would need GraphQL API to get commit frequency
    }
  } catch {
    // Return sensible defaults if API is unavailable
    return {
      totalRepos: 28,
      totalStars: 0,
      topLanguages: [
        { name: 'Python', percentage: 65 },
        { name: 'JavaScript', percentage: 20 },
        { name: 'TypeScript', percentage: 10 },
        { name: 'Java', percentage: 5 },
      ],
      commitFrequency: 0,
    }
  }
}

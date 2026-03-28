import { useState, useEffect } from 'react'

export interface LeetCodeStats {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSubmissions: number
  ranking: number
  languages: { languageName: string; problemsSolved: number }[]
  badges: { name: string; displayName: string }[]
}

export function useLeetCode(username = 'BALAJI-SK') {
  const [stats, setStats] = useState<LeetCodeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const query = `{
      matchedUser(username: "${username}") {
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
        }
        badges {
          name
          displayName
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
      }
    }`

    fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(r => r.json())
      .then(data => {
        const u = data.data?.matchedUser
        if (!u) throw new Error('User not found')
        const subs = u.submitStats.acSubmissionNum
        setStats({
          totalSolved: subs.find((s: {difficulty:string}) => s.difficulty === 'All')?.count ?? 0,
          easySolved: subs.find((s: {difficulty:string}) => s.difficulty === 'Easy')?.count ?? 0,
          mediumSolved: subs.find((s: {difficulty:string}) => s.difficulty === 'Medium')?.count ?? 0,
          hardSolved: subs.find((s: {difficulty:string}) => s.difficulty === 'Hard')?.count ?? 0,
          totalSubmissions: subs.find((s: {difficulty:string}) => s.difficulty === 'All')?.submissions ?? 0,
          ranking: u.profile.ranking,
          languages: u.languageProblemCount,
          badges: u.badges,
        })
      })
      .catch(e => {
        setError(e.message)
        // Fallback data
        setStats({
          totalSolved: 547,
          easySolved: 201,
          mediumSolved: 314,
          hardSolved: 32,
          totalSubmissions: 871,
          ranking: 151892,
          languages: [
            { languageName: 'C++', problemsSolved: 515 },
            { languageName: 'Java', problemsSolved: 57 },
            { languageName: 'Python', problemsSolved: 1 },
          ],
          badges: [{ name: 'Annual Badge', displayName: '100 Days Badge 2022' }],
        })
      })
      .finally(() => setLoading(false))
  }, [username])

  return { stats, loading, error }
}

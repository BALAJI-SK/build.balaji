import { useState, useEffect } from 'react'

export interface GitHubStats {
  publicRepos: number
  followers: number
  following: number
  avatarUrl: string
  createdAt: string
  languages: { name: string; count: number; color: string }[]
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Java: '#B07219',
  Dart: '#00B4AB',
  'Jupyter Notebook': '#DA5B0B',
  Go: '#00ADD8',
  'C++': '#F34B7D',
  Shell: '#89E051',
  PHP: '#4F5D95',
  HTML: '#E34C26',
}

export function useGitHub(username = 'BALAJI-SK') {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then(r => r.json()),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        .then(r => r.json())
        .then((repos: Array<{ language: string | null; fork: boolean }>) =>
          repos.filter(r => !r.fork && r.language)
        ),
    ])
      .then(([user, repos]) => {
        const langCount: Record<string, number> = {}
        repos.forEach((r: { language: string | null }) => {
          if (r.language) {
            langCount[r.language] = (langCount[r.language] || 0) + 1
          }
        })
        const languages = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({ name, count, color: LANGUAGE_COLORS[name] || '#8B949E' }))

        setStats({
          publicRepos: user.public_repos,
          followers: user.followers,
          following: user.following,
          avatarUrl: user.avatar_url,
          createdAt: user.created_at,
          languages,
        })
      })
      .catch(() => {
        setStats({
          publicRepos: 47,
          followers: 3,
          following: 4,
          avatarUrl: 'https://avatars.githubusercontent.com/u/60575418?v=4',
          createdAt: '2020-02-02T14:49:41Z',
          languages: [
            { name: 'Python', count: 12, color: '#3572A5' },
            { name: 'Jupyter Notebook', count: 8, color: '#DA5B0B' },
            { name: 'JavaScript', count: 7, color: '#F1E05A' },
            { name: 'Java', count: 6, color: '#B07219' },
            { name: 'TypeScript', count: 3, color: '#3178C6' },
            { name: 'Dart', count: 2, color: '#00B4AB' },
          ],
        })
      })
      .finally(() => setLoading(false))
  }, [username])

  return { stats, loading }
}

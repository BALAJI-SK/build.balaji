import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import SectionTitle from '../ui/SectionTitle'
import { useGitHub } from '../../hooks/useGitHub'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'
import { Github, Star, GitFork, Users } from 'lucide-react'

export default function GitHubStats() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })
  const { stats, loading } = useGitHub()

  const yearsSince = stats ? new Date().getFullYear() - new Date(stats.createdAt).getFullYear() : 5

  const tooltipStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(33,34,38,0.12)',
    borderRadius: '12px',
    color: '#121317',
    fontFamily: 'Google Sans Mono, monospace',
    fontSize: '12px',
    boxShadow: '0 4px 16px rgba(33,34,38,0.1)',
  }

  // GitHub stats widget — use a light theme variant
  const githubStatsUrl = "https://github-readme-stats.vercel.app/api?username=BALAJI-SK&show_icons=true&theme=default&hide_border=true&title_color=4285F4&icon_color=34A853&text_color=45474D&bg_color=FFFFFF00"

  return (
    <section id="github" className="section" ref={ref}
      style={{ background: 'var(--ag-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          eyebrow="GitHub"
          title="Open Source Activity"
          subtitle="Building in public since 2020."
        />

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="ag-spinner" />
          </div>
        ) : stats && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="space-y-5"
          >
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Avatar + Info */}
              <motion.div
                variants={fadeUpVariants}
                className="ag-card p-6 flex flex-col items-center text-center"
              >
                <img
                  src={stats.avatarUrl}
                  alt="Balaji SK"
                  className="w-20 h-20 rounded-2xl mb-4"
                  style={{ border: '2px solid var(--g-blue)', opacity: 0.9 }}
                />
                <p className="font-display font-medium text-lg" style={{ color: 'var(--ag-text)', letterSpacing: '-0.01em' }}>
                  BALAJI-SK
                </p>
                <p className="font-body text-sm mb-4" style={{ color: 'var(--ag-muted)' }}>
                  Balaji Segu Krishnaiah
                </p>
                <a
                  href="https://github.com/BALAJI-SK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-primary text-xs"
                >
                  <Github size={13} />
                  github.com/BALAJI-SK
                </a>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                variants={fadeUpVariants}
                custom={1}
                className="ag-card p-6 grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Star,     label: 'Public Repos', value: stats.publicRepos, color: 'var(--g-red)' },
                  { icon: GitFork,  label: 'Years Active',  value: yearsSince,        color: 'var(--g-blue)' },
                  { icon: Users,    label: 'Followers',     value: stats.followers,   color: 'var(--g-green)' },
                  { icon: Github,   label: 'Following',     value: stats.following,   color: 'var(--ag-text-2)' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center text-center p-3 rounded-2xl"
                    style={{ background: `color-mix(in srgb, ${color} 6%, var(--ag-surface-2))` }}
                  >
                    <Icon size={17} style={{ color }} className="mb-2" />
                    <p className="font-display font-medium text-2xl" style={{ color, letterSpacing: '-0.02em' }}>{value}</p>
                    <p className="font-body text-xs" style={{ color: 'var(--ag-muted)' }}>{label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Language pie */}
              <motion.div
                variants={fadeUpVariants}
                custom={2}
                className="ag-card p-6"
              >
                <p className="font-body text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ag-muted)' }}>
                  Top Languages
                </p>
                <div className="h-32">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={stats.languages}
                        cx="50%" cy="50%"
                        outerRadius={55} innerRadius={30}
                        dataKey="count" nameKey="name"
                        paddingAngle={2} strokeWidth={0}
                      >
                        {stats.languages.map((l, i) => (
                          <Cell key={i} fill={l.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value: number, name: string) => [`${value} repos`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                  {stats.languages.map(l => (
                    <div key={l.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="font-mono text-xs" style={{ color: 'var(--ag-muted)' }}>{l.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* GitHub stats card */}
            <motion.div
              variants={fadeUpVariants}
              custom={3}
              className="ag-card p-6 overflow-hidden"
            >
              <p className="font-body text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--ag-muted)' }}>
                GitHub Stats
              </p>
              <div className="flex justify-center overflow-x-auto">
                <img
                  src={githubStatsUrl}
                  alt="GitHub stats"
                  className="max-w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

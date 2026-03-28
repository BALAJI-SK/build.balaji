import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { RadialBarChart, RadialBar, Cell, PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'
import SectionTitle from '../ui/SectionTitle'
import { useLeetCode } from '../../hooks/useLeetCode'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!inView || !ref.current) return
    let start = 0
    const duration = 1400
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { start = value; clearInterval(timer) }
      if (ref.current) ref.current.textContent = Math.floor(start).toLocaleString()
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>0</span>
}

export default function LeetCodeStats() {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true })
  const { stats, loading } = useLeetCode()

  const difficultyData = stats ? [
    { name: 'Easy',   value: stats.easySolved,   color: 'var(--g-green)' },
    { name: 'Medium', value: stats.mediumSolved,  color: 'var(--g-yellow)' },
    { name: 'Hard',   value: stats.hardSolved,    color: 'var(--g-red)' },
  ] : []

  const langData = stats?.languages.slice(0, 4).map(l => ({
    name: l.languageName,
    value: l.problemsSolved,
    fill: l.languageName === 'C++' ? '#4285F4' : l.languageName === 'Java' ? '#EA4335' : '#34A853',
  })) || []

  const tooltipStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(33,34,38,0.12)',
    borderRadius: '12px',
    color: '#121317',
    fontFamily: 'Google Sans Mono, monospace',
    fontSize: '12px',
    boxShadow: '0 4px 16px rgba(33,34,38,0.1)',
  }

  return (
    <section id="stats" className="section" ref={ref}
      style={{ background: 'var(--ag-surface-2)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          eyebrow="Competitive Programming"
          title="LeetCode Stats"
          subtitle="547 problems solved. Primarily C++. Consistent since 2021."
        />

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="ag-spinner" />
          </div>
        ) : stats && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* Main: total solved + radial chart */}
            <motion.div
              variants={fadeUpVariants}
              className="ag-card p-6 flex flex-col items-center text-center"
            >
              <p className="font-body text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--ag-muted)' }}>
                Problems Solved
              </p>
              <p className="font-display font-medium mb-1"
                style={{ fontSize: '5rem', lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--g-blue)' }}
              >
                <AnimatedNumber value={stats.totalSolved} inView={inView} />
              </p>
              <p className="font-mono text-sm mb-6" style={{ color: 'var(--ag-muted)' }}>
                of {stats.totalSubmissions.toLocaleString()} submissions
              </p>

              <div className="w-full h-40">
                <ResponsiveContainer>
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="100%"
                    data={difficultyData}
                    startAngle={90} endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={4}
                      background={{ fill: 'rgba(33,34,38,0.06)' }}
                    >
                      {difficultyData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </RadialBar>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex gap-5 mt-2">
                {difficultyData.map(d => (
                  <div key={d.name} className="text-center">
                    <p className="font-display font-medium text-lg" style={{ color: d.color, letterSpacing: '-0.02em' }}>
                      {d.value}
                    </p>
                    <p className="font-mono text-xs" style={{ color: 'var(--ag-muted)' }}>{d.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ranking & badges */}
            <motion.div variants={fadeUpVariants} custom={1} className="space-y-4">
              <div className="ag-card p-6">
                <p className="font-body text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ag-muted)' }}>
                  Global Ranking
                </p>
                <p className="font-display font-medium" style={{ fontSize: '2.5rem', letterSpacing: '-0.03em', color: 'var(--ag-text)' }}>
                  #<AnimatedNumber value={stats.ranking} inView={inView} />
                </p>
                <p className="font-body text-sm mt-1" style={{ color: 'var(--ag-muted)' }}>worldwide</p>
              </div>

              {stats.badges.map(b => (
                <div key={b.name} className="ag-card p-5 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(251,188,4,0.12)', border: '1px solid rgba(251,188,4,0.25)' }}
                  >
                    🏆
                  </div>
                  <div>
                    <p className="font-body font-medium text-sm" style={{ color: 'var(--ag-text)' }}>{b.displayName}</p>
                    <p className="font-body text-xs" style={{ color: 'var(--ag-muted)' }}>Achievement Badge</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Language breakdown */}
            <motion.div variants={fadeUpVariants} custom={2} className="ag-card p-6">
              <p className="font-body text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--ag-muted)' }}>
                Language Breakdown
              </p>

              <div className="h-48 mb-4">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={langData}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {langData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2.5">
                {langData.map(l => (
                  <div key={l.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: l.fill }} />
                      <span className="font-body text-sm" style={{ color: 'var(--ag-text)' }}>{l.name}</span>
                    </div>
                    <span className="font-mono text-sm" style={{ color: l.fill }}>{l.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--ag-outline-2)' }}>
                <a
                  href="https://leetcode.com/u/BALAJI-SK/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs transition-colors"
                  style={{ color: 'var(--g-blue)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-blue-cta)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--g-blue)')}
                >
                  leetcode.com/u/BALAJI-SK ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

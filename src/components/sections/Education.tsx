import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, Award } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle'
import { education } from '../../data/education'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

export default function Education() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })

  return (
    <section id="education" className="section" ref={ref}
      style={{ background: 'var(--ag-bg)' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <SectionTitle eyebrow="Education" title="Academic Foundation" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-5"
        >
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              variants={fadeUpVariants}
              custom={i}
              className="ag-card overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-medium text-xs text-center flex-shrink-0"
                    style={{
                      background: `color-mix(in srgb, ${edu.color} 10%, var(--ag-surface-2))`,
                      border: `1px solid color-mix(in srgb, ${edu.color} 20%, transparent)`,
                      color: edu.color,
                    }}
                  >
                    {edu.logo}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-display font-medium text-xl" style={{ color: 'var(--ag-text)', letterSpacing: '-0.01em' }}>
                          {edu.institution}
                        </h3>
                        <p className="font-body font-medium text-sm mt-0.5" style={{ color: edu.color }}>
                          {edu.degree} — {edu.field}
                        </p>
                      </div>
                      {edu.current && (
                        <span
                          className="flex items-center gap-1.5 font-body text-xs px-2.5 py-1 rounded-full"
                          style={{
                            color: 'var(--g-green)',
                            background: 'rgba(52,168,83,0.08)',
                            border: '1px solid rgba(52,168,83,0.2)',
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--g-green)' }} />
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-sm font-body" style={{ color: 'var(--ag-muted)' }}>
                      <span>📅 {edu.period}</span>
                      <span>📍 {edu.location}</span>
                      {edu.grade && (
                        <span className="flex items-center gap-1.5">
                          <Award size={12} style={{ color: edu.color }} />
                          <span className="font-medium" style={{ color: 'var(--ag-text)' }}>{edu.grade}</span>
                          <span>— {edu.grade_label}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5" style={{ height: 1, background: 'var(--ag-outline-2)' }} />

                {/* Highlights + Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--ag-muted)' }}>
                      <GraduationCap size={12} />
                      Key Coursework
                    </p>
                    <ul className="space-y-1.5">
                      {edu.highlights.map(h => (
                        <li key={h} className="flex items-center gap-2 text-sm font-body" style={{ color: 'var(--ag-text-2)' }}>
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: edu.color }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-body text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ag-muted)' }}>
                      Skills Developed
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.skills.map(s => (
                        <span key={s} className="tech-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

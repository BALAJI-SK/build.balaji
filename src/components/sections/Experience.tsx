import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Calendar, ChevronDown } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle'
import { experiences } from '../../data/experience'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

export default function Experience() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })
  const [expanded, setExpanded] = useState<string | null>('tejas')

  return (
    <section id="experience" className="section" ref={ref}
      style={{ background: 'var(--ag-surface-2)' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <SectionTitle
          eyebrow="Work Experience"
          title="Where I've Built"
          subtitle="3 years across hardware systems, AI, and cloud — from Bengaluru to Dublin."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-3"
        >
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              variants={fadeUpVariants}
              custom={i}
              className="ag-card overflow-hidden"
            >
              {/* Card header */}
              <button
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                className="w-full text-left p-6 flex items-start gap-4"
              >
                {/* Company Logo */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 font-body font-bold text-sm"
                  style={{
                    background: `color-mix(in srgb, ${exp.color} 12%, white)`,
                    border: `1px solid color-mix(in srgb, ${exp.color} 25%, transparent)`,
                    color: exp.color,
                  }}
                >
                  {exp.logo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-medium text-lg" style={{ color: 'var(--ag-text)', letterSpacing: '-0.01em' }}>
                        {exp.role}
                      </h3>
                      <p className="font-body font-medium text-sm mt-0.5" style={{ color: exp.color }}>
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="font-mono text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: `color-mix(in srgb, ${exp.color} 10%, transparent)`,
                        color: exp.color,
                        border: `1px solid color-mix(in srgb, ${exp.color} 20%, transparent)`,
                      }}
                    >
                      {exp.duration}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm font-body" style={{ color: 'var(--ag-muted)' }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                    <span className="text-xs opacity-60">{exp.type}</span>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: expanded === exp.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 flex-shrink-0"
                  style={{ color: 'var(--ag-muted)' }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {expanded === exp.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-6 pb-6 pt-4"
                      style={{ borderTop: '1px solid var(--ag-outline-2)' }}
                    >
                      <p className="text-sm mb-5 leading-relaxed font-body" style={{ color: 'var(--ag-muted)' }}>
                        {exp.description}
                      </p>

                      {/* Bullets */}
                      <ul className="space-y-2.5 mb-6">
                        {exp.bullets.map((b, bi) => (
                          <li key={bi} className="flex gap-3 text-sm leading-relaxed font-body" style={{ color: 'var(--ag-text-2)' }}>
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]"
                              style={{ background: exp.color }}
                            />
                            {b}
                          </li>
                        ))}
                      </ul>

                      {/* Metrics */}
                      {exp.metrics.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                          {exp.metrics.map(m => (
                            <div
                              key={m.label}
                              className="rounded-2xl p-3 text-center"
                              style={{
                                background: `color-mix(in srgb, ${exp.color} 6%, var(--ag-bg))`,
                                border: `1px solid color-mix(in srgb, ${exp.color} 15%, transparent)`,
                              }}
                            >
                              <p className="font-display font-medium text-lg" style={{ color: exp.color, letterSpacing: '-0.02em' }}>
                                {m.value}
                              </p>
                              <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--ag-muted)' }}>{m.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map(s => (
                          <span key={s} className="tech-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

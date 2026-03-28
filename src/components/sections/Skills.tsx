import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionTitle from '../ui/SectionTitle'
import { skillCategories } from '../../data/skills'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

const levelStyle: Record<string, { color: string; label: string }> = {
  expert:    { color: 'var(--g-blue)',   label: 'Expert' },
  proficient:{ color: 'var(--g-green)',  label: 'Proficient' },
  familiar:  { color: 'var(--ag-muted)', label: 'Familiar' },
}

export default function Skills() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })

  return (
    <section id="skills" className="section" ref={ref}
      style={{ background: 'var(--ag-surface-2)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          eyebrow="Tech Stack"
          title="Skills & Tools"
          subtitle="A breadth-first engineer with depth where it matters."
        />

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-6 mb-10"
        >
          {Object.entries(levelStyle).map(([key, { color, label }]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="font-body text-sm" style={{ color: 'var(--ag-muted)' }}>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              variants={fadeUpVariants}
              custom={ci}
              className="ag-card p-6"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg"
                  style={{
                    background: `color-mix(in srgb, ${cat.color} 10%, var(--ag-surface-2))`,
                    border: `1px solid color-mix(in srgb, ${cat.color} 20%, transparent)`,
                  }}
                >
                  {cat.icon}
                </span>
                <h3
                  className="font-display font-medium text-base"
                  style={{ color: cat.color, letterSpacing: '-0.01em' }}
                >
                  {cat.label}
                </h3>
              </div>

              {/* Skills list */}
              <div className="space-y-2.5">
                {cat.skills.map((skill, si) => {
                  const { color, label } = levelStyle[skill.level]
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: ci * 0.06 + si * 0.04 + 0.25, duration: 0.4 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="font-body text-sm" style={{ color: 'var(--ag-text)' }}>{skill.name}</span>
                      </div>
                      <span className="font-mono text-xs" style={{ color, opacity: 0.8 }}>{label}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

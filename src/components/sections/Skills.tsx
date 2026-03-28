import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionTitle from '../ui/SectionTitle'
import { skillCategories } from '../../data/skills'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

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

              {/* Skills as tags */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: ci * 0.06 + si * 0.04 + 0.2, duration: 0.3 }}
                    className="font-mono text-xs px-2.5 py-1 rounded-md"
                    style={{
                      color: cat.color,
                      background: `color-mix(in srgb, ${cat.color} 10%, var(--ag-surface-2))`,
                      border: `1px solid color-mix(in srgb, ${cat.color} 20%, transparent)`,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

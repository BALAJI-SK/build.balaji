import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface SectionTitleProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionTitle({ eyebrow, title, subtitle, align = 'left' }: SectionTitleProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <div ref={ref} className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      >
        <span className="section-accent">{eyebrow}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
        className="font-display mt-2"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 450,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          color: 'var(--ag-text)',
        }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.19, 1, 0.22, 1] }}
          className="mt-3 text-lg max-w-2xl font-body"
          style={{ color: 'var(--ag-muted)', lineHeight: 1.6 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code2, Cpu, Globe, Zap } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

const stats = [
  { label: 'Years of Experience', value: '3+',  icon: Zap,   color: 'var(--g-blue)' },
  { label: 'LeetCode Problems',   value: '547',  icon: Code2, color: 'var(--g-red)' },
  { label: 'GitHub Repositories', value: '47+',  icon: Globe, color: 'var(--g-green)' },
  { label: 'Production Systems',  value: '15+',  icon: Cpu,   color: 'var(--g-yellow)' },
]

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true })

  return (
    <section id="about" className="section" ref={ref}
      style={{ background: 'var(--ag-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Text */}
          <div>
            <SectionTitle
              eyebrow="About Me"
              title="Engineering at the Edge"
              subtitle="From FPGA diagnostics to LLM-powered tools — I build systems that perform."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="space-y-5 leading-relaxed"
            >
              <motion.p variants={fadeUpVariants} className="text-base" style={{ color: 'var(--ag-text-2)' }}>
                I'm a software engineer who operates across the full stack — from low-level C++/FPGA
                hardware interfaces at{' '}
                <span style={{ color: 'var(--g-blue)', fontWeight: 500 }}>Tejas Networks</span> to
                AI-powered property management systems and Web3 identity aggregators.
              </motion.p>

              <motion.p variants={fadeUpVariants} className="text-base" style={{ color: 'var(--ag-muted)' }}>
                At Tejas, I rebuilt a legacy hardware validation ecosystem — cutting device cycle time from{' '}
                <span style={{ color: 'var(--g-green)', fontWeight: 500 }}>4 hours to 90 minutes</span> and
                raising production yield to{' '}
                <span style={{ color: 'var(--g-green)', fontWeight: 500 }}>95.6%</span>.
                Before that, I interned at{' '}
                <span style={{ color: 'var(--g-blue)', fontWeight: 500 }}>McKinsey & Company</span> where I reduced
                a two-week deployment task to two days using Docker, Kubernetes, and AWS EKS.
              </motion.p>

              <motion.p variants={fadeUpVariants} className="text-base" style={{ color: 'var(--ag-muted)' }}>
                I'm currently pursuing an{' '}
                <span style={{ color: 'var(--ag-text)', fontWeight: 500 }}>MSc in AI at Dublin City University</span>{' '}
                while building AI-driven dApps with{' '}
                <span style={{ color: 'var(--g-blue)', fontWeight: 500 }}>Superteam Ireland</span> on Solana.
              </motion.p>

              <motion.p variants={fadeUpVariants} className="text-base" style={{ color: 'var(--ag-muted)' }}>
                I solve DSA problems in C++ (515 solved) — not for the badge, but because
                algorithmic precision directly translates to better system design.
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              custom={4}
              className="flex flex-wrap gap-2 mt-8"
            >
              {['AI/ML', 'Systems Programming', 'Web3', 'Full-Stack', 'Mobile', 'DevOps'].map(tag => (
                <span key={tag} className="tech-tag tech-tag-blue">{tag}</span>
              ))}
            </motion.div>
          </div>

          {/* Right: Stats grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                variants={fadeUpVariants}
                className="ag-card p-6 group cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `color-mix(in srgb, ${color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
                  }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="font-display font-medium text-4xl mb-1" style={{ color, letterSpacing: '-0.02em' }}>
                  {value}
                </p>
                <p className="text-sm font-body" style={{ color: 'var(--ag-muted)' }}>{label}</p>
              </motion.div>
            ))}

            {/* Location card */}
            <motion.div
              variants={fadeUpVariants}
              className="ag-card p-6 col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🇮🇪</div>
                <div>
                  <p className="font-body font-medium" style={{ color: 'var(--ag-text)' }}>Based in Dublin, Ireland</p>
                  <p className="text-sm mt-0.5 font-body" style={{ color: 'var(--ag-muted)' }}>
                    Open to remote & on-site opportunities worldwide
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--g-green)' }} />
                  <span className="font-mono text-xs" style={{ color: 'var(--g-green)' }}>Available</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

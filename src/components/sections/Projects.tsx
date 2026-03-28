import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, ChevronRight } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle'
import { projects } from '../../data/projects'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

const categories = ['All', 'AI / LLM', 'AI / Product', 'Web3 / AI', 'ML / Data Science', 'Full-Stack', 'Mobile', 'Network Security']

function ProjectCard({ project, featured = false, index = 0 }: { project: typeof projects[0]; featured?: boolean; index?: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeUpVariants}
      custom={index}
      className={`ag-card overflow-hidden group ${featured ? 'bento-featured' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${project.color}, transparent)`,
          opacity: hovered ? 1 : 0.4,
        }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{project.icon}</span>
            <span
              className="font-body text-xs px-2.5 py-0.5 rounded-full"
              style={{
                color: project.color,
                background: `color-mix(in srgb, ${project.color} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${project.color} 25%, transparent)`,
              }}
            >
              {project.category}
            </span>
          </div>
          <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--ag-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-blue)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ag-muted)')}
          >
            <Github size={15} />
          </motion.a>
        </div>

        {/* Title */}
        <h3
          className="font-display font-medium text-lg mb-1 transition-colors duration-200"
          style={{
            color: hovered ? project.color : 'var(--ag-text)',
            letterSpacing: '-0.01em',
          }}
        >
          {project.name}
        </h3>
        <p className="text-sm font-body font-medium mb-3" style={{ color: 'var(--g-red)' }}>{project.tagline}</p>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 font-body" style={{ color: 'var(--ag-muted)' }}>
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.metrics.map(m => (
              <span
                key={m}
                className="font-mono text-xs px-2.5 py-1 rounded-lg"
                style={{
                  background: 'var(--ag-surface-2)',
                  color: 'var(--ag-text-2)',
                  border: '1px solid var(--ag-outline-2)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map(s => (
            <span key={s} className="tech-tag">{s}</span>
          ))}
        </div>

        {/* Footer link */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-body font-medium transition-colors duration-150"
          style={{ color: project.color }}
        >
          View on GitHub
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.span key="ext" initial={{ x: -4, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <ExternalLink size={12} />
              </motion.span>
            ) : (
              <motion.span key="chev">
                <ChevronRight size={12} />
              </motion.span>
            )}
          </AnimatePresence>
        </a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const { ref, inView } = useInView({ threshold: 0.04, triggerOnce: true })
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="section" ref={ref}
      style={{ background: 'var(--ag-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          eyebrow="Featured Projects"
          title="What I've Built"
          subtitle="Spanning AI systems, hardware diagnostics, Web3, and data science."
        />

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.filter(c => c === 'All' || projects.some(p => p.category === c)).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200"
              style={
                activeCategory === cat
                  ? {
                      background: 'var(--g-blue)',
                      color: '#fff',
                      border: '1px solid var(--g-blue)',
                    }
                  : {
                      background: 'var(--ag-surface)',
                      color: 'var(--ag-text-2)',
                      border: '1px solid var(--ag-outline-2)',
                    }
              }
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Bento grid */}
        <motion.div
          key={activeCategory}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="bento-grid"
        >
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              featured={project.featured && i === 0}
              index={i}
            />
          ))}
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/BALAJI-SK"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-outline inline-flex items-center gap-2 text-sm"
          >
            <Github size={15} />
            View all 47 repositories on GitHub
            <ExternalLink size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

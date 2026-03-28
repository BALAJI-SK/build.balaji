import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Twitter, ExternalLink, Mail } from 'lucide-react'
import ParticleField from '../ui/ParticleField'
import { fadeUpVariants } from '../../utils/animations'

const socialLinks = [
  { href: 'https://github.com/BALAJI-SK',              icon: Github,       label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/s-k-balaji/',   icon: Linkedin,     label: 'LinkedIn' },
  { href: 'https://x.com/BalajiS20877995',             icon: Twitter,      label: 'X / Twitter' },
  { href: 'https://leetcode.com/u/BALAJI-SK/',         icon: ExternalLink, label: 'LeetCode' },
  { href: 'mailto:skbalajimbl1@gmail.com',             icon: Mail,         label: 'Email' },
]

const badges = [
  { label: 'MSc AI @ DCU',       color: 'tech-tag-blue' },
  { label: 'Ex-Tejas Networks',  color: 'tech-tag-green' },
  { label: 'Ex-McKinsey',        color: 'tech-tag' },
  { label: 'Superteam Ireland',  color: 'tech-tag-red' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--ag-bg)' }}
    >
      {/* Floating Google-color orbs */}
      <ParticleField />

      {/* Content — sits above the orbs */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-16">

        {/* Eyebrow badges */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {badges.map(b => (
            <span key={b.label} className={`tech-tag ${b.color}`}>
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Main name — huge Google Sans Flex display */}
        <motion.h1
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="font-display-hero mb-4"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            fontWeight: 450,
            color: 'var(--ag-text)',
          }}
        >
          Balaji
          <br />
          <span style={{ color: 'var(--g-blue)' }}>Segu Krishnaiah</span>
        </motion.h1>

        {/* Typewriter role line */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="font-body text-xl md:text-2xl mb-6 h-9 flex items-center justify-center"
          style={{ color: 'var(--ag-text-2)', fontWeight: 400 }}
        >
          <TypeAnimation
            sequence={[
              'AI / ML Engineer',
              2000,
              'Systems Programmer',
              2000,
              'Web3 Builder',
              2000,
              'Full-Stack Developer',
              2000,
              'Problem Solver',
              2000,
            ]}
            wrapper="span"
            speed={50}
            deletionSpeed={65}
            repeat={Infinity}
            cursor
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className="font-body text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--ag-muted)' }}
        >
          Building at the intersection of{' '}
          <span style={{ color: 'var(--g-blue)', fontWeight: 500 }}>AI/ML systems</span>,{' '}
          <span style={{ color: 'var(--g-red)', fontWeight: 500 }}>low-level engineering</span>, and{' '}
          <span style={{ color: 'var(--g-green)', fontWeight: 500 }}>Web3</span>.
          {' '}2 years at Tejas Networks, interned at McKinsey, now pursuing MSc AI at DCU Dublin.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <motion.a
            href="#projects"
            onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="btn-pill-primary text-sm px-7 py-3"
          >
            See My Work
          </motion.a>
          <motion.a
            href="#contact"
            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="btn-pill-outline text-sm px-7 py-3"
          >
            Contact Me →
          </motion.a>
        </motion.div>

        {/* Social icons */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={5}
          className="flex items-center justify-center gap-2"
        >
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-full transition-all duration-150"
              style={{
                color: 'var(--ag-text-2)',
                background: 'var(--ag-surface)',
                border: '1px solid var(--ag-outline-2)',
                boxShadow: '0 1px 3px rgba(33,34,38,0.06)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-blue)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ag-text-2)')}
            >
              <Icon size={16} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--ag-muted)' }}
      >
        <span className="font-mono text-xs tracking-widest uppercase" style={{ fontSize: 10 }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-8 rounded-full"
          style={{ background: 'linear-gradient(to bottom, var(--ag-outline), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Send, CheckCircle } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle'
import { fadeUpVariants, staggerContainer } from '../../utils/animations'

const socials = [
  { href: 'https://github.com/BALAJI-SK',               icon: Github,       label: 'GitHub',       handle: 'BALAJI-SK',             color: 'var(--ag-text)' },
  { href: 'https://www.linkedin.com/in/s-k-balaji/',    icon: Linkedin,     label: 'LinkedIn',     handle: 's-k-balaji',            color: '#0A66C2' },
  { href: 'https://x.com/BalajiS20877995',              icon: Twitter,      label: 'X / Twitter',  handle: '@BalajiS20877995',      color: '#000000' },
  { href: 'https://leetcode.com/u/BALAJI-SK/',          icon: ExternalLink, label: 'LeetCode',     handle: 'BALAJI-SK',             color: '#FFA116' },
  { href: 'mailto:skbalajimbl1@gmail.com',              icon: Mail,         label: 'Email',        handle: 'skbalajimbl1@gmail.com', color: 'var(--g-blue)' },
]

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.open(`mailto:skbalajimbl1@gmail.com?subject=${subject}&body=${body}`)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="section" ref={ref}
      style={{ background: 'var(--ag-surface-2)' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle
          eyebrow="Get In Touch"
          title="Let's Work Together"
          align="center"
          subtitle="Open to full-time roles, contract work, and research collaborations. Always happy to chat."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4"
        >
          {/* Left: Info + Socials */}
          <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-5">
            {/* Availability badge */}
            <div className="ag-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--g-green)' }} />
                <span className="font-body text-xs uppercase tracking-wider" style={{ color: 'var(--g-green)' }}>
                  Available Now
                </span>
              </div>
              <p className="text-sm leading-relaxed font-body" style={{ color: 'var(--ag-muted)' }}>
                Actively looking for AI/ML, systems engineering, and full-stack roles at ambitious companies.
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm font-body" style={{ color: 'var(--ag-muted)' }}>
                <MapPin size={12} />
                <span>Dublin, Ireland</span>
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-2">
              {socials.map(({ href, icon: Icon, label, handle, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 p-3.5 ag-card rounded-2xl group"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${color} 10%, var(--ag-surface-2))` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-sm" style={{ color: 'var(--ag-text)' }}>{label}</p>
                    <p className="font-mono text-xs truncate" style={{ color: 'var(--ag-muted)' }}>{handle}</p>
                  </div>
                  <ExternalLink size={11} style={{ color: 'var(--ag-muted)' }} className="flex-shrink-0 group-hover:text-ag-text transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            variants={fadeUpVariants}
            custom={1}
            className="lg:col-span-3 ag-card p-6"
          >
            <h3 className="font-display font-medium text-xl mb-6" style={{ color: 'var(--ag-text)', letterSpacing: '-0.01em' }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--ag-muted)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 font-body"
                    style={{
                      background: 'var(--ag-surface-2)',
                      border: '1px solid var(--ag-outline-2)',
                      color: 'var(--ag-text)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(66,133,244,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(66,133,244,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--ag-outline-2)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label className="font-body text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--ag-muted)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="john@company.com"
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 font-body"
                    style={{
                      background: 'var(--ag-surface-2)',
                      border: '1px solid var(--ag-outline-2)',
                      color: 'var(--ag-text)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(66,133,244,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(66,133,244,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--ag-outline-2)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--ag-muted)' }}>
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell me about the role or project..."
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 font-body resize-none"
                  style={{
                    background: 'var(--ag-surface-2)',
                    border: '1px solid var(--ag-outline-2)',
                    color: 'var(--ag-text)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(66,133,244,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(66,133,244,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--ag-outline-2)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="btn-pill-primary w-full justify-center py-3.5 text-sm"
              >
                {sent ? (
                  <>
                    <CheckCircle size={15} />
                    Opening mail client...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 pt-8"
          style={{ borderTop: '1px solid var(--ag-outline-2)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--ag-muted)' }}>
            Designed & built by{' '}
            <span style={{ color: 'var(--g-blue)' }}>Balaji Segu Krishnaiah</span>
            {' '}·{' '}
            React + TypeScript + Tailwind
          </p>
        </motion.div>
      </div>
    </section>
  )
}

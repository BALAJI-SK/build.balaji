import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
  { href: '#skills',     label: 'Skills' },
  { href: '#stats',      label: 'Stats' },
  { href: '#contact',    label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled]           = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [menuOpen, setMenuOpen]           = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 40)

      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (scrollY / docH) * 100 : 0)

      const ids = navLinks.map(l => l.href.slice(1))
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'ag-nav shadow-sm' : 'bg-transparent'
        }`}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-lg font-medium text-ag-text hover:text-g-blue transition-colors duration-200"
            style={{ letterSpacing: '-0.01em' }}
          >
            Balaji SK
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-1.5 text-sm font-body transition-colors duration-200 rounded-full ${
                    isActive
                      ? 'text-g-blue bg-g-blue/10'
                      : 'text-ag-text-2 hover:text-ag-text hover:bg-ag-surface-2'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-g-blue/10 rounded-full"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              )
            })}
            <a
              href="https://github.com/BALAJI-SK"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary ml-3 text-xs"
            >
              GitHub ↗
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-ag-text"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-ag-text transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-ag-text transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-ag-text transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden ag-card mx-4 mt-1 overflow-hidden"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-5 py-3.5 text-sm text-ag-text-2 hover:text-ag-text hover:bg-ag-surface-2 transition-colors duration-150"
              >
                {link.label}
              </button>
            ))}
            <div className="px-5 py-3 border-t border-ag-outline-2">
              <a
                href="https://github.com/BALAJI-SK"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-primary w-full justify-center text-xs"
              >
                GitHub ↗
              </a>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, PolarRadiusAxis
} from 'recharts'
import { experiences } from './data/experience'
import { projects } from './data/projects'
import { education } from './data/education'
import { skillCategories } from './data/skills'
import { achievements } from './data/achievements'

// ─── Color Tokens ────────────────────────────────────────────────────────────
const C = {
  void: '#030507',
  dark: '#0a0f14',
  surface: '#0f1923',
  surfaceHover: '#162030',
  orange: '#FF6B00',
  orangeLight: '#FF8C38',
  orangeGlow: 'rgba(255,107,0,0.15)',
  leaf: '#3DBA6C',
  leafDark: '#2A8A4E',
  leafGlow: 'rgba(61,186,108,0.12)',
  chakra: '#00C8FF',
  chakraGlow: 'rgba(0,200,255,0.12)',
  srank: '#FFD700',
  kage: '#9945FF',
  textPrimary: '#F0EDE8',
  textSecondary: '#8A9BAE',
  textMuted: '#4A5568',
  border: 'rgba(255,107,0,0.15)',
  borderHover: 'rgba(255,107,0,0.4)',
}

// ─── Custom Hooks ─────────────────────────────────────────────────────────────
function useCounter(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [trigger, target, duration])
  return count
}

// ─── Particle Canvas (Hero BG) ────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    const particles: {
      x: number; y: number; vx: number; vy: number; size: number;
      color: string; rotation: number; vr: number; type: 'leaf' | 'wisp'; opacity: number
    }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 35; i++) {
      const isLeaf = Math.random() > 0.3
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: isLeaf ? Math.random() * 0.6 + 0.2 : (Math.random() - 0.5) * 0.3,
        size: isLeaf ? Math.random() * 8 + 6 : Math.random() * 3 + 2,
        color: isLeaf
          ? ['#FF6B00', '#FF8C38', '#FFD700', '#FF4500'][Math.floor(Math.random() * 4)]
          : '#00C8FF',
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.04,
        type: isLeaf ? 'leaf' : 'wisp',
        opacity: isLeaf ? Math.random() * 0.5 + 0.3 : Math.random() * 0.25 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rotation += p.vr
        if (p.y > canvas.height + 20) p.y = -20
        if (p.x > canvas.width + 20) p.x = -20
        if (p.x < -20) p.x = canvas.width + 20

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        if (p.type === 'leaf') {
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = p.color
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(0, -p.size); ctx.lineTo(0, p.size)
          ctx.stroke()
        } else {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2)
          grad.addColorStop(0, p.color)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

// ─── Inline Utility Components ───────────────────────────────────────────────
const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

function ArcLabel({ arc, title }: { arc?: string; title: string }) {
  return (
    <motion.div {...scrollReveal} style={{ marginBottom: 48 }}>
      {arc && (
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.orange, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>
          📜 {arc}
        </p>
      )}
      <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
        {title}
      </h2>
      <div style={{ height: 3, width: 60, background: `linear-gradient(90deg, ${C.orange}, transparent)`, marginTop: 12 }} />
    </motion.div>
  )
}

function MissionRank({ rank }: { rank: string }) {
  const colors: Record<string, string> = {
    S: C.srank, A: C.orange, B: C.chakra, C: C.leaf, D: C.textMuted
  }
  const color = colors[rank] || C.textMuted
  return (
    <span style={{
      fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700,
      color, border: `1px solid ${color}`, borderRadius: 4, padding: '2px 7px',
      letterSpacing: 1, background: `${color}18`, whiteSpace: 'nowrap',
    }}>
      {rank}-RANK
    </span>
  )
}

function JutsuTag({ label, color = C.orange }: { label: string; color?: string }) {
  return (
    <span style={{
      fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
      color, border: `1px solid ${color}40`, borderRadius: 4,
      padding: '3px 8px', background: `${color}12`,
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      ✦ {label}
    </span>
  )
}

// ─── Section Styles ───────────────────────────────────────────────────────────
const sectionStyle = (bg = C.dark): React.CSSProperties => ({
  background: bg,
  padding: '96px 0',
  position: 'relative',
})

const containerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
}

const cardStyle = (borderColor = C.border, glowColor?: string): React.CSSProperties => ({
  background: C.surface,
  border: `1px solid ${borderColor}`,
  borderRadius: 16,
  padding: 24,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: glowColor ? `0 0 30px ${glowColor}` : undefined,
})

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [charIndex, setCharIndex] = useState(0)
  const name = 'Balaji Segu Krishnaiah'
  const [phase, setPhase] = useState<'unfurl' | 'text' | 'exit'>('unfurl')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 1200)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase !== 'text') return
    if (charIndex >= name.length) {
      const t = setTimeout(() => { setPhase('exit'); setTimeout(onDone, 700) }, 800)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCharIndex(i => i + 1), 60)
    return () => clearTimeout(t)
  }, [phase, charIndex, onDone, name.length])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          onClick={onDone}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: C.void, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', cursor: 'pointer',
          }}
        >
          {/* Scroll unfurl: top curtain */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: phase === 'unfurl' ? 0 : '-50%' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: '#0a0a0a', zIndex: 1 }}
          />
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: phase === 'unfurl' ? 0 : '50%' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: '#0a0a0a', zIndex: 1 }}
          />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase === 'text' ? 1 : 0, scale: phase === 'text' ? 1 : 0.8 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: '"Cinzel", serif', fontSize: 'clamp(80px, 15vw, 140px)',
                color: C.orange, lineHeight: 1, marginBottom: 32,
                textShadow: `0 0 60px ${C.orangeGlow}, 0 0 120px ${C.orangeGlow}`,
              }}
            >
              忍
            </motion.div>
            <div style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(18px, 3vw, 28px)', color: C.textPrimary, letterSpacing: 4, minHeight: 40 }}>
              {name.slice(0, charIndex)}
              <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ color: C.orange }}>|</motion.span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: charIndex >= name.length ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textSecondary, letterSpacing: 3, marginTop: 12, textTransform: 'uppercase' }}
            >
              Full Stack Builder · This is My Ninja Way
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: charIndex >= name.length ? 0.4 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textMuted, marginTop: 24, letterSpacing: 2 }}
            >
              Click anywhere to skip
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Metric Counter Card ──────────────────────────────────────────────────────
function MetricCounterCard({ label, value, inView }: { label: string; value: string; inView: boolean }) {
  // Detect if it's an arrow-style (e.g., "4h → 90min") or percentage or plain number
  const isArrow = value.includes('→')
  const isPercent = value.includes('%') && !value.includes('→')
  const numMatch = value.match(/[\d.]+/)
  const numVal = numMatch ? parseFloat(numMatch[0]) : 0
  const suffix = isPercent ? value.replace(/[\d.]+/, '') : ''
  const counted = useCounter(isArrow ? 0 : numVal, 1500, inView)

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: '16px 20px', textAlign: 'center',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 'clamp(16px, 2.5vw, 22px)',
        fontWeight: 700, color: C.orange, lineHeight: 1.2, marginBottom: 6,
      }}>
        {isArrow ? value : (isPercent ? `${counted}${suffix}` : `${counted}${value.replace(/[\d.]+/, '')}`)}
      </div>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textSecondary }}>
        {label}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NarutoPortfolio() {
  const [loading, setLoading] = useState(true)
  const [navVisible, setNavVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('village')
  const [skillFilter, setSkillFilter] = useState<string | null>(null)
  const [expandedBullets, setExpandedBullets] = useState(false)
  const [expandedProjects, setExpandedProjects] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const heroH = heroRef.current?.offsetHeight ?? 600
    setNavVisible(y > heroH * 0.8)

    // Update active section based on scroll position
    const sectionIds = ['village', 'ninja-way', 'academy', 'genin', 'chunin', 'jonin', 'missions', 'trophies', 'kage', 'jutsu', 'alliance']
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i])
      if (el && y >= el.offsetTop - 120) {
        // Map internal ids to nav ids
        const navId = sectionIds[i] === 'genin' ? 'academy' :
          ['chunin', 'jonin'].includes(sectionIds[i]) ? 'chunin' :
            sectionIds[i] === 'kage' ? 'trophies' : sectionIds[i]
        setActiveSection(navId)
        break
      }
    }
  })

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Metric counters inview for Jonin
  const [joninRef, joninInView] = useInView({ triggerOnce: true, threshold: 0.2 })

  const mckinsey = experiences.find(e => e.id === 'mckinsey')!
  const tejas = experiences.find(e => e.id === 'tejas')!
  const superteam = experiences.find(e => e.id === 'superteam')!
  const uniswap = experiences.find(e => e.id === 'uniswap-incubator')!

  // Live vs upcoming for Uniswap
  const uniswapLive = new Date() >= new Date(uniswap.startDate!)
  const dcu = education.find(e => e.id === 'dcu')!
  const bms = education.find(e => e.id === 'bms')!
  const school = education.find(e => e.id === 'school')!

  const arankProjects = projects.filter(p => p.arank)
  const otherProjects = projects.filter(p => !p.featured && !p.arank)

  const jutsuMap: Record<string, { jutsu: string; desc: string }> = {
    'ai-ml': { jutsu: 'Genjutsu', desc: 'Mind Techniques' },
    'systems': { jutsu: 'Taijutsu', desc: 'Physical Mastery' },
    'web': { jutsu: 'Ninjutsu', desc: 'Versatile Techniques' },
    'mobile': { jutsu: 'Medical Nin', desc: 'Healing Tools' },
    'devops': { jutsu: 'Senjutsu', desc: 'Sage Mode' },
    'web3': { jutsu: 'Kekkei Genkai', desc: 'Rare Bloodline' },
  }

  const radarData = skillCategories.map(cat => ({
    subject: jutsuMap[cat.id]?.jutsu ?? cat.label,
    value: Math.min(100, cat.skills.length * 14),
    fullMark: 100,
  }))

  const handleDone = useCallback(() => setLoading(false), [])

  const navLinks = [
    { id: 'village', label: 'Village' },
    { id: 'ninja-way', label: 'Ninja Way' },
    { id: 'academy', label: 'Ninja Academy' },
    { id: 'chunin', label: 'Experience' },
    { id: 'missions', label: 'Projects' },
    { id: 'trophies', label: 'Achievements' },
    { id: 'jutsu', label: 'Jutsu' },
    { id: 'alliance', label: 'Alliance' },
  ]

  return (
    <div style={{ background: C.void, minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: C.textPrimary, overflowX: 'hidden' }}>
      {/* Global CSS */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.85); } }
        @keyframes glow-pulse { 0%,100% { box-shadow:0 0 20px rgba(153,69,255,0.3); } 50% { box-shadow:0 0 40px rgba(153,69,255,0.6); } }
        @keyframes grid-line { 0% { opacity:0.03; } 100% { opacity:0.07; } }
        .naruto-btn {
          border: none; cursor: pointer; transition: all 0.2s;
          font-family: '"Inter", sans-serif'; letter-spacing: 1px;
        }
        .naruto-btn:hover { filter: brightness(1.15); transform: translateY(-2px); }
      `}</style>

      {/* Loading Screen */}
      {loading && <LoadingScreen onDone={handleDone} />}

      {/* ── Sticky Nav ── */}
      <AnimatePresence>
        {navVisible && (
          <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
              background: 'rgba(10,15,20,0.9)', backdropFilter: 'blur(16px)',
              borderBottom: `1px solid ${C.orange}30`,
              display: 'flex', justifyContent: 'center', padding: '0 24px',
            }}
          >
            <div style={{ display: 'flex', gap: 8, maxWidth: 1200, width: '100%', justifyContent: 'center' }}>
              {navLinks.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => { scrollTo(id); setActiveSection(id) }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '16px 16px 14px',
                    fontFamily: '"Inter", sans-serif', fontWeight: 500, letterSpacing: 1,
                    color: activeSection === id ? C.orange : C.textSecondary,
                    borderBottom: activeSection === id ? `2px solid ${C.orange}` : '2px solid transparent',
                    transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                  }}
                >
                  {id === 'jutsu' ? (
                    <>
                      <span style={{ fontSize: 13 }}>JUTSU</span>
                      <span style={{ fontSize: 9, opacity: 0.6, letterSpacing: 1 }}>SKILLS</span>
                    </>
                  ) : id === 'missions' ? (
                    <>
                      <span style={{ fontSize: 13 }}>PROJECTS</span>
                      <span style={{ fontSize: 9, opacity: 0.6, letterSpacing: 1 }}>S-RANK MISSIONS</span>
                    </>
                  ) : id === 'chunin' ? (
                    <>
                      <span style={{ fontSize: 13 }}>EXPERIENCE</span>
                      <span style={{ fontSize: 9, opacity: 0.6, letterSpacing: 1 }}>ARCS III & IV</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 13 }}>{label.toUpperCase()}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── SECTION 1: HERO ── */}
      <section id="village" ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: C.void, overflow: 'hidden' }}>
        <ParticleCanvas />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${C.orange}08 1px, transparent 1px), linear-gradient(90deg, ${C.orange}08 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div style={{ ...containerStyle, position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: loading ? 2.8 : 0.3 }}>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.orange, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 16 }}>
              🍃 Hidden Leaf Shinobi
            </p>
            <h1 style={{
              fontFamily: '"Cinzel", serif', fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900,
              color: C.textPrimary, letterSpacing: 4, lineHeight: 1.1, marginBottom: 20,
              textShadow: `0 0 40px ${C.orangeGlow}`,
            }}>
              BALAJI SEGU<br />KRISHNAIAH
            </h1>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, color: C.textSecondary, marginBottom: 12 }}>
              Full Stack Builder &nbsp;|&nbsp; MSc AI · Dublin, Ireland
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textMuted, fontStyle: 'italic', marginBottom: 40 }}>
              "I never give up. That's my ninja way." — Naruto Uzumaki
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
              <button
                className="naruto-btn"
                onClick={() => scrollTo('ninja-way')}
                style={{
                  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeLight})`,
                  color: '#fff', padding: '14px 32px', borderRadius: 8,
                  fontWeight: 600, fontSize: 14, letterSpacing: 1,
                }}
              >
                ⚡ Enter the Village
              </button>
              <a
                href="https://drive.google.com/file/d/1SCvCE9lD2O5ho8-PyizVnhvl-CRPXuUZ/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: 'transparent',
                  color: C.textPrimary, padding: '14px 32px', borderRadius: 8,
                  fontWeight: 600, fontSize: 14, letterSpacing: 1, cursor: 'pointer',
                  border: `1px solid ${C.border}`, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.orange }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border }}
              >
                📜 Download Resume
              </a>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              {[
                { value: '3+', label: 'Years Exp', icon: '⚔️', color: C.orange },
                { value: '8+', label: 'Jutsu Built', icon: '📜', color: C.leaf },
                { value: 'McK', label: 'S-Rank Firm', icon: '🏆', color: C.srank },
                { value: 'DCU', label: 'MSc AI', icon: '🎓', color: C.kage },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (loading ? 2.8 : 0.3) + i * 0.1 + 0.5 }}
                  style={{
                    background: C.surface, border: `1px solid ${stat.color}30`,
                    borderRadius: 12, padding: '16px 24px', textAlign: 'center',
                    minWidth: 110,
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Social */}
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'GitHub', href: 'https://github.com/BALAJI-SK' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/s-k-balaji/' },
                { label: 'X / Twitter', href: 'https://x.com/BalajiS20877995' },
                { label: 'Email', href: 'mailto:skbalajimbl1@gmail.com' },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary, letterSpacing: 2, textTransform: 'uppercase', transition: 'color 0.2s' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = C.orange }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = C.textSecondary }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: NINJA WAY ── */}
      <section id="ninja-way" style={sectionStyle(C.dark)}>
        <div style={containerStyle}>
          <ArcLabel title="NINJA WAY" />
          <motion.div {...scrollReveal} style={{ maxWidth: 720, marginBottom: 56 }}>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, color: C.textSecondary, lineHeight: 1.8, marginBottom: 16 }}>
              "My path wasn't the easiest. I didn't have a Sharingan or a Byakugan.
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, color: C.textPrimary, lineHeight: 1.8, marginBottom: 16 }}>
              I had <span style={{ color: C.orange, fontWeight: 600 }}>C++</span>, <span style={{ color: C.leaf, fontWeight: 600 }}>Go</span>, and a <span style={{ color: C.chakra, fontWeight: 600 }}>refusal to quit</span>."
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: C.textSecondary, lineHeight: 1.8 }}>
              I build things that work in the real world — fast systems, AI products, Web3 protocols.
              From Bengaluru to Dublin. Still shipping.
            </p>
          </motion.div>

          {/* Interest Runes */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: '🏓', label: 'Table Tennis', desc: 'Reflexes & calm under pressure', color: C.chakra },
              { icon: '🍃', label: 'Naruto', desc: 'Hard work beats talent. Always.', color: C.orange },
              { icon: '⛓️', label: 'Web3 & AI', desc: 'The jutsu of the future', color: C.kage },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                {...scrollReveal}
                transition={{ ...scrollReveal.transition, delay: i * 0.15 }}
                whileHover={{ y: -4, boxShadow: `0 0 30px ${item.color}30` }}
                style={{
                  background: C.surface, border: `1px solid ${item.color}30`,
                  borderRadius: 16, padding: '28px 32px', flex: '1 1 240px',
                  transition: 'box-shadow 0.3s',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: 16, fontWeight: 600, color: item.color, marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textSecondary }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ACADEMY ARC ── */}
      <section id="academy" style={sectionStyle(C.void)}>
        <div style={containerStyle}>
          <ArcLabel arc="ARC I — THE ACADEMY" title="THE ACADEMY" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 48, marginTop: -32 }}>
            "Every ninja starts here."
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* DCU */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ boxShadow: `0 0 40px ${C.kage}40` }}
              style={{ ...cardStyle(`${C.kage}40`, `${C.kage}20`), animation: 'glow-pulse 3s infinite' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: 28, fontWeight: 700, color: C.kage }}>{dcu.logo}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${C.leaf}20`, border: `1px solid ${C.leaf}40`, borderRadius: 6, padding: '4px 10px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.leaf, display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.leaf, letterSpacing: 1 }}>CURRENT</span>
                </div>
              </div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{dcu.institution}</h3>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.kage, marginBottom: 4 }}>{dcu.degree} · {dcu.field}</p>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{dcu.period}</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textMuted, marginBottom: 14 }}>{dcu.location}</p>
              {dcu.grade && (
                <div style={{ background: `${C.kage}12`, border: `1px solid ${C.kage}30`, borderRadius: 8, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 700, color: C.kage }}>{dcu.grade}</span>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: C.textSecondary }}>{dcu.grade_label}</span>
                </div>
              )}
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Core Scrolls</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {dcu.highlights.map(h => (
                  <span key={h} style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.kage, background: `${C.kage}15`, border: `1px solid ${C.kage}30`, borderRadius: 6, padding: '3px 10px' }}>{h}</span>
                ))}
              </div>
            </motion.div>

            {/* BMS */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ boxShadow: `0 0 30px ${C.orange}30` }}
              style={cardStyle(`${C.orange}30`)}
            >
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: 28, fontWeight: 700, color: C.orange }}>{bms.logo}</div>
              </div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{bms.institution}</h3>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.orange, marginBottom: 4 }}>{bms.degree} · {bms.field}</p>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{bms.period}</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textMuted, marginBottom: 12 }}>{bms.location}</p>
              {bms.grade && (
                <div style={{ background: `${C.orange}12`, border: `1px solid ${C.orange}25`, borderRadius: 8, padding: '8px 14px', display: 'inline-block', marginBottom: 20 }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 700, color: C.orange }}>{bms.grade}</span>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textSecondary, marginLeft: 8 }}>{bms.grade_label}</span>
                </div>
              )}
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Core Scrolls</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {bms.highlights.map(h => (
                  <span key={h} style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.orange, background: `${C.orange}12`, border: `1px solid ${C.orange}25`, borderRadius: 6, padding: '3px 10px' }}>{h}</span>
                ))}
              </div>
            </motion.div>

            {/* School — 10th */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              whileHover={{ boxShadow: `0 0 30px ${C.srank}30` }}
              style={cardStyle(`${C.srank}30`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: 28, fontWeight: 700, color: C.srank }}>{school.logo}</div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.srank, background: `${C.srank}18`, border: `1px solid ${C.srank}40`, borderRadius: 6, padding: '4px 10px', letterSpacing: 1 }}>🥇 SCHOOL TOPPER</span>
              </div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{school.institution}</h3>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.srank, marginBottom: 4 }}>{school.degree}</p>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{school.period}</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textMuted, marginBottom: 16 }}>{school.location}</p>
              {school.grade && (
                <div style={{ background: `${C.srank}12`, border: `1px solid ${C.srank}30`, borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, fontWeight: 700, color: C.srank }}>{school.grade}</div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{school.grade_label}</div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {school.highlights.map(h => (
                  <div key={h} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: C.srank, fontSize: 10, marginTop: 3, flexShrink: 0 }}>✦</span>
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary }}>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: GENIN ARC ── */}
      <section id="genin" style={sectionStyle(C.dark)}>
        <div style={containerStyle}>
          <ArcLabel arc="ARC II — GENIN" title="GENIN ARC" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 48, marginTop: -32 }}>
            "First missions. Learning the ropes."
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
            {['college-space', 'ddos', 'rhythm'].map((id, i) => {
              const proj = projects.find(p => p.id === id)!
              const ranks: Record<string, string> = { 'college-space': 'D', 'ddos': 'C', 'rhythm': 'C' }
              return (
                <motion.div
                  key={proj.id}
                  {...scrollReveal}
                  transition={{ ...scrollReveal.transition, delay: i * 0.12 }}
                  whileHover={{ y: -4, boxShadow: `0 8px 30px ${proj.color}25` }}
                  style={{ ...cardStyle(`${proj.color}25`), display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 28 }}>{proj.icon}</span>
                    <MissionRank rank={ranks[proj.id] ?? 'C'} />
                  </div>
                  <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{proj.name}</h3>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary, marginBottom: 16, lineHeight: 1.6, flex: 1 }}>{proj.tagline}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {proj.stack.map(s => (
                      <span key={s} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textMuted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 8px' }}>{s}</span>
                    ))}
                  </div>
                  <a href={proj.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: proj.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >↗ GitHub</a>
                </motion.div>
              )
            })}
          </div>

          {/* CTA → S-Rank Missions */}
          <motion.div
            {...scrollReveal}
            style={{ textAlign: 'center' }}
          >
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textMuted, marginBottom: 16 }}>
              These were just the warm-up missions.
            </p>
            <button
              onClick={() => scrollTo('missions')}
              style={{
                background: `linear-gradient(135deg, ${C.orange}20, ${C.srank}20)`,
                border: `1px solid ${C.orange}50`,
                borderRadius: 12, padding: '16px 36px', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 12,
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = `linear-gradient(135deg, ${C.orange}35, ${C.srank}35)`
                el.style.borderColor = C.orange
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = `linear-gradient(135deg, ${C.orange}20, ${C.srank}20)`
                el.style.borderColor = `${C.orange}50`
                el.style.transform = 'none'
              }}
            >
              <span style={{ fontFamily: '"Cinzel", serif', fontSize: 15, fontWeight: 700, color: C.srank, letterSpacing: 2 }}>
                ⭐ VIEW S-RANK MISSIONS
              </span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                style={{ fontSize: 18, display: 'inline-block' }}
              >
                ↓
              </motion.span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5: CHUNIN ARC ── */}
      <section id="chunin" style={sectionStyle(C.void)}>
        <div style={containerStyle}>
          <ArcLabel arc="ARC III — THE CHUNIN EXAM" title="THE CHUNIN EXAM" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 48, marginTop: -32 }}>
            "The mission that changed everything."
          </p>

          <motion.div {...scrollReveal} style={{ ...cardStyle(`${C.chakra}30`), position: 'relative', overflow: 'visible' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: 32, fontWeight: 900, color: C.textPrimary, marginBottom: 8 }}>
                  McKINSEY & COMPANY
                </div>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: C.chakra }}>{mckinsey.role}</p>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: C.textMuted, marginTop: 4 }}>{mckinsey.period} · {mckinsey.location}</p>
              </div>
              <MissionRank rank="A" />
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {mckinsey.metrics.map(m => (
                <div key={m.label} style={{ background: `${C.chakra}10`, border: `1px solid ${C.chakra}30`, borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 24, fontWeight: 700, color: C.chakra, marginBottom: 6 }}>{m.value}</div>
                  <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textSecondary }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Mission Objectives */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Mission Objectives</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mckinsey.bullets.map(b => (
                  <div key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: C.orange, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✦</span>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Jutsu Used */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Jutsu Used</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {mckinsey.skills.map(s => <JutsuTag key={s} label={s} />)}
              </div>
            </div>

            {/* Stamp */}
            <div style={{ position: 'absolute', bottom: 24, right: 24, transform: 'rotate(-8deg)' }}>
              <div style={{
                border: `3px solid #cc0000`, borderRadius: 8, padding: '8px 20px',
                fontFamily: '"Cinzel", serif', fontSize: 14, fontWeight: 700, color: '#cc0000',
                opacity: 0.8, letterSpacing: 3, textTransform: 'uppercase',
              }}>
                CHUNIN EXAM PASSED
                <br />
                <span style={{ fontSize: 10, letterSpacing: 4 }}>PROMOTED</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 6: JONIN ARC ── */}
      <section id="jonin" style={sectionStyle(C.dark)}>
        <div style={containerStyle}>
          <ArcLabel arc="ARC IV — JONIN" title="JONIN ARC" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 48, marginTop: -32 }}>
            "Elite. Real stakes. Real hardware."
          </p>

          <motion.div {...scrollReveal} style={cardStyle(`${C.orange}30`)}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: '"Cinzel", serif', fontSize: 28, fontWeight: 900, color: C.textPrimary, marginBottom: 8 }}>
                  ⚙️ TEJAS NETWORKS
                </div>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: C.orange }}>{tejas.role} · {tejas.type}</p>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: C.textMuted, marginTop: 4 }}>{tejas.period} · {tejas.location}</p>
              </div>
              <MissionRank rank="S" />
            </div>

            {/* Mission Metrics */}
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Mission Metrics</p>
            <div ref={joninRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
              {tejas.metrics.map(m => (
                <MetricCounterCard key={m.label} label={m.label} value={m.value} inView={joninInView} />
              ))}
            </div>

            {/* Advanced Jutsu */}
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Advanced Jutsu Unlocked</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {tejas.skills.map(s => <JutsuTag key={s} label={s} />)}
            </div>

            {/* Mentored highlight */}
            <div style={{ borderLeft: `4px solid ${C.orange}`, paddingLeft: 16, marginBottom: 28, background: `${C.orange}08`, borderRadius: '0 8px 8px 0', padding: '12px 16px' }}>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textPrimary }}>
                🟠 <strong>Mentored 4 Interns</strong> — 77% testing efficiency improvement · 45% hardware validation cost savings
              </p>
            </div>

            {/* Bullets */}
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Missions Accomplished</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(expandedBullets ? tejas.bullets : tejas.bullets.slice(0, 2)).map(b => (
                <div key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: C.orange, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✦</span>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{b}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setExpandedBullets(e => !e)}
              style={{
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.textSecondary, padding: '8px 20px', cursor: 'pointer',
                fontFamily: '"Inter", sans-serif', fontSize: 13, marginTop: 16, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.orange; (e.currentTarget as HTMLElement).style.color = C.orange }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.textSecondary }}
            >
              {expandedBullets ? '− Show less' : `+ Show all missions (${tejas.bullets.length})`}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 7: S-RANK MISSIONS ── */}
      <section id="missions" style={sectionStyle(C.void)}>
        <div style={containerStyle}>
          <ArcLabel arc="ARC V — S-RANK MISSIONS" title="S-RANK MISSIONS" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 48, marginTop: -32 }}>
            "The ones they said couldn't be done."
          </p>

          {/* RapidResponse — Hero full-width card */}
          {(() => {
            const hero = projects.find(p => p.id === 'rapid-response')!
            return (
              <motion.div
                {...scrollReveal}
                whileHover={{ boxShadow: `0 0 60px ${hero.color}30` }}
                style={{ ...cardStyle(`${hero.color}50`), marginBottom: 24, background: `linear-gradient(135deg, ${C.surface}, ${C.dark})` }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 40 }}>{hero.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 24, fontWeight: 700, color: C.textPrimary }}>{hero.name}</h3>
                      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: hero.color, marginTop: 4 }}>{hero.tagline}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {hero.collaborative && (
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.chakra, background: `${C.chakra}15`, border: `1px solid ${C.chakra}30`, borderRadius: 6, padding: '4px 10px' }}>
                        👥 Collaborative
                      </span>
                    )}
                    <span style={{ fontSize: 16 }}>⭐</span>
                    <MissionRank rank="S" />
                  </div>
                </div>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>{hero.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {hero.metrics?.map(m => (
                    <span key={m} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: hero.color, background: `${hero.color}15`, border: `1px solid ${hero.color}30`, borderRadius: 6, padding: '4px 12px' }}>{m}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {hero.stack.map(s => <JutsuTag key={s} label={s} color={hero.color} />)}
                </div>
                <a href={hero.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${hero.color}20`, border: `1px solid ${hero.color}50`, color: hero.color, padding: '10px 20px', borderRadius: 8, fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${hero.color}35` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${hero.color}20` }}
                >
                  ↗ View on GitHub
                </a>
              </motion.div>
            )
          })()}

          {/* S-rank grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
            {projects.filter(p => p.featured && p.id !== 'rapid-response').map((proj, i) => (
              <motion.div
                key={proj.id}
                {...scrollReveal}
                transition={{ ...scrollReveal.transition, delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: `0 8px 40px ${proj.color}30` }}
                style={{ ...cardStyle(`${proj.color}35`), display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{proj.icon}</span>
                  <MissionRank rank="S" />
                </div>
                <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{proj.name}</h3>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: proj.color, marginBottom: 10 }}>{proj.tagline}</p>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary, marginBottom: 14, lineHeight: 1.6, flex: 1 }}>{proj.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {proj.metrics?.map(m => (
                    <span key={m} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: proj.color, background: `${proj.color}12`, border: `1px solid ${proj.color}25`, borderRadius: 4, padding: '2px 8px' }}>{m}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {proj.stack.map(s => <JutsuTag key={s} label={s} color={proj.color} />)}
                </div>
                <a href={proj.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: proj.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  {proj.noGithub ? '↗ View Live' : '↗ GitHub'}
                </a>
              </motion.div>
            ))}
          </div>

          {/* A-rank section */}
          {arankProjects.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.orange, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>⬛ A-RANK MISSIONS</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                {arankProjects.map((proj, i) => (
                  <motion.div
                    key={proj.id}
                    {...scrollReveal}
                    transition={{ ...scrollReveal.transition, delay: i * 0.1 }}
                    whileHover={{ y: -4, boxShadow: `0 8px 40px ${proj.color}30` }}
                    style={{ ...cardStyle(`${proj.color}25`), display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: 32 }}>{proj.icon}</span>
                      <MissionRank rank="A" />
                    </div>
                    <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{proj.name}</h3>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: proj.color, marginBottom: 10 }}>{proj.tagline}</p>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary, marginBottom: 14, lineHeight: 1.6, flex: 1 }}>{proj.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {proj.metrics?.map(m => (
                        <span key={m} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: proj.color, background: `${proj.color}12`, border: `1px solid ${proj.color}25`, borderRadius: 4, padding: '2px 8px' }}>{m}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {proj.stack.map(s => <JutsuTag key={s} label={s} color={proj.color} />)}
                    </div>
                    <a href={proj.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: proj.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      {proj.noGithub ? '↗ View Live' : '↗ GitHub'}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* More missions collapsible */}
          <motion.div {...scrollReveal}>
            <button
              onClick={() => setExpandedProjects(e => !e)}
              style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                color: C.textSecondary, padding: '14px 28px', cursor: 'pointer', width: '100%',
                fontFamily: '"Inter", sans-serif', fontSize: 14, letterSpacing: 1, transition: 'all 0.2s', marginBottom: 16,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.orange; (e.currentTarget as HTMLElement).style.color = C.orange }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.textSecondary }}
            >
              {expandedProjects ? '− Hide Missions' : `+ ${otherProjects.length} More Missions (B/C Rank)`}
            </button>
            <AnimatePresence>
              {expandedProjects && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {otherProjects.map((proj, i) => (
                      <motion.div
                        key={proj.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -3 }}
                        style={cardStyle(`${proj.color}25`)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: 24 }}>{proj.icon}</span>
                          <MissionRank rank={['solas', 'visual-shopper'].includes(proj.id) ? 'B' : 'C'} />
                        </div>
                        <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{proj.name}</h3>
                        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>{proj.tagline}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                          {proj.stack.slice(0, 3).map(s => (
                            <span key={s} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: C.textMuted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 7px' }}>{s}</span>
                          ))}
                        </div>
                        <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: proj.color }}>↗ GitHub</a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS / TROPHIES ── */}
      <section id="trophies" style={sectionStyle(C.dark)}>
        <div style={containerStyle}>
          <ArcLabel title="TROPHIES & HONOURS" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 48, marginTop: -32 }}>
            "The battles that proved the ninja way."
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {achievements.map((a, i) => (
              <motion.div
                key={a.id}
                {...scrollReveal}
                transition={{ ...scrollReveal.transition, delay: i * 0.12 }}
                whileHover={{ y: -4, boxShadow: `0 8px 40px ${a.color}30` }}
                style={{ ...cardStyle(`${a.color}35`), position: 'relative' }}
              >
                {/* Rank badge top-right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{a.icon}</span>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700,
                    color: a.color, background: `${a.color}18`, border: `1px solid ${a.color}40`,
                    borderRadius: 6, padding: '4px 10px', letterSpacing: 1, whiteSpace: 'nowrap',
                  }}>
                    {a.prize ?? a.rank}
                  </span>
                </div>

                <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{a.title}</h3>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: a.color, marginBottom: 4 }}>{a.issuer}</p>
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textMuted, marginBottom: 12 }}>{a.date}{a.location ? ` · ${a.location}` : ''}</p>

                {a.project && (
                  <div style={{ background: `${a.color}10`, border: `1px solid ${a.color}25`, borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textMuted, letterSpacing: 1 }}>PROJECT: </span>
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textPrimary, fontWeight: 600 }}>{a.project}</span>
                  </div>
                )}

                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary, lineHeight: 1.6, marginBottom: a.teammates ? 12 : 0 }}>{a.description}</p>

                {a.participants && (
                  <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textMuted, marginBottom: 8 }}>👥 {a.participants}</p>
                )}

                {a.teammates && a.teammates.length > 0 && (
                  <div style={{ marginBottom: a.url ? 12 : 0 }}>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Team</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {a.teammates.map(t => (
                        <span key={t} style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textSecondary, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 8px' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {a.url && (
                  <a href={a.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: '"Inter", sans-serif', fontSize: 13, color: a.color, marginTop: 12 }}
                  >↗ View</a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: KAGE ARC ── */}
      <section id="kage" style={sectionStyle(C.dark)}>
        <div style={containerStyle}>
          <ArcLabel arc="ARC VI — THE KAGE ARC [CURRENT]" title="THE KAGE ARC" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 48, marginTop: -32 }}>
            "The strongest arc. Still being written."
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 48 }}>
            {/* DCU */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ ...cardStyle(`${C.kage}40`), position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontFamily: '"Cinzel", serif', fontSize: 24, fontWeight: 700, color: C.kage }}>{dcu.logo}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${C.leaf}15`, border: `1px solid ${C.leaf}40`, borderRadius: 6, padding: '4px 10px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.leaf, display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.leaf, letterSpacing: 1 }}>LIVE</span>
                </div>
              </div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{dcu.institution}</h3>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.kage, marginBottom: 4 }}>{dcu.degree} · {dcu.field}</p>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{dcu.period}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {dcu.skills.map(s => <JutsuTag key={s} label={s} color={C.kage} />)}
              </div>
            </motion.div>

            {/* Superteam */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={cardStyle(`${C.kage}40`)}
            >
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontFamily: '"Cinzel", serif', fontSize: 24, fontWeight: 700, color: C.kage }}>ST</span>
              </div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{superteam.company}</h3>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.kage, marginBottom: 4 }}>{superteam.role}</p>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{superteam.period} · {superteam.location}</p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>{superteam.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {superteam.skills.map(s => <JutsuTag key={s} label={s} color={C.kage} />)}
              </div>
            </motion.div>

            {/* Uniswap Hook Incubator */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              whileHover={{ boxShadow: `0 0 40px ${uniswap.color}30` }}
              style={{ ...cardStyle(`${uniswap.color}40`), gridColumn: 'span 1' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontFamily: '"Cinzel", serif', fontSize: 22, fontWeight: 700, color: uniswap.color }}>{uniswap.logo}</span>
                {uniswapLive ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${C.leaf}15`, border: `1px solid ${C.leaf}40`, borderRadius: 6, padding: '4px 10px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.leaf, display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.leaf, letterSpacing: 1 }}>LIVE</span>
                  </div>
                ) : (
                  <div style={{ background: `${uniswap.color}15`, border: `1px solid ${uniswap.color}40`, borderRadius: 6, padding: '4px 10px' }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: uniswap.color, letterSpacing: 1 }}>⏳ STARTS APR 9</span>
                  </div>
                )}
              </div>
              <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: 17, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{uniswap.company}</h3>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: uniswap.color, marginBottom: 4 }}>{uniswap.role} · {uniswap.type}</p>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.textMuted, marginBottom: 14 }}>{uniswap.period} · {uniswap.duration}</p>

              {/* Prize highlight */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                {uniswap.metrics.map(m => (
                  <div key={m.label} style={{ background: `${uniswap.color}12`, border: `1px solid ${uniswap.color}30`, borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 700, color: uniswap.color }}>{m.value}</div>
                    <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: C.textMuted, marginTop: 1 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textSecondary, lineHeight: 1.65, marginBottom: 16 }}>
                Building Uniswap v4 Hooks — smart contracts plugging into the swap lifecycle for programmable liquidity &amp; dynamic fees. Cohort theme: <span style={{ color: uniswap.color, fontWeight: 600 }}>IL mitigation &amp; yield systems</span>. Grant-funded by Uniswap Foundation.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {uniswap.skills.map(s => <JutsuTag key={s} label={s} color={uniswap.color} />)}
              </div>

              <a href={uniswap.url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: uniswap.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >↗ atrium.academy/uniswap</a>
            </motion.div>
          </div>

          {/* Chakra Radar */}
          <motion.div {...scrollReveal} style={{ ...cardStyle(`${C.kage}25`), padding: '40px 24px' }}>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: C.textSecondary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32, textAlign: 'center' }}>
              Chakra Network — Skill Radar
            </p>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={`${C.kage}30`} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: C.textSecondary, fontSize: 12, fontFamily: '"JetBrains Mono", monospace' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="value" stroke={C.kage} fill={C.kage} fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 9: JUTSU SCROLL ── */}
      <section id="jutsu" style={sectionStyle(C.void)}>
        <div style={containerStyle}>
          <ArcLabel title="THE JUTSU SCROLL" />
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: C.textMuted, fontStyle: 'italic', marginBottom: 32, marginTop: -32 }}>
            "Every ninja needs their arsenal."
          </p>

          {/* Filter buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
            <button
              onClick={() => setSkillFilter(null)}
              style={{
                background: skillFilter === null ? C.orange : 'transparent',
                border: `1px solid ${skillFilter === null ? C.orange : C.border}`,
                color: skillFilter === null ? '#fff' : C.textSecondary,
                padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
                fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
              }}
            >
              All
            </button>
            {skillCategories.map(cat => {
              const jm = jutsuMap[cat.id]
              const isActive = skillFilter === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSkillFilter(cat.id === skillFilter ? null : cat.id)}
                  style={{
                    background: isActive ? `${cat.color}25` : 'transparent',
                    border: `1px solid ${isActive ? cat.color : C.border}`,
                    color: isActive ? cat.color : C.textSecondary,
                    padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
                    fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                  }}
                >
                  {cat.icon} {jm?.jutsu}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {skillCategories.map((cat, ci) => {
              const jm = jutsuMap[cat.id]
              const isFiltered = skillFilter !== null && skillFilter !== cat.id
              return (
                <motion.div
                  key={cat.id}
                  {...scrollReveal}
                  transition={{ ...scrollReveal.transition, delay: ci * 0.1 }}
                  animate={{ opacity: isFiltered ? 0.25 : 1 }}
                  style={cardStyle(`${cat.color}30`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 20 }}>{cat.icon}</span>
                        <span style={{ fontFamily: '"Cinzel", serif', fontSize: 16, fontWeight: 700, color: cat.color }}>{jm?.jutsu}</span>
                      </div>
                      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: C.textMuted }}>{jm?.desc} · {cat.label}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {cat.skills.map((skill, si) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: si * 0.05 + ci * 0.05 }}
                        style={{
                          fontFamily: '"JetBrains Mono", monospace', fontSize: 12,
                          color: cat.color, background: `${cat.color}12`,
                          border: `1px solid ${cat.color}30`, borderRadius: 6,
                          padding: '5px 12px',
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: FORM ALLIANCE ── */}
      <section id="alliance" style={{ ...sectionStyle(C.dark), position: 'relative', overflow: 'hidden' }}>
        {/* Subtle bg glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${C.orangeGlow}, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ ...containerStyle, position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div {...scrollReveal}>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.textMuted, letterSpacing: 4, marginBottom: 16 }}>⋯ ⋯ ⋯</p>
            <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>FORM AN ALLIANCE</h2>
            <div style={{ height: 3, width: 60, background: `linear-gradient(90deg, transparent, ${C.orange}, transparent)`, margin: '0 auto 24px' }} />
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: C.textSecondary, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7, fontStyle: 'italic' }}>
              "Every legendary team starts with one handshake. Let's make ours."
            </p>
          </motion.div>

          {/* Open to */}
          <motion.div {...scrollReveal} transition={{ ...scrollReveal.transition, delay: 0.15 }} style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 28px' }}>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: C.orange, width: '100%', textAlign: 'center', marginBottom: 12, letterSpacing: 2, textTransform: 'uppercase' }}>🟠 Currently Open To</p>
              {['Full-time SWE', 'AI/ML Roles', 'Web3 Projects', 'Consulting'].map(role => (
                <span key={role} style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}30`, color: C.textPrimary, borderRadius: 8, padding: '6px 16px', fontFamily: '"Inter", sans-serif', fontSize: 13 }}>{role}</span>
              ))}
            </div>
          </motion.div>

          {/* Contact cards */}
          <motion.div
            {...scrollReveal}
            transition={{ ...scrollReveal.transition, delay: 0.25 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 40 }}
          >
            <div style={{ ...cardStyle(), flex: '1 1 200px', maxWidth: 260, textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✉️</div>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: C.textPrimary }}>skbalajimbl1@gmail.com</p>
            </div>
            <div style={{ ...cardStyle(), flex: '1 1 200px', maxWidth: 260, textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>⏱️</div>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textSecondary }}>Response time</p>
              <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, fontWeight: 700, color: C.orange, marginTop: 4 }}>{'< 24 hours'}</p>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div {...scrollReveal} transition={{ ...scrollReveal.transition, delay: 0.35 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}
          >
            <a href="mailto:skbalajimbl1@gmail.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg, ${C.orange}, ${C.orangeLight})`, color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
            >⚡ Send a Scroll</a>
            <a href="https://www.linkedin.com/in/s-k-balaji/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: C.textPrimary, border: `1px solid ${C.border}`, padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.chakra; (e.currentTarget as HTMLElement).style.color = C.chakra }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.textPrimary }}
            >◈ LinkedIn</a>
            <a href="https://x.com/BalajiS20877995" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: C.textPrimary, border: `1px solid ${C.border}`, padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.textSecondary; (e.currentTarget as HTMLElement).style.color = C.textSecondary }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.textPrimary }}
            >𝕏 Twitter</a>
            <a href="https://github.com/BALAJI-SK" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: C.textPrimary, border: `1px solid ${C.border}`, padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.leaf; (e.currentTarget as HTMLElement).style.color = C.leaf }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.textPrimary }}
            >⌥ GitHub</a>
          </motion.div>

          <motion.p {...scrollReveal} transition={{ ...scrollReveal.transition, delay: 0.45 }}
            style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, color: C.textMuted }}
          >
            📍 Dublin, Ireland · Open to Remote / Relocation
          </motion.p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: C.void, borderTop: `1px solid ${C.border}`, padding: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: C.textMuted }}>
          © Balaji Segu Krishnaiah · Built with 🍃 React + Vite
        </p>
        <p style={{ fontFamily: '"Cinzel", serif', fontSize: 13, color: C.orange, fontStyle: 'italic' }}>
          This is my ninja way.
        </p>
      </footer>
    </div>
  )
}

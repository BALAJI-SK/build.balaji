# 🍃 Naruto Ninja Way — Portfolio Design Spec
### For: Balaji Segu Krishnaiah | Claude Code Implementation Guide

> **Data source:** All real data lives in `src/data/` — `experience.ts`, `projects.ts`, `education.ts`, `skills.ts`.
> **Tech stack:** React + TypeScript + Tailwind + Framer Motion + Three.js (optional for hero)
> **Route:** Single page, vertical scroll with scroll-triggered animations via Framer Motion `useInView`

---

## 🎨 Design System

### Color Palette

```ts
// naruto-theme.ts
export const NARUTO = {
  // Backgrounds
  void:        '#030507',   // deepest black — page bg
  dark:        '#0a0f14',   // section bg
  surface:     '#0f1923',   // card bg
  surfaceHover:'#162030',   // card hover

  // Naruto Orange (Primary)
  orange:      '#FF6B00',   // Naruto's signature — primary accent
  orangeLight: '#FF8C38',   // hover states
  orangeGlow:  'rgba(255,107,0,0.15)',  // glow effects

  // Leaf Village Green (Secondary)
  leaf:        '#3DBA6C',   // secondary accent
  leafDark:    '#2A8A4E',
  leafGlow:    'rgba(61,186,108,0.12)',

  // Chakra Blue (Tertiary — special moments)
  chakra:      '#00C8FF',
  chakraGlow:  'rgba(0,200,255,0.12)',

  // Rank Colors
  academy:     '#94a3b8',   // gray — Academy (education)
  genin:       '#3DBA6C',   // green leaf — Genin (early projects)
  chunin:      '#00C8FF',   // blue — Chunin (McKinsey)
  jonin:       '#FF6B00',   // orange — Jonin (Tejas Networks)
  srank:       '#FFD700',   // gold — S-Rank (featured projects)
  kage:        '#9945FF',   // purple — Kage (current Web3/AI arc)

  // Text
  textPrimary:  '#F0EDE8',  // warm white — like scroll paper
  textSecondary:'#8A9BAE',
  textMuted:    '#4A5568',

  // Borders
  border:       'rgba(255,107,0,0.15)',
  borderHover:  'rgba(255,107,0,0.4)',
}
```

### Typography

```css
/* fonts: import in index.html */
/* Primary: Cinzel (for headings — ancient/ninja scroll feel) */
/* Secondary: Inter (for body — clean readability) */
/* Mono: JetBrains Mono (for code/stats) */

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

h1, h2, .rank-label { font-family: 'Cinzel', serif; }
body, p, .card       { font-family: 'Inter', sans-serif; }
.stat, .code, .hash  { font-family: 'JetBrains Mono', monospace; }
```

### Spacing & Layout

```
Page max-width: 1200px, centered
Section padding: py-24 (96px top/bottom)
Card padding: p-6 (24px)
Gap between cards: gap-6 (24px)
Border radius: rounded-xl (12px) for cards, rounded-2xl (16px) for featured
```

---

## 🗺️ Page Architecture — The 9 Arcs

```
┌─────────────────────────────────────┐
│  0. LOADING SCREEN  — Scroll unfurl │
│  1. HERO            — The Village   │
│  2. NINJA WAY       — My Story      │
│  3. ACADEMY ARC     — Education     │
│  4. GENIN ARC       — Early Builds  │
│  5. CHUNIN ARC      — McKinsey      │
│  6. JONIN ARC       — Tejas Networks│
│  7. S-RANK MISSIONS — Top Projects  │
│  8. KAGE ARC        — Current       │
│  9. JUTSU SCROLL    — Skills        │
│ 10. FORM ALLIANCE   — Contact       │
└─────────────────────────────────────┘
```

---

## 📜 Section 0 — Loading Screen (Scroll Unfurl)

**Duration:** 2.5 seconds on first visit, skippable
**Effect:** A scroll/paper unrolls vertically revealing Japanese kanji + name

```
Implementation:
- Full screen dark bg (#030507)
- Center: SVG scroll animation — two ends unroll top/bottom
- Inside scroll: Kanji 忍 (Nin — "ninja/endure") fades in large
- Below: "Balaji Segu Krishnaiah" types out character by character
- Subtitle: "Full Stack Builder · This is My Ninja Way"
- Fades out, hero fades in

Framer Motion:
  scroll-top: y: -100% → 0 (spring, 1.5s)
  scroll-bottom: y: 100% → 0 (spring, 1.5s)
  kanji: opacity 0 → 1 (delay 0.8s)
  name: staggerChildren 0.05s per character
```

---

## 🏯 Section 1 — Hero (The Hidden Leaf Village)

**Vibe:** You are Naruto standing at the gates of Konoha — cinematic, atmospheric, epic

### Layout

```
┌──────────────────────────────────────────────────┐
│  [PARTICLE BG — falling leaves + chakra wisps]   │
│                                                  │
│        🍃  HIDDEN LEAF PORTFOLIO                 │
│                                                  │
│   ██████  BALAJI SEGU KRISHNAIAH  ██████         │
│         Full Stack Builder                       │
│      MSc AI · Dublin, Ireland                    │
│                                                  │
│   "I never give up. That's my ninja way."        │
│              — Naruto Uzumaki                    │
│                                                  │
│  [⚡ Enter the Village]  [📜 Download Resume]   │
│                                                  │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌───────┐ │
│  │ 3+ yrs │  │  8+    │  │ McKin  │  │ DCU   │ │
│  │  exp   │  │ projs  │  │  sey   │  │ MSc   │ │
│  └────────┘  └────────┘  └────────┘  └───────┘ │
│                                                  │
│     github · linkedin · twitter · email          │
└──────────────────────────────────────────────────┘
```

### Particle Background

```tsx
// Use tsparticles or custom canvas
// Particles: falling autumn maple leaves (orange/red/gold)
// Plus: faint chakra energy wisps (blue, slow float)
// Subtle grid lines like a training ground

particlesConfig: {
  count: 40,
  types: ['leaf', 'chakra-wisp'],
  leaf: { color: ['#FF6B00', '#FF8C38', '#FFD700'], size: 8-16, rotation: true },
  wisp: { color: '#00C8FF', size: 2-4, opacity: 0.3, blur: true }
}
```

### Stat Cards (4 mini cards below name)

```tsx
// Data: hardcoded (these are highlights)
const heroStats = [
  { value: '3+',    label: 'Years Exp',     icon: '⚔️', color: NARUTO.orange },
  { value: '8+',    label: 'Jutsu Built',   icon: '📜', color: NARUTO.leaf },
  { value: 'McK',   label: 'S-Rank Firm',   icon: '🏆', color: NARUTO.srank },
  { value: 'DCU',   label: 'MSc AI',        icon: '🎓', color: NARUTO.kage },
]
// Card style: dark glass, orange border on hover, stat in JetBrains Mono
```

### Nav Bar (Sticky, appears on scroll)

```
Position: fixed top, appears after hero leaves viewport
Style: backdrop-blur dark bg, orange bottom border line
Links: Village · Ninja Way · Academy · Missions · Jutsu · Alliance
Active link: orange underline dot indicator
Mobile: hamburger → slide-in drawer
```

---

## 🌿 Section 2 — Ninja Way (My Story)

**Naruto parallel:** The Ninja Way speech — personal philosophy

```
┌─────────────────────────────────────────────────┐
│  ── NINJA WAY ──────────────────────────────    │
│                                                 │
│  "My path wasn't the easiest.                   │
│   I didn't have a Sharingan or a Byakugan.      │
│   I had C++, Go, and a refusal to quit."        │
│                                                 │
│  I build things that work in the real world —  │
│  fast systems, AI products, Web3 protocols.    │
│  From Bengaluru to Dublin. Still shipping.     │
│                                                 │
│  [Table Tennis icon] [Naruto icon] [Code icon] │
│  Interests shown as little glowing runes       │
└─────────────────────────────────────────────────┘
```

```tsx
// 3 "interest rune" cards
const interests = [
  { icon: '🏓', label: 'Table Tennis', desc: 'Reflexes & calm under pressure' },
  { icon: '🍃', label: 'Naruto', desc: 'Hard work beats talent. Always.' },
  { icon: '⛓️', label: 'Web3 & AI', desc: 'The jutsu of the future' },
]
// Style: glowing rune border, hover lifts card with glow bloom
```

---

## 🎓 Section 3 — Academy Arc (Education)

**Naruto parallel:** Academy training — where ninjas learn the basics

### Rank Badge: `ACADEMY → GRADUATE`

```
┌─────────────────────────────────────────────────┐
│  📜 ARC I — THE ACADEMY                         │
│     "Every ninja starts here."                  │
│                                                 │
│  ┌──────────────────┐  ┌───────────────────┐   │
│  │ 🎓 DCU           │  │ 🏛️ BMS College    │   │
│  │ MSc Computing    │  │ B.Tech CS         │   │
│  │ Artificial Intel │  │ First Class w/    │   │
│  │ Sep 2025–Sep 2026│  │ Distinction       │   │
│  │ Dublin, Ireland  │  │ CGPA 8.58 / 10   │   │
│  │                  │  │ Aug 2019–Jul 2023 │   │
│  │ [CURRENT ●]      │  │ Bengaluru, India  │   │
│  │                  │  │                   │   │
│  │ Core Scrolls:    │  │ Core Scrolls:     │   │
│  │ ML · Deep Learn  │  │ DSA · OS · AI/ML  │   │
│  │ AI Foundations   │  │ Big Data · OOP    │   │
│  │ Data Engineering │  │ Networks · C++    │   │
│  └──────────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────┘
```

```tsx
// Data source: import { education } from '@/data/education'
// education[0] = DCU (current: true) → show "CURRENT" badge
// education[1] = BMS

// Card style:
// - Left card (DCU): purple/kage glow — current arc
// - Right card (BMS): orange/jonin — past foundation
// - "Core Scrolls" = highlights array rendered as tags
// - Animated: card slides in from bottom on scroll enter
// - DCU card has a subtle pulsing "LIVE" dot

// Scroll reveal: education[0] from left, education[1] from right
// Framer Motion: initial={{ x: -60, opacity: 0 }}, animate on inView
```

---

## 🌱 Section 4 — Genin Arc (Early Projects & Interests)

**Naruto parallel:** First missions after graduating Academy — small but formative

### Rank Badge: `GENIN — RANK D/C MISSIONS`

```
┌────────────────────────────────────────────────┐
│  📜 ARC II — GENIN                             │
│     "First missions. Learning the ropes."      │
│                                                │
│  ┌─────────────────┐  ┌──────────────────┐    │
│  │ 📱 College Space │  │ 🛡️ DDoS Detection│    │
│  │ Flutter + Fire  │  │ SDN · OpenFlow   │    │
│  │ Full mobile app │  │ Real-time traffic│    │
│  │ for campus life │  │ Mininet simulation│   │
│  │ [D-Rank Mission]│  │ [C-Rank Mission] │    │
│  └─────────────────┘  └──────────────────┘    │
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │ 📈 The Immutable Rhythm                │   │
│  │ Testing Benner's 1875 market model     │   │
│  │ against S&P 500 · FTSE 100 · Bitcoin   │   │
│  │ [C-Rank Research Mission]              │   │
│  └────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
```

```tsx
// Data source: import { projects } from '@/data/projects'
// Genin projects: college-space, ddos, rhythm (featured: false)

// Each card has a "Mission Rank" badge:
//   D-Rank: gray badge  (learning missions)
//   C-Rank: green badge (some challenge)
//   B-Rank: blue badge  (real missions)
//   A-Rank: orange badge (serious missions)
//   S-Rank: gold badge  (legendary)

// Mission Rank component:
// <MissionRank rank="C" /> → renders colored badge with rank symbol

// Card style:
// - Dark surface card, subtle leaf-green border
// - Stack tags from project.stack array
// - GitHub link icon (↗)
// - Scroll animation: stagger children 0.1s
```

---

## 🌀 Section 5 — Chunin Arc (McKinsey Internship)

**Naruto parallel:** The Chunin Exam — the big test that proves you're ready for serious missions

### Rank Badge: `CHUNIN — PROMOTED`

```
┌──────────────────────────────────────────────────┐
│  📜 ARC III — THE CHUNIN EXAM                    │
│     "The mission that changed everything."       │
│                                                  │
│  ╔═══════════════════════════════════════════╗   │
│  ║  🏢  McKINSEY & COMPANY                  ║   │
│  ║  Software Engineer Intern                ║   │
│  ║  Jan 2023 – Jul 2023 · 7 months          ║   │
│  ║  Bengaluru, India                        ║   │
│  ╟───────────────────────────────────────────╢   │
│  ║                                          ║   │
│  ║  MISSION OUTCOMES:                       ║   │
│  ║  ⚡ 2 weeks → 2 days    [Task reduction] ║   │
│  ║  ✅ 100% backend test coverage           ║   │
│  ║                                          ║   │
│  ║  JUTSU USED:                             ║   │
│  ║  React.js · Node.js · Docker · K8s       ║   │
│  ║  AWS EKS · Testing                       ║   │
│  ║                                          ║   │
│  ║  KEY JUTSU: One-click AWS EKS deployment ║   │
│  ║  design canvas — architecture built from ║   │
│  ║  zero.                                   ║   │
│  ╚═══════════════════════════════════════════╝   │
│                                                  │
│  [CHUNIN PROMOTION SCROLL — animated unfurl]     │
└──────────────────────────────────────────────────┘
```

```tsx
// Data source: experiences.find(e => e.id === 'mckinsey')

// Special treatment: This section gets its OWN full-width layout
// Not just a card — it's a "mission briefing" style panel

// Metric cards (2 large):
// Each metric from mckinsey.metrics rendered as impact stats
// "2 weeks → 2 days" shown as animated counter/transition

// "Jutsu Used" = skills array rendered as orange tags
// Bullets = rendered as mission objectives with ✦ bullet icon

// Bottom: "CHUNIN EXAM PASSED" stamp (rotated red stamp effect)
// CSS: transform rotate(-8deg), red border, "PROMOTED" text
```

---

## 🔥 Section 6 — Jonin Arc (Tejas Networks — 2 Years)

**Naruto parallel:** Jonin level — elite, mentors others, takes the hardest missions

### Rank Badge: `JONIN — ELITE NINJA`

```
┌──────────────────────────────────────────────────┐
│  📜 ARC IV — JONIN                               │
│     "Elite. Real stakes. Real hardware."         │
│                                                  │
│  ╔═══════════════════════════════════════════╗   │
│  ║  ⚙️  TEJAS NETWORKS                       ║   │
│  ║  Software Engineer  ·  Full-time          ║   │
│  ║  Sep 2023 – Aug 2025  ·  2 years          ║   │
│  ║  Bengaluru, India                         ║   │
│  ╟───────────────────────────────────────────╢   │
│  ║                                           ║   │
│  ║  MISSION METRICS (animated counters):     ║   │
│  ║  ┌──────────┐ ┌──────────┐ ┌──────────┐  ║   │
│  ║  │ 4h→90min │ │82%→95.6% │ │  500+    │  ║   │
│  ║  │Cycle Time│ │Prod Yield│ │Daily Exec│  ║   │
│  ║  └──────────┘ └──────────┘ └──────────┘  ║   │
│  ║  ┌──────────┐ ┌──────────┐ ┌──────────┐  ║   │
│  ║  │  99.8%   │ │  +30%    │ │  -45%    │  ║   │
│  ║  │ Accuracy │ │ Defect↑  │ │Cost Save │  ║   │
│  ║  └──────────┘ └──────────┘ └──────────┘  ║   │
│  ║                                           ║   │
│  ║  ADVANCED JUTSU UNLOCKED:                 ║   │
│  ║  C++ · Go/Goroutines · FPGA · Flutter     ║   │
│  ║  WebSockets · I2C/SPI/PCIe · JSON Config  ║   │
│  ║                                           ║   │
│  ║  🟠 MENTORED 4 INTERNS                   ║   │
│  ║  (77% testing efficiency improvement)    ║   │
│  ╚═══════════════════════════════════════════╝   │
│                                                  │
│  Missions Accomplished:                          │
│  [expandable bullet list from tejas.bullets]     │
└──────────────────────────────────────────────────┘
```

```tsx
// Data source: experiences.find(e => e.id === 'tejas')

// Metric counter animation:
// Use Framer Motion + useInView + custom counter hook
// Count up from 0 to value when section enters viewport
// "4h → 90min" renders as two values with arrow between

// "Advanced Jutsu Unlocked" = skills array, styled as scroll tags
// Each skill tag: dark bg, orange border, small kunai icon ✦

// Expandable bullet list:
// Show first 2 bullets by default, "+ Show all missions" toggle
// Bullets from tejas.bullets array (6 bullets total)

// "Mentored 4 Interns" — special highlight box
// Orange left border, bold stat
```

---

## ⭐ Section 7 — S-Rank Missions (Featured Projects)

**Naruto parallel:** S-Rank missions — the legendary, dangerous ones that define a ninja

### Rank Badge: `S-RANK — LEGENDARY MISSIONS`

```
┌──────────────────────────────────────────────────┐
│  📜 ARC V — S-RANK MISSIONS                      │
│     "The ones they said couldn't be done."       │
│                                                  │
│  ╔════════════════════════════════════════════╗  │
│  ║  🌱  GreenCode Optimizer    [S-RANK] 🏆    ║  │
│  ║  AI-powered sustainable code analysis      ║  │
│  ║  Anthropic Claude + GitLab Duo             ║  │
│  ║  ──────────────────────────────────────    ║  │
│  ║  75 passing tests · MIT · CI/CD integrated ║  │
│  ║  Python · Claude API · GitLab CI           ║  │
│  ║  [↗ View Mission Report]                   ║  │
│  ╚════════════════════════════════════════════╝  │
│                                                  │
│  ┌────────────────────┐  ┌─────────────────────┐ │
│  │ 🏠 Lette AI [S]    │  │ ⛓️ Agent-2 [S]      │ │
│  │ AI property OS     │  │ Web2/Web3 DeFi ID   │ │
│  │ 100 msgs→5 prior   │  │ GitHub+SO+Solana→   │ │
│  │ <1 min processing  │  │ reputation score    │ │
│  │ FastAPI·NLP·LLM    │  │ FastAPI·Helius RPC  │ │
│  │ [↗ GitHub]         │  │ [↗ GitHub]          │ │
│  └────────────────────┘  └─────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  + 5 More Missions (B/C Rank)              │  │
│  │  [Expand → shows Irish Retrofit, Solas,    │  │
│  │   College Space, DDoS, Immutable Rhythm]   │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

```tsx
// Data source: import { projects } from '@/data/projects'
// S-Rank = featured: true → greencode, lette, agent2
// B/C Rank = featured: false → others (collapsed by default)

// GreenCode gets FULL WIDTH hero card (it's the flagship)
// Lette AI + Agent-2 get side-by-side 2-col cards

// Mission Rank badge component:
// S-Rank: gold badge with ⭐ icon + glow
// Project color from project.color property

// Project card structure:
// - Top: icon (project.icon) + name + rank badge
// - Middle: tagline + 2-line description
// - Metrics row: project.metrics as little pills
// - Bottom: stack tags + GitHub link button

// "5 More Missions" accordion:
// Closed: shows "+5" button
// Open: slides down grid of remaining projects

// Hover effect on cards:
// - Border brightens to project.color
// - Subtle glow bloom behind card
// - Small "MISSION BRIEF" label appears
```

---

## 🌸 Section 8 — Kage Arc (Current)

**Naruto parallel:** The current arc — becoming Kage-level, the highest rank

### Rank Badge: `KAGE ARC — ONGOING`

```
┌──────────────────────────────────────────────────┐
│  📜 ARC VI — THE KAGE ARC  [CURRENT]             │
│     "The strongest arc. Still being written."    │
│                                                  │
│  ╔══════════════════╗  ╔═══════════════════════╗ │
│  ║  🎓 DCU          ║  ║  ⛓️ Superteam Ireland ║ │
│  ║  MSc AI          ║  ║  Web3 Developer       ║ │
│  ║  Sep 2025–       ║  ║  Sep 2025 – Present   ║ │
│  ║  Sep 2026        ║  ║  Dublin, Ireland      ║ │
│  ║  Dublin,Ireland  ║  ║                       ║ │
│  ║  [LIVE ●]        ║  ║  Building AI dApps    ║ │
│  ║                  ║  ║  on Solana.           ║ │
│  ║  ML · DL · AI    ║  ║  Irish Web3 ecosystem ║ │
│  ║  Data Engineering║  ║  Solana·DeFi·TypeScript║ │
│  ╚══════════════════╝  ╚═══════════════════════╝ │
│                                                  │
│  CHAKRA NETWORK (skill radar chart):             │
│  Animated radar/spider showing 6 skill axes      │
│  AI/ML · Systems · Web · Mobile · DevOps · Web3  │
└──────────────────────────────────────────────────┘
```

```tsx
// Data sources:
// education.find(e => e.current === true) → DCU card
// experiences.find(e => e.id === 'superteam') → Superteam card

// DCU card: purple/kage color, pulsing LIVE dot, current badge
// Superteam card: Solana purple (#9945FF), Web3 energy

// Chakra Network (Radar Chart):
// Use recharts RadarChart or custom SVG
// 6 axes from skillCategories: ai-ml, systems, web, mobile, devops, web3
// Animated: draws from center outward on scroll enter
// Colors: each axis matches its skill category color
// Hover tooltip shows top skill in that category
```

---

## 📜 Section 9 — Jutsu Scroll (Skills)

**Naruto parallel:** The jutsu scroll — a ninja's full arsenal

```
┌──────────────────────────────────────────────────┐
│  📜 THE JUTSU SCROLL                             │
│     "Every ninja needs their arsenal."           │
│                                                  │
│  Filter: [All] [Ninjutsu] [Taijutsu] [Genjutsu]  │
│          [Kekkei Genkai] [Senjutsu] [Medical]    │
│                                                  │
│  ┌──────────────┐ ┌──────────────┐               │
│  │ 🧠 Genjutsu  │ │ ⚙️ Taijutsu  │               │
│  │  (AI / ML)   │ │  (Systems)   │               │
│  │ ─────────────│ │ ─────────────│               │
│  │ Python  ████ │ │ C++     ████ │               │
│  │ FastAPI ████ │ │ Go      ████ │               │
│  │ Pandas  ████ │ │ FPGA    ███░ │               │
│  │ PyTorch ███░ │ │ Linux   ███░ │               │
│  │ LLMs    ███░ │ │ I2C/SPI ███░ │               │
│  └──────────────┘ └──────────────┘               │
│  ┌──────────────┐ ┌──────────────┐               │
│  │ 🌐 Ninjutsu  │ │ 📱 Medical   │               │
│  │   (Web)      │ │  Ninjutsu    │               │
│  │ ─────────────│ │  (Mobile)    │               │
│  │ React   ████ │ │ Flutter ████ │               │
│  │ Node.js ███░ │ │ Dart    ████ │               │
│  │ TypeScr ███░ │ │ Firebase███░ │               │
│  └──────────────┘ └──────────────┘               │
│  ┌──────────────┐ ┌──────────────┐               │
│  │ ☁️ Senjutsu  │ │ ⛓️ Kekkei    │               │
│  │  (DevOps)    │ │  Genkai      │               │
│  │ ─────────────│ │  (Web3)      │               │
│  │ Docker  ████ │ │ Solana  ███░ │               │
│  │ K8s     ███░ │ │ DeFi    ███░ │               │
│  │ AWS EKS ███░ │ │ dApps   ███░ │               │
│  └──────────────┘ └──────────────┘               │
└──────────────────────────────────────────────────┘
```

```tsx
// Data source: import { skillCategories } from '@/data/skills'
// Map categories to Naruto jutsu types:
const jutsuMap = {
  'ai-ml':   { jutsu: 'Genjutsu',      desc: '(Mind Techniques)' },
  'systems': { jutsu: 'Taijutsu',      desc: '(Physical Mastery)' },
  'web':     { jutsu: 'Ninjutsu',      desc: '(Versatile Techniques)' },
  'mobile':  { jutsu: 'Medical Nin',   desc: '(Healing Tools)' },
  'devops':  { jutsu: 'Senjutsu',      desc: '(Sage Mode)' },
  'web3':    { jutsu: 'Kekkei Genkai', desc: '(Rare Bloodline)' },
}

// Skill level → bar width:
// 'expert'     → 90% width, orange fill
// 'proficient' → 70% width, leaf green fill
// 'familiar'   → 45% width, muted blue fill

// Bar animation: width animates 0 → final on scroll enter
// Framer Motion: initial width: 0, animate to % with spring

// Filter buttons: clicking a jutsu type highlights those cards
// Others dim to 30% opacity
// Framer Motion layoutId for smooth card transitions
```

---

## 🤝 Section 10 — Form an Alliance (Contact)

**Naruto parallel:** "Form an Alliance" — the final call to action

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ⋯ ⋯ ⋯ ── FORM AN ALLIANCE ── ⋯ ⋯ ⋯            │
│                                                  │
│  "Every legendary team starts with               │
│   one handshake. Let's make ours."               │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  🟠 Currently Open To:                     │ │
│  │  Full-time SWE · AI/ML Roles               │ │
│  │  Web3 Projects · Consulting                │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────┐  ┌──────────────────────┐   │
│  │ ✉️  Email      │  │  ⏱️ Response time     │   │
│  │ skbalajimbl1   │  │  Within 24 hours      │   │
│  │ @gmail.com     │  │  Always.              │   │
│  └────────────────┘  └──────────────────────┘   │
│                                                  │
│  [⚡ Send a Scroll]   [◈ LinkedIn]  [⌥ GitHub]  │
│                                                  │
│  📍 Dublin, Ireland · Open to Remote/Relocation  │
│                                                  │
└──────────────────────────────────────────────────┘
```

```tsx
// Hardcoded contact info
const contact = {
  email: 'skbalajimbl1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/s-k-balaji/',
  github: 'https://github.com/BALAJI-SK',
  location: 'Dublin, Ireland',
  responseTime: '< 24 hours',
  openTo: ['Full-time SWE', 'AI/ML Roles', 'Web3 Projects', 'Consulting']
}

// Background: deep dark with subtle orange particle wisps
// "Send a Scroll" button:
//   - Orange gradient, ninja scroll icon
//   - Click: mailto:skbalajimbl1@gmail.com
//   - Hover: scroll unroll micro-animation on the icon

// Bottom of page: small footer
// "© Balaji Segu Krishnaiah · Built with 🍃 React + Vite"
// "This is my ninja way." — right side
```

---

## 🎬 Global Animations Reference

```tsx
// All using Framer Motion

// 1. Scroll reveal (default for all sections):
const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' }
}

// 2. Stagger children (for card grids):
const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
}

// 3. Card hover:
const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.2 } }
}

// 4. Skill bar fill (on scroll):
// initial: { width: 0 }
// animate: { width: `${skillPercent}%` }
// transition: { duration: 0.8, ease: 'easeOut', delay: index * 0.05 }

// 5. Metric counter (Tejas / Hero stats):
// Custom hook: useCounter(target, duration, triggerInView)
// Counts from 0 to target over duration when in view

// 6. Section arc label:
// Before each section title: "📜 ARC II — GENIN"
// Slides in from left, orange underline draws right
```

---

## 🗂️ File Structure for Claude Code

```
src/
├── data/
│   ├── experience.ts     ✅ exists — use as-is
│   ├── projects.ts       ✅ exists — use as-is
│   ├── education.ts      ✅ exists — use as-is
│   └── skills.ts         ✅ exists — use as-is
│
├── theme/
│   └── naruto.ts         🆕 CREATE — color tokens (see Design System above)
│
├── components/
│   ├── ui/
│   │   ├── MissionRank.tsx    🆕 Rank badge (S/A/B/C/D)
│   │   ├── JutsuTag.tsx       🆕 Skill tag with icon
│   │   ├── ArcLabel.tsx       🆕 "📜 ARC II — GENIN" header
│   │   ├── MetricCard.tsx     🆕 Animated stat counter
│   │   └── ScrollReveal.tsx   🆕 Framer Motion wrapper
│   │
│   └── sections/
│       ├── LoadingScreen.tsx  🆕 Scroll unfurl animation
│       ├── Hero.tsx           🆕 Leaf village hero
│       ├── NinjaWay.tsx       🆕 Personal story / interests
│       ├── AcademyArc.tsx     🆕 Education (uses education.ts)
│       ├── GeninArc.tsx       🆕 Early projects (uses projects.ts)
│       ├── ChuninkArc.tsx     🆕 McKinsey (uses experience.ts)
│       ├── JoninArc.tsx       🆕 Tejas Networks (uses experience.ts)
│       ├── SRankMissions.tsx  🆕 Featured projects (uses projects.ts)
│       ├── KageArc.tsx        🆕 Current: DCU + Superteam
│       ├── JutsuScroll.tsx    🆕 Skills (uses skills.ts)
│       └── Alliance.tsx       🆕 Contact
│
├── hooks/
│   └── useCounter.ts     🆕 Animated counter hook
│
└── App.tsx               ✏️ Replace content with NarutoPortfolio
```

---

## 🧰 Dependencies to Install

```bash
npm install framer-motion          # animations (scroll reveal, counters)
npm install @tsparticles/react     # hero particle leaves
npm install @tsparticles/slim      # particle engine
npm install recharts               # radar chart for Kage Arc skills
npm install react-intersection-observer  # scroll triggers (alternative to FM)
```

---

## 🚀 How to Tell Claude Code to Build This

Paste this exact prompt into Claude Code:

```
Read the file NARUTO_PORTFOLIO_DESIGN.md for the full design spec.
Read all files in src/data/ for the real content data.

Build the Naruto Ninja Way portfolio following the spec exactly:
1. Use the color tokens from naruto.ts (create this file first)
2. Build each section component as described
3. Use real data from src/data/ — do not hardcode content
4. Use Framer Motion for all animations as specified
5. Install required dependencies listed at the bottom of the spec
6. Replace App.tsx to render all sections in order
7. Ensure mobile responsive at 375px, 768px, 1200px breakpoints
8. Dark theme only — background #030507
```
```

---

## ✅ Quality Checklist for Claude Code

- [ ] All 10 sections rendered in scroll order
- [ ] Real data from `src/data/` used everywhere (no hardcoded content)
- [ ] Framer Motion scroll reveal on every section
- [ ] Metric counters animate on scroll into view (Tejas + Hero)
- [ ] Skill bars animate width on scroll (Jutsu Scroll section)
- [ ] Mission Rank badges shown on all project cards
- [ ] Jutsu type mapping applied to all skill categories
- [ ] "Chunin Exam Passed" stamp effect on McKinsey card
- [ ] "LIVE ●" pulsing dot on DCU current education card
- [ ] Filter buttons work on Jutsu Scroll section
- [ ] GitHub + LinkedIn + email links are real (from neural-layers.ts)
- [ ] Mobile responsive (375px+)
- [ ] Loading screen plays once per session
- [ ] Nav bar sticky + highlights active section on scroll
- [ ] Footer "This is my ninja way" present

---

*Design spec prepared by Claude · Data from `src/data/` · Ready for Claude Code*

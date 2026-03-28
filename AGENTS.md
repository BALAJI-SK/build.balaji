# AGENTS.md — Coding Agent Instructions

This file is for agentic coding assistants operating in this repository.

## Project Overview

Personal portfolio site for **Balaji Segu Krishnaiah** (AI/ML Engineer).
Stack: **React 18 + TypeScript + Vite + Tailwind CSS v3 + Framer Motion**.
Package manager: **Bun** (not npm/yarn — always use `bun`).
Theme: Google Antigravity aesthetic — light background, floating gradient orbs, Google Sans Flex font.

---

## Build / Dev Commands

```bash
bun install           # install dependencies
bun run dev           # start dev server at http://localhost:5173
bun run build         # type-check (tsc -b) then Vite production build
bun run preview       # serve the dist/ build locally
```

There are **no test files** in this project (no Jest, Vitest, or Playwright).
Type-checking is the primary correctness check:

```bash
bun run build         # runs tsc -b first — treat any TS error as a test failure
```

To type-check without building:
```bash
bunx tsc --noEmit
```

---

## Repository Structure

```
src/
  App.tsx                        # Root — imports Header + all sections
  main.tsx                       # ReactDOM.createRoot entry
  index.css                      # Global CSS, design tokens, utility classes
  components/
    layout/
      Header.tsx                 # Fixed nav, scroll progress bar, mobile menu
    sections/
      Hero.tsx                   # Full-screen hero with floating orbs
      About.tsx                  # Bio + stat cards
      Experience.tsx             # Expandable work timeline cards
      Projects.tsx               # Bento grid + category filter
      Skills.tsx                 # Skill category cards
      Education.tsx              # Education cards
      LeetCodeStats.tsx          # Live LeetCode GraphQL data + charts
      GitHubStats.tsx            # Live GitHub API data + charts
      Contact.tsx                # Social links + mailto form
    ui/
      ParticleField.tsx          # CSS-only floating Google-color orbs
      SectionTitle.tsx           # Reusable eyebrow + heading + subtitle block
  data/
    experience.ts                # Experience[] typed array
    education.ts                 # Education[] typed array
    projects.ts                  # Project[] typed array
    skills.ts                    # SkillCategory[] typed array
  hooks/
    useLeetCode.ts               # Fetch LeetCode GraphQL + fallback static data
    useGitHub.ts                 # Fetch GitHub REST API + fallback static data
  utils/
    animations.ts                # Shared Framer Motion Variants
```

---

## TypeScript Rules

- **Strict mode** is on — `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- Target: `ES2020`, module resolution: `bundler`
- No `any` — use proper types or `unknown` with a type guard
- Always type component props with an explicit `interface` (not inline object type)
- Always type data arrays with exported interfaces (see `src/data/experience.ts` as the pattern)
- Path alias `@/*` maps to `src/*` — prefer `../../` relative imports inside `src/` for consistency
- Do **not** add `.tsx` extensions to imports — Vite resolves them automatically

```ts
// Good
import SectionTitle from '../ui/SectionTitle'
import { fadeUpVariants } from '../../utils/animations'

// Bad
import SectionTitle from '../ui/SectionTitle.tsx'
```

---

## Code Style

### Formatting
- 2-space indentation
- Single quotes for strings
- No semicolons at end of lines
- Trailing commas in multi-line objects/arrays
- Max line length: ~100 chars (soft limit)

### Naming Conventions
- **Components**: PascalCase (`HeroSection`, `ProjectCard`)
- **Hooks**: camelCase with `use` prefix (`useLeetCode`, `useGitHub`)
- **Data files**: camelCase named exports for arrays (`experiences`, `projects`)
- **Interfaces**: PascalCase, no `I` prefix (`Experience`, `LeetCodeStats`)
- **CSS classes**: kebab-case (`ag-card`, `btn-pill-primary`, `tech-tag`)
- **Tailwind tokens**: `ag-*` for Antigravity palette, `g-*` for Google brand colors

### Component Pattern
```tsx
// Props interface first
interface Props {
  title: string
  optional?: boolean
}

// Default export, named function
export default function MyComponent({ title, optional = false }: Props) {
  return <div>...</div>
}
```

### Imports Order
1. React built-ins (`import { useState } from 'react'`)
2. Third-party libraries (`framer-motion`, `lucide-react`, `recharts`)
3. Local components (`../ui/SectionTitle`)
4. Local data / hooks / utils (`../../data/experience`)

---

## Design System

All visual design uses the **Google Antigravity** token system. Never add hardcoded hex colors — use CSS variables or Tailwind tokens:

| CSS Variable     | Value                  | Use                      |
|------------------|------------------------|--------------------------|
| `--ag-bg`        | `#F8F9FC`              | Page background          |
| `--ag-surface`   | `#FFFFFF`              | Card background          |
| `--ag-surface-2` | `#EFF2F7`              | Section/input background |
| `--ag-text`      | `#121317`              | Primary text             |
| `--ag-text-2`    | `#45474D`              | Secondary text           |
| `--ag-muted`     | `#6A6A71`              | Muted/caption text       |
| `--ag-outline`   | `rgba(33,34,38,0.12)`  | Standard border          |
| `--ag-outline-2` | `rgba(33,34,38,0.06)`  | Subtle border            |
| `--g-blue`       | `#4285F4`              | Google Blue accent       |
| `--g-blue-cta`   | `#3279F9`              | CTA button blue          |
| `--g-red`        | `#EA4335`              | Google Red accent        |
| `--g-yellow`     | `#FBBC04`              | Google Yellow accent     |
| `--g-green`      | `#34A853`              | Google Green / available |

**Global CSS utility classes** (defined in `src/index.css`, never re-define in components):
- `.ag-card` — standard card (white bg, subtle border, hover shadow)
- `.btn-pill-primary` — filled blue pill button
- `.btn-pill-outline` — outlined pill button
- `.tech-tag`, `.tech-tag-blue`, `.tech-tag-red`, `.tech-tag-green`, `.tech-tag-yellow` — skill/badge pills
- `.section-accent` — eyebrow label pill (blue tint)
- `.ag-spinner` — loading spinner
- `.orb`, `.orb-blue/red/yellow/green` — floating background orbs (hero only)

**Typography**: use `font-display` (Google Sans Flex, headings), `font-body` (Google Sans, body), `font-mono` (Google Sans Mono, code/labels).

---

## Animation

- All scroll-triggered animations use `react-intersection-observer` (`useInView`) with `triggerOnce: true`
- Use shared variants from `src/utils/animations.ts` (`fadeUpVariants`, `staggerContainer`, etc.)
- Pass `custom={index}` for staggered list items
- Easing: `[0.19, 1, 0.22, 1]` (ease-out-expo) for entrances; `[0.34, 1.85, 0.64, 1]` (ease-out-back) for interactive hover

---

## Data Updates

All content lives in `src/data/`. To update portfolio content:
- `experience.ts` — work history (add new `Experience` object at the top of the array)
- `projects.ts` — projects (add new `Project` object)
- `education.ts` — education entries
- `skills.ts` — skill categories and individual skills

Hooks in `src/hooks/` fetch **live data** (LeetCode GraphQL, GitHub REST API) with inline static fallback.

---

## Do Not

- Do not use `npm` or `yarn` — always use `bun`
- Do not add hardcoded hex colors — use CSS variables
- Do not import tsParticles — `ParticleField` is pure CSS orbs
- Do not import `CustomCursor` — removed; cursor is browser default
- Do not commit the `dist/` directory unless specifically asked
- Do not add ESLint or Prettier configs unless asked
- Do not use `cursor: none` in CSS

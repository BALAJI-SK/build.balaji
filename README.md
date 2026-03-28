# Balaji Segu Krishnaiah — Portfolio

Personal portfolio site for **Balaji Segu Krishnaiah**, AI/ML Engineer.

Built with a **Google Antigravity** aesthetic — light background, floating gradient orbs, and Google Sans Flex variable font.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v3 + custom CSS tokens |
| Animation | Framer Motion 11 |
| Charts | Recharts |
| Icons | Lucide React |
| Scroll detection | react-intersection-observer |
| Typing animation | react-type-animation |
| Package manager | **Bun** |

---

## Features

- 9 sections: Hero, About, Experience, Projects, Skills, Education, LeetCode Stats, GitHub Stats, Contact
- Live data from LeetCode GraphQL API and GitHub REST API (with static fallbacks)
- Scroll-triggered entrance animations with stagger
- Responsive layout — mobile menu, adaptive grids
- Projects bento grid with category filter
- Expandable work timeline cards with metrics and skill tags

---

## Getting Started

```bash
# Install dependencies (requires Bun — https://bun.sh)
bun install

# Start dev server at http://localhost:5173
bun run dev

# Production build (runs tsc type-check first)
bun run build

# Preview the production build
bun run preview
```

> Always use `bun`, not `npm` or `yarn`.

---

## Updating Content

All portfolio content lives in `src/data/`:

| File | What it controls |
|---|---|
| `src/data/experience.ts` | Work history timeline |
| `src/data/projects.ts` | Projects bento grid |
| `src/data/education.ts` | Education cards |
| `src/data/skills.ts` | Skill category cards |

Live API data (LeetCode, GitHub) is fetched in `src/hooks/useLeetCode.ts` and `src/hooks/useGitHub.ts`.

---

## Project Structure

```
src/
  App.tsx                  # Root — imports Header + all sections
  main.tsx                 # Entry point
  index.css                # Global CSS, Antigravity design tokens, utility classes
  components/
    layout/
      Header.tsx           # Fixed nav, scroll progress bar, mobile menu
    sections/
      Hero.tsx             # Full-screen hero with floating orbs
      About.tsx            # Bio + stat cards
      Experience.tsx       # Expandable work timeline cards
      Projects.tsx         # Bento grid + category filter
      Skills.tsx           # Skill category cards
      Education.tsx        # Education cards
      LeetCodeStats.tsx    # Live LeetCode GraphQL data + charts
      GitHubStats.tsx      # Live GitHub API data + charts
      Contact.tsx          # Social links + contact form
    ui/
      ParticleField.tsx    # CSS-only floating Google-color orbs (no tsParticles)
      SectionTitle.tsx     # Reusable eyebrow + heading + subtitle block
  data/                    # Static content arrays (see above)
  hooks/                   # useLeetCode, useGitHub — live API + fallback data
  utils/
    animations.ts          # Shared Framer Motion variants
```

---

## Design System

The site uses a custom **Google Antigravity** token system defined in `src/index.css`. All colors reference CSS variables (`--ag-bg`, `--ag-surface`, `--g-blue`, etc.) or Tailwind tokens — never hardcoded hex values.

Typography is set with Google Sans Flex (display/headings), Google Sans (body), and Google Sans Mono (code/labels), loaded from Google Fonts in `index.html`.

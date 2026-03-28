import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Education from './components/sections/Education'
import LeetCodeStats from './components/sections/LeetCodeStats'
import GitHubStats from './components/sections/GitHubStats'
import Contact from './components/sections/Contact'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <LeetCodeStats />
        <GitHubStats />
        <Contact />
      </main>
    </>
  )
}

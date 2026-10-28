import { useEffect, useState } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useContent } from '../content'
import Ripples from './Ripples'
import WaterBackground from './WaterBackground'
import HeartIntro from './HeartIntro'

const INTRO_KEY = 'hc-intro-seen'
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const seen = () => { try { return sessionStorage.getItem(INTRO_KEY) === '1' } catch { return false } }

export default function Layout() {
  const { site, settings, preview } = useContent()
  const wantIntro = settings.variants.intro === 'heart'
  // Once per visit on the public site; in the lab preview, every time the option is switched on.
  const [intro, setIntro] = useState(() => wantIntro && !reducedMotion() && (preview || !seen()))
  useEffect(() => { if (preview) setIntro(wantIntro && !reducedMotion()) }, [preview, wantIntro])
  const endIntro = () => { setIntro(false); try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* private mode */ } }
  const [first, ...rest] = site.identity.name.split(' ')
  const onHome = useLocation().pathname === '/'
  const { resume } = site.contact
  const resumeName = `${site.identity.name.replace(/\s+/g, '-')}-Resume.pdf`
  return (
    <>
      {settings.variants.background === 'water' && <WaterBackground />}
      {settings.variants.ripples === 'on' && <Ripples />}
      {intro && <HeartIntro onDone={endIntro} />}
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <Link to="/" className={`nav__name ${onHome ? '' : 'nav__name--full'}`} aria-label={`${site.identity.name} — home`}>
          {onHome
            ? <em>{[first, ...rest].map((w) => w[0]).join('')}</em>
            : <em>{[first, ...rest].join('').toLowerCase()}</em>}
        </Link>
        <nav aria-label="Primary">
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/about">About</NavLink>
          {resume && <a href={resume} download={resumeName}>Resume</a>}
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="footer">
        {settings.variants.background === 'waterHero' && <WaterBackground contained />}
        <span>© {new Date().getFullYear()} {site.identity.name}</span>
        <nav aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/work">Work</Link>
          <Link to="/about">About</Link>
          {resume && <a href={resume} download={resumeName}>Resume</a>}
        </nav>
      </footer>
    </>
  )
}

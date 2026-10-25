import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useContent } from '../content'
import Ripples from './Ripples'
import WaterBackground from './WaterBackground'

export default function Layout() {
  const { site, settings } = useContent()
  const [first, ...rest] = site.identity.name.split(' ')
  const onHome = useLocation().pathname === '/'
  const { resume } = site.contact
  const resumeName = `${site.identity.name.replace(/\s+/g, '-')}-Resume.pdf`
  return (
    <>
      {settings.variants.background === 'water' && <WaterBackground />}
      {settings.variants.ripples === 'on' && <Ripples />}
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

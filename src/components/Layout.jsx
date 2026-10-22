import { NavLink, Link, Outlet } from 'react-router-dom'
import { useContent } from '../content'
import Ripples from './Ripples'
import WaterBackground from './WaterBackground'

export default function Layout() {
  const { site, settings } = useContent()
  const [first, ...rest] = site.identity.name.split(' ')
  return (
    <>
      {settings.variants.background === 'water' && <WaterBackground />}
      {settings.variants.ripples === 'on' && <Ripples />}
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <Link to="/" className="nav__name" aria-label={`${site.identity.name} — home`}>
          <em>{first[0]}</em>{rest.map((w) => w[0]).join('')}
        </Link>
        <nav aria-label="Primary">
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/about">About</NavLink>
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
        </nav>
      </footer>
    </>
  )
}

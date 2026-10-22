import { NavLink, Link, Outlet } from 'react-router-dom'
import { useContent } from '../content'

export default function Layout() {
  const { site } = useContent()
  const [first, ...rest] = site.identity.name.split(' ')
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <Link to="/" className="nav__name" aria-label={`${site.identity.name} — home`}>
          <em>{first}</em> {rest.length > 0 && rest.join(' ')}
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

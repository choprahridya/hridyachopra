import { Link } from 'react-router-dom'
import { useContent } from '../content'
import { Reveal } from './bits'

// Closing invitation. Only links that actually exist are rendered.
export default function Contact() {
  const { email, linkedin, resume } = useContent().site.contact
  const links = [
    email && { label: 'Email', href: `mailto:${email}` },
    linkedin && { label: 'LinkedIn', href: linkedin },
    resume && { label: 'Résumé', href: resume },
  ].filter(Boolean)

  return (
    <section className="wrap section closing">
      <Reveal>
        <h2 className="closing__title">Let’s <em>talk.</em></h2>
      </Reveal>
      <Reveal className="closing__links" delay={120}>
        {links.length ? (
          links.map((l) => (
            <a key={l.label} href={l.href} className="textlink" target={l.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))
        ) : (
          <p className="is-draft" data-scaffold>[Email · LinkedIn · Résumé]</p>
        )}
        <Link to="/work" className="textlink">Work <span aria-hidden="true">→</span></Link>
        <Link to="/about" className="textlink">About <span aria-hidden="true">→</span></Link>
      </Reveal>
    </section>
  )
}

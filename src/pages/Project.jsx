import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useContent, projectBySlug, nextProject, redirectFor } from '../content'
import { Reveal, Copy, MediaSlot, usePageMeta } from '../components/bits'
import NotFound from './NotFound'

const META = [
  ['role', 'Role'],
  ['timeline', 'Timeline'],
  ['team', 'Team'],
  ['context', 'Context'],
]

export default function Project() {
  const { slug } = useParams()
  const { site, preview } = useContent()
  const found = projectBySlug(site, slug)
  const p = found && (!found.hidden || preview) ? found : null
  const moved = !found && redirectFor(site, slug)
  const next = p && nextProject(site, slug)
  const sections = p ? p.sections.filter((s) => !s.hidden) : []
  const [current, setCurrent] = useState(null)
  usePageMeta(p ? `${p.title} — ${site.identity.name}` : `Not found — ${site.identity.name}`, p?.summary)

  useEffect(() => {
    if (!p) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [p, sections.map((s) => s.id).join()])

  if (moved) return <Navigate to={`/work/${moved.slug}`} replace />
  if (!p) return <NotFound />

  return (
    <article className="case">
      <header className="wrap case__head">
        <Reveal><Link to="/work" className="textlink back"><span aria-hidden="true">←</span> All work</Link></Reveal>
        <Reveal as="p" className="eyebrow" delay={60}>UX case study · {p.tags.join(' · ')}</Reveal>
        <Reveal as="h1" className={`case__title ${p.scaffold ? 'is-draft' : ''}`} delay={120}>{p.title}</Reveal>
        <Reveal delay={180}><Copy value={p.summary} className="lede case__sum" /></Reveal>
        <Reveal as="dl" className="case__meta" delay={240}>
          {META.filter(([k]) => p.meta[k]).map(([k, label]) => (
            <div key={k}>
              <dt>{label}</dt>
              <Copy as="dd" value={p.meta[k]} />
            </div>
          ))}
        </Reveal>
      </header>

      <Reveal className="wrap case__cover">
        <MediaSlot media={p.cover} />
      </Reveal>

      <div className="wrap case__body">
        <nav className="case__toc" aria-label="Sections">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={current === s.id ? 'is-current' : ''}>{s.label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="case__sections">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="case__section">
              <Reveal as="h2" className="h3">{s.label}</Reveal>
              <Reveal delay={80}><Copy value={s.body} className="case__text" /></Reveal>
              {s.media && (
                <Reveal delay={120}><MediaSlot media={s.media} /></Reveal>
              )}
            </section>
          ))}
        </div>
      </div>

      {next && (
        <Reveal className="wrap next">
          <Link to={`/work/${next.slug}`} className="next__link">
            <span className="eyebrow">Next project</span>
            <span className={`next__title ${next.scaffold ? 'is-draft' : ''}`}>{next.title} <span aria-hidden="true">→</span></span>
          </Link>
        </Reveal>
      )}
    </article>
  )
}

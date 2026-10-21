import { Link } from 'react-router-dom'
import { useContent } from '../content'
import { Reveal, Copy, MediaSlot, usePageMeta } from '../components/bits'
import Contact from '../components/Contact'

export default function About() {
  const { about, identity, meta } = useContent().site
  usePageMeta(meta.about.title, meta.about.description)
  return (
    <>
      <section className="wrap page-head about-head">
        <div>
          <Reveal as="h1" className="h1">About</Reveal>
          <Reveal delay={100}>
            <p className="lede">{identity.name} — {identity.discipline}.</p>
            <Copy value={about.intro} className="lede" />
          </Reveal>
        </div>
        <Reveal className="about-head__media" delay={160}>
          <MediaSlot media={about.portrait} />
        </Reveal>
      </section>

      <section className="wrap section section--tight">
        <div className="rows">
          <Reveal className="row">
            <h2 className="row__label">Bio</h2>
            <Copy value={about.bio} className="row__body" />
          </Reveal>
          {about.sections.filter((s) => !s.hidden).map((s) => (
            <Reveal key={s.id} className="row">
              <h2 className="row__label">{s.title}</h2>
              <ul className="row__body row__list">
                {s.items.map((it, i) => <Copy key={i} as="li" value={it} />)}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="onward">
          <Link to="/work" className="textlink">View my work <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>
      <Contact />
    </>
  )
}

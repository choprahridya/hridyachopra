import { Link } from 'react-router-dom'
import { useContent } from '../content'
import { Reveal, Copy, MediaSlot, usePageMeta } from '../components/bits'

const linkedinHandle = (url) => url.replace(/\/+$/, '').split('/').pop() || url

export default function About() {
  const { about, contact, meta } = useContent().site
  usePageMeta(meta.about.title, meta.about.description)
  const education = about.education.filter((e) => !e.hidden)
  const experience = about.experience.filter((e) => !e.hidden)
  const contactLines = [
    contact.phone && { label: 'Phone', text: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
    contact.email && { label: 'Email', text: contact.email, href: `mailto:${contact.email}` },
    contact.linkedin && { label: 'LinkedIn', text: linkedinHandle(contact.linkedin), href: contact.linkedin, external: true },
    contact.resume && { label: 'Résumé', text: 'View', href: contact.resume, external: true },
  ].filter(Boolean)

  return (
    <>
      <div className="wrap about">
        <aside className="about__side about__side--top">
          <Reveal className="about__portrait"><MediaSlot media={about.portrait} /></Reveal>
          <Reveal as="dl" className="about__contact" delay={80}>
            {contactLines.length ? contactLines.map((c) => (
              <div key={c.label}>
                <dt>{c.label}:</dt>
                <dd><a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noreferrer' : undefined}>{c.text}</a></dd>
              </div>
            )) : <div><dd className="is-draft" data-scaffold>[Email · LinkedIn · Résumé]</dd></div>}
          </Reveal>
        </aside>

        <div className="about__main">
          <section aria-labelledby="about-heading">
            <Reveal as="h1" id="about-heading" className="about__h">{about.heading}</Reveal>
            <Reveal className="about__quote" delay={80}>
              {about.paragraphs.map((p, i) => <Copy key={i} value={p} />)}
            </Reveal>
          </section>

          {education.length > 0 && (
            <section aria-labelledby="edu-heading">
              <Reveal as="h2" id="edu-heading" className="about__h">Education</Reveal>
              <ol className="timeline">
                {education.map((e, i) => (
                  <Reveal as="li" key={e.id} delay={i * 80}>
                    {e.years && <p className="timeline__when">{e.years}</p>}
                    <Copy as="h3" className="timeline__title" value={e.title} />
                    {e.detail && <p className="timeline__detail">{e.detail}</p>}
                  </Reveal>
                ))}
              </ol>
            </section>
          )}

          {experience.length > 0 && (
            <section aria-labelledby="exp-heading">
              <Reveal as="h2" id="exp-heading" className="about__h">Experience</Reveal>
              <ol className="timeline">
                {experience.map((e, i) => (
                  <Reveal as="li" key={e.id} delay={i * 80}>
                    {e.dates && <p className="timeline__when">{e.dates}</p>}
                    <Copy as="h3" className="timeline__title" value={e.role} />
                    {e.org && <p className="timeline__org">{e.org}</p>}
                    {e.description && <p className="timeline__detail">{e.description}</p>}
                  </Reveal>
                ))}
              </ol>
            </section>
          )}

          {about.extra?.filter((x) => !x.hidden).map((x) => (
            <section key={x.id}>
              <Reveal as="h2" className="about__h">{x.title}</Reveal>
              <ul className="about__list">{x.items.map((it, i) => <Copy key={i} as="li" value={it} />)}</ul>
            </section>
          ))}
        </div>

        <aside className="about__side about__side--bottom">
          {[['Skills', about.skills], ['Tools', about.tools]].filter(([, list]) => list.length).map(([label, list]) => (
            <Reveal key={label} className="about__tags">
              <h2 className="about__label">{label}</h2>
              <ul>{list.map((t) => <li key={t} className={t.startsWith('[') ? 'is-draft' : ''}>{t}</li>)}</ul>
            </Reveal>
          ))}
        </aside>
      </div>

      <section className="wrap about-connect">
        <Reveal as="h2" className="about-connect__h">{about.connect.heading}</Reveal>
        {about.connect.text && <Reveal as="p" className="lede" delay={60}>{about.connect.text}</Reveal>}
        <Reveal delay={120} className="about-connect__links">
          {contact.email
            ? <a className="about-connect__email" href={`mailto:${contact.email}`}>{contact.email} <span aria-hidden="true">→</span></a>
            : <p className="is-draft" data-scaffold>[Email]</p>}
          <Link to="/work" className="textlink">View my work <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>
    </>
  )
}

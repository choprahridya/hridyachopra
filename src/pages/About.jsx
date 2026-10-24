import { Link } from 'react-router-dom'
import '@fontsource/dm-serif-display/400.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/400-italic.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/800.css'
import { useContent } from '../content'
import { Reveal, Copy, MediaSlot, usePageMeta } from '../components/bits'

// Layout, type scale, spacing and block-level fade-up follow the owner's earlier
// About page (hridyachopra.vercel.app/about), measured at 1440 and 375 wide,
// including its fonts: DM Serif Display (headings) and DM Sans (text).
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
    contact.resume && { label: 'Resume', text: 'Download', href: contact.resume, download: true },
  ].filter(Boolean)
  const tagGroups = [['Skills', about.skills], ['Tools', about.tools]].filter(([, list]) => list.length)

  return (
    <div className="ab">
      <div className="ab__grid">
        <aside className="ab__side">
          <Reveal className="ab__portrait"><MediaSlot media={{ ...about.portrait, ratio: '3 / 4' }} /></Reveal>
          <Reveal className="ab__contact">
            {contactLines.length ? contactLines.map((c) => (
              <p key={c.label}>
                <strong>{c.label}:</strong>{' '}
                <a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noreferrer' : undefined} download={c.download || undefined}>{c.text}</a>
              </p>
            )) : <p className="is-draft" data-scaffold>[Email · LinkedIn · Resume]</p>}
          </Reveal>
          {tagGroups.map(([label, list]) => (
            <Reveal key={label} className="ab__tags">
              <h2 className="ab__label">{label}</h2>
              <ul>{list.map((t) => <li key={t} className={t.startsWith('[') ? 'is-draft' : ''}>{t}</li>)}</ul>
            </Reveal>
          ))}
        </aside>

        <div className="ab__main">
          <Reveal as="section" aria-labelledby="about-heading">
            <h1 id="about-heading" className="ab__h ab__h--tight">{about.heading}</h1>
            <div className="ab__quote">
              {about.paragraphs.map((p, i) => <Copy key={i} value={p} />)}
            </div>
          </Reveal>

          {education.length > 0 && (
            <Reveal as="section" aria-labelledby="edu-heading">
              <h2 id="edu-heading" className="ab__h">Education</h2>
              <ol className="ab__timeline">
                {education.map((e) => (
                  <li key={e.id}>
                    {e.years && <p className="ab__when">{e.years}</p>}
                    <Copy as="h3" className="ab__title" value={e.title} />
                    {e.detail && <p className="ab__small">{e.detail}</p>}
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {experience.length > 0 && (
            <Reveal as="section" aria-labelledby="exp-heading">
              <h2 id="exp-heading" className="ab__h">Experience</h2>
              <ol className="ab__timeline">
                {experience.map((e) => (
                  <li key={e.id}>
                    {e.dates && <p className="ab__when">{e.dates}</p>}
                    <Copy as="h3" className="ab__title" value={e.role} />
                    {e.org && <p className="ab__org">{e.org}</p>}
                    {e.description && <p className="ab__small ab__small--loose">{e.description}</p>}
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {about.extra?.filter((x) => !x.hidden).map((x) => (
            <Reveal as="section" key={x.id}>
              <h2 className="ab__h">{x.title}</h2>
              <ul className="ab__list">{x.items.map((it, i) => <Copy key={i} as="li" value={it} />)}</ul>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal as="section" className="ab__connect">
        <h2 className="ab__h ab__h--connect">{about.connect.heading}</h2>
        {about.connect.text && <p className="ab__connectText">{about.connect.text}</p>}
        <div className="ab__connectLinks">
          {contact.email
            ? <a className="ab__email" href={`mailto:${contact.email}`}>{contact.email} <span aria-hidden="true">→</span></a>
            : <p className="is-draft" data-scaffold>[Email]</p>}
          <Link to="/work" className="textlink">View my work <span aria-hidden="true">→</span></Link>
        </div>
      </Reveal>
    </div>
  )
}

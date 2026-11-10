import { Component, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'

// three.js is large: load the 3D bloom as its own chunk so the text paints first
const SteelBloom = lazy(() => import('./SteelBloom'))

// If the 3D piece fails (old GPU, WebGL off), drop it and keep the rest of the page.
class Optional extends Component {
  state = { failed: false }
  static getDerivedStateFromError () { return { failed: true } }
  render () { return this.state.failed ? null : this.props.children }
}

// Landing hero, "editorial" version: full-bleed 3D steel-and-glass bloom (SteelBloom) on a dark starry sky,
// running under the nav and fading into the page below. The owner's name as the headline (both words Playfair italic), the statement, one quiet line with the degree and the
// site's own text links. The heart lives in the opening animation (HeartIntro) only.
export default function HeroEditorial({ identity, about }) {
  const [first, ...rest] = identity.name.split(' ')
  const statement = `${identity.statement.lead} ${identity.statement.emphasis || ''}`.trim()

  const edu = about.education.find((e) => !e.hidden)
  const note = [
    edu && `${edu.detail.split(' · ')[0]}, ${edu.title.split(' (')[0]}`,
  ].filter(Boolean)

  return (
    <section className="hero-e" aria-label="Introduction">
      <Optional><Suspense fallback={null}><SteelBloom /></Suspense></Optional>
      <div className="hero-e__inner wrap">
        <p className="hero-e__meta">{identity.discipline}</p>
        <h1 className="hero-e__title" aria-label={identity.name}>
          <span className="line"><span className="hero-e__first">{first}</span></span>
          {rest.length > 0 && <span className="line"><span className="hero-e__last">{rest.join(' ')}</span></span>}
        </h1>
        <p className="hero-e__statement">{statement}</p>
        {note.length > 0 && <p className="hero-e__note">{note.join(' · ')}</p>}
        <div className="hero-e__links">
          <a href="#selected" className="textlink">Selected work <span aria-hidden="true">↓</span></a>
          <Link to="/about" className="textlink">About me <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  )
}

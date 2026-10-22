import { Link } from 'react-router-dom'
import { useContent, featuredProjects } from '../content'
import ProjectIndex from '../components/ProjectIndex'
import { Reveal, Copy, MediaSlot, usePageMeta } from '../components/bits'
import Contact from '../components/Contact'
import Carousel3D from '../components/Carousel3D'

export default function Home() {
  const { site, settings } = useContent()
  const { identity, home, about, meta } = site
  usePageMeta(meta.home.title, meta.home.description)
  const [first, ...rest] = identity.name.split(' ')
  const featured = featuredProjects(site)
  const showCarousel = home.carousel?.enabled && featured.length > 0
  const carouselHero = showCarousel && settings.variants.heroLayout === 'carousel'
  const carouselItems = featured.map((p) => ({ key: p.id, href: `/work/${p.slug}`, title: p.title, media: p.cover, scaffold: p.scaffold }))
  return (
    <>
      {carouselHero ? (
        <section className="hero-c">
          <h1 className="hero-c__name wrap" aria-label={identity.name}>
            <span className="line"><span><em>{first}</em></span></span>{' '}
            {rest.length > 0 && <span className="line hero-c__last"><span>{rest.join(' ')}</span></span>}
          </h1>
          <Carousel3D label="Selected projects" autoplay={home.carousel.autoplay} items={carouselItems} variant="hero" />
        </section>
      ) : (<>
      <section className="hero wrap">
        <p className="eyebrow hero__eyebrow"><span className="dot" aria-hidden="true" />{identity.discipline}</p>
        <h1 className="hero__name" aria-label={identity.name}>
          <span className="line"><span>{first}</span></span>
          {rest.length > 0 && <span className="line"><span>{rest.join(' ')}</span></span>}
        </h1>
        <p className="hero__statement">
          <span className="line"><span>{identity.statement.lead}</span></span>
          {identity.statement.emphasis && (
            <span className="line"><span><em className="draw">{identity.statement.emphasis}<svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 C 70 4, 150 4, 296 11" /></svg></em></span></span>
          )}
        </p>
        <div className="hero__foot">
          <Copy value={home.intro} className="hero__intro" />
          {featured.length > 0 && <a href="#selected" className="textlink">Selected work <span aria-hidden="true">↓</span></a>}
        </div>
      </section>

      {showCarousel && <Carousel3D label="Selected projects" autoplay={home.carousel.autoplay} items={carouselItems} />}
      </>)}

      {featured.length > 0 && (
        <section id="selected" className="wrap section">
          <Reveal className="section__head">
            <h2 className="h2">Selected <em>work</em></h2>
            <Link to="/work" className="textlink">View all work <span aria-hidden="true">→</span></Link>
          </Reveal>
          <ProjectIndex projects={featured} />
        </section>
      )}

      <section className="wrap section teaser">
        <Reveal className="teaser__media">
          <MediaSlot media={about.portrait} />
        </Reveal>
        <Reveal className="teaser__body" delay={120}>
          <p className="eyebrow">About</p>
          <Copy value={about.intro} className="lede" />
          <Link to="/about" className="textlink">More about me <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>

      <Contact />
    </>
  )
}

import { Link } from 'react-router-dom'
import { useContent, publicProjects } from '../content'
import ProjectGrid from '../components/ProjectGrid'
import { Reveal, usePageMeta } from '../components/bits'

export default function Work() {
  const { site } = useContent()
  usePageMeta(site.meta.work.title, site.meta.work.description)
  return (
    <>
      <section className="wrap page-head">
        <Reveal as="h1" className="h1">Work</Reveal>
        <Reveal as="p" className="lede" delay={100}>UX projects and case studies.</Reveal>
      </section>
      <section className="wrap section section--tight">
        <ProjectGrid projects={publicProjects(site)} />
        <Reveal className="onward">
          <Link to="/about" className="textlink">About me <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>
    </>
  )
}

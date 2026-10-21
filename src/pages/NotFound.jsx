import { Link } from 'react-router-dom'
import { usePageMeta } from '../components/bits'
import { useContent } from '../content'

export default function NotFound() {
  usePageMeta(`Not found — ${useContent().site.identity.name}`)
  return (
    <section className="wrap page-head">
      <h1 className="h1">Not <em>found.</em></h1>
      <p className="lede">This page doesn’t exist.</p>
      <p><Link to="/work" className="textlink">See the work <span aria-hidden="true">→</span></Link></p>
    </section>
  )
}

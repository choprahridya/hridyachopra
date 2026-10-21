import { useEffect, useRef } from 'react'

// Fades/rises children in once they enter the viewport.
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

// Text that may still be an unreviewed draft prompt.
export function Copy({ value, as: Tag = 'p', className = '' }) {
  const v = typeof value === 'string' ? { text: value, scaffold: value.startsWith('[') } : value
  return (
    <Tag className={`${className} ${v.scaffold ? 'is-draft' : ''}`.trim()} data-scaffold={v.scaffold || undefined}>
      {v.text}
    </Tag>
  )
}

// Image when one is set; otherwise a designed placeholder slot.
// Accepts a media object ({ src, alt, caption, fit, ratio, label }) or plain label/ratio.
export function MediaSlot({ media, label, ratio, className = '' }) {
  const m = media || {}
  const r = ratio || m.ratio || '16 / 10'
  if (m.src) {
    return (
      <figure className={`media ${className}`}>
        <div className="media__frame" style={{ aspectRatio: r }}>
          <img src={m.src} alt={m.alt || ''} loading="lazy" decoding="async" style={{ objectFit: m.fit || 'cover' }} />
        </div>
        {m.caption && <figcaption>{m.caption}</figcaption>}
      </figure>
    )
  }
  return (
    <figure className={`slot ${className}`} style={{ aspectRatio: r }} data-scaffold>
      <svg className="slot__art" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 78 C 40 60, 70 92, 110 70 S 150 58, 160 64" />
        <path d="M0 86 C 36 72, 80 98, 118 80 S 152 72, 160 76" />
      </svg>
      <figcaption>[{label || m.label || 'Image'}]</figcaption>
    </figure>
  )
}

// Sets document title and description for the current page.
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    if (description) tag.content = description
  }, [title, description])
}

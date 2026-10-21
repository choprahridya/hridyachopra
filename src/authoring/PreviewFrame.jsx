import { useEffect, useRef, useState } from 'react'

export const DEVICES = {
  phone: { label: 'Phone', w: 390 },
  tablet: { label: 'Tablet', w: 768 },
  desktop: { label: 'Desktop', w: 1440 },
}

// Renders the real portfolio in an iframe at a true viewport width, fed with draft
// content/settings over postMessage. Scaled down visually when the space is narrower.
export default function PreviewFrame({ path, site, settings, device = 'desktop', label = 'Preview', onRoute }) {
  const stage = useRef(null)
  const frame = useRef(null)
  const ready = useRef(false)
  const latest = useRef({ site, settings, path })
  latest.current = { site, settings, path }
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [src] = useState(() => `${path}?__preview=1`)

  const post = (msg) => frame.current?.contentWindow?.postMessage(msg, window.location.origin)

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(stage.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return
      if (e.data?.type === 'portfolio:ready') {
        ready.current = true
        const { site: s, settings: t, path: p } = latest.current
        post({ type: 'portfolio:draft', site: s, settings: t })
        post({ type: 'portfolio:navigate', path: p })
      } else if (e.data?.type === 'portfolio:route') {
        onRoute?.(e.data.path)
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [onRoute])

  useEffect(() => { if (ready.current) post({ type: 'portfolio:draft', site, settings }) }, [site, settings])
  useEffect(() => { if (ready.current) post({ type: 'portfolio:navigate', path }) }, [path])

  const width = DEVICES[device].w
  const scale = box.w ? Math.min(1, box.w / width) : 1
  return (
    <div className="pf">
      <div className="pf__bar">
        <strong>{label}</strong>
        <span>{DEVICES[device].label} · {width}px{scale < 0.999 ? ` · shown at ${Math.round(scale * 100)}%` : ''}</span>
      </div>
      <div className="pf__stage" ref={stage}>
        <iframe
          ref={frame}
          title={`${label} — ${DEVICES[device].label}`}
          src={src}
          style={{ width, height: box.h ? box.h / scale : '100%', transform: `scale(${scale})` }}
        />
      </div>
    </div>
  )
}

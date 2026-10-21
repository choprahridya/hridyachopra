import { createContext, createElement, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import siteJson from './site.json'
import settingsJson from './settings.json'
import { migrateSite, migrateSettings, applySettings } from './schema'

export { applySettings }

const visible = (site) => site.projects.filter((p) => !p.hidden)

export const projectBySlug = (site, slug) => site.projects.find((p) => p.slug === slug)
export const redirectFor = (site, slug) => site.projects.find((p) => (p.redirectFrom || []).includes(slug))
export const publicProjects = visible

export const nextProject = (site, slug) => {
  const list = visible(site)
  const i = list.findIndex((p) => p.slug === slug)
  if (i < 0 || list.length < 2) return null
  return list[(i + 1) % list.length]
}

export const featuredProjects = (site) =>
  site.home.featured.map((id) => site.projects.find((p) => p.id === id)).filter((p) => p && !p.hidden)

const Ctx = createContext(null)
export const useContent = () => useContext(Ctx)

const AUTHORING = /^\/(lab|dashboard)(\/|$)/

// Holds the content the renderer draws from. Normally the committed JSON;
// inside an authoring preview frame (dev only) it is the editor's draft.
export function ContentProvider({ children }) {
  const [state, setState] = useState(() => ({
    site: migrateSite(siteJson),
    settings: migrateSettings(settingsJson),
  }))
  const preview = useRef(
    import.meta.env.DEV && new URLSearchParams(window.location.search).has('__preview')
  ).current
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!AUTHORING.test(pathname)) applySettings(state.settings)
  }, [state.settings, pathname])

  useEffect(() => {
    if (!preview) return
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return
      const d = e.data || {}
      if (d.type === 'portfolio:draft') {
        setState((s) => ({ site: d.site || s.site, settings: d.settings || s.settings }))
      } else if (d.type === 'portfolio:navigate' && d.path) {
        navigate(d.path)
      }
    }
    window.addEventListener('message', onMsg)
    window.parent.postMessage({ type: 'portfolio:ready' }, window.location.origin)
    return () => window.removeEventListener('message', onMsg)
  }, [preview, navigate])

  useEffect(() => {
    if (preview) window.parent.postMessage({ type: 'portfolio:route', path: pathname }, window.location.origin)
  }, [preview, pathname])

  // After a save from the authoring tools, public tabs reload to show it.
  useEffect(() => {
    if (!import.meta.hot || preview) return
    const reload = () => { if (!AUTHORING.test(window.location.pathname)) window.location.reload() }
    import.meta.hot.on('portfolio:content-saved', reload)
    return () => import.meta.hot.off?.('portfolio:content-saved', reload)
  }, [preview])

  return createElement(Ctx.Provider, { value: { ...state, preview } }, children)
}

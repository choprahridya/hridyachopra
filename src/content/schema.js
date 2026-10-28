// Content + settings schema: migration, defaults and validation.
// Shared by the public renderer, the authoring tools and the local API.

export const SITE_VERSION = 3
export const SETTINGS_VERSION = 2

const clone = (v) => JSON.parse(JSON.stringify(v))

export const emptyMedia = (ratio = '16 / 9', label = 'Image') => ({
  src: '', alt: '', caption: '', fit: 'cover', ratio, label,
})

const isPlaceholder = (t) => typeof t === 'string' && t.trim().startsWith('[')

// ---------- Site ----------

export function migrateSite(input) {
  const s = clone(input || {})
  const v = s.schemaVersion || 1
  if (v > SITE_VERSION) throw new Error(`Content schema v${v} is newer than this editor (v${SITE_VERSION}).`)

  if (v < 2) {
    const st = s.identity?.statement
    if (typeof st === 'string') {
      const words = st.trim().split(/\s+/)
      const cut = Math.max(1, words.length - 2)
      s.identity.statement = { lead: words.slice(0, cut).join(' '), emphasis: words.slice(cut).join(' ') }
    }
    s.about = s.about || {}
    s.about.portrait = s.about.portrait || { ...emptyMedia('4 / 5', 'Portrait · 4:5'), alt: `Portrait of ${s.identity?.name || ''}`.trim() }
    for (const sec of s.about.sections || []) sec.hidden = !!sec.hidden
    if (s.contact) delete s.contact.scaffold
    for (const p of s.projects || []) {
      p.cover = p.cover || emptyMedia('16 / 9', 'Project cover · 16:9')
      p.hidden = !!p.hidden
      p.redirectFrom = p.redirectFrom || []
      for (const sec of p.sections || []) {
        sec.hidden = !!sec.hidden
        if (sec.media && !('src' in sec.media)) sec.media = { ...emptyMedia(sec.media.ratio, sec.media.label) }
      }
    }
  }
  if (v < 3) {
    // About becomes structured: paragraphs, education/experience timelines, skills, tools.
    const a = s.about || {}
    const asText = (x) => (x && typeof x === 'object' ? x : { text: x || '', scaffold: isPlaceholder(x) })
    const paragraphs = [a.intro, a.bio].filter(Boolean).map(asText)
    const take = (id) => (a.sections || []).find((x) => x.id === id)
    const lines = (sec) => (sec?.items || []).map(asText).filter((it) => it.text)
    const entry = (it, i, kind) => (kind === 'education'
      ? { id: `edu-${i + 1}`, years: '', title: it.text, detail: '', hidden: false }
      : { id: `exp-${i + 1}`, dates: '', role: it.text, org: '', description: '', hidden: false })
    s.about = {
      heading: 'About Me',
      paragraphs: paragraphs.length ? paragraphs : [{ text: '[Introduce your practice.]', scaffold: true }],
      portrait: a.portrait,
      education: lines(take('education')).map((it, i) => entry(it, i, 'education')),
      experience: lines(take('experience')).map((it, i) => entry(it, i, 'experience')),
      skills: [],
      tools: lines(take('tools')).map((it) => it.text),
      extra: (a.sections || []).filter((x) => !['education', 'experience', 'tools'].includes(x.id)),
      connect: { heading: 'Want to connect?', text: '' },
    }
    s.contact = { phone: '', ...(s.contact || {}) }
  }
  // Optional fields added after v2 shipped get safe defaults.
  s.home = s.home || {}
  s.home.carousel = { enabled: true, autoplay: true, ...(s.home.carousel || {}) }
  s.schemaVersion = SITE_VERSION
  return s
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URLISH = /^(https?:\/\/|\/media\/)/

export function validateSite(s) {
  const errors = []
  const err = (path, msg) => errors.push({ path, msg })
  if (!s?.identity?.name?.trim()) err('identity.name', 'Name is required.')
  const ids = new Set()
  const slugs = new Set()
  ;(s.projects || []).forEach((p, i) => {
    const at = `projects.${i}`
    if (!p.id) err(at, 'Project is missing an id.')
    if (ids.has(p.id)) err(at, `Duplicate project id “${p.id}”.`)
    ids.add(p.id)
    if (!SLUG.test(p.slug || '')) err(`${at}.slug`, `“${p.title}”: URL slug must be lowercase letters, numbers and hyphens.`)
    if (slugs.has(p.slug)) err(`${at}.slug`, `Two projects use the URL “${p.slug}”.`)
    slugs.add(p.slug)
    for (const old of p.redirectFrom || []) slugs.add(old)
    if (!p.title?.trim()) err(`${at}.title`, 'Project title is required.')
    const secIds = new Set()
    ;(p.sections || []).forEach((sec) => {
      if (secIds.has(sec.id)) err(`${at}.sections`, `“${p.title}”: duplicate section id “${sec.id}”.`)
      secIds.add(sec.id)
    })
  })
  for (const id of s.home?.featured || []) if (!ids.has(id)) err('home.featured', `Featured project “${id}” no longer exists.`)
  const c = s.contact || {}
  if (c.email && !EMAIL.test(c.email)) err('contact.email', 'Email address looks incomplete.')
  if (c.linkedin && !/^https?:\/\//.test(c.linkedin)) err('contact.linkedin', 'LinkedIn link should start with https://')
  if (c.resume && !URLISH.test(c.resume)) err('contact.resume', 'Résumé should be a https:// link or an uploaded file.')
  if (c.phone && !/^\+?[\d\s().-]{7,}$/.test(c.phone)) err('contact.phone', 'Phone number looks incomplete.')
  return errors
}

// Every unresolved draft placeholder, for the release check.
export function findPlaceholders(s) {
  const out = []
  const walk = (v, path) => {
    if (v == null) return
    if (typeof v === 'string') { if (isPlaceholder(v)) out.push({ path, text: v }); return }
    if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}.${i}`))
    if (typeof v === 'object') {
      if ('text' in v && 'scaffold' in v) { if (v.scaffold || isPlaceholder(v.text)) out.push({ path, text: v.text }); return }
      if ('src' in v && 'ratio' in v) { if (!v.src) out.push({ path, text: `[${v.label || 'Image'}]`, media: true }); return }
      for (const [k, x] of Object.entries(v)) if (k !== 'redirectFrom' && k !== 'cardHover') walk(x, path ? `${path}.${k}` : k)
    }
  }
  walk({ identity: s.identity, home: s.home, about: s.about }, '')
  ;(s.projects || []).forEach((p, i) => { if (!p.hidden) walk(p, `projects.${i}`) })
  const c = s.contact || {}
  if (!c.email && !c.linkedin && !c.resume) out.push({ path: 'contact', text: '[Email · LinkedIn · Résumé]' })
  return out
}

// ---------- Settings ----------

export const DEFAULT_SETTINGS = {
  schemaVersion: SETTINGS_VERSION,
  colors: {
    bg: '#F3EEE3', surface: '#FAF8F3', ink: '#16213F', muted: '#5B6378',
    accent: '#2343B0', accentSoft: '#DCE3F5', line: '#D9D2C2',
  },
  type: { heroMinRem: 3.6, heroMaxRem: 8.25, bodyPx: 16 },
  layout: { maxWidthPx: 1180, gutterMinPx: 20, gutterMaxPx: 48, sectionScale: 1 },
  media: { radiusPx: 10, coverRatio: '16 / 10' },
  variants: { heroLayout: 'type', hero: 'split', workPreview: 'cursor', ripples: 'off', background: 'plain', intro: 'off' },
}

const num = (str, unit, fallback) => {
  const m = String(str || '').match(new RegExp(`([\\d.]+)${unit}`, 'g'))
  return m ? m.map((x) => parseFloat(x)) : fallback
}

export function migrateSettings(input) {
  const s = clone(input || {})
  const v = s.schemaVersion || 1
  if (v > SETTINGS_VERSION) throw new Error(`Settings schema v${v} is newer than this editor (v${SETTINGS_VERSION}).`)
  if (v < 2) {
    const [heroMin, heroMax] = num(s.type?.heroSize, 'rem', [3.6, 8.25])
    const [gMin, gMax] = num(s.layout?.gutter, 'px', [20, 48])
    return {
      ...clone(DEFAULT_SETTINGS),
      colors: { ...DEFAULT_SETTINGS.colors, ...(s.colors || {}) },
      type: { ...DEFAULT_SETTINGS.type, heroMinRem: heroMin, heroMaxRem: heroMax ?? 8.25 },
      layout: { ...DEFAULT_SETTINGS.layout, maxWidthPx: parseFloat(s.layout?.maxWidth) || 1180, gutterMinPx: gMin, gutterMaxPx: gMax ?? 48 },
    }
  }
  // Fill any setting added after this file was written.
  const out = clone(DEFAULT_SETTINGS)
  for (const g of Object.keys(out)) if (typeof out[g] === 'object') out[g] = { ...out[g], ...(s[g] || {}) }
  out.schemaVersion = SETTINGS_VERSION
  return out
}

// Settings -> CSS custom properties / data attributes on a document.
export function applySettings(s, doc = document) {
  const root = doc.documentElement
  const st = root.style
  for (const [k, v] of Object.entries(s.colors)) st.setProperty(`--c-${k}`, v)
  st.setProperty('--hero-size', `clamp(${s.type.heroMinRem}rem, 8.4vw, ${s.type.heroMaxRem}rem)`)
  st.setProperty('--body-size', `${s.type.bodyPx}px`)
  st.setProperty('--max-w', `${s.layout.maxWidthPx}px`)
  st.setProperty('--gutter', `clamp(${s.layout.gutterMinPx}px, 4vw, ${s.layout.gutterMaxPx}px)`)
  st.setProperty('--section-scale', s.layout.sectionScale)
  st.setProperty('--radius', `${s.media.radiusPx}px`)
  st.setProperty('--cover-ratio', s.media.coverRatio)
  root.dataset.hero = s.variants.hero
  root.dataset.heroLayout = s.variants.heroLayout
  root.dataset.preview = s.variants.workPreview
}

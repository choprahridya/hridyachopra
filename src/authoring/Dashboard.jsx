import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, downloadJson, readFileAsText, local, setIn, getIn, diffPaths } from './api'
import { migrateSite, migrateSettings, validateSite, findPlaceholders, emptyMedia } from '../content/schema'
import PreviewFrame, { DEVICES } from './PreviewFrame'
import useUndoable from './useUndoable'
import { TextField, Check, MoveButtons, MediaField, move } from './fields'
import './authoring.css'

const DRAFT_KEY = 'hc-dashboard-draft'
const TABS = [
  ['overview', 'Overview'], ['home', 'Home & identity'], ['projects', 'Projects'],
  ['about', 'About'], ['contact', 'Contact'], ['meta', 'Page titles'], ['history', 'History & backup'],
]

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const UX_SECTIONS = [
  ['overview', 'Overview', '[What the project is, who it was for and what you set out to change.]'],
  ['context', 'Context', '[The situation and constraints you started from.]'],
  ['contribution', 'My contribution', '[Describe your individual contribution, separate from the team’s.]'],
  ['decisions', 'Key decisions', '[Explain one decision and the evidence behind it.]', '4 / 3'],
  ['evidence', 'Evidence & iteration', '[What you tested or observed, and what changed because of it.]', '16 / 9'],
  ['reflection', 'Reflection', '[What you’d do differently, and what you learned.]'],
]

function newProject(site) {
  const taken = new Set(site.projects.flatMap((p) => [p.id, p.slug, ...(p.redirectFrom || [])]))
  let n = site.projects.length + 1
  while (taken.has(`project-${String(n).padStart(2, '0')}`)) n++
  const nn = String(n).padStart(2, '0')
  return {
    id: `project-${nn}`, slug: `project-${nn}`, format: 'ux-case-study', scaffold: true, hidden: false, redirectFrom: [],
    title: `[Project title ${nn}]`, summary: '[One sentence about what this project is and why it matters.]',
    tags: ['[Discipline]', '[Year]'],
    meta: { role: '[Your individual contribution]', timeline: '[Duration · Year]', team: '[Collaborators and their roles]', context: '[Course, internship or self-initiated]' },
    cover: emptyMedia('16 / 9', 'Project cover · 16:9'),
    sections: UX_SECTIONS.map(([id, label, body, ratio]) => ({ id, label, body, hidden: false, ...(ratio ? { media: emptyMedia(ratio, `${label} image`) } : {}) })),
  }
}

// Old URLs keep working: a changed slug is recorded as a redirect on save.
function prepareForSave(draft, saved) {
  const projects = draft.projects.map((p) => {
    const before = saved.projects.find((s) => s.id === p.id)
    let redirectFrom = (p.redirectFrom || []).filter((s) => s !== p.slug)
    if (before && before.slug !== p.slug && !redirectFrom.includes(before.slug)) redirectFrom = [...redirectFrom, before.slug]
    return { ...p, redirectFrom }
  })
  const ids = new Set(projects.map((p) => p.id))
  return { ...draft, projects, home: { ...draft.home, featured: draft.home.featured.filter((id) => ids.has(id)) } }
}

function describePath(site, path) {
  const parts = path.split('.')
  if (parts[0] === 'projects' && parts[1] != null) {
    const p = site.projects[Number(parts[1])]
    const rest = parts.slice(2)
    if (rest[0] === 'sections' && rest[1] != null) {
      const sec = p?.sections?.[Number(rest[1])]
      return [p?.title || 'Project', sec?.label || 'Section', ...rest.slice(2)].join(' › ')
    }
    return [p?.title || 'Projects', ...rest].join(' › ')
  }
  if (parts[0] === 'about' && parts[1] === 'sections' && parts[2] != null) {
    return ['About', site.about.sections[Number(parts[2])]?.title || 'Section', ...parts.slice(3)].join(' › ')
  }
  return parts.join(' › ')
}

const tabFor = (path) => {
  const top = path.split('.')[0]
  return top === 'identity' || top === 'home' ? 'home' : TABS.some(([k]) => k === top) ? top : 'overview'
}

export default function Dashboard() {
  const draft = useUndoable(null)
  const site = draft.value
  const [saved, setSaved] = useState(null)
  const [revision, setRevision] = useState(null)
  const [tab, setTab] = useState('overview')
  const [projectIdx, setProjectIdx] = useState(0)
  const [device, setDevice] = useState('desktop')
  const [previewPath, setPreviewPath] = useState('/')
  const [status, setStatus] = useState(null)
  const [recovery, setRecovery] = useState(null)
  const [conflict, setConflict] = useState(null)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState(null)

  useEffect(() => { document.title = 'Content dashboard — portfolio' }, [])

  useEffect(() => {
    (async () => {
      const r = await api.state()
      if (!r.ok) return setStatus({ kind: 'error', msg: r.data.message || 'Couldn’t load content.' })
      const loadedSite = migrateSite(r.data.site)
      setSaved(loadedSite)
      setRevision(r.data.siteRevision)
      setSettings(migrateSettings(r.data.settings))
      draft.reset(loadedSite)
      const stored = local.get(DRAFT_KEY)
      if (stored?.site && JSON.stringify(stored.site) !== JSON.stringify(loadedSite)) setRecovery(stored)
    })()
  }, [])

  const dirty = !!(site && saved && JSON.stringify(site) !== JSON.stringify(saved))

  // Keep a browser copy of unsaved work for recovery after a reload or crash.
  useEffect(() => {
    if (!site || !saved || recovery) return
    const t = setTimeout(() => {
      if (dirty) local.set(DRAFT_KEY, { site, baseRevision: revision, at: new Date().toISOString() })
      else local.remove(DRAFT_KEY)
    }, 400)
    return () => clearTimeout(t)
  }, [site, saved, dirty, revision, recovery])

  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = useCallback((path, value) => draft.set((s) => setIn(s, path, value), path), [draft.set])

  const save = useCallback(async (force = false) => {
    if (!site || saving) return
    const prepared = prepareForSave(site, saved)
    const errors = validateSite(prepared)
    if (errors.length) {
      setTab('overview')
      return setStatus({ kind: 'error', msg: `Not saved — ${errors.length} thing${errors.length > 1 ? 's' : ''} to fix (listed in Overview).` })
    }
    setSaving(true)
    setStatus({ kind: 'info', msg: 'Saving…' })
    try {
      const r = await api.saveContent(prepared, revision, force)
      if (r.status === 409) {
        setConflict({ theirs: migrateSite(r.data.current), revision: r.data.revision })
        setStatus({ kind: 'warn', msg: 'Not saved — the content file changed since you opened the dashboard.' })
        return
      }
      if (!r.ok) {
        setStatus({ kind: 'error', msg: r.data.errors ? r.data.errors.map((e) => e.msg).join(' ') : r.data.message || 'Save failed.', retry: true })
        return
      }
      setSaved(prepared)
      setRevision(r.data.revision)
      draft.set(prepared)
      setConflict(null)
      local.remove(DRAFT_KEY)
      setStatus({ kind: 'ok', msg: r.data.unchanged ? 'Nothing to save — already up to date.' : 'Saved to src/content/site.json on this computer. Not published.' })
    } finally {
      setSaving(false)
    }
  }, [site, saved, revision, saving, draft])

  // ⌘/Ctrl+S saves; ⌘/Ctrl+Z undoes outside text fields (text fields keep their own undo).
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key.toLowerCase() === 's') { e.preventDefault(); save() }
      const inText = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)
      if (e.key.toLowerCase() === 'z' && !inText) { e.preventDefault(); e.shiftKey ? draft.redo() : draft.undo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save, draft.undo, draft.redo])

  // The preview follows whatever is being edited.
  useEffect(() => {
    if (!site) return
    const p = site.projects[projectIdx]
    const map = { home: '/', about: '/about', contact: '/about', projects: p ? `/work/${p.slug}` : '/work' }
    if (map[tab]) setPreviewPath(map[tab])
  }, [tab, projectIdx, site?.projects[projectIdx]?.slug])

  const errors = useMemo(() => (site ? validateSite(site) : []), [site])
  const placeholders = useMemo(() => (site ? findPlaceholders(site) : []), [site])
  const changes = useMemo(() => (site && saved ? diffPaths(saved, site) : []), [site, saved])

  if (!site || !settings) return <div className="au au--loading">{status?.msg || 'Loading the dashboard…'}</div>

  const goTo = (path) => {
    const t = tabFor(path)
    setTab(t)
    const m = path.match(/^projects\.(\d+)/)
    if (m) setProjectIdx(Number(m[1]))
  }

  const ctx = { site, saved, update, set: draft.set, goTo }

  return (
    <div className="au dash">
      <header className="au-top">
        <div className="au-top__title">
          <strong>Content dashboard</strong>
          <span className="dash__state">
            {dirty ? <span className="dash__dirty">Unsaved changes</span> : <span className="au-muted">All changes saved locally</span>}
            <span className="au-muted">· Saving updates files on this computer; publishing is separate.</span>
          </span>
        </div>
        <div className="au-top__tools">
          <button onClick={draft.undo} disabled={!draft.canUndo} title="Undo (⌘Z)">Undo</button>
          <button onClick={draft.redo} disabled={!draft.canRedo} title="Redo (⇧⌘Z)">Redo</button>
          <button className="is-primary" onClick={() => save()} disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save'}</button>
          <Link className="au-link" to="/lab">Design lab →</Link>
        </div>
      </header>

      <div className="dash__body">
        <section className="dash__editor" aria-label="Editor">
          <nav className="dash__tabs" aria-label="Editor sections">
            {TABS.map(([k, l]) => <button key={k} aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)}>{l}</button>)}
          </nav>
          <div className="dash__pane">
            {status && (
              <p className={`au-status is-${status.kind}`} role="status">
                {status.msg} {status.retry && <button onClick={() => save()}>Try again</button>}
              </p>
            )}
            {recovery && (
              <div className="au-status is-warn">
                Unsaved changes from {new Date(recovery.at).toLocaleString()} were found in this browser.
                <div className="au-row">
                  <button onClick={() => { draft.set(migrateSite(recovery.site)); setRecovery(null); setStatus({ kind: 'info', msg: 'Restored. Review, then Save.' }) }}>Restore them</button>
                  <button onClick={() => downloadJson('portfolio-recovered-draft.json', recovery.site)}>Download a copy</button>
                  <button className="is-quiet" onClick={() => { local.remove(DRAFT_KEY); setRecovery(null) }}>Discard</button>
                </div>
              </div>
            )}
            {conflict && (
              <ConflictPanel
                mine={site} theirs={conflict.theirs}
                onKeepMine={() => { setRevision(conflict.revision); setConflict(null); setTimeout(() => save(true), 0) }}
                onUseTheirs={() => {
                  local.set(`${DRAFT_KEY}-before-conflict`, { site, at: new Date().toISOString() })
                  downloadJson('portfolio-my-draft-before-conflict.json', site)
                  setSaved(conflict.theirs); setRevision(conflict.revision); draft.set(conflict.theirs); setConflict(null)
                  setStatus({ kind: 'info', msg: 'Loaded the newer saved content. Your draft was downloaded as a file in case you need it.' })
                }}
              />
            )}

            {tab === 'overview' && <Overview {...ctx} errors={errors} placeholders={placeholders} changes={changes} />}
            {tab === 'home' && <HomeEditor {...ctx} />}
            {tab === 'projects' && <ProjectsEditor {...ctx} index={projectIdx} setIndex={setProjectIdx} />}
            {tab === 'about' && <AboutEditor {...ctx} />}
            {tab === 'contact' && <ContactEditor {...ctx} />}
            {tab === 'meta' && <MetaEditor {...ctx} />}
            {tab === 'history' && <HistoryPane {...ctx} onReplace={(next, msg) => { draft.set(next); setStatus({ kind: 'info', msg }) }} onDiscard={() => { draft.set(saved); setStatus({ kind: 'info', msg: 'Unsaved changes discarded (Undo brings them back).' }) }} dirty={dirty} />}
          </div>
        </section>

        <section className="dash__preview" aria-label="Draft preview">
          <div className="dash__previewTools">
            <span className="au-muted">Draft preview. Click links inside to move around.</span>
            <div className="au-seg" role="group" aria-label="Screen size">
              {Object.entries(DEVICES).map(([k, d]) => <button key={k} aria-pressed={device === k} onClick={() => setDevice(k)}>{d.label}</button>)}
            </div>
          </div>
          <PreviewFrame label="Draft" path={previewPath} site={site} settings={settings} device={device} onRoute={setPreviewPath} />
        </section>
      </div>
    </div>
  )
}

function ConflictPanel({ mine, theirs, onKeepMine, onUseTheirs }) {
  const diff = diffPaths(theirs, mine)
  return (
    <div className="au-status is-warn">
      <strong>The content was saved somewhere else</strong> (another tab, or a file edit) after you opened this dashboard.
      {diff.length > 0 && <>
        <p style={{ margin: '6px 0 0' }}>Your draft differs from the newer file in:</p>
        <ul className="issues">{diff.slice(0, 12).map((p) => <li key={p}>{describePath(mine, p)}</li>)}{diff.length > 12 && <li>…and {diff.length - 12} more</li>}</ul>
      </>}
      <div className="au-row">
        <button className="is-danger" onClick={onKeepMine}>Keep my version (replace theirs)</button>
        <button onClick={onUseTheirs}>Use the newer version (download mine first)</button>
      </div>
    </div>
  )
}

function Overview({ site, errors, placeholders, changes, goTo }) {
  return (
    <>
      <h2>Before saving</h2>
      {errors.length ? (
        <ul className="issues">{errors.map((e, i) => <li key={i}>{e.msg}<button onClick={() => goTo(e.path)} aria-label={`Go to ${describePath(site, e.path)}`}>Go</button></li>)}</ul>
      ) : <p className="au-muted">No problems found.</p>}

      <h2>Unsaved changes ({changes.length})</h2>
      {changes.length ? (
        <ul className="issues">{changes.slice(0, 25).map((p) => <li key={p}>{describePath(site, p)}<button onClick={() => goTo(p)} aria-label={`Go to ${describePath(site, p)}`}>Go</button></li>)}{changes.length > 25 && <li>…and {changes.length - 25} more</li>}</ul>
      ) : <p className="au-muted">None.</p>}

      <h2>Release check — placeholders left ({placeholders.length})</h2>
      <p className="au-hint">Fill in or remove each one before the site goes public.</p>
      <ul className="issues">
        {placeholders.map((p, i) => <li key={i}><span className="au-muted">{describePath(site, p.path)}:</span> {p.text}<button onClick={() => goTo(p.path)} aria-label={`Go to ${describePath(site, p.path)}`}>Go</button></li>)}
      </ul>
    </>
  )
}

function HomeEditor({ site, update, set }) {
  const { identity, home } = site
  const toggleFeatured = (id, on) => update('home.featured', on ? [...home.featured, id] : home.featured.filter((x) => x !== id))
  return (
    <>
      <h2>Identity</h2>
      <TextField label="Name" value={identity.name} onChange={(v) => update('identity.name', v)} />
      <TextField label="Discipline" value={identity.discipline} onChange={(v) => update('identity.discipline', v)} hint="Shown above your name and on About." />
      <TextField label="Statement" value={identity.statement.lead} onChange={(v) => update('identity.statement.lead', v)} />
      <TextField label="Statement — underlined italic ending" value={identity.statement.emphasis} onChange={(v) => update('identity.statement.emphasis', v)} />

      <h2>Home introduction</h2>
      <TextField label="Introduction" multiline value={home.intro} onChange={(v) => update('home.intro', v)} />

      <h2>3D carousel on Home</h2>
      <p className="au-hint">Shows the covers of your selected projects (below) under the hero. Each card opens its project.</p>
      <Check label="Show the carousel" checked={home.carousel?.enabled} onChange={(v) => update('home.carousel.enabled', v)} />
      <Check label="Move on its own (visitors can pause it)" checked={home.carousel?.autoplay} onChange={(v) => update('home.carousel.autoplay', v)} />

      <h2>Selected work on Home</h2>
      <p className="au-hint">Ticked projects appear on Home in this order. All visible projects appear on Work.</p>
      <ul className="list">
        {home.featured.map((id, i) => {
          const p = site.projects.find((x) => x.id === id)
          return (
            <li key={id}>
              <span className="list__main">{p?.title || id} {p?.hidden && <span className="au-tag is-off">Hidden</span>}</span>
              <MoveButtons index={i} length={home.featured.length} label={p?.title} onMove={(a, b) => update('home.featured', move(home.featured, a, b))} />
              <button className="mini is-quiet" onClick={() => toggleFeatured(id, false)}>Remove</button>
            </li>
          )
        })}
      </ul>
      {site.projects.filter((p) => !home.featured.includes(p.id)).map((p) => (
        <Check key={p.id} label={`Feature “${p.title}”`} checked={false} onChange={(on) => toggleFeatured(p.id, on)} />
      ))}
      <p className="au-hint">The buttons on Home (“Selected work”, “View all work”, “More about me”) always go to your Work and About pages, so they can’t be pointed elsewhere.</p>
    </>
  )
}

function ProjectsEditor({ site, saved, update, set, index, setIndex }) {
  const projects = site.projects
  const p = projects[index]
  const before = p && saved.projects.find((s) => s.id === p.id)

  const add = () => { const fresh = newProject(site); set((s) => ({ ...s, projects: [...s.projects, fresh] })); setIndex(projects.length) }
  const duplicate = () => {
    const taken = new Set(projects.flatMap((x) => [x.id, x.slug, ...(x.redirectFrom || [])]))
    let slug = `${p.slug}-copy`; let n = 2
    while (taken.has(slug)) slug = `${p.slug}-copy-${n++}`
    const copy = { ...structuredClone(p), id: slug, slug, title: `${p.title} (copy)`, redirectFrom: [] }
    set((s) => { const list = s.projects.slice(); list.splice(index + 1, 0, copy); return { ...s, projects: list } })
    setIndex(index + 1)
  }
  const remove = () => {
    if (!window.confirm(`Delete “${p.title}”? You can Undo, and older saved versions stay in History.`)) return
    set((s) => ({ ...s, projects: s.projects.filter((_, i) => i !== index), home: { ...s.home, featured: s.home.featured.filter((id) => id !== p.id) } }))
    setIndex(Math.max(0, index - 1))
  }
  const at = (k) => `projects.${index}.${k}`

  return (
    <>
      <h2>Projects</h2>
      <p className="au-hint">The order here is the order on the Work page.</p>
      <ul className="list">
        {projects.map((x, i) => (
          <li key={x.id} className={i === index ? 'is-selected' : ''}>
            <button className="list__main" onClick={() => setIndex(i)}>
              {x.title}{' '}
              {x.hidden ? <span className="au-tag is-off">Hidden</span> : x.scaffold ? <span className="au-tag">Draft</span> : <span className="au-tag is-ok">Reviewed</span>}
            </button>
            <MoveButtons index={i} length={projects.length} label={x.title} onMove={(a, b) => { set((s) => ({ ...s, projects: move(s.projects, a, b) })); if (index === a) setIndex(b) }} />
          </li>
        ))}
      </ul>
      <div className="au-row"><button onClick={add}>New project</button>{p && <button onClick={duplicate}>Duplicate</button>}{p && <button className="is-danger" onClick={remove}>Delete</button>}</div>

      {p && <>
        <h2 style={{ marginTop: 24 }}>Editing: {p.title}</h2>
        <TextField label="Title" value={p.title} onChange={(v) => update(at('title'), v)} />
        <TextField label="Web address" value={p.slug} onChange={(v) => update(at('slug'), slugify(v) || v)}
          hint={before && before.slug !== p.slug ? `Will be /work/${p.slug}. The old address /work/${before.slug} will redirect here.` : `/work/${p.slug}`} />
        <label className="au-field">Status
          <select value={p.scaffold ? 'draft' : 'reviewed'} onChange={(e) => update(at('scaffold'), e.target.value === 'draft')}>
            <option value="draft">Draft — still has placeholder content</option>
            <option value="reviewed">Reviewed — real content</option>
          </select>
        </label>
        <Check label="Hide from the public site (kept here, not shown on Home or Work)" checked={p.hidden} onChange={(v) => update(at('hidden'), v)} />
        <TextField label="Summary" multiline rows={2} value={p.summary} onChange={(v) => update(at('summary'), v)} />
        <TextField label="Tags (comma-separated)" value={p.tags.join(', ')} onChange={(v) => update(at('tags'), v.split(',').map((t) => t.trim()).filter(Boolean))} />
        <div className="card">
          <strong>Project details</strong>
          <TextField label="My role" value={p.meta.role} onChange={(v) => update(at('meta.role'), v)} />
          <TextField label="Timeline" value={p.meta.timeline} onChange={(v) => update(at('meta.timeline'), v)} />
          <TextField label="Team & credits" value={p.meta.team} onChange={(v) => update(at('meta.team'), v)} />
          <TextField label="Context" value={p.meta.context} onChange={(v) => update(at('meta.context'), v)} hint="Leave any of these empty to hide it." />
        </div>
        <MediaField label="Cover image" value={p.cover} onChange={(v) => update(at('cover'), v)} />

        <h2>Sections</h2>
        <p className="au-hint">Reorder, hide or add sections. Hidden sections keep their text.</p>
        {p.sections.map((sec, si) => {
          const sp = (k) => at(`sections.${si}.${k}`)
          return (
            <div className="card" key={sec.id}>
              <div className="card__head">
                <strong>{sec.label || 'Untitled section'} {sec.hidden && <span className="au-tag is-off">Hidden</span>}</strong>
                <MoveButtons index={si} length={p.sections.length} label={sec.label} onMove={(a, b) => update(at('sections'), move(p.sections, a, b))} />
                <button className="mini is-quiet" onClick={() => { if (window.confirm(`Remove the “${sec.label}” section?`)) update(at('sections'), p.sections.filter((_, i) => i !== si)) }}>Remove</button>
              </div>
              <TextField label="Heading" value={sec.label} onChange={(v) => update(sp('label'), v)} />
              <TextField label="Text" multiline rows={4} value={sec.body} onChange={(v) => update(sp('body'), v)} />
              {sec.media
                ? <><MediaField label="Section image" value={sec.media} onChange={(v) => update(sp('media'), v)} />
                    <button className="mini is-quiet" style={{ marginTop: 6 }} onClick={() => update(at('sections'), p.sections.map((x, i) => (i === si ? (({ media, ...rest }) => rest)(x) : x)))}>Remove image slot</button></>
                : <div className="au-row"><button className="mini" onClick={() => update(sp('media'), emptyMedia('16 / 9', `${sec.label} image`))}>Add an image</button></div>}
              <Check label="Hide this section" checked={sec.hidden} onChange={(v) => update(sp('hidden'), v)} />
            </div>
          )
        })}
        <div className="au-row">
          <button onClick={() => {
            const ids = new Set(p.sections.map((s) => s.id))
            let id = 'section'; let n = 2
            while (ids.has(id)) id = `section-${n++}`
            update(at('sections'), [...p.sections, { id, label: 'New section', body: '[What this section shows.]', hidden: false }])
          }}>Add section</button>
        </div>
      </>}
    </>
  )
}

function AboutEditor({ site, update }) {
  const { about } = site
  const secs = about.sections
  return (
    <>
      <h2>About</h2>
      <TextField label="Introduction" multiline value={about.intro} onChange={(v) => update('about.intro', v)} hint="Also shown in the About teaser on Home." />
      <TextField label="Bio" multiline rows={6} value={about.bio} onChange={(v) => update('about.bio', v)} />
      <MediaField label="Portrait" value={about.portrait} onChange={(v) => update('about.portrait', v)} />

      <h2>Sections</h2>
      {secs.map((s, i) => (
        <div className="card" key={s.id}>
          <div className="card__head">
            <strong>{s.title} {s.hidden && <span className="au-tag is-off">Hidden</span>}</strong>
            <MoveButtons index={i} length={secs.length} label={s.title} onMove={(a, b) => update('about.sections', move(secs, a, b))} />
            <button className="mini is-quiet" onClick={() => { if (window.confirm(`Remove “${s.title}”?`)) update('about.sections', secs.filter((_, j) => j !== i)) }}>Remove</button>
          </div>
          <TextField label="Heading" value={s.title} onChange={(v) => update(`about.sections.${i}.title`, v)} />
          {s.items.map((it, j) => (
            <div key={j} className="au-row" style={{ alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}><TextField label={`Line ${j + 1}`} value={it} onChange={(v) => update(`about.sections.${i}.items.${j}`, v)} /></div>
              <button className="mini is-quiet" onClick={() => update(`about.sections.${i}.items`, s.items.filter((_, k) => k !== j))} aria-label={`Remove line ${j + 1}`}>Remove</button>
            </div>
          ))}
          <div className="au-row"><button className="mini" onClick={() => update(`about.sections.${i}.items`, [...s.items, { text: '', scaffold: false }])}>Add a line</button></div>
          <Check label="Hide this section" checked={s.hidden} onChange={(v) => update(`about.sections.${i}.hidden`, v)} />
        </div>
      ))}
      <div className="au-row">
        <button onClick={() => {
          const ids = new Set(secs.map((s) => s.id)); let id = 'section'; let n = 2
          while (ids.has(id)) id = `section-${n++}`
          update('about.sections', [...secs, { id, title: 'New section', hidden: false, items: [{ text: '[A line about this.]', scaffold: true }] }])
        }}>Add section</button>
      </div>
    </>
  )
}

function ContactEditor({ site, update }) {
  const c = site.contact
  const resumeMedia = { src: c.resume?.startsWith('/media/') ? c.resume : '', label: 'Résumé PDF' }
  return (
    <>
      <h2>Contact links</h2>
      <p className="au-hint">Only filled-in links appear on the site, at the end of Home and About.</p>
      <TextField label="Email" type="email" value={c.email} placeholder="name@example.com" onChange={(v) => update('contact.email', v.trim())} />
      <TextField label="LinkedIn profile" value={c.linkedin} placeholder="https://www.linkedin.com/in/…" onChange={(v) => update('contact.linkedin', v.trim())} />
      <TextField label="Résumé link" value={c.resume} placeholder="https://… or upload a PDF below" onChange={(v) => update('contact.resume', v.trim())} />
      <MediaField label="Or upload a résumé PDF" accept="application/pdf" value={resumeMedia} onChange={(m) => update('contact.resume', m.src)} />
    </>
  )
}

function MetaEditor({ site, update }) {
  return (
    <>
      <h2>Page titles & descriptions</h2>
      <p className="au-hint">Used in browser tabs, search results and link previews. Project pages use each project’s title and summary.</p>
      {[['home', 'Home'], ['work', 'Work'], ['about', 'About']].map(([k, l]) => (
        <div className="card" key={k}>
          <strong>{l}</strong>
          <TextField label="Title" value={site.meta[k].title} onChange={(v) => update(`meta.${k}.title`, v)} />
          <TextField label="Description" multiline rows={2} value={site.meta[k].description} onChange={(v) => update(`meta.${k}.description`, v)} />
        </div>
      ))}
    </>
  )
}

function HistoryPane({ site, onReplace, onDiscard, dirty }) {
  const [items, setItems] = useState(null)
  const [msg, setMsg] = useState(null)
  const file = useRef(null)
  useEffect(() => { api.history().then((r) => setItems(r.ok ? r.data.items.filter((i) => i.kind === 'site') : [])) }, [])

  const restore = async (f) => {
    const r = await api.snapshot(f)
    if (!r.ok) return setMsg('Couldn’t open that version.')
    try { onReplace(migrateSite(r.data), `Loaded the version saved before ${f.replace(/^site-|\.json$/g, '')}. Review it, then Save to make it current (Undo reverts).`) }
    catch (e) { setMsg(e.message) }
  }
  const onImport = async (e) => {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    try {
      const data = migrateSite(JSON.parse(await readFileAsText(f)))
      const errs = validateSite(data)
      if (!data.identity || !Array.isArray(data.projects)) throw new Error('That file isn’t portfolio content.')
      onReplace(data, `Imported ${f.name}${errs.length ? ` — ${errs.length} problem(s) to fix before saving` : ''}. Undo reverts.`)
    } catch (err) { setMsg(err instanceof SyntaxError ? 'That file isn’t valid JSON.' : err.message) }
  }
  const label = (f) => {
    const m = f.match(/^site-(\d{4})-(\d\d)-(\d\d)T(\d\d)-(\d\d)-(\d\d)/)
    return m ? `Before save on ${new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`).toLocaleString()}` : f.replace(/\.json$/, '').replace(/-/g, ' ')
  }

  return (
    <>
      <h2>Saved versions</h2>
      <p className="au-hint">Every save keeps the previous version in authoring/history (the newest 60 are kept). Loading one replaces your draft; nothing changes until you Save.</p>
      {msg && <p className="au-status is-error">{msg}</p>}
      <ul className="list">
        {items === null && <li className="au-muted">Loading…</li>}
        {items?.length === 0 && <li className="au-muted">No earlier versions yet.</li>}
        {items?.map((i) => <li key={i.file}><span className="list__main">{label(i.file)}</span><button className="mini" onClick={() => restore(i.file)}>Load into draft</button></li>)}
      </ul>
      <h2>Backup</h2>
      <div className="au-row">
        <button onClick={() => downloadJson(`portfolio-content-${new Date().toISOString().slice(0, 10)}.json`, site)}>Download current draft</button>
        <button onClick={() => file.current?.click()}>Import a backup…</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={onImport} />
        <button className="is-danger" disabled={!dirty} onClick={onDiscard}>Discard unsaved changes</button>
      </div>
    </>
  )
}

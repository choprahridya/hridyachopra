import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, downloadJson, readFileAsText, local, getIn, setIn } from './api'
import PreviewFrame, { DEVICES } from './PreviewFrame'
import { SETTINGS, SCOPE_LABEL, validateSettings, importPreset, presetFile, formatValue, contrast } from './settingsSchema'
import { migrateSettings } from '../content/schema'
import './authoring.css'

const WORKING_KEY = 'hc-lab-working'

const pagesFor = (site) => [
  ['/', 'Home'], ['/work', 'Work'], ['/about', 'About'],
  ...site.projects.map((p) => [`/work/${p.slug}`, p.title]),
]

export default function Lab() {
  const [loaded, setLoaded] = useState(null) // { site, settings, settingsRevision }
  const [working, setWorking] = useState(null) // { id, name, notes, settings }
  const [presets, setPresets] = useState([])
  const [path, setPath] = useState('/')
  const [device, setDevice] = useState('desktop')
  const [view, setView] = useState('exploration')
  const [status, setStatus] = useState(null)
  const [conflict, setConflict] = useState(null)
  const [busy, setBusy] = useState(false)
  const fileInput = useRef(null)

  useEffect(() => { document.title = 'Design lab — portfolio' }, [])

  const load = useCallback(async () => {
    const [st, pr] = await Promise.all([api.state(), api.presets()])
    if (!st.ok) return setStatus({ kind: 'error', msg: st.data.message || 'Couldn’t load the portfolio.' })
    const current = migrateSettings(st.data.settings) // fills settings added since the file was saved
    setLoaded({ site: st.data.site, settings: current, settingsRevision: st.data.settingsRevision })
    setPresets(pr.ok ? pr.data.items : [])
    const saved = local.get(WORKING_KEY)
    setWorking((w) => w || (saved?.settings ? { ...saved, settings: migrateSettings(saved.settings) } : { id: null, name: '', notes: '', settings: current }))
    if (saved?.settings && JSON.stringify(migrateSettings(saved.settings)) !== JSON.stringify(current)) {
      setStatus({ kind: 'info', msg: 'Reopened the exploration you were working on in this browser.' })
    }
  }, [])
  useEffect(() => { load() }, [load])

  useEffect(() => { if (working) local.set(WORKING_KEY, working) }, [working])

  const baseline = loaded?.settings
  const changes = useMemo(() => (baseline && working ? SETTINGS.filter((d) => getIn(baseline, d.id) !== getIn(working.settings, d.id)) : []), [baseline, working])
  const problems = useMemo(() => (working ? validateSettings(working.settings) : []), [working])

  if (!loaded || !working) {
    return <div className="au au--loading">{status?.msg || 'Loading the lab…'}</div>
  }

  const setValue = (id, v) => setWorking((w) => ({ ...w, settings: setIn(w.settings, id, v) }))
  const resetValue = (id) => setValue(id, getIn(baseline, id))

  const savePreset = async () => {
    const name = working.name.trim() || window.prompt('Name this exploration', 'Exploration')
    if (!name) return
    setBusy(true)
    const r = await api.savePreset({ id: working.id, name, notes: working.notes, settings: working.settings })
    setBusy(false)
    if (!r.ok) return setStatus({ kind: 'error', msg: r.data.message || 'Couldn’t save the exploration.' })
    setWorking((w) => ({ ...w, id: r.data.id, name: r.data.name }))
    setPresets((list) => [r.data, ...list.filter((p) => p.id !== r.data.id)])
    setStatus({ kind: 'ok', msg: `Saved “${r.data.name}” to authoring/presets/${r.data.id}.json. The live design is unchanged.` })
  }

  const openPreset = (p) => {
    if (changes.length && !working.id && !window.confirm('Your current unsaved exploration will be replaced. Continue?')) return
    setWorking({ id: p.id, name: p.name, notes: p.notes || '', settings: importPreset(p, baseline).settings })
    setStatus({ kind: 'info', msg: `Opened “${p.name}”.` })
  }

  const removePreset = async (p) => {
    if (!window.confirm(`Delete the saved exploration “${p.name}”? This removes its file.`)) return
    const r = await api.deletePreset(p.id)
    if (!r.ok) return setStatus({ kind: 'error', msg: 'Couldn’t delete it.' })
    setPresets((l) => l.filter((x) => x.id !== p.id))
    if (working.id === p.id) setWorking((w) => ({ ...w, id: null }))
  }

  const startNew = () => {
    if (changes.length && !window.confirm('Start again from the current design? Unsaved exploration changes will be lost.')) return
    setWorking({ id: null, name: '', notes: '', settings: baseline })
    setStatus({ kind: 'info', msg: 'Started a new exploration from the current design.' })
  }

  const exportPreset = () => {
    const name = working.name.trim() || 'exploration'
    downloadJson(`${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.preset.json`, presetFile(name, working.notes, working.settings))
  }

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await readFileAsText(file))
      const res = importPreset(parsed, baseline)
      setWorking({ id: null, name: res.name || file.name.replace(/\.json$/, ''), notes: res.notesText, settings: res.settings })
      setStatus({ kind: res.notes.length ? 'warn' : 'ok', msg: res.notes.length ? `Imported with notes: ${res.notes.join(' ')}` : `Imported “${res.name || file.name}”.` })
    } catch (err) {
      setStatus({ kind: 'error', msg: err instanceof SyntaxError ? 'That file isn’t valid JSON.' : err.message })
    }
  }

  const accept = async (force = false) => {
    if (problems.length) return setStatus({ kind: 'error', msg: `Fix first: ${problems.join('; ')}` })
    if (!force && !window.confirm('Use this exploration as the portfolio’s design?\n\nIt is saved to src/content/settings.json on this computer. Nothing is published.')) return
    setBusy(true)
    const r = await api.saveSettings(working.settings, loaded.settingsRevision, force)
    setBusy(false)
    if (r.status === 409) return setConflict(r.data)
    if (!r.ok) return setStatus({ kind: 'error', msg: r.data.message || 'Couldn’t save the design.' })
    setConflict(null)
    setLoaded((l) => ({ ...l, settings: working.settings, settingsRevision: r.data.revision }))
    setStatus({ kind: 'ok', msg: 'This is now the portfolio’s design (saved locally, not published). The previous design is in History.' })
  }

  const contrasts = [
    ['Body text', working.settings.colors.ink],
    ['Headings', working.settings.colors.accent],
    ['Secondary', working.settings.colors.muted],
  ].map(([l, c]) => [l, contrast(c, working.settings.colors.bg)])

  const groups = [...new Set(SETTINGS.map((d) => d.group))]
  const frames = view === 'split'
    ? [['Current design', baseline], ['Exploration', working.settings]]
    : [[view === 'baseline' ? 'Current design' : 'Exploration', view === 'baseline' ? baseline : working.settings]]

  return (
    <div className="au lab">
      <a className="au-skip" href="#lab-controls">Skip to design controls</a>
      <header className="au-top">
        <div className="au-top__title">
          <strong>Design lab</strong>
          <span className="au-muted">{working.name || 'Unsaved exploration'} · {changes.length ? `${changes.length} change${changes.length > 1 ? 's' : ''} from the current design` : 'matches the current design'}</span>
        </div>
        <div className="au-top__tools">
          <label>Page
            <select value={path} onChange={(e) => setPath(e.target.value)}>
              {pagesFor(loaded.site).map(([p, l]) => <option key={p} value={p}>{l}</option>)}
              {!pagesFor(loaded.site).some(([p]) => p === path) && <option value={path}>{path}</option>}
            </select>
          </label>
          <div className="au-seg" role="group" aria-label="Screen size">
            {Object.entries(DEVICES).map(([k, d]) => <button key={k} aria-pressed={device === k} onClick={() => setDevice(k)}>{d.label}</button>)}
          </div>
          <div className="au-seg" role="group" aria-label="Compare">
            {[['exploration', 'Exploration'], ['baseline', 'Current'], ['split', 'Side by side']].map(([k, l]) => <button key={k} aria-pressed={view === k} onClick={() => setView(k)}>{l}</button>)}
          </div>
          <Link className="au-link" to="/dashboard">Content dashboard →</Link>
        </div>
      </header>

      <div className="lab__body">
        <section className={`lab__canvas ${view === 'split' ? 'is-split' : ''}`} aria-label="Portfolio preview">
          {frames.map(([label, s]) => (
            <PreviewFrame key={label} label={label} path={path} site={loaded.site} settings={s} device={device} onRoute={setPath} />
          ))}
        </section>

        <aside className="lab__panel" id="lab-controls" tabIndex={-1} aria-label="Design controls">
          {status && <p className={`au-status is-${status.kind}`} role="status">{status.msg}</p>}
          {conflict && (
            <div className="au-status is-warn">
              The accepted design was changed somewhere else since this lab opened.
              <div className="au-row">
                <button onClick={() => { setLoaded((l) => ({ ...l, settings: conflict.current, settingsRevision: conflict.revision })); setConflict(null) }}>Compare against the newer design</button>
                <button className="is-danger" onClick={() => accept(true)}>Replace it with this exploration</button>
              </div>
            </div>
          )}

          {groups.map((g) => (
            <fieldset key={g} className="lab__group">
              <legend>{g}</legend>
              {SETTINGS.filter((d) => d.group === g).map((d) => (
                <Control key={d.id} def={d} value={getIn(working.settings, d.id)} base={getIn(baseline, d.id)} onChange={(v) => setValue(d.id, v)} onReset={() => resetValue(d.id)} />
              ))}
              {g === 'Colour' && (
                <p className="lab__contrast">
                  {contrasts.map(([l, r]) => (
                    <span key={l} className={r < 4.5 ? 'is-low' : ''}>{l} {r.toFixed(1)}:1{r < 4.5 ? ' — too low for text' : ''}</span>
                  ))}
                </p>
              )}
            </fieldset>
          ))}

          <fieldset className="lab__group">
            <legend>Changes from the current design</legend>
            {changes.length ? (
              <ul className="lab__summary">
                {changes.map((d) => (
                  <li key={d.id}><span>{d.label} <em>({SCOPE_LABEL[d.scope]})</em></span> {formatValue(d, getIn(baseline, d.id))} → <strong>{formatValue(d, getIn(working.settings, d.id))}</strong></li>
                ))}
              </ul>
            ) : <p className="au-muted">No changes yet.</p>}
            <label className="au-field">Ideas that need new layout work
              <textarea rows={3} value={working.notes} placeholder="e.g. try a two-column project list on desktop" onChange={(e) => setWorking((w) => ({ ...w, notes: e.target.value }))} />
            </label>
            <p className="au-hint">These notes are saved with the exploration. They aren’t applied automatically. Each one needs to be built separately.</p>
          </fieldset>

          <div className="lab__actions">
            <label className="au-field">Exploration name
              <input value={working.name} placeholder="e.g. Deeper blue, tighter" onChange={(e) => setWorking((w) => ({ ...w, name: e.target.value }))} />
            </label>
            <div className="au-row">
              <button onClick={savePreset} disabled={busy}>Save exploration</button>
              <button onClick={startNew}>Reset to current design</button>
            </div>
            <button className="is-primary" onClick={() => accept(false)} disabled={busy || !changes.length}>Use this design</button>
            <p className="au-hint">“Use this design” changes the portfolio’s design on this computer. Publishing is a separate step.</p>
          </div>

          <details className="lab__manage">
            <summary>Saved explorations ({presets.length}) · import & export</summary>
            <ul className="lab__presets">
              {presets.map((p) => (
                <li key={p.id} className={working.id === p.id ? 'is-current' : ''}>
                  <span>{p.name}<small>{new Date(p.updatedAt).toLocaleString()}</small></span>
                  <button onClick={() => openPreset(p)}>Open</button>
                  <button className="is-quiet" onClick={() => removePreset(p)} aria-label={`Delete ${p.name}`}>Delete</button>
                </li>
              ))}
              {!presets.length && <li className="au-muted">None saved yet.</li>}
            </ul>
            <div className="au-row">
              <button onClick={exportPreset}>Export as file</button>
              <button onClick={() => fileInput.current?.click()}>Import a file</button>
              <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={onImport} />
            </div>
          </details>
        </aside>
      </div>
    </div>
  )
}

function Control({ def, value, base, onChange, onReset }) {
  const changed = value !== base
  const id = `ctl-${def.id.replace('.', '-')}`
  return (
    <div className={`ctl ${changed ? 'is-changed' : ''}`}>
      <div className="ctl__head">
        <label htmlFor={id}>{def.label}</label>
        <span className={`ctl__scope is-${def.scope}`}>{SCOPE_LABEL[def.scope]}</span>
        {changed && <button className="ctl__reset" onClick={onReset} title={`Back to ${formatValue(def, base)}`}>Reset</button>}
      </div>
      {def.type === 'color' && (
        <div className="ctl__color">
          <input id={id} type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'} onChange={(e) => onChange(e.target.value.toUpperCase())} />
          <input aria-label={`${def.label} hex`} value={value} onChange={(e) => onChange(e.target.value.trim())} spellCheck={false} />
        </div>
      )}
      {def.type === 'range' && (
        <div className="ctl__range">
          <input id={id} type="range" min={def.min} max={def.max} step={def.step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
          <output htmlFor={id}>{value}{def.unit}</output>
        </div>
      )}
      {def.type === 'select' && (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {def.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      )}
      <small className="ctl__target">{def.target}</small>
    </div>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { api, readFileAsBase64 } from './api'

const isDraft = (t) => typeof t === 'string' && t.trim().startsWith('[')

// Text input for either a plain string or a { text, scaffold } value.
// Writing over a bracketed placeholder marks it as real content.
export function TextField({ label, value, onChange, multiline, rows = 3, hint, placeholder, type = 'text' }) {
  const id = useId()
  const obj = value && typeof value === 'object'
  const text = obj ? value.text : value ?? ''
  const draft = obj ? value.scaffold || isDraft(text) : isDraft(text)
  const emit = (t) => onChange(obj ? { text: t, scaffold: isDraft(t) } : t)
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div className="au-field">
      <label htmlFor={id}>{label} {draft && <span className="au-tag">Placeholder</span>}</label>
      <Tag id={id} type={multiline ? undefined : type} rows={multiline ? rows : undefined} value={text} placeholder={placeholder} onChange={(e) => emit(e.target.value)} />
      {hint && <small>{hint}</small>}
    </div>
  )
}

export function Check({ label, checked, onChange }) {
  return (
    <label className="check"><input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} /> {label}</label>
  )
}

export function MoveButtons({ index, length, onMove, label }) {
  return (
    <>
      <button className="mini" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`Move ${label} up`}>↑</button>
      <button className="mini" disabled={index === length - 1} onClick={() => onMove(index, index + 1)} aria-label={`Move ${label} down`}>↓</button>
    </>
  )
}

export const move = (arr, from, to) => {
  const copy = arr.slice()
  const [x] = copy.splice(from, 1)
  copy.splice(to, 0, x)
  return copy
}

let mediaCache = null
const RATIOS = [['16 / 9', '16:9'], ['16 / 10', '16:10'], ['4 / 3', '4:3'], ['3 / 2', '3:2'], ['4 / 5', '4:5 (portrait)'], ['1 / 1', 'Square']]

// Pick or upload an image into public/media; edit alt text, caption, fit and shape.
export function MediaField({ label, value, onChange, accept = 'image/*' }) {
  const [library, setLibrary] = useState(mediaCache || [])
  const [state, setState] = useState(null)
  const input = useRef(null)
  const m = value || {}
  const set = (patch) => onChange({ ...m, ...patch })

  useEffect(() => {
    if (mediaCache) return
    api.media().then((r) => { if (r.ok) { mediaCache = r.data.items; setLibrary(r.data.items) } })
  }, [])

  const upload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 15 * 1024 * 1024) return setState({ kind: 'error', msg: 'That file is over 15 MB. Export a smaller version first.' })
    setState({ kind: 'info', msg: `Uploading ${file.name}…` })
    try {
      const r = await api.upload(file.name, await readFileAsBase64(file))
      if (!r.ok) return setState({ kind: 'error', msg: r.data.message || 'Upload failed.' })
      mediaCache = [...(mediaCache || []), r.data.src].sort()
      setLibrary(mediaCache)
      set({ src: r.data.src })
      setState({ kind: 'ok', msg: `Added to public/media. Save to keep it on the page${m.alt ? '' : ' — and describe it in Alt text'}.` })
    } catch (err) {
      setState({ kind: 'error', msg: err.message })
    }
  }

  const isImage = m.src && !/\.(pdf|mp4|webm)$/i.test(m.src)
  return (
    <div className="card">
      <div className="card__head"><strong>{label}</strong>{!m.src && <span className="au-tag">Placeholder</span>}</div>
      <div className="media-field">
        <div className="media-field__thumb">{isImage ? <img src={m.src} alt="" /> : m.src ? m.src.split('/').pop() : 'No image yet'}</div>
        <div>
          <div className="au-row" style={{ marginTop: 0 }}>
            <button onClick={() => input.current?.click()}>Upload…</button>
            <input ref={input} type="file" accept={accept} hidden onChange={upload} />
            {m.src && <button className="is-quiet" onClick={() => set({ src: '' })}>Remove image</button>}
          </div>
          {library.length > 0 && (
            <label className="au-field">Or choose an uploaded file
              <select value={library.includes(m.src) ? m.src : ''} onChange={(e) => e.target.value && set({ src: e.target.value })}>
                <option value="">—</option>
                {library.map((src) => <option key={src} value={src}>{src.replace('/media/', '')}</option>)}
              </select>
            </label>
          )}
        </div>
      </div>
      {state && <p className={`au-status is-${state.kind}`} style={{ marginTop: 10 }}>{state.msg}</p>}
      {'alt' in m && <TextField label="Alt text (describe the image)" value={m.alt} onChange={(v) => set({ alt: v })} hint={m.src && !m.alt ? 'Needed for people using screen readers.' : undefined} />}
      {'caption' in m && <TextField label="Caption (optional)" value={m.caption} onChange={(v) => set({ caption: v })} />}
      <div className="au-row">
        {'ratio' in m && (
          <label className="au-field" style={{ flex: 1 }}>Shape
            <select value={m.ratio} onChange={(e) => set({ ratio: e.target.value })}>
              {RATIOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              {!RATIOS.some(([v]) => v === m.ratio) && <option value={m.ratio}>{m.ratio}</option>}
            </select>
          </label>
        )}
        {'fit' in m && (
          <label className="au-field" style={{ flex: 1 }}>Fit
            <select value={m.fit} onChange={(e) => set({ fit: e.target.value })}>
              <option value="cover">Fill the frame (crop edges)</option>
              <option value="contain">Show whole image</option>
            </select>
          </label>
        )}
      </div>
    </div>
  )
}

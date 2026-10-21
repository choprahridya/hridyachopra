// Client for the local authoring API (authoring/server-plugin.js).
const BASE = '/__authoring/api'

async function call(method, path, payload) {
  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers: payload ? { 'Content-Type': 'application/json' } : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    })
  } catch {
    return { ok: false, status: 0, data: { message: 'Couldn’t reach the local server. Is `npm run dev` still running?' } }
  }
  let data = {}
  try { data = await res.json() } catch { /* empty body */ }
  return { ok: res.ok, status: res.status, data }
}

export const api = {
  state: () => call('GET', '/state'),
  saveContent: (site, baseRevision, force = false) => call('POST', '/content', { site, baseRevision, force }),
  saveSettings: (settings, baseRevision, force = false) => call('POST', '/settings', { settings, baseRevision, force }),
  history: () => call('GET', '/history'),
  snapshot: (file) => call('GET', `/history/${encodeURIComponent(file)}`),
  presets: () => call('GET', '/presets'),
  savePreset: (preset) => call('POST', '/presets', preset),
  deletePreset: (id) => call('DELETE', `/presets/${encodeURIComponent(id)}`),
  media: () => call('GET', '/media'),
  upload: (name, dataBase64) => call('POST', '/media', { name, dataBase64 }),
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(new Error('Couldn’t read that file.'))
    r.readAsText(file)
  })
}

export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] || '')
    r.onerror = () => reject(new Error('Couldn’t read that file.'))
    r.readAsDataURL(file)
  })
}

// Browser storage is a convenience only; every call tolerates it being unavailable.
export const local = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)) } catch { return null } },
  set(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true } catch { return false } },
  remove(key) { try { localStorage.removeItem(key) } catch { /* ignore */ } },
}

// Immutable get/set by dotted path ("projects.0.title").
export function getIn(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
}
export function setIn(obj, path, value) {
  const [k, ...rest] = path.split('.')
  const key = Array.isArray(obj) ? Number(k) : k
  const copy = Array.isArray(obj) ? obj.slice() : { ...obj }
  copy[key] = rest.length ? setIn(obj?.[key] ?? {}, rest.join('.'), value) : value
  return copy
}

// Paths that differ between two JSON values (for change summaries).
export function diffPaths(a, b, path = '', out = []) {
  if (JSON.stringify(a) === JSON.stringify(b)) return out
  const objA = a && typeof a === 'object'
  const objB = b && typeof b === 'object'
  if (!objA || !objB || Array.isArray(a) !== Array.isArray(b) || (Array.isArray(a) && a.length !== b.length)) {
    out.push(path || '(everything)')
    return out
  }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], path ? `${path}.${k}` : k, out)
  return out
}

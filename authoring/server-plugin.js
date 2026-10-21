// Local authoring API for the design lab and dashboard.
// Runs only inside the Vite dev server (configureServer); nothing here is in the public build.
//
//   GET  /__authoring/api/state            content + settings + their revisions
//   POST /__authoring/api/content          { site, baseRevision, force? }  -> 409 on stale baseRevision
//   POST /__authoring/api/settings         { settings, baseRevision, force? }
//   GET  /__authoring/api/history          snapshots (newest first)
//   GET  /__authoring/api/history/:file    one snapshot
//   GET  /__authoring/api/presets          saved lab explorations
//   POST /__authoring/api/presets          { id?, name, notes, settings }
//   DELETE /__authoring/api/presets/:id
//   GET  /__authoring/api/media            files in public/media
//   POST /__authoring/api/media            { name, dataBase64 }

import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { migrateSite, migrateSettings, validateSite } from '../src/content/schema.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FILES = {
  site: path.join(ROOT, 'src/content/site.json'),
  settings: path.join(ROOT, 'src/content/settings.json'),
}
const HISTORY = path.join(ROOT, 'authoring/history')
const PRESETS = path.join(ROOT, 'authoring/presets')
const MEDIA = path.join(ROOT, 'public/media')
const HISTORY_LIMIT = 60
const MAX_UPLOAD = 15 * 1024 * 1024
const MEDIA_TYPES = /\.(png|jpe?g|webp|avif|gif|svg|pdf|mp4|webm)$/i

const rev = (text) => crypto.createHash('sha1').update(text).digest('hex').slice(0, 12)
const stamp = () => new Date().toISOString().replace(/[:.]/g, '-')
const safeName = (n) => n.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')

async function readJson(file) {
  const text = await fs.readFile(file, 'utf8')
  return { text, data: JSON.parse(text), revision: rev(text) }
}

async function atomicWrite(file, text) {
  const tmp = `${file}.${process.pid}.tmp`
  await fs.writeFile(tmp, text)
  await fs.rename(tmp, file)
}

async function pruneHistory() {
  const files = (await fs.readdir(HISTORY)).filter((f) => f.endsWith('.json')).sort()
  const excess = files.length - HISTORY_LIMIT
  for (const f of files.slice(0, Math.max(0, excess))) {
    if (!f.includes('before-migration')) await fs.unlink(path.join(HISTORY, f))
  }
}

function body(req, limit = MAX_UPLOAD * 1.4) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > limit) { reject(Object.assign(new Error('Upload is too large (15 MB max).'), { status: 413 })); req.destroy() }
      else chunks.push(c)
    })
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}) }
      catch { reject(Object.assign(new Error('Request was not valid JSON.'), { status: 400 })) }
    })
    req.on('error', reject)
  })
}

const send = (res, status, data) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

export default function authoringApi() {
  let server
  let suppressUntil = 0 // our own write already announced itself

  // Shared save: revision check, snapshot of the previous file, atomic write.
  async function save(kind, value, baseRevision, force) {
    const file = FILES[kind]
    const current = await readJson(file)
    if (!force && baseRevision !== current.revision) {
      return [409, { error: 'stale', message: 'This file changed since you opened it.', current: current.data, revision: current.revision }]
    }
    const text = JSON.stringify(value, null, 2) + '\n'
    if (text === current.text) return [200, { revision: current.revision, unchanged: true }]
    await fs.mkdir(HISTORY, { recursive: true })
    await fs.writeFile(path.join(HISTORY, `${kind}-${stamp()}.json`), current.text)
    await pruneHistory()
    suppressUntil = Date.now() + 3000
    await atomicWrite(file, text)
    server?.ws.send({ type: 'custom', event: 'portfolio:content-saved', data: { kind } })
    return [200, { revision: rev(text), file: path.relative(ROOT, file) }]
  }

  const routes = {
    'GET /state': async () => {
      const [site, settings] = await Promise.all([readJson(FILES.site), readJson(FILES.settings)])
      return [200, { site: site.data, siteRevision: site.revision, settings: settings.data, settingsRevision: settings.revision }]
    },
    'POST /content': async (req) => {
      const { site, baseRevision, force } = await body(req)
      let migrated
      try { migrated = migrateSite(site) } catch (e) { return [422, { error: 'schema', message: e.message }] }
      const errors = validateSite(migrated)
      if (errors.length) return [422, { error: 'invalid', errors }]
      return save('site', migrated, baseRevision, force)
    },
    'POST /settings': async (req) => {
      const { settings, baseRevision, force } = await body(req)
      let migrated
      try { migrated = migrateSettings(settings) } catch (e) { return [422, { error: 'schema', message: e.message }] }
      return save('settings', migrated, baseRevision, force)
    },
    'GET /history': async () => {
      await fs.mkdir(HISTORY, { recursive: true })
      const files = (await fs.readdir(HISTORY)).filter((f) => f.endsWith('.json')).sort().reverse()
      return [200, { items: files.map((f) => ({ file: f, kind: f.split('-')[0] })) }]
    },
    'GET /history/:file': async (req, file) => {
      if (!/^[\w.-]+\.json$/.test(file)) return [400, { error: 'bad name' }]
      return [200, JSON.parse(await fs.readFile(path.join(HISTORY, file), 'utf8'))]
    },
    'GET /presets': async () => {
      await fs.mkdir(PRESETS, { recursive: true })
      const files = (await fs.readdir(PRESETS)).filter((f) => f.endsWith('.json'))
      const items = await Promise.all(files.map(async (f) => JSON.parse(await fs.readFile(path.join(PRESETS, f), 'utf8'))))
      return [200, { items: items.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')) }]
    },
    'POST /presets': async (req) => {
      const p = await body(req)
      if (!p.name?.trim()) return [422, { error: 'invalid', message: 'Give the exploration a name.' }]
      const id = p.id && /^[a-z0-9-]+$/.test(p.id) ? p.id : `${safeName(p.name).slice(0, 40) || 'exploration'}-${Date.now().toString(36)}`
      const preset = {
        format: 'hc-portfolio-preset', version: 1, id, name: p.name.trim(), notes: p.notes || '',
        settings: migrateSettings(p.settings), updatedAt: new Date().toISOString(),
      }
      await fs.mkdir(PRESETS, { recursive: true })
      await atomicWrite(path.join(PRESETS, `${id}.json`), JSON.stringify(preset, null, 2) + '\n')
      return [200, preset]
    },
    'DELETE /presets/:id': async (req, id) => {
      if (!/^[a-z0-9-]+$/.test(id)) return [400, { error: 'bad id' }]
      await fs.unlink(path.join(PRESETS, `${id}.json`))
      return [200, { ok: true }]
    },
    'GET /media': async () => {
      await fs.mkdir(MEDIA, { recursive: true })
      const files = (await fs.readdir(MEDIA)).filter((f) => MEDIA_TYPES.test(f)).sort()
      return [200, { items: files.map((f) => `/media/${f}`) }]
    },
    'POST /media': async (req) => {
      const { name, dataBase64 } = await body(req)
      const clean = safeName(name || '')
      if (!MEDIA_TYPES.test(clean)) return [422, { error: 'type', message: 'Use an image (png, jpg, webp, avif, gif, svg), PDF or video file.' }]
      const buf = Buffer.from(dataBase64 || '', 'base64')
      if (!buf.length) return [422, { error: 'empty', message: 'The file was empty.' }]
      if (buf.length > MAX_UPLOAD) return [413, { error: 'size', message: 'File is larger than 15 MB.' }]
      await fs.mkdir(MEDIA, { recursive: true })
      let final = clean
      const ext = path.extname(clean)
      for (let i = 2; await fs.stat(path.join(MEDIA, final)).then(() => true, () => false); i++) {
        final = `${path.basename(clean, ext)}-${i}${ext}`
      }
      await fs.writeFile(path.join(MEDIA, final), buf)
      return [200, { src: `/media/${final}` }]
    },
  }

  return {
    name: 'portfolio-authoring-api',
    apply: 'serve',
    configureServer(s) {
      server = s
      s.middlewares.use('/__authoring/api', async (req, res) => {
        const url = new URL(req.url, 'http://local')
        const [, seg1, seg2] = url.pathname.split('/')
        const key = `${req.method} /${seg1}${seg2 ? '/:' : ''}${seg2 ? (seg1 === 'presets' ? 'id' : 'file') : ''}`
        const handler = routes[key]
        if (!handler) return send(res, 404, { error: 'not found' })
        try {
          const [status, data] = await handler(req, seg2 && decodeURIComponent(seg2))
          send(res, status, data)
        } catch (e) {
          send(res, e.status || 500, { error: 'server', message: e.message })
        }
      })
    },
    // Content files never hot-reload the page: the lab/dashboard keep their drafts and
    // detect the change on save (revision check); public tabs reload via this event.
    handleHotUpdate(ctx) {
      if (!Object.values(FILES).includes(ctx.file)) return
      if (Date.now() >= suppressUntil) ctx.server.ws.send({ type: 'custom', event: 'portfolio:content-saved', data: { external: true } })
      return []
    },
  }
}

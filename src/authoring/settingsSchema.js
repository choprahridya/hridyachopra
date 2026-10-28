import { DEFAULT_SETTINGS, SETTINGS_VERSION, migrateSettings } from '../content/schema'
import { getIn, setIn } from './api'

// Every lab control: stable id (= settings path), label, type, range/options, unit,
// breakpoint scope and what it affects on the site.
export const SETTINGS = [
  { id: 'colors.accent', group: 'Colour', label: 'Accent & headings', type: 'color', scope: 'all', target: 'Name, headings, links, focus ring' },
  { id: 'colors.ink', group: 'Colour', label: 'Body text', type: 'color', scope: 'all', target: 'Paragraphs, statement' },
  { id: 'colors.bg', group: 'Colour', label: 'Background', type: 'color', scope: 'all', target: 'Page background' },
  { id: 'colors.surface', group: 'Colour', label: 'Image surfaces', type: 'color', scope: 'all', target: 'Media frames, hover rows' },
  { id: 'colors.muted', group: 'Colour', label: 'Secondary text', type: 'color', scope: 'all', target: 'Labels, placeholders, metadata' },
  { id: 'colors.line', group: 'Colour', label: 'Rules & borders', type: 'color', scope: 'all', target: 'Dividers, frame borders' },
  { id: 'colors.accentSoft', group: 'Colour', label: 'Soft accent', type: 'color', scope: 'all', target: 'Placeholder grid, text selection' },

  { id: 'type.heroMaxRem', group: 'Type', label: 'Hero name size', type: 'range', min: 5, max: 11, step: 0.25, unit: 'rem', scope: 'desktop', target: 'Home hero name (wide screens)' },
  { id: 'type.heroMinRem', group: 'Type', label: 'Hero name size', type: 'range', min: 2.6, max: 4.6, step: 0.1, unit: 'rem', scope: 'phone', target: 'Home hero name (phones)' },
  { id: 'type.bodyPx', group: 'Type', label: 'Body text size', type: 'range', min: 14, max: 19, step: 0.5, unit: 'px', scope: 'all', target: 'All running text' },

  { id: 'layout.maxWidthPx', group: 'Layout & spacing', label: 'Content width', type: 'range', min: 960, max: 1440, step: 20, unit: 'px', scope: 'desktop', target: 'Maximum width of every page' },
  { id: 'layout.gutterMaxPx', group: 'Layout & spacing', label: 'Side margin', type: 'range', min: 24, max: 96, step: 4, unit: 'px', scope: 'desktop', target: 'Page edges (wide screens)' },
  { id: 'layout.gutterMinPx', group: 'Layout & spacing', label: 'Side margin', type: 'range', min: 12, max: 32, step: 2, unit: 'px', scope: 'phone', target: 'Page edges (phones)' },
  { id: 'layout.sectionScale', group: 'Layout & spacing', label: 'Space between sections', type: 'range', min: 0.6, max: 1.6, step: 0.05, unit: '×', scope: 'all', target: 'Vertical rhythm on Home, Work, About' },

  { id: 'media.radiusPx', group: 'Media', label: 'Image corner radius', type: 'range', min: 0, max: 24, step: 1, unit: 'px', scope: 'all', target: 'Covers, portrait, case-study images' },
  { id: 'media.coverRatio', group: 'Media', label: 'Work cover shape', type: 'select', scope: 'all', target: 'Covers in the work list',
    options: [['16 / 10', '16:10'], ['4 / 3', '4:3'], ['3 / 2', '3:2'], ['1 / 1', 'Square']] },

  { id: 'variants.heroLayout', group: 'Layout variants', label: 'Home first screen', type: 'select', scope: 'all', target: 'Carousel version needs the carousel switched on in the dashboard',
    options: [['type', 'Name, statement & introduction'], ['carousel', 'Name & project carousel only'], ['editorial', 'Dark editorial panel (statement, facts, project visual)']] },
  { id: 'variants.hero', group: 'Layout variants', label: 'Hero arrangement', type: 'select', scope: 'desktop', target: 'Name, statement & introduction version (phones always stack)',
    options: [['split', 'Statement on the right'], ['stacked', 'Everything left-aligned']] },
  { id: 'variants.background', group: 'Layout variants', label: 'Page background', type: 'select', scope: 'all', target: 'Behind all content (hero-only fades out at the bottom of the landing hero)',
    options: [['plain', 'Plain colour'], ['waterHero', 'Moving water in the landing hero only'], ['water', 'Moving water on every page']] },
  { id: 'variants.ripples', group: 'Layout variants', label: 'Ripples when clicking the background', type: 'select', scope: 'all', target: 'Every page (not on links, buttons or the carousel)',
    options: [['off', 'Off'], ['on', 'On']] },
]

export const SCOPE_LABEL = { all: 'All sizes', phone: 'Phone', desktop: 'Desktop' }
const HEX = /^#[0-9a-f]{6}$/i

export function checkValue(def, v) {
  if (def.type === 'color') return HEX.test(v) ? null : 'needs a 6-digit hex colour like #2343B0'
  if (def.type === 'range') return typeof v === 'number' && v >= def.min && v <= def.max ? null : `must be between ${def.min} and ${def.max}${def.unit}`
  if (def.type === 'select') return def.options.some(([o]) => o === v) ? null : `must be one of ${def.options.map((o) => o[1]).join(', ')}`
  return null
}

export function validateSettings(s) {
  return SETTINGS.map((d) => ({ d, e: checkValue(d, getIn(s, d.id)) })).filter((x) => x.e).map(({ d, e }) => `${d.label} (${SCOPE_LABEL[d.scope]}) ${e}`)
}

// Accepts an exported preset file (or bare settings), migrating older versions.
// Values that can't be applied fall back to the baseline and are reported.
export function importPreset(json, baseline) {
  const raw = json?.format === 'hc-portfolio-preset' ? json.settings : json
  if (!raw || typeof raw !== 'object' || !raw.colors) throw new Error('This file isn’t a portfolio design preset.')
  const migrated = migrateSettings(raw)
  const notes = []
  let out = baseline
  for (const d of SETTINGS) {
    const v = getIn(migrated, d.id)
    const e = checkValue(d, v)
    if (e) notes.push(`${d.label} (${SCOPE_LABEL[d.scope]}): kept current value — imported value ${e}.`)
    else out = setIn(out, d.id, v)
  }
  const known = new Set(SETTINGS.map((d) => d.id))
  for (const g of Object.keys(raw)) {
    if (g === 'schemaVersion' || typeof raw[g] !== 'object') continue
    for (const k of Object.keys(raw[g])) if (!known.has(`${g}.${k}`) && !(g === 'type' && k === 'heroSize') && !(g === 'layout' && /^(maxWidth|gutter)$/.test(k))) notes.push(`Ignored unknown setting “${g}.${k}”.`)
  }
  return { settings: { ...out, schemaVersion: SETTINGS_VERSION }, notes, name: json?.name, notesText: json?.notes || '' }
}

export const presetFile = (name, notes, settings) => ({
  format: 'hc-portfolio-preset', version: 1, settingsSchemaVersion: SETTINGS_VERSION,
  name, notes, settings, exportedAt: new Date().toISOString(),
})

export const formatValue = (d, v) =>
  d.type === 'select' ? d.options.find(([o]) => o === v)?.[1] ?? v : d.type === 'range' ? `${v}${d.unit}` : v

export { DEFAULT_SETTINGS }

// WCAG contrast ratio between two hex colours.
export function contrast(a, b) {
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  }
  if (!HEX.test(a) || !HEX.test(b)) return 0
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

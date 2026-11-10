import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// Landing-hero 3D piece: an engineered flower — three rings of curved glass petals, each framed in thin
// steel (spine, edge rails, cross ribs, polished joints) around a glowing blue core with turning rings,
// on a thin steel stem, over a dark starry sky. Opens ring by ring on load, then breathes and turns; it
// leans toward the pointer and petals near it open further. Style inspired by an owner-supplied
// "mechanical flower" demo; original code and design, in this site's blues. Paused off-screen and in
// hidden tabs; renders a single still frame with reduced motion.

const RINGS = [
  { n: 14, L: 1.0, W: 0.2, r0: 0.17, closed: 0.18, open: 1.32, bend: 0.22, cup: 0.5 },
  { n: 11, L: 0.78, W: 0.17, r0: 0.12, closed: 0.12, open: 0.98, bend: 0.32, cup: 0.6 },
  { n: 8, L: 0.52, W: 0.14, r0: 0.07, closed: 0.06, open: 0.62, bend: 0.45, cup: 0.7 },
]
const clamp01 = (x) => Math.min(1, Math.max(0, x))
const mix = (a, b, t) => a + (b - a) * t
const easeOutBack = (t) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) }

// Petal in its hinge space: length along +Y, width along X, curling towards -Z (upwards once opened).
function petalPoint(ring, u, v) {
  const s = u * ring.L
  const hw = ring.W * Math.pow(Math.max(Math.sin(Math.PI * Math.pow(u, 0.85)), 0), 0.7)
  return new THREE.Vector3(v * hw, s, -ring.bend * s * s / ring.L - ring.cup * v * v * hw)
}

function buildPetal(ring) {
  // glass membrane
  const SU = 28, SV = 10, pos = [], idx = []
  for (let i = 0; i <= SU; i++) for (let j = 0; j <= SV; j++) {
    const p = petalPoint(ring, i / SU, (j / SV) * 2 - 1); pos.push(p.x, p.y, p.z)
  }
  for (let i = 0; i < SU; i++) for (let j = 0; j < SV; j++) {
    const a = i * (SV + 1) + j, b = a + SV + 1
    idx.push(a, b, a + 1, b, b + 1, a + 1)
  }
  const glass = new THREE.BufferGeometry()
  glass.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  glass.setIndex(idx); glass.computeVertexNormals()

  // steel frame: spine, two edge rails, cross ribs, joints
  const tube = (pts, r) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(8, pts.length * 3), r, 6, false)
  const line = (n, f) => Array.from({ length: n + 1 }, (_, k) => f(k / n))
  const frame = [
    tube(line(20, (u) => petalPoint(ring, u * 0.99, 0).add(new THREE.Vector3(0, 0, -0.004))), 0.0075),
    tube(line(24, (u) => petalPoint(ring, 0.02 + u * 0.97, -1)), 0.004),
    tube(line(24, (u) => petalPoint(ring, 0.02 + u * 0.97, 1)), 0.004),
  ]
  const joints = []
  for (const u of [0.22, 0.42, 0.62, 0.8]) {
    frame.push(tube(line(10, (t) => petalPoint(ring, u, t * 2 - 1)), 0.0032))
    const j = new THREE.SphereGeometry(0.013, 10, 8); const c = petalPoint(ring, u, 0); j.translate(c.x, c.y, c.z - 0.004); joints.push(j)
  }
  const tip = new THREE.SphereGeometry(0.011, 10, 8); const tp = petalPoint(ring, 0.99, 0); tip.translate(tp.x, tp.y, tp.z); joints.push(tip)
  const steel = mergeGeometries(frame); frame.forEach((g) => g.dispose())
  const knobs = mergeGeometries(joints); joints.forEach((g) => g.dispose())
  return { glass, steel, knobs, tipLocal: petalPoint(ring, 0.8, 0) }
}

function skyTexture() {
  const c = document.createElement('canvas'); c.width = 4; c.height = 512
  const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 512)
  g.addColorStop(0, '#020309'); g.addColorStop(0.55, '#060c24'); g.addColorStop(1, '#13285A')
  x.fillStyle = g; x.fillRect(0, 0, 4, 512)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

export default function SteelBloom() {
  const ref = useRef(null)

  useEffect(() => {
    const host = ref.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer
    try { renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' }) } catch { return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = skyTexture()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    camera.position.set(0, 0.25, 6.2)
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.5
    pmrem.dispose()

    // materials
    const M = {
      steel: new THREE.MeshStandardMaterial({ color: '#c3cfe4', metalness: 1, roughness: 0.26 }),
      blued: new THREE.MeshStandardMaterial({ color: '#7b98d6', metalness: 1, roughness: 0.32 }),
      polish: new THREE.MeshStandardMaterial({ color: '#e7eefb', metalness: 1, roughness: 0.12 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#9cc0ff', metalness: 0, roughness: 0.2, transparent: true, opacity: 0.2, side: THREE.DoubleSide,
        depthWrite: false, emissive: '#1d46b8', emissiveIntensity: 0.12, iridescence: 0.55, iridescenceIOR: 1.6,
      }),
      core: new THREE.MeshBasicMaterial({ color: new THREE.Color('#cfe2ff').multiplyScalar(2.2) }),
    }

    // flower: placed (position/scale per layout) -> lean (pointer) -> spin (slow turn)
    const place = new THREE.Group(); scene.add(place)
    const lean = new THREE.Group(); place.add(lean)
    const spin = new THREE.Group(); lean.add(spin)

    const petals = []
    RINGS.forEach((ring, k) => {
      const geo = buildPetal(ring)
      for (let i = 0; i < ring.n; i++) {
        const phi = (i / ring.n) * Math.PI * 2 + k * 0.37
        const hinge = new THREE.Group()
        hinge.position.set(Math.sin(phi) * ring.r0, 0.01 * k, Math.cos(phi) * ring.r0)
        hinge.rotation.order = 'YXZ'; hinge.rotation.y = phi
        const glass = new THREE.Mesh(geo.glass, M.glass); glass.renderOrder = 2
        hinge.add(glass, new THREE.Mesh(geo.steel, k === 0 ? M.steel : M.blued), new THREE.Mesh(geo.knobs, M.polish))
        spin.add(hinge)
        petals.push({ hinge, ring, k, phase: Math.random() * 6.28, push: 0, tip: geo.tipLocal })
      }
    })

    // hub, core, rings, stem
    const dish = new THREE.Mesh(new THREE.LatheGeometry([[0, -0.1], [0.08, -0.09], [0.15, -0.055], [0.2, -0.01], [0.19, 0], [0, 0]].map(([r, y]) => new THREE.Vector2(r, y)), 48), M.steel)
    spin.add(dish)
    const coreBall = new THREE.Mesh(new THREE.SphereGeometry(0.045, 24, 16), M.core); coreBall.position.y = 0.12; spin.add(coreBall)
    const coreLight = new THREE.PointLight('#8fb6ff', 0.8, 2, 2); coreLight.position.y = 0.12; spin.add(coreLight)
    const orbit = [0.07, 0.095].map((r, i) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 8, 64), i ? M.polish : M.blued)
      m.position.y = 0.12; m.rotation.set(0.6 + i, i * 0.8, 0); spin.add(m); return m
    })
    const stemCurve = new THREE.CatmullRomCurve3([[0, -0.08, 0], [0.02, -0.9, -0.05], [0.07, -2.0, -0.08], [0.05, -3.4, 0]].map((p) => new THREE.Vector3(...p)))
    const stem = new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 80, 0.018, 10, false), M.steel)
    lean.add(stem)

    // stars
    const N = 240, sp = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) { sp[i * 3] = (Math.random() - 0.5) * 26; sp[i * 3 + 1] = (Math.random() - 0.4) * 14; sp[i * 3 + 2] = -8 - Math.random() * 10 }
    const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#cddcff', size: 0.035, sizeAttenuation: true, transparent: true, opacity: 0.8, depthWrite: false }))
    scene.add(stars)
    const key = new THREE.DirectionalLight('#eef3ff', 1.1); key.position.set(-3, 4, 5); scene.add(key)

    // post: bloom on the bright core and highlights
    const target = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 })
    const composer = new EffectComposer(renderer, target)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.4, 0.95)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    // layout: flower on the right on wide screens, centred below the text on phones
    const layout = () => {
      const w = host.clientWidth, h = host.clientHeight
      renderer.setSize(w, h, false); composer.setSize(w, h)
      camera.aspect = w / h; camera.updateProjectionMatrix()
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z, halfW = halfH * camera.aspect
      if (w >= 860) { place.position.set(halfW * 0.42, -0.05, 0); place.scale.setScalar(1) }
      else { place.position.set(0, -halfH * 0.48, 0); place.scale.setScalar(Math.min(0.85, halfW / 1.35)) }
    }
    layout()

    const ptr = { x: 0, y: 0, on: 0, sx: 0, sy: 0, act: 0 }
    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      ptr.on = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0
      ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1; ptr.y = 1 - ((e.clientY - r.top) / r.height) * 2
    }

    const v = new THREE.Vector3()
    let raf = 0, last = performance.now(), t = reduced ? 4 : 0, visible = true
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 1 / 20); last = now
      t += dt
      ptr.sx += (ptr.x * ptr.on - ptr.sx) * Math.min(1, dt * 2.5); ptr.sy += (ptr.y * ptr.on - ptr.sy) * Math.min(1, dt * 2.5)
      ptr.act += (ptr.on - ptr.act) * Math.min(1, dt * 4)

      lean.rotation.x = 0.55 - ptr.sy * 0.08 + Math.sin(t * 0.4) * 0.015
      lean.rotation.z = -ptr.sx * 0.09 + Math.sin(t * 0.33) * 0.02
      spin.rotation.y += dt * 0.07
      orbit[0].rotation.y += dt * 0.6; orbit[1].rotation.x += dt * 0.45
      coreLight.intensity = 0.8 + Math.sin(t * 1.6) * 0.15

      for (const p of petals) {
        const e = easeOutBack(clamp01((t - 0.35 - p.k * 0.28) / 1.7))
        // petals whose tip is near the pointer open a little further
        p.hinge.localToWorld(v.copy(p.tip)).project(camera)
        const d = Math.hypot((v.x - ptr.x) * camera.aspect, v.y - ptr.y)
        const want = Math.exp(-(d * d) / 0.035) * ptr.act
        p.push += (want - p.push) * Math.min(1, dt * 5)
        p.hinge.rotation.x = mix(p.ring.closed, p.ring.open, e) + Math.sin(t * 0.8 + p.phase) * 0.025 + p.push * 0.32
      }
      stars.rotation.y = Math.sin(t * 0.02) * 0.05
      composer.render()
      if (reduced) cancelAnimationFrame(raf)
    }
    const run = () => { cancelAnimationFrame(raf); if (visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; run() }); io.observe(host)
    const ro = new ResizeObserver(layout); ro.observe(host)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', run)
    run()

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', run)
      scene.traverse((o) => { o.geometry?.dispose?.() })
      Object.values(M).forEach((m) => m.dispose())
      scene.background?.dispose(); scene.environment?.dispose(); target.dispose(); composer.dispose?.(); renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={ref} className="steel-bloom" aria-hidden="true" />
}

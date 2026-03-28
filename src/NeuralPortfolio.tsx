import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { NEURAL_LAYERS } from './data/neural-layers'
import type { NeuralNode } from './data/neural-layers'

// ─── Emoji canvas texture helper ─────────────────────────────────────────────
function makeEmojiTexture(icon: string, size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width  = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  ctx.font         = `${Math.round(size * 0.52)}px serif`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(icon, size / 2, size / 2 + 2)
  return new THREE.CanvasTexture(canvas)
}

// ─── Text label sprite texture ────────────────────────────────────────────────
function makeTextSprite(text: string, hexColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width  = 320
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 320, 64)
  ctx.font = 'bold 26px "Outfit", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = hexColor
  ctx.globalAlpha = 0.9
  ctx.fillText(text.toUpperCase(), 160, 32)
  return new THREE.CanvasTexture(canvas)
}

// ─── Color + Size maps ────────────────────────────────────────────────────────
const NODE_COLOR: Record<string, number> = {
  input:   0x00d4ff,
  achieve: 0xf59e0b,
  like:    0x10b981,
  output:  0xec4899,
  default: 0x7c9fff,
}

const NODE_SIZE: Record<string, number> = {
  input:   0.68,
  achieve: 0.50,
  like:    0.50,
  output:  0.74,
  default: 0.44,
}

// Map layer x-percentage to 3D world X coordinate
function mapX(xPct: number): number {
  return ((xPct - 8) / (91 - 8)) * 30 - 15
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NeuralPortfolio() {
  const [heroVisible, setHeroVisible]     = useState(true)
  const [networkActive, setNetworkActive] = useState(false)
  const [activeNodeState, setActiveNodeState] = useState<NeuralNode | null>(null)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  const mountRef      = useRef<HTMLDivElement>(null)
  const panelRef      = useRef<HTMLDivElement>(null)
  const heroRef       = useRef<HTMLDivElement>(null)

  // Three.js internals
  const sceneRef       = useRef<THREE.Scene | null>(null)
  const cameraRef      = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef    = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef       = useRef<number>(0)
  const clockRef       = useRef(new THREE.Clock())

  const nodeGroupMap   = useRef(new Map<string, THREE.Group>())
  const lineMap        = useRef(new Map<string, THREE.Line>())
  const meshNodeIdMap  = useRef(new Map<string, string>()) // mesh.uuid → nodeId
  const clickableMeshes = useRef<THREE.Mesh[]>([])
  const nodeAnimData   = useRef<Array<{ id: string; group: THREE.Group; baseY: number; phase: number; spd: number }>>([])

  const raycaster      = useRef(new THREE.Raycaster())
  const mouse          = useRef(new THREE.Vector2())
  const hoveredId      = useRef<string | null>(null)
  const activeNodeRef  = useRef<NeuralNode | null>(null)

  // ─── Build Three.js scene ──────────────────────────────────────────────────
  useEffect(() => {
    if (!networkActive || !mountRef.current) return

    const mount = mountRef.current
    const W = mount.clientWidth
    const H = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050a14)
    scene.fog = new THREE.FogExp2(0x050a14, 0.008)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 300)
    camera.position.set(0, 3, 30)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ── Stars background ──────────────────────────────────────────────────────
    const starPositions = new Float32Array(4000 * 3)
    for (let i = 0; i < 4000; i++) {
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 300
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 150
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 300
    }
    const starsGeo = new THREE.BufferGeometry()
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.08, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })))

    // ── Nebula cloud (large transparent sphere for atmosphere) ────────────────
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x0a1628, transparent: true, opacity: 0.3,
      side: THREE.BackSide, depthWrite: false,
    })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(120, 32, 32), nebulaMat))

    // ── Build neural nodes ────────────────────────────────────────────────────
    const worldPositions = new Map<string, THREE.Vector3>()
    const newClickableMeshes: THREE.Mesh[] = []

    NEURAL_LAYERS.forEach(layer => {
      const lx    = mapX(layer.x)
      const count = layer.nodes.length

      layer.nodes.forEach((node, i) => {
        const spread = count === 1 ? 0 : (count === 2 ? 2.2 : 3.8)
        const ly = (i - (count - 1) / 2) * spread
        const lz = (Math.random() - 0.5) * 2

        const color  = NODE_COLOR[node.type] ?? NODE_COLOR.default
        const radius = NODE_SIZE[node.type]  ?? NODE_SIZE.default
        const pos    = new THREE.Vector3(lx, ly, lz)
        worldPositions.set(node.id, pos)

        const group = new THREE.Group()
        group.position.copy(pos)

        // Inner solid sphere
        const innerGeo = new THREE.SphereGeometry(radius, 40, 40)
        const innerMat = new THREE.MeshBasicMaterial({ color })
        const innerMesh = new THREE.Mesh(innerGeo, innerMat)
        group.add(innerMesh)

        // Outer glow (large, additive)
        const outerGeo = new THREE.SphereGeometry(radius * 1.8, 32, 32)
        const outerMat = new THREE.MeshBasicMaterial({
          color, transparent: true, opacity: 0.06,
          blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
        })
        group.add(new THREE.Mesh(outerGeo, outerMat))

        // Mid glow
        const midGeo = new THREE.SphereGeometry(radius * 1.3, 32, 32)
        const midMat = new THREE.MeshBasicMaterial({
          color, transparent: true, opacity: 0.12,
          blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
        })
        group.add(new THREE.Mesh(midGeo, midMat))

        // Halo ring for input / output
        if (node.type === 'input' || node.type === 'output') {
          const ringGeo = new THREE.TorusGeometry(radius * 1.55, 0.035, 8, 80)
          const ringMat = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: 0.55,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
          const ring = new THREE.Mesh(ringGeo, ringMat)
          ring.rotation.x = Math.PI / 2.5
          group.add(ring)
        }

        // Outer ring pulse (all nodes)
        const pulseGeo = new THREE.TorusGeometry(radius * 1.9, 0.018, 6, 64)
        const pulseMat = new THREE.MeshBasicMaterial({
          color, transparent: true, opacity: 0.2,
          blending: THREE.AdditiveBlending, depthWrite: false,
        })
        const pulseRing = new THREE.Mesh(pulseGeo, pulseMat)
        pulseRing.rotation.x = Math.PI / 3
        pulseRing.userData.isPulseRing = true
        group.add(pulseRing)

        // Emoji sprite — billboards toward camera automatically
        const emojiTex = makeEmojiTexture(node.icon, 128)
        const spriteMat = new THREE.SpriteMaterial({
          map: emojiTex,
          transparent: true,
          depthWrite: false,
          sizeAttenuation: true,
        })
        const sprite = new THREE.Sprite(spriteMat)
        const spriteScale = radius * 1.25
        sprite.scale.set(spriteScale, spriteScale, 1)
        sprite.position.set(0, 0, radius * 0.6)
        group.add(sprite)

        // Text label below each node
        const labelColor = '#' + new THREE.Color(color).getHexString()
        const labelTex = makeTextSprite(node.label, labelColor)
        const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthWrite: false, sizeAttenuation: true })
        const labelSprite = new THREE.Sprite(labelMat)
        labelSprite.scale.set(2.8, 0.52, 1)
        labelSprite.position.set(0, -(radius + 0.72), 0)
        group.add(labelSprite)

        scene.add(group)
        nodeGroupMap.current.set(node.id, group)
        meshNodeIdMap.current.set(innerMesh.uuid, node.id)
        newClickableMeshes.push(innerMesh)

        nodeAnimData.current.push({
          id: node.id, group,
          baseY: ly,
          phase: Math.random() * Math.PI * 2,
          spd:   0.45 + Math.random() * 0.35,
        })
      })
    })

    clickableMeshes.current = newClickableMeshes

    // ── Build beam connections ─────────────────────────────────────────────────
    for (let i = 0; i < NEURAL_LAYERS.length - 1; i++) {
      const fromLayer = NEURAL_LAYERS[i]
      const toLayer   = NEURAL_LAYERS[i + 1]

      fromLayer.nodes.forEach(from => {
        toLayer.nodes.forEach(to => {
          const fp = worldPositions.get(from.id)!
          const tp = worldPositions.get(to.id)!

          const fromColor = new THREE.Color(NODE_COLOR[from.type] ?? NODE_COLOR.default)
          const toColor   = new THREE.Color(NODE_COLOR[to.type]   ?? NODE_COLOR.default)
          const midColor  = fromColor.clone().lerp(toColor, 0.5)

          // Build a curved line using a catmull-rom spline
          const mid = new THREE.Vector3().lerpVectors(fp, tp, 0.5)
          mid.y += (Math.random() - 0.5) * 0.8
          mid.z += (Math.random() - 0.5) * 0.8
          const curve = new THREE.QuadraticBezierCurve3(fp.clone(), mid, tp.clone())
          const pts = curve.getPoints(20)

          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts)
          const lineMat = new THREE.LineBasicMaterial({
            color: midColor, transparent: true, opacity: 0.22,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
          const line = new THREE.Line(lineGeo, lineMat)
          scene.add(line)
          lineMap.current.set(`${from.id}-${to.id}`, line)
        })
      })
    }

    // ── Animate signal particles along connections ────────────────────────────
    // Small bright dots that travel along each line
    const signalDots: Array<{
      mesh: THREE.Mesh;
      curve: THREE.QuadraticBezierCurve3;
      t: number;
      spd: number;
    }> = []

    for (let i = 0; i < NEURAL_LAYERS.length - 1; i++) {
      const fromLayer = NEURAL_LAYERS[i]
      const toLayer   = NEURAL_LAYERS[i + 1]

      fromLayer.nodes.forEach(from => {
        toLayer.nodes.forEach(to => {
          const fp  = worldPositions.get(from.id)!
          const tp  = worldPositions.get(to.id)!
          const mid = new THREE.Vector3().lerpVectors(fp, tp, 0.5)
          mid.y += (Math.random() - 0.5) * 0.8
          mid.z += (Math.random() - 0.5) * 0.8
          const curve = new THREE.QuadraticBezierCurve3(fp.clone(), mid, tp.clone())

          const dotGeo = new THREE.SphereGeometry(0.06, 8, 8)
          const dotMat = new THREE.MeshBasicMaterial({
            color: 0x00d4ff, transparent: true, opacity: 0.85,
            blending: THREE.AdditiveBlending, depthWrite: false,
          })
          const dotMesh = new THREE.Mesh(dotGeo, dotMat)
          dotMesh.visible = false
          scene.add(dotMesh)

          signalDots.push({
            mesh: dotMesh,
            curve,
            t: Math.random(),
            spd: 0.08 + Math.random() * 0.12,
          })
        })
      })
    }

    // ── Animation loop ─────────────────────────────────────────────────────────
    const clock = clockRef.current
    clock.start()

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const delta   = clock.getDelta()

      // Camera gentle drift (parallax)
      camera.position.x = Math.sin(elapsed * 0.10) * 2.8
      camera.position.y = 3   + Math.sin(elapsed * 0.07) * 1.2
      camera.position.z = 30  + Math.sin(elapsed * 0.05) * 1.8
      camera.lookAt(0, 0, 0)

      // Node bobbing + slow Y-rotation
      nodeAnimData.current.forEach(({ group, baseY, phase, spd }) => {
        group.position.y = baseY + Math.sin(elapsed * spd + phase) * 0.13
        group.rotation.y += 0.003

        // Pulse ring scale
        const pulseRing = group.children.find(c => c.userData.isPulseRing) as THREE.Mesh | undefined
        if (pulseRing) {
          const s = 1 + 0.12 * Math.abs(Math.sin(elapsed * 1.2 + phase))
          pulseRing.scale.setScalar(s)
          ;(pulseRing.material as THREE.MeshBasicMaterial).opacity =
            0.08 + 0.12 * (1 - Math.abs(Math.sin(elapsed * 1.2 + phase)))
        }
      })

      // Signal dot travel
      signalDots.forEach(dot => {
        dot.t += dot.spd * Math.min(delta, 0.05)
        if (dot.t > 1) {
          dot.t = 0
          dot.mesh.visible = Math.random() > 0.3 // randomly hide some
        }
        if (dot.mesh.visible) {
          const pos = dot.curve.getPoint(dot.t)
          dot.mesh.position.copy(pos)
          // fade in/out at endpoints
          const alpha = dot.t < 0.1 ? dot.t * 10 : dot.t > 0.9 ? (1 - dot.t) * 10 : 1
          ;(dot.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85 * alpha
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      nodeGroupMap.current.clear()
      lineMap.current.clear()
      meshNodeIdMap.current.clear()
      clickableMeshes.current = []
      nodeAnimData.current    = []
    }
  }, [networkActive])

  // Panel initial off-screen position
  useEffect(() => {
    if (panelRef.current) gsap.set(panelRef.current, { x: 440 })
  }, [])

  // ─── Line highlight helpers ────────────────────────────────────────────────
  const highlightLines = useCallback((nodeId: string) => {
    lineMap.current.forEach((line, key) => {
      const mat = line.material as THREE.LineBasicMaterial
      if (key.startsWith(nodeId + '-') || key.endsWith('-' + nodeId)) {
        mat.opacity = 0.75
        mat.color.set(0x00d4ff)
      } else {
        mat.opacity = 0.03
      }
    })
  }, [])

  const resetLines = useCallback(() => {
    lineMap.current.forEach(line => {
      ;(line.material as THREE.LineBasicMaterial).opacity = 0.22
    })
  }, [])

  // ─── Panel open / close ────────────────────────────────────────────────────
  const openPanel = useCallback((node: NeuralNode) => {
    // Reset previously active node scale
    const prevId = activeNodeRef.current?.id
    if (prevId && prevId !== node.id) {
      const prevGroup = nodeGroupMap.current.get(prevId)
      if (prevGroup) gsap.to(prevGroup.scale, { x: 1, y: 1, z: 1, duration: 0.25 })
    }

    activeNodeRef.current = node
    setActiveNodeState(node)

    // Scale up clicked node
    const group = nodeGroupMap.current.get(node.id)
    if (group) gsap.to(group.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.4, ease: 'back.out(2)' })

    // Slide panel in
    if (panelRef.current) {
      gsap.killTweensOf(panelRef.current)
      gsap.fromTo(
        panelRef.current,
        { x: 440 },
        { x: 0, duration: 0.55, ease: 'power3.out' }
      )
    }

    highlightLines(node.id)
  }, [highlightLines])

  const closePanel = useCallback(() => {
    const prevId = activeNodeRef.current?.id
    if (prevId) {
      const prevGroup = nodeGroupMap.current.get(prevId)
      if (prevGroup) gsap.to(prevGroup.scale, { x: 1, y: 1, z: 1, duration: 0.25 })
    }
    activeNodeRef.current = null

    if (panelRef.current) {
      gsap.to(panelRef.current, {
        x: 440, duration: 0.4, ease: 'power3.in',
        onComplete: () => setActiveNodeState(null),
      })
    }
    resetLines()
  }, [resetLines])

  // ─── Raycasting ───────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!networkActive || !mountRef.current || !cameraRef.current) return
    const rect = mountRef.current.getBoundingClientRect()
    mouse.current.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
    mouse.current.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, cameraRef.current)
    const hits = raycaster.current.intersectObjects(clickableMeshes.current)

    if (hits.length > 0) {
      const nodeId = meshNodeIdMap.current.get((hits[0].object as THREE.Mesh).uuid)
      if (nodeId && nodeId !== hoveredId.current) {
        // Un-hover previous
        if (hoveredId.current && hoveredId.current !== activeNodeRef.current?.id) {
          const pg = nodeGroupMap.current.get(hoveredId.current)
          if (pg) gsap.to(pg.scale, { x: 1, y: 1, z: 1, duration: 0.2 })
        }
        hoveredId.current = nodeId
        if (nodeId !== activeNodeRef.current?.id) {
          const hg = nodeGroupMap.current.get(nodeId)
          if (hg) gsap.to(hg.scale, { x: 1.18, y: 1.18, z: 1.18, duration: 0.2 })
        }
        const nodeData = NEURAL_LAYERS.flatMap(l => l.nodes).find(n => n.id === nodeId)
        if (nodeData) setTooltip({ text: nodeData.title, x: e.clientX + 16, y: e.clientY - 12 })
        if (mountRef.current) mountRef.current.style.cursor = 'pointer'
      }
    } else {
      if (hoveredId.current && hoveredId.current !== activeNodeRef.current?.id) {
        const pg = nodeGroupMap.current.get(hoveredId.current)
        if (pg) gsap.to(pg.scale, { x: 1, y: 1, z: 1, duration: 0.2 })
      }
      hoveredId.current = null
      setTooltip(null)
      if (mountRef.current) mountRef.current.style.cursor = 'default'
    }
  }, [networkActive])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!networkActive || !mountRef.current || !cameraRef.current) return
    const rect = mountRef.current.getBoundingClientRect()
    mouse.current.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
    mouse.current.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, cameraRef.current)
    const hits = raycaster.current.intersectObjects(clickableMeshes.current)

    if (hits.length > 0) {
      const nodeId = meshNodeIdMap.current.get((hits[0].object as THREE.Mesh).uuid)
      if (nodeId) {
        const nodeData = NEURAL_LAYERS.flatMap(l => l.nodes).find(n => n.id === nodeId)
        if (nodeData) openPanel(nodeData)
      }
    }
  }, [networkActive, openPanel])

  // ─── Hero → Network transition ────────────────────────────────────────────
  const activateNetwork = () => {
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        opacity: 0, y: -20, duration: 0.7, ease: 'power2.in',
        onComplete: () => setHeroVisible(false),
      })
    }
    setNetworkActive(true)
  }

  const goBack = () => {
    closePanel()
    setNetworkActive(false)
    setHeroVisible(true)
    setTimeout(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        )
      }
    }, 80)
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: '#050a14', position: 'relative',
      fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
    }}>

      {/* Google Font inject */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --muted: #64748b;
          --text:  #e2e8f0;
          --panel-bg: rgba(8,16,32,0.97);
        }

        /* Panel content styles (dangerouslySetInnerHTML) */
        .stat-row { display:flex; gap:12px; margin-bottom:20px; }
        .stat-box { flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:14px; text-align:center; }
        .stat-num { font-size:24px; font-weight:800; font-family:'Syne',sans-serif; }
        .stat-lbl { font-size:10px; color:var(--muted); margin-top:2px; letter-spacing:1px; }

        .panel-item { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:15px 17px; margin-bottom:11px; transition:border-color 0.2s; }
        .panel-item:hover { border-color:rgba(0,212,255,0.25); }
        .item-title { font-size:14px; font-weight:600; margin-bottom:4px; color:#e2e8f0; }
        .item-sub   { font-size:12px; color:var(--muted); line-height:1.55; }

        .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:600; letter-spacing:1px; margin:3px 2px; }
        .badge-blue   { background:rgba(0,212,255,0.12);  color:#00d4ff; border:1px solid rgba(0,212,255,0.25); }
        .badge-yellow { background:rgba(245,158,11,0.12); color:#f59e0b; border:1px solid rgba(245,158,11,0.25); }
        .badge-green  { background:rgba(16,185,129,0.12); color:#10b981; border:1px solid rgba(16,185,129,0.25); }
        .badge-pink   { background:rgba(236,72,153,0.12); color:#ec4899; border:1px solid rgba(236,72,153,0.25); }
        .badge-purple { background:rgba(124,58,237,0.12); color:#a78bfa; border:1px solid rgba(124,58,237,0.25); }

        .connect-btn { display:block; width:100%; padding:14px; background:linear-gradient(135deg,#ec4899,#7c3aed); border:none; border-radius:12px; color:#fff; font-size:14px; font-weight:700; cursor:pointer; margin-top:12px; letter-spacing:1px; font-family:'Outfit',sans-serif; box-shadow:0 0 28px rgba(236,72,153,0.25); transition:transform 0.2s,box-shadow 0.2s; }
        .connect-btn:hover { transform:translateY(-2px); box-shadow:0 0 48px rgba(236,72,153,0.45); }

        /* Hero animations */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes heroPulse {
          0%,100% { box-shadow:0 0 30px rgba(0,212,255,0.4); }
          50%      { box-shadow:0 0 60px rgba(0,212,255,0.7), 0 0 100px rgba(0,212,255,0.2); }
        }
        @keyframes networkFadeIn {
          from { opacity:0; transform:scale(0.96); }
          to   { opacity:1; transform:scale(1); }
        }
        .network-enter { animation: networkFadeIn 0.9s ease forwards; }

        /* Links */
        .node-link { display:inline-flex; align-items:center; gap:6px; color:#00d4ff; text-decoration:none; font-size:13px; font-weight:600; padding:4px 0; border-bottom:1px solid rgba(0,212,255,0.2); transition:border-color 0.2s, color 0.2s; }
        .node-link:hover { color:#38e0ff; border-color:rgba(0,212,255,0.6); }
        .node-link-purple { color:#a78bfa; border-bottom-color:rgba(167,139,250,0.2); }
        .node-link-purple:hover { color:#c4b5fd; border-color:rgba(167,139,250,0.6); }
        .node-link-green { color:#10b981; border-bottom-color:rgba(16,185,129,0.2); }
        .node-link-green:hover { color:#34d399; border-color:rgba(16,185,129,0.6); }

        /* Scrollbar */
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(0,212,255,0.2); border-radius:4px; }
      `}</style>

      {/* ── Three.js canvas mount ──────────────────────────────────────── */}
      <div
        ref={mountRef}
        className={networkActive ? 'network-enter' : ''}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      />

      {/* ── Hero Screen ────────────────────────────────────────────────── */}
      {heroVisible && (
        <div ref={heroRef} style={{
          position: 'fixed', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%), #050a14',
          pointerEvents: 'all',
        }}>
          {/* Hex grid decoration */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32z' fill='none' stroke='%2300d4ff' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }} />

          {/* Badge */}
          <div style={{
            fontSize: 11, letterSpacing: 5, color: '#00d4ff',
            textTransform: 'uppercase', marginBottom: 20,
            opacity: 0, animation: 'fadeUp 1s 0.4s forwards',
            fontFamily: "'Outfit', sans-serif", fontWeight: 600,
          }}>
            ⬡ Neural Portfolio v2.0 — Initializing
          </div>

          {/* Name */}
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(36px, 5.5vw, 80px)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 45%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            lineHeight: 1.08,
            opacity: 0,
            animation: 'fadeUp 1s 0.7s forwards',
          }}>
            Balaji Segu<br />Krishnaiah
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 17, color: '#64748b', marginTop: 16,
            opacity: 0, animation: 'fadeUp 1s 1.0s forwards',
            letterSpacing: '0.5px',
          }}>
            Software Engineer &nbsp;·&nbsp; AI/ML &nbsp;·&nbsp; Web3 Builder
          </div>

          {/* CTA button */}
          <button
            onClick={activateNetwork}
            style={{
              marginTop: 44,
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              border: 'none', borderRadius: 50,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
              opacity: 0, animation: 'fadeUp 1s 1.3s forwards, heroPulse 3s 2.3s infinite',
              letterSpacing: '1.5px',
              fontFamily: "'Outfit', sans-serif",
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            ⚡ Run Inference on Me
          </button>

          {/* Hint */}
          <div style={{
            position: 'fixed', bottom: 36, left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 12, color: '#475569',
            opacity: 0, animation: 'fadeUp 1s 1.9s forwards',
            letterSpacing: '1px',
          }}>
            ↓ Each node is a layer of who I am — click to explore
          </div>
        </div>
      )}

      {/* ── Network overlay: layer labels ──────────────────────────────── */}
      {networkActive && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
          {NEURAL_LAYERS.map(layer => (
            <div key={layer.id} style={{
              position: 'absolute', top: 18,
              left: `${layer.x}%`,
              transform: 'translateX(-50%)',
              fontSize: 10, letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#7aa0c0',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              whiteSpace: 'nowrap',
              textShadow: '0 0 12px rgba(0,212,255,0.3)',
            }}>
              {layer.label}
            </div>
          ))}
        </div>
      )}

      {/* ── Back button ─────────────────────────────────────────────────── */}
      {networkActive && (
        <button
          onClick={goBack}
          style={{
            position: 'fixed', top: 20, left: 20, zIndex: 20,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 50, padding: '8px 20px',
            color: '#64748b', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: "'Outfit', sans-serif",
            transition: 'background 0.2s, color 0.2s',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e2e8f0' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}
        >
          ← Back
        </button>
      )}

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      {networkActive && (
        <div style={{
          position: 'fixed', bottom: 28, left: 28, zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 7,
        }}>
          {[
            { color: '#00d4ff', label: 'Core Layer' },
            { color: '#f59e0b', label: 'Achievements' },
            { color: '#10b981', label: 'Interests' },
            { color: '#ec4899', label: 'Output' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%',
                border: `1.5px solid ${color}`,
                boxShadow: `0 0 6px ${color}66`,
              }} />
              <span style={{ fontSize: 10, color: '#475569', letterSpacing: 1, fontFamily: "'Outfit'" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Side Panel ──────────────────────────────────────────────────── */}
      <div ref={panelRef} style={{
        position: 'fixed', top: 0, right: 0,
        width: 420, height: '100vh',
        background: 'rgba(6,12,24,0.98)',
        borderLeft: '1px solid rgba(0,212,255,0.12)',
        zIndex: 20, overflowY: 'auto',
        backdropFilter: 'blur(24px)',
        padding: '32px 28px 48px',
        willChange: 'transform',
      }}>
        {/* Colored top accent bar */}
        {activeNodeState && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${activeNodeState.tagColor}, transparent)`,
          }} />
        )}
        {/* Close button */}
        <button
          onClick={closePanel}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: 36, height: 36,
            color: '#e2e8f0', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          ✕
        </button>

        {activeNodeState && (
          <>
            {/* Tag */}
            <div style={{
              fontSize: 10, letterSpacing: 4, textTransform: 'uppercase',
              color: activeNodeState.tagColor, marginBottom: 10, fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
            }}>
              ⬡ {activeNodeState.tag}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 26, fontWeight: 800,
              color: '#f1f5f9', marginBottom: 8, lineHeight: 1.2,
            }}>
              {activeNodeState.title}
            </div>

            {/* Description */}
            <div style={{
              fontSize: 14, color: '#64748b', lineHeight: 1.7,
              marginBottom: 24, fontFamily: "'Outfit', sans-serif",
            }}>
              {activeNodeState.desc}
            </div>

            {/* Content (HTML from data) */}
            <div
              dangerouslySetInnerHTML={{ __html: activeNodeState.content }}
              style={{ color: '#e2e8f0' }}
            />
          </>
        )}
      </div>

      {/* ── Tooltip ──────────────────────────────────────────────────────── */}
      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x, top: tooltip.y,
          background: 'rgba(6,12,24,0.95)',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: 8, padding: '7px 14px',
          fontSize: 12, color: '#00d4ff',
          pointerEvents: 'none', zIndex: 100,
          whiteSpace: 'nowrap',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '0.5px',
          boxShadow: '0 0 20px rgba(0,212,255,0.15)',
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

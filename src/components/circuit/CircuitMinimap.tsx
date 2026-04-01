'use client'
/**
 * CircuitMinimap — SVG overlay in the bottom-left corner.
 *
 * The track path SVG is pre-computed once (module-level useMemo equivalent)
 * so it never rebuilds on re-render. Only the car dot moves.
 *
 * Sector colour coding:
 *   Sector 1 — blue  (#4488ff)
 *   Sector 2 — amber (#ff8844)
 *   Sector 3 — green (#44ff88)
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'
import { trackControlPoints } from '@/data/trackLayout'
import { getCircuitCurve } from '@/lib/trackCurve'

const SIZE    = 168
const PADDING = 14

// ─── Static minimap data (computed once per page load) ────────────────────────

function buildMinimapStatics() {
  const curve  = getCircuitCurve()
  const points = curve.getPoints(300)

  let minX = Infinity, maxX = -Infinity
  let minZ = Infinity, maxZ = -Infinity
  for (const p of points) {
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x
    if (p.z < minZ) minZ = p.z; if (p.z > maxZ) maxZ = p.z
  }

  const W = maxX - minX
  const H = maxZ - minZ
  const inner = SIZE - 2 * PADDING
  const scale  = inner / Math.max(W, H)
  const offX   = PADDING + (inner - W * scale) / 2
  const offZ   = PADDING + (inner - H * scale) / 2

  const project = (p: THREE.Vector3) => ({
    x: (p.x - minX) * scale + offX,
    y: (p.z - minZ) * scale + offZ,
  })

  const pathD = points
    .map((p, i) => {
      const { x, y } = project(p)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ') + ' Z'

  return { project, pathD }
}

// Runs once when module is first imported (safe — THREE is client-side only,
// and this module is only imported by 'use client' components)
let _statics: ReturnType<typeof buildMinimapStatics> | null = null
function getStatics() {
  if (!_statics) _statics = buildMinimapStatics()
  return _statics
}

// ─── Sector path segments for colour coding ────────────────────────────────────

const SECTOR_COLORS = ['#4488ff', '#ff8844', '#44ff88']
// t-ranges for each sector
const SECTOR_RANGES = [
  [0.0,  0.33],
  [0.33, 0.66],
  [0.66, 1.0 ],
]

function buildSectorPaths() {
  const curve = getCircuitCurve()
  const { project } = getStatics()
  return SECTOR_RANGES.map(([tStart, tEnd], i) => {
    const pts = Array.from({ length: 61 }, (_, j) => {
      const t = tStart + (tEnd - tStart) * (j / 60)
      return project(curve.getPointAt(t))
    })
    const d = pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
    return { d, color: SECTOR_COLORS[i] }
  })
}

let _sectorPaths: ReturnType<typeof buildSectorPaths> | null = null
function getSectorPaths() {
  if (!_sectorPaths) _sectorPaths = buildSectorPaths()
  return _sectorPaths
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function CircuitMinimap() {
  const { splineProgress, currentSector } = useGameStore()
  const curve = useMemo(() => getCircuitCurve(), [])

  // Only recompute the car dot position on progress change
  const carDot = useMemo(() => {
    const { project } = getStatics()
    return project(curve.getPointAt(Math.max(0, Math.min(0.9999, splineProgress))))
  }, [splineProgress, curve])

  const sectorPaths = useMemo(() => getSectorPaths(), [])
  const sectorColor = SECTOR_COLORS[currentSector - 1]

  return (
    <div style={{
      position:       'absolute',
      bottom:         24,
      left:           24,
      width:          SIZE,
      height:         SIZE,
      background:     'rgba(0,0,0,0.75)',
      border:         '1px solid rgba(255,255,255,0.12)',
      borderRadius:   10,
      overflow:       'hidden',
      pointerEvents:  'none',
    }}>
      <svg width={SIZE} height={SIZE}>
        {/* Sector-coloured track segments */}
        {sectorPaths.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={i === currentSector - 1 ? 3 : 1.5}
            strokeOpacity={i === currentSector - 1 ? 0.9 : 0.35}
            strokeLinecap="round"
          />
        ))}

        {/* Car dot */}
        <circle cx={carDot.x} cy={carDot.y} r={5.5} fill={sectorColor} opacity={0.95} />
        <circle cx={carDot.x} cy={carDot.y} r={3}   fill="#ffffff"     opacity={0.9} />
      </svg>

      {/* Sector label */}
      <div style={{
        position:    'absolute',
        bottom:      6,
        right:       9,
        color:       sectorColor,
        fontSize:    9,
        fontFamily:  'monospace',
        letterSpacing: 1.5,
        opacity:     0.85,
      }}>
        S{currentSector}
      </div>

      {/* Progress % */}
      <div style={{
        position:    'absolute',
        top:         6,
        right:       9,
        color:       'rgba(255,255,255,0.35)',
        fontSize:    8,
        fontFamily:  'monospace',
        letterSpacing: 1,
      }}>
        {Math.round(splineProgress * 100)}%
      </div>
    </div>
  )
}

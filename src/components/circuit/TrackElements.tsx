'use client'
/**
 * TrackElements — static 3D scene dressing for the circuit:
 *   • Sector gantry gates at t = 0.0, 0.33, 0.66
 *   • POI marker posts with glowing orbs (education / experience / leetcode)
 *   • LeetCode timing tower in Sector 3
 *
 * All positions are derived from the shared Catmull-Rom curve so they align
 * precisely with the track ribbon.
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { Text, Billboard } from '@react-three/drei'
import { pois, sectorBoundaries } from '@/data/trackLayout'
import { sectors } from '@/data/f1Mappings'
import { getCircuitCurve } from '@/lib/trackCurve'
import type { SectorInfo } from '@/types'

// ─── Sector gantry gate ────────────────────────────────────────────────────────

const SECTOR_COLORS = ['#4488ff', '#ff8844', '#44ff88']

interface GateProps {
  position: THREE.Vector3
  rotationY: number
  sector: SectorInfo
  color: string
}

function SectorGate({ position, rotationY, sector, color }: GateProps) {
  return (
    <group position={[position.x, 0, position.z]} rotation={[0, rotationY, 0]}>
      {/* Left pillar */}
      <mesh position={[-7.2, 3.5, 0]} castShadow>
        <boxGeometry args={[0.7, 7, 0.7]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.4} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[7.2, 3.5, 0]} castShadow>
        <boxGeometry args={[0.7, 7, 0.7]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.4} />
      </mesh>
      {/* Horizontal beam */}
      <mesh position={[0, 7.15, 0]} castShadow>
        <boxGeometry args={[15.1, 0.75, 0.7]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.4} />
      </mesh>
      {/* Lights strip along beam */}
      <mesh position={[0, 7.55, 0]}>
        <boxGeometry args={[14.6, 0.18, 0.18]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
      </mesh>
      {/* Point light for atmosphere */}
      <pointLight color={color} intensity={3} distance={25} position={[0, 7, 0]} />
      {/* Sector label */}
      <Text
        position={[0, 9.0, 0]}
        fontSize={1.05}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#000000"
      >
        {`SECTOR ${sector.number}  ·  ${sector.name.toUpperCase()}`}
      </Text>
    </group>
  )
}

// ─── POI marker post ───────────────────────────────────────────────────────────

const POI_COLORS: Record<string, string> = {
  education:  '#4488ff',
  experience: '#ff8844',
  leetcode:   '#44ff88',
}

interface POIMarkerProps {
  worldPos: THREE.Vector3
  label: string
  typeColor: string
}

function POIMarker({ worldPos, label, typeColor }: POIMarkerProps) {
  return (
    <group position={[worldPos.x, 0, worldPos.z]}>
      {/* Pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 4.4, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Glowing orb */}
      <mesh position={[0, 5.0, 0]}>
        <sphereGeometry args={[0.55, 14, 14]} />
        <meshStandardMaterial color={typeColor} emissive={typeColor} emissiveIntensity={1.2} />
      </mesh>
      {/* Point light for glow spill onto track */}
      <pointLight color={typeColor} intensity={2.5} distance={12} position={[0, 5.0, 0]} />
      {/* Billboard label — always faces camera */}
      <Billboard position={[0, 7.0, 0]}>
        <Text
          fontSize={0.9}
          color={typeColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {label}
        </Text>
      </Billboard>
    </group>
  )
}

// ─── LeetCode timing tower ─────────────────────────────────────────────────────

const ROW_COLORS = ['#ff4400', '#ff8800', '#ffcc00']

function LeetCodeTower({ position }: { position: THREE.Vector3 }) {
  const ROWS = 9
  return (
    <group position={[position.x, 0, position.z]}>
      {/* Foundation */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4.0, 0.8, 2.0]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      {/* Rows */}
      {Array.from({ length: ROWS }, (_, i) => (
        <mesh key={i} position={[0, 1.0 + i * 1.4, 0]}>
          <boxGeometry args={[3.6, 1.1, 1.4]} />
          <meshStandardMaterial
            color="#0d0d0d"
            emissive={ROW_COLORS[i % 3]}
            emissiveIntensity={0.45}
          />
        </mesh>
      ))}
      {/* Screen rows — bright emissive strips */}
      {Array.from({ length: ROWS }, (_, i) => (
        <mesh key={`s${i}`} position={[0, 1.0 + i * 1.4 + 0.28, 0.72]}>
          <boxGeometry args={[3.0, 0.28, 0.04]} />
          <meshStandardMaterial
            color={ROW_COLORS[i % 3]}
            emissive={ROW_COLORS[i % 3]}
            emissiveIntensity={2.0}
          />
        </mesh>
      ))}
      {/* Top antenna */}
      <mesh position={[0, 1.0 + ROWS * 1.4 + 1.4, 0]}>
        <cylinderGeometry args={[0.08, 0.35, 2.8, 8]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={1} />
      </mesh>
      <pointLight color="#ff8800" intensity={4} distance={20} position={[0, ROWS * 1.4, 0]} />
      {/* Label */}
      <Billboard position={[0, -1.4, 0]}>
        <Text
          fontSize={1.0}
          color="#ff8800"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          TIMING TOWER
        </Text>
      </Billboard>
    </group>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function TrackElements() {
  const curve = useMemo(() => getCircuitCurve(), [])

  // Sector gates at t=0, sector2Start, sector3Start
  const gateTs = [0.0, sectorBoundaries.sector2Start, sectorBoundaries.sector3Start]
  const gates = useMemo(() =>
    gateTs.map((t, i) => {
      const pos = curve.getPointAt(t)
      const tan = curve.getTangentAt(t).normalize()
      return {
        pos,
        rotationY: Math.atan2(-tan.x, -tan.z),
        sector: sectors[i],
        color: SECTOR_COLORS[i],
      }
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [curve])

  // POI marker world positions
  const poiMarkers = useMemo(() =>
    pois.map((poi) => {
      const pos = curve.getPointAt(poi.t)
      const tan = curve.getTangentAt(poi.t).normalize()
      const lat = new THREE.Vector3(-tan.z, 0, tan.x)
      // Place markers just beyond the kerb
      pos.addScaledVector(lat, poi.side === 'left' ? 9 : -9)
      const typeColor = POI_COLORS[poi.type] ?? '#ffffff'
      const label = poi.type === 'leetcode'
        ? 'LeetCode Stats'
        : poi.contentId.replace(/-/g, ' ').toUpperCase()
      return { poi, pos, typeColor, label }
    }),
  [curve])

  // LeetCode tower position (t=0.70, right side, further out)
  const towerPos = useMemo(() => {
    const pos = curve.getPointAt(0.70)
    const tan = curve.getTangentAt(0.70).normalize()
    const lat = new THREE.Vector3(-tan.z, 0, tan.x)
    pos.addScaledVector(lat, -18)
    return pos
  }, [curve])

  return (
    <group>
      {gates.map((g, i) => (
        <SectorGate key={i} position={g.pos} rotationY={g.rotationY} sector={g.sector} color={g.color} />
      ))}

      {poiMarkers.map(({ poi, pos, typeColor, label }) => (
        <POIMarker key={poi.id} worldPos={pos} label={label} typeColor={typeColor} />
      ))}

      <LeetCodeTower position={towerPos} />
    </group>
  )
}

'use client'
/**
 * CarModel — procedural F1 car composed of simple Three.js geometries.
 *
 * Reads position and rotation from refs (written by CarPhysics' useFrame) and
 * lerps toward them each frame for smooth visual movement.
 *
 * Livery: team accent color on body, front wing, rear wing.
 * Orientation: local –Z is the nose (Three.js forward), so the car faces in
 * the direction of travel when rotation.y = atan2(-tx, -tz).
 */

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/store/gameStore'
import { teamCards } from '@/data/f1Mappings'
import type { CarTeam } from '@/types'

interface CarModelProps {
  positionRef: React.MutableRefObject<THREE.Vector3>
  rotationRef: React.MutableRefObject<number>
}

export function CarModel({ positionRef, rotationRef }: CarModelProps) {
  const groupRef = useRef<THREE.Group | null>(null)
  const { selectedCar } = useGameStore()
  const team = selectedCar ? teamCards[selectedCar as CarTeam] : teamCards.mercedes
  const accent = team.accentColor
  const dark   = '#111111'

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const lf = Math.min(delta * 12, 1)
    groupRef.current.position.lerp(positionRef.current, lf)

    const targetRot = rotationRef.current
    const cur = groupRef.current.rotation.y
    // Shortest-path lerp for rotation
    let diff = ((targetRot - cur + Math.PI) % (2 * Math.PI)) - Math.PI
    if (diff < -Math.PI) diff += 2 * Math.PI
    groupRef.current.rotation.y = cur + diff * Math.min(delta * 8, 1)
  })

  return (
    <group ref={groupRef}>
      {/* ── Main chassis body ─────────────────────────────────────── */}
      <mesh position={[0, 0.50, 0]} castShadow>
        <boxGeometry args={[1.65, 0.28, 4.2]} />
        <meshStandardMaterial color={accent} metalness={0.55} roughness={0.3} />
      </mesh>

      {/* Sidepods (wider at rear, narrower at front) */}
      <mesh position={[-0.95, 0.44, 0.3]} castShadow>
        <boxGeometry args={[0.3, 0.2, 2.6]} />
        <meshStandardMaterial color={accent} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.95, 0.44, 0.3]} castShadow>
        <boxGeometry args={[0.3, 0.2, 2.6]} />
        <meshStandardMaterial color={accent} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ── Cockpit / monocoque ───────────────────────────────────── */}
      <mesh position={[0, 0.73, 0.15]} castShadow>
        <boxGeometry args={[0.62, 0.32, 1.6]} />
        <meshStandardMaterial color={dark} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Halo — titanium arch over cockpit */}
      <mesh position={[0, 0.92, 0.10]}>
        <torusGeometry args={[0.32, 0.04, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#999999" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* ── Front wing ───────────────────────────────────────────── */}
      {/* Main plane */}
      <mesh position={[0, 0.26, -2.30]} castShadow>
        <boxGeometry args={[2.10, 0.07, 0.55]} />
        <meshStandardMaterial color={accent} metalness={0.4} roughness={0.35} />
      </mesh>
      {/* Endplates */}
      <mesh position={[-1.07, 0.32, -2.30]}>
        <boxGeometry args={[0.05, 0.22, 0.55]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[1.07, 0.32, -2.30]}>
        <boxGeometry args={[0.05, 0.22, 0.55]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 0.44, -2.05]}>
        <boxGeometry args={[0.28, 0.16, 0.45]} />
        <meshStandardMaterial color={accent} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* ── Rear wing ────────────────────────────────────────────── */}
      {/* Main element */}
      <mesh position={[0, 1.06, 1.85]} castShadow>
        <boxGeometry args={[1.72, 0.09, 0.32]} />
        <meshStandardMaterial color={accent} metalness={0.4} roughness={0.35} />
      </mesh>
      {/* DRS flap */}
      <mesh position={[0, 1.18, 1.82]}>
        <boxGeometry args={[1.68, 0.05, 0.28]} />
        <meshStandardMaterial color={dark} roughness={0.2} />
      </mesh>
      {/* Support pillars */}
      <mesh position={[-0.4, 0.78, 1.85]}>
        <boxGeometry args={[0.07, 0.55, 0.12]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0.4, 0.78, 1.85]}>
        <boxGeometry args={[0.07, 0.55, 0.12]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {/* Beam wing */}
      <mesh position={[0, 0.62, 1.75]}>
        <boxGeometry args={[0.9, 0.05, 0.2]} />
        <meshStandardMaterial color={dark} />
      </mesh>

      {/* ── Wheels (cylinders, rotated 90° on X to stand upright) ── */}
      {/* Front left */}
      <mesh position={[-1.02, 0.38, -1.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.42, 14]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.95} />
      </mesh>
      {/* Front right */}
      <mesh position={[1.02, 0.38, -1.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.42, 14]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.95} />
      </mesh>
      {/* Rear left */}
      <mesh position={[-1.05, 0.38, 1.35]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.50, 14]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.95} />
      </mesh>
      {/* Rear right */}
      <mesh position={[1.05, 0.38, 1.35]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.43, 0.43, 0.50, 14]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.95} />
      </mesh>

      {/* Wheel hubs */}
      {([-1.02, 1.02] as const).map((x) =>
        ([-1.45] as const).map((z) => (
          <mesh key={`fhub-${x}`} position={[x < 0 ? -1.24 : 1.24, 0.38, z]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 10]} />
            <meshStandardMaterial color={accent} metalness={0.7} roughness={0.2} />
          </mesh>
        ))
      )}
      {([-1.05, 1.05] as const).map((x) =>
        ([1.35] as const).map((z) => (
          <mesh key={`rhub-${x}`} position={[x < 0 ? -1.31 : 1.31, 0.38, z]}>
            <cylinderGeometry args={[0.20, 0.20, 0.08, 10]} />
            <meshStandardMaterial color={accent} metalness={0.7} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* Car number on nose — small block for visual identity */}
      <mesh position={[0, 0.54, -2.10]}>
        <boxGeometry args={[0.45, 0.22, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

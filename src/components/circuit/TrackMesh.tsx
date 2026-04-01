'use client'
/**
 * TrackMesh — procedural ribbon geometry for the circuit.
 *
 * Samples the shared Catmull-Rom spline at trackConfig.totalSamples points
 * and builds five ribbon meshes: asphalt road, left/right red kerbs, and
 * left/right grass strips.
 *
 * Geometry strategy: for each sample pair (i, i+1) we emit a quad with
 * vertices [leftI, rightI, leftI+1, rightI+1]. Index winding: (a,c,b),(b,c,d)
 * gives CCW triangles when viewed from above (+Y), so normals point up.
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { trackConfig } from '@/data/trackLayout'
import { getCircuitCurve } from '@/lib/trackCurve'

interface RibbonArgs {
  curve:      THREE.CatmullRomCurve3
  samples:    number
  leftHalf:   number  // world units left of centerline
  rightHalf:  number  // world units right of centerline
  yOffset?:   number
}

function buildRibbon({ curve, samples, leftHalf, rightHalf, yOffset = 0 }: RibbonArgs): THREE.BufferGeometry {
  const positions: number[] = []
  const normals:   number[] = []
  const uvs:       number[] = []
  const indices:   number[] = []

  for (let i = 0; i <= samples; i++) {
    const t       = i / samples
    const pos     = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t).normalize()
    // Left-perpendicular in the XZ plane (90° CCW of travel direction)
    const lat = new THREE.Vector3(-tangent.z, 0, tangent.x)

    const lx = pos.x + lat.x * leftHalf
    const lz = pos.z + lat.z * leftHalf
    const rx = pos.x - lat.x * rightHalf
    const rz = pos.z - lat.z * rightHalf
    const y  = pos.y + yOffset

    positions.push(lx, y, lz, rx, y, rz)
    normals.push(0, 1, 0, 0, 1, 0)
    uvs.push(0, i * 0.2, 1, i * 0.2)
  }

  for (let i = 0; i < samples; i++) {
    const a = i * 2,     b = i * 2 + 1
    const c = (i+1) * 2, d = (i+1) * 2 + 1
    // CCW from above → normal points +Y
    indices.push(a, c, b, b, c, d)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normals,   3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs,       2))
  geo.setIndex(indices)
  return geo
}

export function TrackMesh() {
  const hw = trackConfig.roadWidth / 2   // 5 — half road
  const kw = trackConfig.kerbWidth       // 1 — kerb each side
  const gw = 9                           // grass strip width
  const n  = trackConfig.totalSamples

  const curve = useMemo(() => getCircuitCurve(), [])

  // Geometry definitions — yOffset layers them so nothing z-fights
  const roadGeo   = useMemo(() => buildRibbon({ curve, samples: n, leftHalf: hw,          rightHalf: hw,          yOffset: 0.03 }), [curve, n, hw])
  const lKerbGeo  = useMemo(() => buildRibbon({ curve, samples: n, leftHalf: hw + kw,     rightHalf: hw,          yOffset: 0.05 }), [curve, n, hw, kw])
  const rKerbGeo  = useMemo(() => buildRibbon({ curve, samples: n, leftHalf: hw,          rightHalf: hw + kw,     yOffset: 0.05 }), [curve, n, hw, kw])
  const lGrassGeo = useMemo(() => buildRibbon({ curve, samples: n, leftHalf: hw+kw+gw,   rightHalf: hw+kw,       yOffset: 0.01 }), [curve, n, hw, kw, gw])
  const rGrassGeo = useMemo(() => buildRibbon({ curve, samples: n, leftHalf: hw+kw,       rightHalf: hw+kw+gw,   yOffset: 0.01 }), [curve, n, hw, kw, gw])
  const outerGeo  = useMemo(() => buildRibbon({ curve, samples: n, leftHalf: hw+kw+gw+25, rightHalf: hw+kw+gw+25, yOffset: 0.0  }), [curve, n, hw, kw, gw])

  return (
    <group>
      {/* Far outer ground */}
      <mesh geometry={outerGeo}>
        <meshStandardMaterial color="#0c180c" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Grass strips */}
      <mesh geometry={lGrassGeo}>
        <meshStandardMaterial color="#1a3a1a" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={rGrassGeo}>
        <meshStandardMaterial color="#1a3a1a" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Red kerbs */}
      <mesh geometry={lKerbGeo}>
        <meshStandardMaterial color="#cc1111" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={rKerbGeo}>
        <meshStandardMaterial color="#cc1111" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Asphalt road — top layer */}
      <mesh geometry={roadGeo} receiveShadow>
        <meshStandardMaterial color="#222222" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

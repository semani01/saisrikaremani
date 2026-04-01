'use client'
/**
 * CarPhysics — the game loop for the circuit phase.
 *
 * Runs inside the R3F Canvas. Each frame:
 *   1. Reads keyboard state via useCarControls (ref — no re-renders)
 *   2. Integrates speed, lateral offset, and track progress
 *   3. Derives world position + heading from the Catmull-Rom spline
 *   4. Writes positionRef / rotationRef (read by CarModel + FollowCamera)
 *   5. Throttled Zustand writes: sector, POI detection, splineProgress
 *   6. Updates CircuitEngine pitch to reflect current speed
 *
 * Car rotation formula: heading.y = atan2(–tx, –tz)
 *   → car's local –Z aligns with tangent (nose faces direction of travel)
 */

import { useRef, useMemo, useEffect, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/store/gameStore'
import { useAudioStore } from '@/store/audioStore'
import { useCarControls } from '@/hooks/useCarControls'
import { pois, sectorBoundaries, trackConfig } from '@/data/trackLayout'
import { getCircuitCurve } from '@/lib/trackCurve'
import type { CircuitEngine } from '@/lib/circuitEngine'
import { CarModel } from './CarModel'
import { FollowCamera } from './FollowCamera'

// Physics constants (tuned for ~35–45s full lap at max speed)
const ACCEL_RATE  = 0.55   // speed gain/sec under throttle
const BRAKE_RATE  = 0.90   // speed loss/sec under braking
const COAST_RATE  = 0.18   // natural drag
const STEER_RATE  = 1.80   // lateral movement/sec
const CENTER_RATE = 2.40   // lateral spring back to centre
const TRACK_SPEED = 0.025  // spline-t advance/sec at speed 1.0
const MAX_LATERAL = 0.85   // fraction of road half-width used at full steer

interface CarPhysicsProps {
  engineRef: MutableRefObject<CircuitEngine | null>
}

export function CarPhysics({ engineRef }: CarPhysicsProps) {
  const keys   = useCarControls()
  const curve  = useMemo(() => getCircuitCurve(), [])

  // All physics live in mutable refs — zero React re-renders per frame
  const speedRef = useRef(0)
  const tRef     = useRef(0)
  const latRef   = useRef(0)   // –1 (full left) … +1 (full right)
  const posRef   = useRef(new THREE.Vector3())
  const rotRef   = useRef(0)

  const lastWriteMs = useRef(0)

  const { setCarPosition, setSplineProgress, setCurrentSector, setNearbyPOI, tickTimeOnTrack } = useGameStore()
  const { isVoiceMuted, masterVolume, sfxVolume } = useAudioStore()

  // Keep audio volume in a ref so the closure inside useFrame never goes stale
  const volRef = useRef(isVoiceMuted ? 0 : masterVolume * sfxVolume)
  useEffect(() => {
    volRef.current = isVoiceMuted ? 0 : masterVolume * sfxVolume
  }, [isVoiceMuted, masterVolume, sfxVolume])

  // Pre-bake POI world positions (cheap, only once per mount)
  const poiPositions = useMemo(() =>
    pois.map((poi) => {
      const pos = curve.getPointAt(poi.t)
      const tan = curve.getTangentAt(poi.t).normalize()
      const lat = new THREE.Vector3(-tan.z, 0, tan.x)
      pos.addScaledVector(lat, poi.side === 'left' ? 11 : -11)
      return { poi, worldPos: pos.clone() }
    }),
  [curve])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)   // cap on tab-switch / lag spikes

    const { forward, backward, left, right } = keys.current

    // ── Speed ──────────────────────────────────────────────────────────────
    if (forward)       speedRef.current = Math.min(1, speedRef.current + ACCEL_RATE * dt)
    else if (backward) speedRef.current = Math.max(0, speedRef.current - BRAKE_RATE  * dt)
    else               speedRef.current = Math.max(0, speedRef.current - COAST_RATE  * dt)

    // ── Lateral ────────────────────────────────────────────────────────────
    if (left)       latRef.current = Math.max(-1, latRef.current - STEER_RATE * dt)
    else if (right) latRef.current = Math.min( 1, latRef.current + STEER_RATE * dt)
    else            latRef.current = latRef.current * (1 - CENTER_RATE * dt)

    // ── Track progress ─────────────────────────────────────────────────────
    tRef.current = (tRef.current + speedRef.current * TRACK_SPEED * dt) % 1

    // ── World position ─────────────────────────────────────────────────────
    const t       = tRef.current
    const pos     = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t).normalize()
    const latDir  = new THREE.Vector3(-tangent.z, 0, tangent.x)

    const maxOff = trackConfig.roadWidth * MAX_LATERAL
    pos.addScaledVector(latDir, latRef.current * maxOff)
    pos.y = 0.45

    posRef.current.copy(pos)
    rotRef.current = Math.atan2(-tangent.x, -tangent.z)

    // ── Engine sound pitch ─────────────────────────────────────────────────
    engineRef.current?.setSpeed(speedRef.current, volRef.current)

    // ── Throttled Zustand writes (~10 fps) ─────────────────────────────────
    const now = performance.now()
    if (now - lastWriteMs.current > 100) {
      lastWriteMs.current = now

      setSplineProgress(t)
      setCarPosition(posRef.current.clone())

      const sector: 1 | 2 | 3 =
        t >= sectorBoundaries.sector3Start ? 3 :
        t >= sectorBoundaries.sector2Start ? 2 : 1
      setCurrentSector(sector)

      let nearest = null
      let nearestDist = Infinity
      for (const { poi, worldPos } of poiPositions) {
        const d = posRef.current.distanceTo(worldPos)
        if (d < trackConfig.poiDetectionRadius && d < nearestDist) {
          nearest = poi
          nearestDist = d
        }
      }
      setNearbyPOI(nearest)
      tickTimeOnTrack()
    }
  })

  return (
    <>
      <CarModel   positionRef={posRef} rotationRef={rotRef} />
      <FollowCamera positionRef={posRef} rotationRef={rotRef} />
    </>
  )
}

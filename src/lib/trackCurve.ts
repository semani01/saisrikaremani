/**
 * trackCurve.ts — Shared Catmull-Rom circuit curve singleton.
 *
 * All Phase 3 components (TrackMesh, CarPhysics, TrackElements, CircuitMinimap)
 * import from here so the curve is only constructed once.
 */

import * as THREE from 'three'
import { trackControlPoints } from '@/data/trackLayout'

let _curve: THREE.CatmullRomCurve3 | null = null

export function getCircuitCurve(): THREE.CatmullRomCurve3 {
  if (!_curve) {
    _curve = new THREE.CatmullRomCurve3(trackControlPoints, true, 'catmullrom', 0.5)
  }
  return _curve
}

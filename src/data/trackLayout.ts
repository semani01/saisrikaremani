/**
 * trackLayout.ts — Circuit geometry, POI positions, and DRS zone ranges.
 *
 * All positions are normalized values (t: 0–1) along the Catmull-Rom spline.
 * The actual 3D spline control points are defined here and consumed by
 * TrackMesh (Phase 3) to procedurally generate the circuit geometry.
 *
 * Phase 3 will flesh out the spline. For now, this is the typed scaffold.
 */

import * as THREE from 'three'
import type { POI, DRSZone, SectorBoundaries } from '@/types'

// ─── Track Spline Control Points ─────────────────────────────────────────────
// A Catmull-Rom spline through these points generates the circuit centerline.
// Designed to resemble an F1 circuit: straights, chicanes, sweeping corners.
// TODO (Phase 3): Tune these points to get the final circuit shape.

export const trackControlPoints: THREE.Vector3[] = [
  // Start/finish straight
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, -60),
  // Turn 1 — right-hander
  new THREE.Vector3(20, 0, -90),
  new THREE.Vector3(50, 0, -100),
  // Sector 1 loop (Education)
  new THREE.Vector3(80, 0, -80),
  new THREE.Vector3(90, 0, -50),
  new THREE.Vector3(80, 0, -20),
  // Chicane
  new THREE.Vector3(60, 0, 10),
  new THREE.Vector3(55, 0, 30),
  // Sector 2 section (Experience) — pit lane area
  new THREE.Vector3(40, 0, 50),
  new THREE.Vector3(20, 0, 60),
  new THREE.Vector3(-20, 0, 60),
  // Long left-hander
  new THREE.Vector3(-60, 0, 40),
  new THREE.Vector3(-80, 0, 10),
  // Sector 3 DRS straight (Projects)
  new THREE.Vector3(-80, 0, -30),
  new THREE.Vector3(-60, 0, -70),
  // Final complex
  new THREE.Vector3(-30, 0, -90),
  new THREE.Vector3(-10, 0, -80),
  // Back to start/finish
  new THREE.Vector3(0, 0, -40),
  new THREE.Vector3(0, 0, 0),
]

// ─── Sector Boundaries ────────────────────────────────────────────────────────

export const sectorBoundaries: SectorBoundaries = {
  sector2Start: 0.33,   // roughly 1/3 of the way around
  sector3Start: 0.66,   // roughly 2/3 of the way around
}

// ─── Points of Interest ───────────────────────────────────────────────────────
// Each POI is a content card that appears in the HUD when the car is nearby.
// t values are approximate — tune during Phase 3 after seeing the actual track.

export const pois: POI[] = [
  // Sector 1 — Education
  {
    id: 'cu-denver-ms',
    type: 'education',
    t: 0.08,
    side: 'left',
    contentId: 'cu-denver-ms',
  },
  {
    id: 'kl-university',
    type: 'education',
    t: 0.18,
    side: 'right',
    contentId: 'kl-university-btech',
  },

  // Sector 2 — Experience
  {
    id: 'cu-anschutz',
    type: 'experience',
    t: 0.38,
    side: 'left',
    contentId: 'cu-anschutz-ml',
  },
  {
    id: 'bragify',
    type: 'experience',
    t: 0.46,
    side: 'right',
    contentId: 'bragify-sde',
  },
  {
    id: 'samsung',
    type: 'experience',
    t: 0.54,
    side: 'left',
    contentId: 'samsung-rd',
  },

  // Sector 3 — Projects (non-DRS POIs, e.g. LeetCode timing tower)
  {
    id: 'leetcode-tower',
    type: 'leetcode',
    t: 0.70,
    side: 'right',
    contentId: 'leetcode',
  },
]

// ─── DRS Zones ────────────────────────────────────────────────────────────────
// DRS zones trigger the project deep-dive cards.
// Placed in Sector 3 (t > 0.66) with some in the transition from Sector 2.

export const drsZones: DRSZone[] = [
  { id: 'drs-pegasus',       tStart: 0.60, tEnd: 0.67, projectId: 'pegasus' },
  { id: 'drs-colorado',      tStart: 0.67, tEnd: 0.73, projectId: 'colorado-crash' },
  { id: 'drs-florasense',    tStart: 0.73, tEnd: 0.79, projectId: 'florasense' },
  { id: 'drs-stock',         tStart: 0.79, tEnd: 0.85, projectId: 'ai-stock-picker' },
  { id: 'drs-maieutic',      tStart: 0.85, tEnd: 0.90, projectId: 'maieutic' },
  { id: 'drs-stroke',        tStart: 0.90, tEnd: 0.94, projectId: 'stroke-rehab' },
  { id: 'drs-bragify',       tStart: 0.94, tEnd: 0.97, projectId: 'bragify' },
  { id: 'drs-samsung',       tStart: 0.97, tEnd: 1.00, projectId: 'samsung-inpainting' },
]

// ─── Track Config ─────────────────────────────────────────────────────────────

export const trackConfig = {
  name: 'Emani International Circuit',
  abbreviation: 'PGP',
  roadWidth: 10,          // world units
  kerbWidth: 1,           // world units each side
  totalSamples: 500,      // how many points to sample from the spline
  poiDetectionRadius: 15, // world units — how close the car must be to trigger HUD update
  finishLineT: 1.0,       // normalized position — reaching this triggers the podium
}

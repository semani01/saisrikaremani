import * as THREE from 'three'

// ─── Game Flow ────────────────────────────────────────────────────────────────

export type GamePhase = 'garage' | 'lights-out' | 'circuit' | 'podium'

export type CarTeam = 'mercedes' | 'ferrari' | 'mclaren' | 'redbull'

export type OverlayType = 'project' | 'telemetry' | 'engineer'

// ─── Track & Circuit ──────────────────────────────────────────────────────────

export type POIType = 'education' | 'experience' | 'project' | 'skill' | 'leetcode'

export interface POI {
  id: string
  type: POIType
  t: number           // normalized position along spline (0–1)
  side: 'left' | 'right'
  contentId: string   // references an entry in portfolio.ts
}

export interface DRSZone {
  id: string
  tStart: number
  tEnd: number
  projectId: string   // references a ProjectItem id
}

export interface SectorBoundaries {
  sector2Start: number  // t value where Sector 2 begins
  sector3Start: number  // t value where Sector 3 begins
}

// ─── Portfolio Content ────────────────────────────────────────────────────────

export interface EducationItem {
  id: string
  degree: string
  school: string
  gpa: number
  startYear: number
  endYear: number
  coursework: string[]
  highlights: string[]
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  startDate: string
  endDate: string
  description: string
  techStack: string[]
  highlights: string[]
}

export interface ProjectMetric {
  label: string
  value: string
  color?: 'green' | 'amber' | 'blue' | 'purple' | 'white'
}

export interface CaseStudy {
  problemStatement: string
  architecture: string          // ASCII/text representation
  keyDecisions: { title: string; body: string }[]
  results: string
  whatILearned: string
  screenshotsNeeded: string[]
}

export interface ProjectItem {
  id: string
  name: string
  domain: string                // e.g. "Machine learning / NLP"
  summary: string               // one-liner for DRS compact card
  quickStats: ProjectMetric[]   // 3 metrics for compact card
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  caseStudy: CaseStudy
}

export interface SkillItem {
  id: string
  label: string
  category: 'ml' | 'fullstack' | 'data' | 'mlops' | 'cloud'
  proficiency: number           // 0–100, used for engine mode bars
}

// ─── External Data ────────────────────────────────────────────────────────────

export interface GitHubStats {
  totalRepos: number
  totalStars: number
  topLanguages: { name: string; percentage: number }[]
  commitFrequency: number       // commits per week (approx)
}

export interface LeetCodeStats {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  streak: number
}

// ─── Race Stats (for Podium) ──────────────────────────────────────────────────

export interface RaceStats {
  poisExplored: number
  projectsViewed: number
  sectorsCompleted: number
  timeOnTrack: number           // seconds
}

// ─── F1 Mappings ─────────────────────────────────────────────────────────────

export interface TireCompound {
  id: 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet' | 'hypersoft'
  color: string                 // hex
  label: string                 // F1 compound name
  skill: string                 // what it maps to
  detail: string                // e.g. "Primary — ML, data, backend"
}

export interface SectorInfo {
  number: 1 | 2 | 3
  name: string                  // "Origins" | "Pit Lane" | "Straights"
  content: string               // "Education" | "Work Experience" | "Projects"
}

// ─── Zustand Store Shapes ─────────────────────────────────────────────────────

export interface GameStore {
  // Game flow
  gamePhase: GamePhase
  setGamePhase: (phase: GamePhase) => void

  // Car selection
  selectedCar: CarTeam | null
  setSelectedCar: (car: CarTeam) => void

  // Circuit state
  carPosition: THREE.Vector3
  splineProgress: number        // 0–1
  currentSector: 1 | 2 | 3
  nearbyPOI: POI | null

  // Overlay / pause state
  isPaused: boolean
  activeOverlay: OverlayType | null

  // Race stats
  raceStats: RaceStats

  // Actions
  setCarPosition: (pos: THREE.Vector3) => void
  setSplineProgress: (t: number) => void
  setCurrentSector: (sector: 1 | 2 | 3) => void
  setNearbyPOI: (poi: POI | null) => void
  openOverlay: (type: OverlayType) => void
  closeOverlay: () => void
  incrementPOIsExplored: () => void
  incrementProjectsViewed: () => void
  tickTimeOnTrack: () => void
  resetRace: () => void
}

export interface AudioStore {
  isMuted: boolean
  isVoiceMuted: boolean
  masterVolume: number          // 0–1
  musicVolume: number           // 0–1
  sfxVolume: number             // 0–1

  toggleMute: () => void
  toggleVoiceMute: () => void
  setVolume: (channel: 'master' | 'music' | 'sfx', value: number) => void
}

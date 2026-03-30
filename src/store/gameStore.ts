import { create } from 'zustand'
import * as THREE from 'three'
import type { GameStore, GamePhase, CarTeam, OverlayType, POI } from '@/types'

const DEFAULT_RACE_STATS = {
  poisExplored: 0,
  projectsViewed: 0,
  sectorsCompleted: 0,
  timeOnTrack: 0,
}

export const useGameStore = create<GameStore>((set) => ({
  // ── Game flow ──────────────────────────────────────────────────────────────
  gamePhase: 'garage',
  setGamePhase: (phase: GamePhase) => set({ gamePhase: phase }),

  // ── Car selection ──────────────────────────────────────────────────────────
  selectedCar: null,
  setSelectedCar: (car: CarTeam) => set({ selectedCar: car }),

  // ── Circuit state ──────────────────────────────────────────────────────────
  carPosition: new THREE.Vector3(0, 0, 0),
  splineProgress: 0,
  currentSector: 1,
  nearbyPOI: null,

  // ── Overlay / pause state ──────────────────────────────────────────────────
  isPaused: false,
  activeOverlay: null,

  // ── Race stats ─────────────────────────────────────────────────────────────
  raceStats: DEFAULT_RACE_STATS,

  // ── Actions ────────────────────────────────────────────────────────────────
  setCarPosition: (pos: THREE.Vector3) =>
    set({ carPosition: pos }),

  setSplineProgress: (t: number) =>
    set({ splineProgress: Math.max(0, Math.min(1, t)) }),

  setCurrentSector: (sector: 1 | 2 | 3) =>
    set((state) => {
      // Track how many sectors completed (only increment when advancing)
      if (sector > state.currentSector) {
        return {
          currentSector: sector,
          raceStats: {
            ...state.raceStats,
            sectorsCompleted: sector - 1,
          },
        }
      }
      return { currentSector: sector }
    }),

  setNearbyPOI: (poi: POI | null) =>
    set({ nearbyPOI: poi }),

  openOverlay: (type: OverlayType) =>
    set({ isPaused: true, activeOverlay: type }),

  closeOverlay: () =>
    set({ isPaused: false, activeOverlay: null }),

  incrementPOIsExplored: () =>
    set((state) => ({
      raceStats: {
        ...state.raceStats,
        poisExplored: state.raceStats.poisExplored + 1,
      },
    })),

  incrementProjectsViewed: () =>
    set((state) => ({
      raceStats: {
        ...state.raceStats,
        projectsViewed: state.raceStats.projectsViewed + 1,
      },
    })),

  tickTimeOnTrack: () =>
    set((state) => ({
      raceStats: {
        ...state.raceStats,
        timeOnTrack: state.raceStats.timeOnTrack + 1,
      },
    })),

  resetRace: () =>
    set({
      gamePhase: 'garage',
      selectedCar: null,
      carPosition: new THREE.Vector3(0, 0, 0),
      splineProgress: 0,
      currentSector: 1,
      nearbyPOI: null,
      isPaused: false,
      activeOverlay: null,
      raceStats: DEFAULT_RACE_STATS,
    }),
}))

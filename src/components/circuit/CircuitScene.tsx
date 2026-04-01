'use client'
/**
 * CircuitScene — the Phase 3 game screen.
 *
 * Layout:
 *   <Canvas>
 *     ├─ Lighting (ambient + directional)
 *     ├─ Stars (background)
 *     ├─ TrackMesh (road + kerbs + grass ribbons)
 *     ├─ TrackElements (sector gates, POI posts, timing tower)
 *     └─ CarPhysics (physics loop → CarModel + FollowCamera)
 *   </Canvas>
 *
 *   HTML overlays (outside Canvas, pointer-events: none):
 *     • Sector name + lap progress bar (top)
 *     • CircuitMinimap (bottom-left)
 *     • Keyboard hints (bottom-right)
 *     • M / S mute toggles (top-left)
 *
 * Audio:
 *   • CircuitEngine (continuous engine drone, speed-reactive)
 *   • Engine starts on mount, stops on unmount / ESC / SFX mute
 */

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, AdaptiveDpr } from '@react-three/drei'
import { useGameStore } from '@/store/gameStore'
import { useAudioStore } from '@/store/audioStore'
import { CircuitEngine } from '@/lib/circuitEngine'
import { TrackMesh } from './TrackMesh'
import { TrackElements } from './TrackElements'
import { CarPhysics } from './CarPhysics'
import { CircuitMinimap } from './CircuitMinimap'
import { LoadingScreen } from './LoadingScreen'

const SECTOR_NAMES  = ['ORIGINS', 'PIT LANE', 'STRAIGHTS']
const SECTOR_COLORS = ['#4488ff', '#ff8844', '#44ff88']

export function CircuitScene() {
  const { setGamePhase, splineProgress, currentSector } = useGameStore()
  const { isMuted, isVoiceMuted, masterVolume, sfxVolume, toggleMute, toggleVoiceMute } = useAudioStore()

  const engineRef     = useRef<CircuitEngine | null>(null)
  const engineRunning = useRef(false)

  // ── Start continuous engine drone ────────────────────────────────────────
  useEffect(() => {
    if (isVoiceMuted) return
    const engine = new CircuitEngine()
    engineRef.current = engine
    engineRunning.current = true
    engine.start(masterVolume * sfxVolume)

    return () => {
      engine.stop()
      engineRunning.current = false
      engineRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Stop / restart engine when SFX mute toggles ──────────────────────────
  useEffect(() => {
    if (isVoiceMuted) {
      engineRef.current?.stop()
      engineRunning.current = false
      engineRef.current = null
    } else if (!engineRunning.current) {
      const engine = new CircuitEngine()
      engineRef.current = engine
      engineRunning.current = true
      engine.start(masterVolume * sfxVolume)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceMuted])

  // ── Keyboard: ESC → garage, M → music mute ──────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        engineRef.current?.stop()
        setGamePhase('garage')
      }
      if (e.key === 'm' || e.key === 'M') toggleMute()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setGamePhase, toggleMute])

  const sectorColor = SECTOR_COLORS[currentSector - 1]
  const sectorName  = SECTOR_NAMES[currentSector - 1]

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}>

      {/* ── 3D Canvas ─────────────────────────────────────────────────────── */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ position: [0, 8, 15], fov: 60, near: 0.1, far: 400 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <AdaptiveDpr pixelated />

          {/* Atmospheric fog — hides far track ends, adds depth */}
          <fog attach="fog" args={['#080810', 80, 220]} />

          {/* Lighting */}
          <ambientLight intensity={0.25} color="#303040" />
          <directionalLight
            position={[60, 100, 40]}
            intensity={1.6}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={1}
            shadow-camera-far={300}
            shadow-camera-left={-120}
            shadow-camera-right={120}
            shadow-camera-top={120}
            shadow-camera-bottom={-120}
          />
          {/* Rim light from the opposite side for depth */}
          <directionalLight position={[-40, 30, -60]} intensity={0.4} color="#2244aa" />

          {/* Night sky */}
          <Stars radius={180} depth={60} count={4000} factor={4} fade speed={0.8} />

          {/* Track */}
          <TrackMesh />

          {/* Scene dressing: gates, POI posts, timing tower */}
          <TrackElements />

          {/* Car physics, model, and follow camera */}
          <CarPhysics engineRef={engineRef} />
        </Canvas>
      </Suspense>

      {/* ── Lap progress bar (top, full width) ─────────────────────────────── */}
      <div style={{
        position:  'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'rgba(255,255,255,0.08)',
        pointerEvents: 'none',
      }}>
        <div style={{
          height:     '100%',
          width:      `${splineProgress * 100}%`,
          background: sectorColor,
          transition: 'width 0.12s linear, background-color 0.5s ease',
        }} />
      </div>

      {/* ── Sector name HUD (top-right) ─────────────────────────────────────── */}
      <div style={{
        position:      'absolute', top: 20, right: 24,
        color:         sectorColor,
        fontFamily:    'var(--font-geist-mono), monospace',
        textAlign:     'right',
        pointerEvents: 'none',
        userSelect:    'none',
      }}>
        <div style={{ fontSize: 9,  letterSpacing: 3, opacity: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>
          Sector
        </div>
        <div style={{ fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
          {sectorName}
        </div>
        <div style={{ fontSize: 9, letterSpacing: 1, opacity: 0.35, marginTop: 4 }}>
          {Math.round(splineProgress * 100)}% lap
        </div>
      </div>

      {/* ── Audio toggles (top-left) ────────────────────────────────────────── */}
      <div style={{
        position:   'absolute', top: 20, left: 24,
        display:    'flex', gap: 8,
        fontFamily: 'var(--font-geist-mono), monospace',
      }}>
        {[
          { key: 'M', label: 'Music', active: !isMuted,       onClick: toggleMute },
          { key: 'S', label: 'SFX',   active: !isVoiceMuted,  onClick: toggleVoiceMute },
        ].map(({ key: k, label, active, onClick }) => (
          <button
            key={k}
            onClick={onClick}
            style={{
              background:  active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              border:      `1px solid ${active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
              color:       active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)',
              borderRadius: 4,
              padding:     '3px 8px',
              fontSize:    9,
              letterSpacing: 1.5,
              cursor:      'pointer',
              fontFamily:  'inherit',
            }}
          >
            [{k}] {label}
          </button>
        ))}
      </div>

      {/* ── Minimap ─────────────────────────────────────────────────────────── */}
      <CircuitMinimap />

      {/* ── Keyboard hints (bottom-right) ────────────────────────────────────── */}
      <div style={{
        position:      'absolute', bottom: 24, right: 24,
        color:         'rgba(255,255,255,0.28)',
        fontFamily:    'var(--font-geist-mono), monospace',
        fontSize:      9,
        letterSpacing: 1.5,
        lineHeight:    2.0,
        textAlign:     'right',
        pointerEvents: 'none',
        userSelect:    'none',
      }}>
        <div>W / ↑ &nbsp; ACCELERATE</div>
        <div>S / ↓ &nbsp; BRAKE</div>
        <div>A / D / ←→ &nbsp; STEER</div>
        <div>ESC &nbsp; RETURN TO GARAGE</div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'
import { useGameStore } from '@/store/gameStore'
import { useAudioStore } from '@/store/audioStore'
import { teamCards } from '@/data/f1Mappings'
import { playEngineRoar } from '@/lib/engineSynth'
import type { CarTeam } from '@/types'

// Visual timing (ms) — tuned to match F1-lights-out-audio.m4a pacing
const LIGHT_INTERVAL    = 1000   // gap between each light turning red
const HOLD_AFTER_5TH   = 500    // brief pause then random hold starts
const MIN_HOLD          = 600
const MAX_HOLD          = 2500
const BLACKOUT_DURATION = 500

type SequencePhase =
  | 'fade-in'
  | 'lights-on'
  | 'hold'
  | 'lights-out'
  | 'blackout'

export function LightsOutSequence() {
  const { selectedCar, setGamePhase } = useGameStore()
  // isMuted = music (M key), isVoiceMuted = SFX (S key)
  const { isVoiceMuted, masterVolume, sfxVolume } = useAudioStore()

  const [phase, setPhase] = useState<SequencePhase>('fade-in')
  const [litCount, setLitCount] = useState(0)
  const [lightsOut, setLightsOut] = useState(false)

  const sequenceSoundRef = useRef<Howl | null>(null)
  const team = selectedCar ? teamCards[selectedCar as CarTeam] : teamCards.mercedes

  // Load the full F1 lights-out audio track (covers entire sequence)
  useEffect(() => {
    sequenceSoundRef.current = new Howl({
      src: ['/audio/F1-lights-out-audio.m4a'],
      volume: isVoiceMuted ? 0 : masterVolume * sfxVolume,
    })
    return () => { sequenceSoundRef.current?.unload() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync SFX mute live
  useEffect(() => {
    const vol = isVoiceMuted ? 0 : masterVolume * sfxVolume
    sequenceSoundRef.current?.volume(vol)
  }, [isVoiceMuted, masterVolume, sfxVolume])

  // Phase: fade-in → lights-on (play audio here)
  useEffect(() => {
    const t = setTimeout(() => {
      sequenceSoundRef.current?.play()
      setPhase('lights-on')
    }, 800)
    return () => clearTimeout(t)
  }, [])

  // Phase: lights-on — illuminate one light per interval
  useEffect(() => {
    if (phase !== 'lights-on') return
    let count = 0
    const interval = setInterval(() => {
      count++
      setLitCount(count)
      if (count === 5) {
        clearInterval(interval)
        setTimeout(() => setPhase('hold'), HOLD_AFTER_5TH)
      }
    }, LIGHT_INTERVAL)
    return () => clearInterval(interval)
  }, [phase])

  // Phase: hold — random tension pause
  useEffect(() => {
    if (phase !== 'hold') return
    const holdTime = MIN_HOLD + Math.random() * (MAX_HOLD - MIN_HOLD)
    const t = setTimeout(() => {
      setLightsOut(true)
      setPhase('lights-out')
      if (!isVoiceMuted) playEngineRoar(masterVolume * sfxVolume)
    }, holdTime)
    return () => clearTimeout(t)
  }, [phase])

  // Phase: lights-out → blackout
  useEffect(() => {
    if (phase !== 'lights-out') return
    const t = setTimeout(() => setPhase('blackout'), 800)
    return () => clearTimeout(t)
  }, [phase])

  // Phase: blackout → circuit
  useEffect(() => {
    if (phase !== 'blackout') return
    const t = setTimeout(() => setGamePhase('circuit'), BLACKOUT_DURATION)
    return () => clearTimeout(t)
  }, [phase, setGamePhase])

  // ESC → back to garage
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setGamePhase('garage')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setGamePhase])

  return (
    <AnimatePresence>
      <motion.div
        key="lights-out-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'blackout' ? 0 : 1 }}
        transition={{ duration: phase === 'blackout' ? 0.5 : 0.6 }}
        style={{
          width: '100vw',
          height: '100vh',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          fontFamily: 'var(--font-geist-mono), monospace',
        }}
      >
        {/* Car silhouette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
        >
          <div style={{ position: 'relative', width: 160, height: 52 }}>
            <div style={{
              position: 'absolute', top: 8, left: 0, right: 0, height: 28,
              borderRadius: '40px 40px 6px 6px',
              background: team.accentColor,
              boxShadow: `0 0 40px ${team.accentColor}66`,
            }} />
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 48, height: 20, borderRadius: '50% 50% 0 0',
              background: team.accentColor, filter: 'brightness(0.7)',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, right: -12, width: 32, height: 8,
              borderRadius: 4, background: team.accentColor, filter: 'brightness(0.8)',
            }} />
            <div style={{
              position: 'absolute', top: 4, left: -8, width: 20, height: 10,
              borderRadius: 3, background: team.accentColor, filter: 'brightness(0.8)',
            }} />
          </div>
          <div style={{ color: team.accentColor, fontSize: 11, letterSpacing: 3, opacity: 0.7 }}>
            {team.name.toUpperCase()} · #{team.number}
          </div>
        </motion.div>

        {/* Lights panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            display: 'flex', gap: 16,
            background: '#111', padding: '20px 32px',
            borderRadius: 12, border: '1px solid #222',
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                background: lightsOut ? '#1a0000' : i < litCount ? '#cc0000' : '#1a0000',
                boxShadow: lightsOut || i >= litCount
                  ? 'none'
                  : '0 0 16px #cc000099, 0 0 32px #cc000044',
              }}
              transition={{ duration: 0.15 }}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #333' }}
            />
          ))}
        </motion.div>

        {/* Status text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          style={{ color: '#888', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}
        >
          {(phase === 'fade-in') && 'Preparing for race start…'}
          {(phase === 'lights-on' || phase === 'hold') && 'Lights on the grid'}
          {phase === 'lights-out' && "It's lights out and away we go!"}
        </motion.div>

        {/* ESC hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: 24, color: '#666', fontSize: 11, letterSpacing: 2 }}
        >
          ESC to return to garage
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

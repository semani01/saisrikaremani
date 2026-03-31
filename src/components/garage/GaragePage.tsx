'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CarCard } from './CarCard'
import { LightsRow } from './LightsRow'
import { KeyboardHints } from './KeyboardHints'
import { GarageMusic } from '@/components/audio/GarageMusic'
import { teamCards } from '@/data/f1Mappings'
import { useGameStore } from '@/store/gameStore'
import type { CarTeam } from '@/types'

const TEAM_ORDER: CarTeam[] = ['mercedes', 'ferrari', 'mclaren', 'redbull']

export function GaragePage() {
  const { setSelectedCar, setGamePhase } = useGameStore()
  const [keyboardIndex, setKeyboardIndex] = useState<number | null>(null)

  function handleSelect(car: CarTeam) {
    setSelectedCar(car)
    setGamePhase('lights-out')
  }

  // Keyboard controls: 1–4 to highlight, Enter to select, M/S handled in KeyboardHints
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= '1' && e.key <= '4') {
        setKeyboardIndex(parseInt(e.key) - 1)
      } else if (e.key === 'Enter' && keyboardIndex !== null) {
        handleSelect(TEAM_ORDER[keyboardIndex])
      } else if (e.key === 'ArrowLeft') {
        setKeyboardIndex((prev) => (prev === null ? 0 : Math.max(0, prev - 1)))
      } else if (e.key === 'ArrowRight') {
        setKeyboardIndex((prev) => (prev === null ? 0 : Math.min(3, prev + 1)))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keyboardIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    <GarageMusic />
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#0a0a0e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-geist-sans), sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 820,
        background: '#0f0f13',
        borderRadius: 12,
        margin: '24px 16px',
      }}>

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 28px 0' }}
        >
          <div>
            <div style={{ color: '#e8e6e0', fontSize: 22, fontWeight: 500, letterSpacing: 0.5 }}>
              Sai Srikar Emani
            </div>
            <div style={{ color: '#7a786f', fontSize: 13, marginTop: 2 }}>
              ML engineer · full-stack developer · builder
            </div>
          </div>
          <div style={{ color: '#5a584f', fontSize: 12, textAlign: 'right', lineHeight: 1.6 }}>
            Austin, TX<br />MS Computer Science, CU Denver
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ textAlign: 'center', padding: '32px 0 8px' }}
        >
          <div style={{
            color: '#a09e96',
            fontSize: 12,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontFamily: 'var(--font-geist-mono), monospace',
          }}>
            Portfolio Grand Prix
          </div>
          <div style={{ color: '#e8e6e0', fontSize: 18, fontWeight: 500, marginTop: 8 }}>
            Select your car to begin the race
          </div>
        </motion.div>

        {/* Lights */}
        <LightsRow />

        {/* Car grid */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 14,
            padding: '8px 28px 28px',
          }}
        >
          {TEAM_ORDER.map((teamId, i) => {
            const team = teamCards[teamId]
            return (
              <motion.div
                key={teamId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                <CarCard
                  id={teamId}
                  name={team.name}
                  tagline={team.tagline}
                  number={team.number}
                  accentColor={team.accentColor}
                  bgColor={team.bgColor}
                  borderColor={team.borderColor}
                  stats={team.stats}
                  isKeyboardFocused={keyboardIndex === i}
                  onSelect={handleSelect}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Keyboard hints */}
        <KeyboardHints />
      </div>
    </div>
    </>
  )
}

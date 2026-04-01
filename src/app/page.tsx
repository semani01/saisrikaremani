'use client'

import { useGameStore } from '@/store/gameStore'
import { GaragePage } from '@/components/garage/GaragePage'
import { LightsOutSequence } from '@/components/lights/LightsOutSequence'
import { CircuitScene } from '@/components/circuit/CircuitScene'

export default function Home() {
  const { gamePhase } = useGameStore()

  if (gamePhase === 'lights-out') return <LightsOutSequence />
  if (gamePhase === 'circuit')    return <CircuitScene />

  // 'podium' falls back to garage until Phase 7
  return <GaragePage />
}

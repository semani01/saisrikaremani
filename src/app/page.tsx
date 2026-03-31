'use client'

import { useGameStore } from '@/store/gameStore'
import { GaragePage } from '@/components/garage/GaragePage'
import { LightsOutSequence } from '@/components/lights/LightsOutSequence'

export default function Home() {
  const { gamePhase } = useGameStore()

  if (gamePhase === 'lights-out') return <LightsOutSequence />

  // 'circuit' and 'podium' phases land here until Phase 3/7 are built
  return <GaragePage />
}

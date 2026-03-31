'use client'

import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { useAudioStore } from '@/store/audioStore'

export function GarageMusic() {
  const howlRef = useRef<Howl | null>(null)
  const { isMuted, masterVolume, musicVolume } = useAudioStore()

  useEffect(() => {
    const howl = new Howl({
      src: ['/audio/joyinsound-sports-energetic-background-music-390232.mp3'],
      loop: true,
      volume: 0,
    })

    howlRef.current = howl
    howl.play()

    // Fade in over 1.5s
    howl.fade(0, masterVolume * musicVolume, 1500)

    return () => {
      // Quick fade out when transitioning away from garage
      howl.fade(howl.volume(), 0, 400)
      setTimeout(() => howl.stop(), 420)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync mute state
  useEffect(() => {
    if (!howlRef.current) return
    if (isMuted) {
      howlRef.current.fade(howlRef.current.volume(), 0, 300)
    } else {
      howlRef.current.fade(howlRef.current.volume(), masterVolume * musicVolume, 300)
    }
  }, [isMuted, masterVolume, musicVolume])

  return null
}

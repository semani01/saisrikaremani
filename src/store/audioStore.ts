import { create } from 'zustand'
import type { AudioStore } from '@/types'

export const useAudioStore = create<AudioStore>((set) => ({
  isMuted: false,
  isVoiceMuted: false,
  masterVolume: 0.8,
  musicVolume: 0.5,
  sfxVolume: 0.7,

  toggleMute: () =>
    set((state) => ({ isMuted: !state.isMuted })),

  toggleVoiceMute: () =>
    set((state) => ({ isVoiceMuted: !state.isVoiceMuted })),

  setVolume: (channel, value) => {
    const clamped = Math.max(0, Math.min(1, value))
    if (channel === 'master') return set({ masterVolume: clamped })
    if (channel === 'music') return set({ musicVolume: clamped })
    if (channel === 'sfx') return set({ sfxVolume: clamped })
  },
}))

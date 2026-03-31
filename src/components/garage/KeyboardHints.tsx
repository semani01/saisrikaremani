'use client'

import { motion } from 'framer-motion'
import { useAudioStore } from '@/store/audioStore'

function Hint({ keyLabel, label, onClick }: { keyLabel: string; label: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={onClick ? 'cursor-pointer select-none' : ''}
      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
    >
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        border: '1px solid #3a3830',
        borderRadius: 4,
        color: '#7a786f',
        fontSize: 11,
        fontFamily: 'var(--font-geist-mono), monospace',
      }}>
        {keyLabel}
      </span>
      <span style={{ color: '#4a4840', fontSize: 12 }}>{label}</span>
    </div>
  )
}

export function KeyboardHints() {
  const { isMuted, isVoiceMuted, toggleMute, toggleVoiceMute } = useAudioStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '0 28px 28px' }}
    >
      <Hint keyLabel="Click" label="select car" />
      <Hint keyLabel="1–4" label="highlight car" />
      <Hint keyLabel="M" label={isMuted ? 'music off' : 'music on'} onClick={toggleMute} />
      <Hint keyLabel="S" label={isVoiceMuted ? 'sfx off' : 'sfx on'} onClick={toggleVoiceMute} />
    </motion.div>
  )
}

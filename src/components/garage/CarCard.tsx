'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CarTeam } from '@/types'

interface Stat {
  label: string
  value: string
}

interface CarCardProps {
  id: CarTeam
  name: string
  tagline: string
  number: string
  accentColor: string
  bgColor: string
  borderColor: string
  stats: Stat[]
  isKeyboardFocused: boolean
  onSelect: (id: CarTeam) => void
}

export function CarCard({
  id,
  name,
  tagline,
  number,
  accentColor,
  bgColor,
  borderColor,
  stats,
  isKeyboardFocused,
  onSelect,
}: CarCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const active = isHovered || isKeyboardFocused

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(id)}
      style={{
        background: bgColor,
        border: `1.5px solid ${active ? accentColor : borderColor}`,
        borderRadius: 10,
        padding: '20px 14px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color 0.2s, box-shadow 0.25s',
        boxShadow: active ? `0 0 0 1px ${accentColor}22, 0 8px 28px ${accentColor}22` : 'none',
        height: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Car number watermark */}
      <span style={{
        position: 'absolute',
        top: 8,
        right: 10,
        fontSize: 20,
        fontWeight: 500,
        color: accentColor,
        opacity: 0.18,
        fontFamily: 'var(--font-geist-mono), monospace',
        userSelect: 'none',
      }}>
        {number}
      </span>

      {/* Car silhouette — slides up slightly on hover */}
      <motion.div
        animate={{ y: active ? -4 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          width: 80,
          height: 36,
          borderRadius: '18px 18px 4px 4px',
          background: accentColor,
          position: 'relative',
          flexShrink: 0,
          boxShadow: active ? `0 0 20px ${accentColor}66` : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: 6,
          borderRadius: '0 0 3px 3px',
          background: 'rgba(0,0,0,0.35)',
        }} />
      </motion.div>

      {/* Team name — always visible */}
      <div style={{ color: '#c8c6be', fontSize: 14, fontWeight: 500, marginTop: 12, flexShrink: 0 }}>
        {name}
      </div>

      {/* Bottom area — crossfades between tagline and stats+button */}
      <div style={{ position: 'relative', width: '100%', flex: 1, marginTop: 6 }}>
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div
              key="tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                color: '#6a6860',
                fontSize: 12,
                position: 'absolute',
                width: '100%',
                top: 0,
              }}
            >
              {tagline}
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                width: '100%',
                top: 0,
              }}
            >
              <div style={{ borderTop: `1px solid ${accentColor}33`, paddingTop: 8, marginBottom: 8 }}>
                {stats.map((stat) => (
                  <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#5a5850', fontSize: 10 }}>{stat.label}</span>
                    <span style={{ color: accentColor, fontSize: 10, fontWeight: 600 }}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onSelect(id) }}
                style={{
                  width: '100%',
                  padding: '5px 0',
                  borderRadius: 5,
                  background: accentColor,
                  color: '#0f0f13',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                Select
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

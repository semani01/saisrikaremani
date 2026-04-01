'use client'
/**
 * LoadingScreen — shown via Suspense while the R3F Canvas initialises and
 * drei's Text component loads its font assets.
 */

import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { progress } = useProgress()

  return (
    <div style={{
      width:          '100vw',
      height:         '100vh',
      background:     '#000000',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     'var(--font-geist-mono), monospace',
      gap:            16,
    }}>
      {/* Animated dot grid (3×3 pulse) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,8px)', gap: 5, marginBottom: 8 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            style={{
              width:        8,
              height:       8,
              borderRadius: '50%',
              background:   '#ff1801',
              opacity:      0.3 + (i % 3) * 0.3,
              animation:    `pulse ${0.8 + (i % 3) * 0.2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
        Building Circuit
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
        <div style={{
          height:     '100%',
          width:      `${progress}%`,
          background: '#ff1801',
          borderRadius: 1,
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.2)' }}>
        {Math.round(progress)}%
      </div>

      <style>{`@keyframes pulse { from { opacity: 0.2; } to { opacity: 1; } }`}</style>
    </div>
  )
}

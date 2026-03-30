'use client'

/**
 * page.tsx — Entry point for Portfolio Grand Prix
 *
 * Phase 0: Renders a blank R3F Canvas with a red box to confirm
 * React Three Fiber is wired up correctly. Background matches
 * the portfolio dark theme (#0f0f13).
 *
 * Phase 1+: Replace <SceneTest /> with <GameRoot /> which routes
 * to the correct phase component based on gameStore.gamePhase.
 */

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function SceneTest() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#dc1430" />
      </mesh>
      <OrbitControls />
    </>
  )
}

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', background: '#0f0f13' }}>
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
        <SceneTest />
      </Canvas>

      {/* Phase 0 label — remove in Phase 1 */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#5a5850',
          fontSize: 12,
          fontFamily: 'monospace',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        Portfolio Grand Prix — Phase 0 scaffold ✓
      </div>
    </main>
  )
}

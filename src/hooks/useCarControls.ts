'use client'
/**
 * useCarControls — tracks keyboard state for driving the car on the circuit.
 *
 * Returns a stable ref (not state) so the physics loop can read it each frame
 * without triggering any React re-renders.
 *
 * Controls:
 *   W / ArrowUp    — accelerate
 *   S / ArrowDown  — brake
 *   A / ArrowLeft  — steer left
 *   D / ArrowRight — steer right
 */

import { useEffect, useRef, type MutableRefObject } from 'react'

export interface CarKeys {
  forward:  boolean
  backward: boolean
  left:     boolean
  right:    boolean
}

export function useCarControls(): MutableRefObject<CarKeys> {
  const keys = useRef<CarKeys>({ forward: false, backward: false, left: false, right: false })

  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': keys.current.forward  = true;  e.preventDefault(); break
        case 'ArrowDown':  case 's': case 'S': keys.current.backward = true;  e.preventDefault(); break
        case 'ArrowLeft':  case 'a': case 'A': keys.current.left     = true;  e.preventDefault(); break
        case 'ArrowRight': case 'd': case 'D': keys.current.right    = true;  e.preventDefault(); break
      }
    }
    function onUp(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': keys.current.forward  = false; break
        case 'ArrowDown':  case 's': case 'S': keys.current.backward = false; break
        case 'ArrowLeft':  case 'a': case 'A': keys.current.left     = false; break
        case 'ArrowRight': case 'd': case 'D': keys.current.right    = false; break
      }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  return keys
}

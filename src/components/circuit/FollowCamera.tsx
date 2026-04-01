'use client'
/**
 * FollowCamera — smooth chase camera that sits behind and above the car.
 *
 * Reads position and rotation from refs (updated by CarPhysics) and lerps
 * the Canvas default camera toward an ideal position each frame.
 *
 * Camera offset: 10 units behind, 6 units above.
 * Look-at target: 5 units ahead of the car, at car height + 1.
 */

import { useRef } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'

interface FollowCameraProps {
  positionRef: React.MutableRefObject<THREE.Vector3>
  rotationRef: React.MutableRefObject<number>
}

const BEHIND_DIST   = 10
const CAMERA_HEIGHT = 6
const LOOK_AHEAD    = 5
const LERP_SPEED    = 3.5

export function FollowCamera({ positionRef, rotationRef }: FollowCameraProps) {
  const { camera } = useThree()
  const camPos   = useRef(new THREE.Vector3(0, 8, 15))
  const lookAtPt = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const pos = positionRef.current
    const rot = rotationRef.current

    const lf = Math.min(delta * LERP_SPEED, 1)

    // rot = atan2(-tx,-tz), so local +Z dir in world = (sin(rot), 0, cos(rot))
    // Rear of car is in local +Z direction (same formula as car rotation)
    const sinR = Math.sin(rot)
    const cosR = Math.cos(rot)

    // Ideal camera position: behind (+Z local) and above
    const idealCam = new THREE.Vector3(
      pos.x + sinR * BEHIND_DIST,
      pos.y + CAMERA_HEIGHT,
      pos.z + cosR * BEHIND_DIST,
    )
    camPos.current.lerp(idealCam, lf)
    camera.position.copy(camPos.current)

    // Look slightly ahead of the car (nose direction = –Z local)
    const idealLook = new THREE.Vector3(
      pos.x - sinR * LOOK_AHEAD,
      pos.y + 1,
      pos.z - cosR * LOOK_AHEAD,
    )
    lookAtPt.current.lerp(idealLook, lf)
    camera.lookAt(lookAtPt.current)
  })

  return null
}

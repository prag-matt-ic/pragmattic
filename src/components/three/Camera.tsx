'use client'

import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useEffect, useRef } from 'react'
import { MathUtils } from 'three'

const MIN_POLAR_ANGLE = MathUtils.degToRad(80)
const MAX_POLAR_ANGLE = MathUtils.degToRad(100)

const MIN_AZIMUTH_ANGLE = -Math.PI / 8
const MAX_AZIMUTH_ANGLE = Math.PI / 8

const Camera: FC = () => {
  const cameraControls = useRef<CameraControls>(null)
  const size = useThree((s) => s.size)

  // Rotation values
  const targetPolarAngle = useRef({ value: 0 })
  const targetAzimuthAngle = useRef({ value: 0 })

  useEffect(() => {
    if (size.width < 480) return // Don't do on mobile

    const onPointerMove = (e: PointerEvent) => {
      const normalizedY = e.clientY / size.height
      const newPolarAngle = MathUtils.lerp(MIN_POLAR_ANGLE, MAX_POLAR_ANGLE, normalizedY)
      const normalizedX = e.clientX / size.width
      const newAzimuthAngle = MathUtils.lerp(MIN_AZIMUTH_ANGLE, MAX_AZIMUTH_ANGLE, normalizedX)

      targetPolarAngle.current.value = newPolarAngle
      targetAzimuthAngle.current.value = newAzimuthAngle
    }
    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [size])

  useFrame((_, delta) => {
    if (!cameraControls.current) return

    // Move camera to pointer position with lerp for smoothness

    if (cameraControls.current.azimuthAngle !== targetAzimuthAngle.current.value) {
      const newAziumuthAngle = MathUtils.lerp(
        cameraControls.current.azimuthAngle,
        targetAzimuthAngle.current.value,
        delta * 4,
      )
      cameraControls.current.rotateAzimuthTo(newAziumuthAngle, false)
    }

    if (cameraControls.current.polarAngle !== targetPolarAngle.current.value) {
      const newPolarAngle = MathUtils.lerp(cameraControls.current.polarAngle, targetPolarAngle.current.value, delta * 4)
      cameraControls.current.rotatePolarTo(newPolarAngle, false)
    }
  })

  return (
    <CameraControls
      ref={cameraControls}
      minPolarAngle={MIN_POLAR_ANGLE}
      maxPolarAngle={MAX_POLAR_ANGLE}
      minAzimuthAngle={MIN_AZIMUTH_ANGLE}
      maxAzimuthAngle={MAX_AZIMUTH_ANGLE}
      makeDefault={true}
      mouseButtons={{
        left: 0,
        middle: 0,
        right: 0,
        wheel: 0,
      }}
    />
  )
}

export default Camera

'use client'
import { useGSAP } from '@gsap/react'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useMemo, useRef } from 'react'
import { AdditiveBlending, BufferAttribute, ShaderMaterial } from 'three'

import { HALF_TUNNEL_LENGTH, TUNNEL_LENGTH, TUNNEL_RADIUS } from '../cylinder/EnergyTunnel'
import fragmentShader from './energyPoint.frag'
import vertexShader from './energyPoint.vert'

type Props = {}

const HALF_TUNNEL_RADIUS = TUNNEL_RADIUS / 2

type Uniforms = {
  uTime: number
  uHalfTunnelLength: number
  uEnterProgress: number
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uHalfTunnelLength: TUNNEL_LENGTH / 2,
  uEnterProgress: 0,
}

const EnergyPointsShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ EnergyPointsShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    energyPointsShaderMaterial: ShaderMaterialProps & Uniforms
  }
}

const NUMBER_OF_POINTS = 96

const EnergyTunnelPoints: FC<Props> = ({}) => {
  const shaderMaterial = useRef<ShaderMaterial & Uniforms>(null)
  const positions = useRef<BufferAttribute>(null)

  const enterProgress = useRef({ value: 0.0 })

  useGSAP(
    () => {
      gsap.to(enterProgress.current, {
        value: 1,
        duration: 1.4,
        delay: 0.5,
        ease: 'power2.in',
      })
    },
    {
      dependencies: [],
    },
  )

  const initialPointPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < NUMBER_OF_POINTS; i++) {
      const x = Math.random() * TUNNEL_RADIUS - HALF_TUNNEL_RADIUS
      const y = Math.random() * TUNNEL_LENGTH - HALF_TUNNEL_LENGTH
      const z = Math.random() * TUNNEL_RADIUS - HALF_TUNNEL_RADIUS
      positions.push(x, y, z)
    }
    return new Float32Array(positions)
  }, [])

  // Used to randomise sparkle animation and point sizes
  const sparkleSeeds = useMemo(() => {
    const seeds = []
    for (let i = 0; i < NUMBER_OF_POINTS; i++) {
      seeds.push(Math.random())
    }
    return new Float32Array(seeds)
  }, [])

  useFrame(({ clock }) => {
    if (!positions.current) return
    if (!shaderMaterial.current) return

    shaderMaterial.current.uTime = clock.elapsedTime
    shaderMaterial.current.uEnterProgress = enterProgress.current.value

    // Move the points up until they reach max Y, then reset
    const positionsArray = positions.current.array
    for (let i = 1; i < positionsArray.length; i += 3) {
      positionsArray[i] += 0.005
      if (positionsArray[i] >= HALF_TUNNEL_LENGTH) {
        positionsArray[i] = -HALF_TUNNEL_LENGTH
      }
    }
    positions.current.needsUpdate = true
  })

  return (
    <points dispose={null}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={positions}
          attach="attributes-position"
          array={initialPointPositions}
          count={initialPointPositions.length / 3}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-seed" array={sparkleSeeds} count={sparkleSeeds.length} itemSize={1} />
      </bufferGeometry>
      <energyPointsShaderMaterial
        ref={shaderMaterial}
        key={EnergyPointsShaderMaterial.key}
        attach="material"
        transparent={true}
        depthTest={false}
        blending={AdditiveBlending}
        uTime={0}
        uEnterProgress={0}
        uHalfTunnelLength={HALF_TUNNEL_LENGTH}
      />
    </points>
  )
}

export default EnergyTunnelPoints

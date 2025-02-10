'use client'
import { useGSAP } from '@gsap/react'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useMemo, useRef } from 'react'
import { AdditiveBlending, Points, ShaderMaterial } from 'three'

import fragment from './star.frag'
import vertex from './star.vert'

type Uniforms = {
  uTime: number
  uScrollProgress: number
}
const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uScrollProgress: 0,
} as const

const StarsParticleShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertex, fragment)

extend({ StarsParticleShaderMaterial })

const Stars: FC = () => {
  const particlesCount = 1024 * 8
  const particlesPositions: Float32Array = useMemo(() => getPositions(particlesCount), [particlesCount])
  const particlesShader = useRef<ShaderMaterial & Uniforms>(null)

  const points = useRef<Points>(null)
  const scrollProgress = useRef(0)

  useFrame(({ clock }) => {
    if (!particlesShader.current) return
    particlesShader.current.uTime = clock.elapsedTime
    particlesShader.current.uScrollProgress = scrollProgress.current
  })

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        scrub: true,
        onUpdate: ({ progress }) => {
          scrollProgress.current = progress
        },
      })
    },
    {
      dependencies: [],
    },
  )

  return (
    <points ref={points} scale={1} position={[0, 0, 0]}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={particlesPositions}
          count={particlesPositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <starsParticleShaderMaterial
        key={StarsParticleShaderMaterial.key}
        ref={particlesShader}
        depthTest={false}
        transparent={true}
        blending={AdditiveBlending}
        uTime={0}
        uScrollProgress={0}
      />
    </points>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      starsParticleShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}

const getPositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const zDepth = 4
    const z = Math.random() * zDepth

    const spread = z * 2

    const x = Math.random() * 2 - 1
    const y = Math.random() * 2 - 1

    const stride = i * 3
    positions[stride] = x * spread
    positions[stride + 1] = y * spread
    positions[stride + 2] = z
  }

  return positions
}

export default Stars

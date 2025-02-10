'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useMemo, useRef } from 'react'
import { AdditiveBlending, ShaderMaterial } from 'three'

import particleFragment from './particle.frag'
import particleVertex from './particle.vert'

type Uniforms = {
  uTime: number
}
const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
} as const

const ParallaxParticleShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, particleVertex, particleFragment)

extend({ ParallaxParticleShaderMaterial })

const ParallaxParticles: FC = () => {
  const particlesCount = 1024
  const particlesPositions: Float32Array = useMemo(() => getPositions(particlesCount), [particlesCount])
  const particlesShader = useRef<ShaderMaterial & Uniforms>(null)

  useFrame(({ clock }) => {
    if (!particlesShader.current) return
    particlesShader.current.uTime = clock.elapsedTime
  })

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={particlesPositions}
          count={particlesPositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <parallaxParticleShaderMaterial
        key={ParallaxParticleShaderMaterial.key}
        ref={particlesShader}
        uTime={0}
        depthTest={false}
        transparent={true}
        blending={AdditiveBlending}
      />
    </points>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      parallaxParticleShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}

export const getPositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3)

  const spread = 6

  for (let i = 0; i < count; i++) {
    const stride = i * 3
    const x = Math.random() * 2 - 1
    const y = Math.random() * 2 - 1
    const z = Math.random() * 6 - 2

    positions[stride] = x * spread
    positions[stride + 1] = y * spread
    positions[stride + 2] = z
  }

  return positions
}

export default ParallaxParticles

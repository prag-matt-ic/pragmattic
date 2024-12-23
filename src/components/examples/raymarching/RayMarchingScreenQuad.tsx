'use client'

import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { ShaderMaterial, Vector2 } from 'three'

// import textureFragment from './texture.frag'
import rayMarchingFragment from './raybox.frag'
// import gradientFragment from './gradient.frag'
import vertexShader from './screen.vert'

// Boilerplate for creating a screen quad shader - ideal for backgrounds, post-processing effects, etc.

type Uniforms = {
  uTime: number
  uAspect: number
  uPointer: Vector2
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1,
  uPointer: new Vector2(),
}

const RMScreenQuad = shaderMaterial(INITIAL_UNIFORMS, vertexShader, rayMarchingFragment)

extend({ RMScreenQuad })

const RayMarchingScreenQuadShader: FC = () => {
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock, pointer }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
    shader.current.uPointer = pointer
  })

  return (
    <ScreenQuad>
      <rMScreenQuad
        key={RMScreenQuad.key}
        ref={shader}
        // Uniforms
        uTime={0}
        uAspect={viewport.aspect}
        uPointer={new Vector2(0)}
      />
    </ScreenQuad>
  )
}

export default RayMarchingScreenQuadShader

declare global {
  namespace JSX {
    interface IntrinsicElements {
      rMScreenQuad: ShaderMaterialProps & Uniforms
    }
  }
}

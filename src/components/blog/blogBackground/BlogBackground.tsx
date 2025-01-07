'use client'
import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { Color, ShaderMaterial } from 'three'

import { BLACK_VEC3_RGB, LIGHT_VEC3_RGB, MID_VEC3_RGB } from '@/resources/colours'

import fragmentShader from './bg.frag'
import vertexShader from './bg.vert'

type Uniforms = {
  uTime: number
  uLightColour: Color
  uMidColour: Color
  uDarkColour: Color
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uLightColour: LIGHT_VEC3_RGB,
  uMidColour: MID_VEC3_RGB,
  uDarkColour: BLACK_VEC3_RGB,
}

const BlogBackgroundShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ BlogBackgroundShaderMaterial })

const BlogBackgroundCanvas: FC = () => {
  return (
    <Canvas
      className="!fixed inset-0"
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: 'low-power',
      }}>
      <BlogBackground />
    </Canvas>
  )
}

const BlogBackground: FC = () => {
  const material = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!material.current) return
    material.current.uTime = clock.elapsedTime
  })

  return (
    <ScreenQuad>
      <blogBackgroundShaderMaterial key={BlogBackgroundShaderMaterial.key} ref={material} uTime={0} />
    </ScreenQuad>
  )
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    blogBackgroundShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
  }
}

export default BlogBackgroundCanvas

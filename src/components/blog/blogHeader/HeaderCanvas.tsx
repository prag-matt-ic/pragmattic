'use client'
import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { Color, ShaderMaterial } from 'three'

import fragmentShader from './header.frag'
import vertexShader from './header.vert'

type Uniforms = {
  uTime: number
  uAspect: number
  uLightColour: Color
  uMidColour: Color
  uDarkColour: Color
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1,
  uLightColour: new Color('#7A718E').convertLinearToSRGB(),
  uMidColour: new Color('#2E2A37').convertLinearToSRGB(),
  uDarkColour: new Color('#0A090C').convertLinearToSRGB(),
}

const HeaderShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ HeaderShaderMaterial })

const HeaderCanvas: FC = () => {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: 'low-power',
      }}>
      <HeaderShader />
    </Canvas>
  )
}

const HeaderShader: FC = () => {
  const material = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!material.current) return
    material.current.uTime = clock.elapsedTime
  })

  return (
    <ScreenQuad>
      <headerShaderMaterial key={HeaderShaderMaterial.key} ref={material} uAspect={1} uTime={0} />
    </ScreenQuad>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      headerShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
    }
  }
}

export default HeaderCanvas

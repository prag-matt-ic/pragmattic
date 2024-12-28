'use client'
import { Plane } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { Color, ShaderMaterial } from 'three'

import { BLACK_VEC3, LIGHT_VEC3, MID_VEC3, OFF_BLACK_VEC3 } from '@/resources/colours'

import bgFragment from './background.frag'
import bgVertex from './background.vert'

type Uniforms = {
  uTime: number
  uAspect: number
  uLightColour: Color
  uMidColour: Color
  uOffBlackColour: Color
  uBlackColour: Color
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1,
  uLightColour: LIGHT_VEC3,
  uMidColour: MID_VEC3,
  uOffBlackColour: OFF_BLACK_VEC3,
  uBlackColour: BLACK_VEC3,
}

const HomeBackgroundShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, bgVertex, bgFragment)

extend({ HomeBackgroundShaderMaterial })

const HomeBackgroundPlane: FC = () => {
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <Plane args={[viewport.width * 3, viewport.height * 3, 1, 1]} position={[0, 0, -6]}>
      <homeBackgroundShaderMaterial
        key={HomeBackgroundShaderMaterial.key}
        ref={shader}
        uTime={0}
        uAspect={viewport.aspect}
      />
    </Plane>
  )
}

export default HomeBackgroundPlane

declare global {
  namespace JSX {
    interface IntrinsicElements {
      homeBackgroundShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
    }
  }
}

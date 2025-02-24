'use client'
import { Plane } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, type RefObject, useRef } from 'react'
import { Color, ShaderMaterial } from 'three'

import { BLACK_VEC3_RGB, LIGHT_VEC3_RGB, MID_VEC3_RGB, OFF_BLACK_VEC3_RGB } from '@/resources/colours'

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
  uLightColour: LIGHT_VEC3_RGB,
  uMidColour: MID_VEC3_RGB,
  uOffBlackColour: OFF_BLACK_VEC3_RGB,
  uBlackColour: BLACK_VEC3_RGB,
}

const HomeBackgroundShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, bgVertex, bgFragment)

extend({ HomeBackgroundShaderMaterial })

const HomeBackgroundPlane: FC = () => {
  const { viewport } = useThree()
  const shader = useRef<SM>(null)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <Plane args={[viewport.width * 3, viewport.height * 3, 1, 1]} position={[0, 0, -6]}>
      <homeBackgroundShaderMaterial
        key={HomeBackgroundShaderMaterial.key}
        ref={shader}
        {...INITIAL_UNIFORMS}
        uAspect={viewport.aspect}
      />
    </Plane>
  )
}

export default HomeBackgroundPlane

type SM = Partial<ShaderMaterial> & Uniforms & { ref: RefObject<SM | null>; key: string }

declare module '@react-three/fiber' {
  interface ThreeElements {
    homeBackgroundShaderMaterial: SM
  }
}

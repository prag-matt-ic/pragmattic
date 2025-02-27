'use client'
import { Plane } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { Color } from 'three'

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

const INITIAL_UNIFORMS: Partial<Uniforms> = {
  uTime: 0,
  uLightColour: LIGHT_VEC3_RGB,
  uMidColour: MID_VEC3_RGB,
  uOffBlackColour: OFF_BLACK_VEC3_RGB,
  uBlackColour: BLACK_VEC3_RGB,
}

const CustomShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, bgVertex, bgFragment)
const HomeBackgroundShaderMaterial = extend(CustomShaderMaterial)

const HomeBackgroundPlane: FC = () => {
  const { viewport } = useThree()
  const shader = useRef<typeof HomeBackgroundShaderMaterial & Uniforms>(null)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <Plane args={[viewport.width * 3, viewport.height * 3, 1, 1]} position={[0, 0, -6]}>
      <HomeBackgroundShaderMaterial
        key={CustomShaderMaterial.key}
        ref={shader}
        {...INITIAL_UNIFORMS}
        uAspect={viewport.aspect}
      />
    </Plane>
  )
}

export default HomeBackgroundPlane

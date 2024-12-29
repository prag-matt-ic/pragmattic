'use client'

import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { Color, ShaderMaterial } from 'three'

import vertexShader from './screen.vert'
import fragmentShader from './timeboxx.frag'

// Boilerplate for creating a screen quad shader - ideal for backgrounds, post-processing effects, etc.

type Uniforms = {
  uTime: number
  uAspect: number

  uBgColour: Color
  uGroundColour: Color
  uBgBoxColour: Color

  uIsActive: boolean
  uActiveBoxColour: Color
}

const BG_COLOUR = new Color('#030616').convertLinearToSRGB()
const GROUND_COLOUR = new Color('#111729').convertLinearToSRGB()
const BG_BOX_COLOR = new Color('#242C44').convertLinearToSRGB()

// D946EF - purple
// 15B8A6 - teal
const ACTIVE_BOX_COLOUR = new Color('#D946EF').convertLinearToSRGB()

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1,

  uBgColour: BG_COLOUR,
  uGroundColour: GROUND_COLOUR,
  uBgBoxColour: BG_BOX_COLOR,

  uIsActive: true,
  uActiveBoxColour: ACTIVE_BOX_COLOUR,
}

const TimeboxxShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ TimeboxxShaderMaterial })

type Props = {
  activeColour?: string
}

const TimeboxxArtShader: FC<Props> = ({ activeColour }) => {
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <ScreenQuad>
      <timeboxxShaderMaterial
        key={TimeboxxShaderMaterial.key}
        ref={shader}
        // Uniforms
        uTime={0}
        uAspect={viewport.aspect}
        uIsActive={true}
        uBgColour={BG_COLOUR}
        uGroundColour={GROUND_COLOUR}
        uBgBoxColour={BG_BOX_COLOR}
        uActiveBoxColour={ACTIVE_BOX_COLOUR}
      />
    </ScreenQuad>
  )
}

export default TimeboxxArtShader

declare module '@react-three/fiber' {
  interface ThreeElements {
    timeboxxShaderMaterial: ShaderMaterialProps & Uniforms
  }
}

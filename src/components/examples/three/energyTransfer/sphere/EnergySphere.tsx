import { shaderMaterial, ShapeProps, Sphere } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { Color, ShaderMaterial, SphereGeometry } from 'three'

import fragmentShader from './energySphere.frag'
import vertexShader from './energySphere.vert'

export const SPHERE_RADIUS = 0.2

type Uniforms = {
  uTime: number
  uSeed: number
  uColour: Color
  uIsOnLeft: boolean
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uSeed: 0,
  uColour: new Color('#ffffff'),
  uIsOnLeft: false,
}

const EnergySphereShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ EnergySphereShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    energySphereShaderMaterial: ShaderMaterialProps & Uniforms
  }
}

type Props = ShapeProps<typeof SphereGeometry> & {
  seed: number
  colour: Color
  isOnLeft: boolean
}

const EnergySphere: FC<Props> = ({ seed, colour, isOnLeft, ...props }) => {
  const shaderMaterial = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
  })

  return (
    <Sphere args={[SPHERE_RADIUS, 32, 32]} {...props}>
      <energySphereShaderMaterial
        key={EnergySphereShaderMaterial.key}
        ref={shaderMaterial}
        attach="material"
        // transparent={true}
        uTime={0}
        uSeed={seed}
        uColour={colour}
        uIsOnLeft={isOnLeft}
      />
    </Sphere>
  )
}

export default EnergySphere

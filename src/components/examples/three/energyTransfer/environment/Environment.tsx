import {
  Environment as EnvironmentDrei,
  shaderMaterial,
  Sphere,
  usePerformanceMonitor,
  useTexture,
} from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useRef, useState } from 'react'
import { BackSide, Color, ShaderMaterial, Texture } from 'three'

import fragmentShader from './environment.frag'
import vertexShader from './environment.vert'
// import useHomeStore from "@/hooks/useHomeStore";

type Uniforms = {
  uTime: number
  uDarkestColour: Color
  // uniform vec3 uCyanColour;
  // uniform vec3 uOrangeColour;
  // uniform vec3 uBlueColour;
  uCyanColour: Color
  uOrangeColour: Color
  uBlueColour: Color
  uTexture: Texture | null
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uDarkestColour: new Color('#000000'),
  // TODO: these need renaming as they don't match the names.
  uCyanColour: new Color('#5E2B7D'),
  uOrangeColour: new Color('#5A72FC'),
  uBlueColour: new Color('#1B2A83'),
  uTexture: null,
}

const EnvironmentShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ EnvironmentShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    environmentShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
  }
}

const Environment: FC = () => {
  // https://www.artstation.com/artwork/zPEmm2
  const texture = useTexture(
    '/images/environment/panos.jpg',
    // "https://cdnb.artstation.com/p/assets/panos/panos/074/909/667/medium/cecaaa372f280832.jpg?1713275782"
    // "https://cdnb.artstation.com/p/assets/panos/panos/074/909/685/large/67ed628115567a0a.jpg?1713275809"
  )

  const [resolution, setResolution] = useState(512)

  usePerformanceMonitor({
    onIncline: () => {
      if (resolution === 1024) return
      setResolution((r) => r * 2)
    },
    onDecline: () => {
      if (resolution === 64) return
      setResolution((r) => r / 2)
    },
    // onFallback,
    // onChange,
  })

  const shaderMaterial = useRef<ShaderMaterial & Uniforms>(null)

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
  })

  return (
    <EnvironmentDrei background={true} ground={false} frames={Infinity} far={8.5} resolution={resolution}>
      <Sphere position={[0, 0, 0]} args={[8, 24, 24]}>
        <environmentShaderMaterial
          ref={shaderMaterial}
          key={EnvironmentShaderMaterial.key}
          side={BackSide}
          uTexture={texture}
        />
      </Sphere>
    </EnvironmentDrei>
  )
}

export default Environment

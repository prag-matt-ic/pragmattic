'use client'
import { useGSAP } from '@gsap/react'
import { Cylinder, shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import React, { type FC, useRef } from 'react'
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three'

import fragmentShader from './energyTunnel.frag'
import vertexShader from './energyTunnel.vert'

gsap.registerPlugin(useGSAP)

const NUMBER_OF_LINES = 10
export const TUNNEL_LENGTH = 2.2
export const HALF_TUNNEL_LENGTH = TUNNEL_LENGTH / 2
export const TUNNEL_RADIUS = 0.08

// Cyan, light cyan, white
const COLOUR_OPTIONS: Color[] = [new Color('#37F3FF'), new Color('#D0FCFF'), new Color('#ffffff'), new Color('#FF6DF5')]

const getRandomLineColour = (): Color => COLOUR_OPTIONS[Math.floor(Math.random() * COLOUR_OPTIONS.length)]

const INITIAL_COLOURS = Array.from({ length: NUMBER_OF_LINES }, () => getRandomLineColour())

type Uniforms = {
  uTime: number
  uLinesParams: Float32Array | null
  uLinesProgress: Float32Array | null
  uLinesColour: Color[]
  uProgress: number
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uLinesParams: null,
  uLinesProgress: null,
  uLinesColour: INITIAL_COLOURS,
  uProgress: 0,
}

const EnergyCylinderShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ EnergyCylinderShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    energyCylinderShaderMaterial: ShaderMaterialProps & Uniforms
  }
}

type Props = {}

const EnergyTunnel: FC<Props> = ({}) => {
  const shaderMaterial = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  // const { progress } = useControls({
  //   progress: { value: 0, min: 0, max: 1 },
  // })

  const lineParams = useRef(new Float32Array(NUMBER_OF_LINES * 3))
  const lineProgress = useRef(new Float32Array(NUMBER_OF_LINES))
  const lineColours = useRef<Color[]>(INITIAL_COLOURS)

  useGSAP(
    () => {
      const lineExtensions: number[] = [0, 0, 0.5, 1, 2, 2]
      function generateRandomLineParams(i: number) {
        const xOffset = Math.random() - 0.5 / 4.0 // Random X offset
        const yExtension = lineExtensions[Math.floor(Math.random() * lineExtensions.length)] // How "long" the line is
        const thickness = 0.4 + Math.random() * 0.4
        return [xOffset, yExtension, thickness]
      }

      for (let i = 0; i < NUMBER_OF_LINES; i++) {
        lineParams.current.set(generateRandomLineParams(i), i * 3)
        let progress = { value: 0 }
        let tween = gsap.to(progress, {
          value: 1,
          delay: 'random(0, 1, 0.2)',
          duration: 'random(0.8, 4, 0.2)',
          ease: 'none',
          onUpdate: () => {
            lineProgress.current[i] = progress.value
          },
          onComplete: () => {
            lineProgress.current[i] = 1.0
            setTimeout(() => {
              lineProgress.current[i] = 0.0
              lineParams.current.set(generateRandomLineParams(i), i * 3)
              lineColours.current[i] = getRandomLineColour()
              tween.restart()
            }, 200)
          },
        })
      }
    },
    {
      dependencies: [],
    },
  )

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
    shaderMaterial.current.uLinesParams = lineParams.current
    shaderMaterial.current.uLinesProgress = lineProgress.current
    shaderMaterial.current.uLinesColour = lineColours.current
  })

  return (
    <Cylinder args={[TUNNEL_RADIUS, TUNNEL_RADIUS, TUNNEL_LENGTH, 40, 40, true]}>
      <energyCylinderShaderMaterial
        ref={shaderMaterial}
        key={EnergyCylinderShaderMaterial.key}
        transparent={true}
        side={DoubleSide}
        depthWrite={false} // Prevent transparent fragments from occluding others
        uTime={0}
        uLinesParams={null}
        uLinesProgress={null}
        uLinesColour={INITIAL_COLOURS}
        uProgress={0}
        blending={AdditiveBlending}
        defines={{ NUM_LINES: NUMBER_OF_LINES }}
      />
    </Cylinder>
  )
}

export default EnergyTunnel

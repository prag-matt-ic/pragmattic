'use client'

import { useGSAP } from '@gsap/react'
import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import { COSINE_GRADIENTS, type CosineGradientPreset } from '@thi.ng/color'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { useControls } from 'leva'
import React, { type FC, useRef } from 'react'
import { ShaderMaterial, Vector3 } from 'three'

import fragmentShader from './gradient.frag'
import vertexShader from './gradient.vert'

// Component for rendering colourful animated gradient background that moves up and down with the user scroll

// Remember to register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger)

type Uniforms = {
  uTime: number
  uScrollProgress: number
  uColourPalette: Vector3[]
  uUvScale: number
  uUvDistortionIterations: number
  uUvDistortionIntensity: number
}

const DEFAULT_COLOUR_PALETTE: Vector3[] = COSINE_GRADIENTS['heat1'].map((color) => new Vector3(...color))

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uScrollProgress: 0,
  uColourPalette: DEFAULT_COLOUR_PALETTE,
  uUvScale: 1,
  uUvDistortionIterations: 0,
  uUvDistortionIntensity: 0,
}

const ScrollingBackgroundMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ ScrollingBackgroundMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    scrollingBackgroundMaterial: ShaderMaterialProps & Partial<Uniforms>
  }
}

type Props = {
  screens: number
  loopScroll?: boolean
}

const ScrollingBackgroundGradientWithControls: FC<Props> = (props) => {
  const { colourPalette, timeMultiplier, scale, distortionIterations, distortionIntensity } = useConfig()
  return (
    <ScrollingBackgroundGradient
      {...props}
      colourPalette={colourPalette}
      timeMultiplier={timeMultiplier}
      scale={scale}
      distortionIterations={distortionIterations}
      distortionIntensity={distortionIntensity}
    />
  )
}

export default ScrollingBackgroundGradientWithControls

type Config = {
  colourPalette: Vector3[]
  timeMultiplier: number
  scale: number
  distortionIterations: number
  distortionIntensity: number
}

const ScrollingBackgroundGradient: FC<Props & Config> = ({
  screens,
  loopScroll = false,
  colourPalette,
  timeMultiplier,
  scale,
  distortionIntensity,
  distortionIterations,
}) => {
  const gradientShader = useRef<ShaderMaterial & Partial<Uniforms>>(null)
  const scrollProgress = useRef(0)
  const scrollLoop = useRef(0)

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: ({ progress }) => {
        if (loopScroll && progress === 1) {
          scrollLoop.current++
          scrollProgress.current = 0
          window.scrollTo(0, 0)
          return
        }
        scrollProgress.current = progress
      },
    })
  }, [loopScroll])

  useFrame(({ clock }) => {
    if (!gradientShader.current) return
    gradientShader.current.uTime = clock.elapsedTime * timeMultiplier
    gradientShader.current.uScrollProgress = (scrollProgress.current + scrollLoop.current) * screens
  })

  return (
    <ScreenQuad>
      <scrollingBackgroundMaterial
        key={ScrollingBackgroundMaterial.key}
        ref={gradientShader}
        // Uniforms
        uTime={0}
        uScrollProgress={0}
        uColourPalette={colourPalette}
        uUvScale={scale}
        uUvDistortionIterations={distortionIterations}
        uUvDistortionIntensity={distortionIntensity}
      />
    </ScreenQuad>
  )
}

function useConfig(): Config {
  // Config for the shader
  const { paletteKey, timeMultiplier, scale, distortionIterations, distortionIntensity } = useControls({
    paletteKey: {
      label: 'Palette',
      value: 'heat1' as CosineGradientPreset,
      options: Object.keys(COSINE_GRADIENTS),
    },
    timeMultiplier: {
      label: 'Time Multiplier',
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.05,
    },
    scale: {
      label: 'Scale',
      value: 1,
      min: 0.1,
      max: 4,
      step: 0.1,
    },
    distortionIterations: {
      label: 'Iterations',
      value: 6,
      min: 0,
      max: 14,
      step: 1,
    },
    distortionIntensity: {
      label: 'Intensity',
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.02,
      render: (get) => get('distortionIterations') > 0,
    },
  })

  const colourPaletteVec3 = COSINE_GRADIENTS[paletteKey as CosineGradientPreset].map((color) => new Vector3(...color))

  return { colourPalette: colourPaletteVec3, timeMultiplier, scale, distortionIterations, distortionIntensity }
}

export const ScrollBackgroundGradientCanvas: FC = () => {
  return (
    <Canvas
      className="absolute"
      gl={{
        alpha: false,
        antialias: false,
      }}>
      <ScrollingBackgroundGradient
        screens={0.5}
        colourPalette={DEFAULT_COLOUR_PALETTE}
        timeMultiplier={0.2}
        scale={1}
        distortionIterations={5}
        distortionIntensity={0.3}
      />
    </Canvas>
  )
}

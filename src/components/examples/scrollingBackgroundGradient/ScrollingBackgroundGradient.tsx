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

const ScrollingBgGradientMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ ScrollingBgGradientMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    scrollingBgGradientMaterial: ShaderMaterialProps & Partial<Uniforms>
  }
}

type Props = {
  screens: number
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
  colourPalette,
  timeMultiplier,
  scale,
  distortionIntensity,
  distortionIterations,
}) => {
  const gradientShader = useRef<ShaderMaterial & Partial<Uniforms>>(null)
  const scrollProgress = useRef(0)

  useFrame(({ clock }) => {
    if (!gradientShader.current) return
    gradientShader.current.uTime = clock.elapsedTime * timeMultiplier
    gradientShader.current.uScrollProgress = scrollProgress.current
  })

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: ({ progress }) => {
        // TODO: add looping scroll.
        scrollProgress.current = progress * screens
      },
    })
  }, [screens])

  return (
    <ScreenQuad>
      <scrollingBgGradientMaterial
        key={ScrollingBgGradientMaterial.key}
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
      className="absolute aspect-square"
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

//  // Generate brand colour palette
//     // Parse the input brand color from HEX
//     const colour = brandColour // Use your `brandColour` variable
//     const baseLCH = lch(colour)

//     // Generate lighter and darker variations
//     const variations = [-0.4, -0.2, 0.2, 0.4].map((delta) => {
//       const lchColor = { ...baseLCH, l: clamp(baseLCH.l + delta, 0, 1) }
//       return srgb(lchColor)
//     })

//     // Convert base color to sRGB
//     const c1 = srgb(baseLCH)

//     // Compute average of variations
//     const c2 = variations.reduce(
//       (acc, color) => ({
//         r: acc.r + color.r / variations.length,
//         g: acc.g + color.g / variations.length,
//         b: acc.b + color.b / variations.length,
//       }),
//       { r: 0, g: 0, b: 0 },
//     )

//     // Compute cosine coefficients
//     function cosineCoefficients(c1, c2) {
//       const amp = [0.5 * (c1.r - c2.r), 0.5 * (c1.g - c2.g), 0.5 * (c1.b - c2.b)]
//       const offset = [c1.r - amp[0], c1.g - amp[1], c1.b - amp[2]]
//       const freq = [-0.5, -0.5, -0.5]
//       const phase = [0.0, 0.0, 0.0]
//       return { a: offset, b: amp, c: freq, d: phase }
//     }

//     const coeffs = cosineCoefficients(c1, c2)

//     // Map coefficients to Vector3
//     const aVec = new Vector3(...coeffs.a)
//     const bVec = new Vector3(...coeffs.b)
//     const cVec = new Vector3(...coeffs.c)
//     const dVec = new Vector3(...coeffs.d)

//     // Log the coefficients for debugging
//     console.log('Cosine Coefficients:', { aVec, bVec, cVec, dVec })

//     // Return the coefficients as an array of Vector3
//     return [aVec, bVec, cVec, dVec]

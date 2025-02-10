'use client'
import { useGSAP } from '@gsap/react'
import { shaderMaterial } from '@react-three/drei'
import { Canvas, extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import { COSINE_GRADIENTS, type CosineGradientPreset } from '@thi.ng/color'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { Leva, useControls } from 'leva'
import React, { type FC, useMemo, useRef } from 'react'
import { ShaderMaterial, Vector3 } from 'three'

import PointerCamera from '@/components/PointerCamera'

import fragmentShader from './wavePlane.frag'
import vertexShader from './wavePlane.vert'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Uniforms = {
  uTime: number
  uScrollProgress: number
  uColourPalette: Vector3[]
  uShowGrid: boolean
  uGridSize: number
}

const DEFAULT_COLOUR_PALETTE: Vector3[] = COSINE_GRADIENTS['heat1'].map((color) => new Vector3(...color))

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uScrollProgress: 0,
  uColourPalette: DEFAULT_COLOUR_PALETTE,
  uShowGrid: true,
  uGridSize: 24,
}

const WavePlaneShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ WavePlaneShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    wavePlaneShaderMaterial: ShaderMaterialProps & Uniforms
  }
}

type Props = {
  screenHeights: number
  loopScroll: boolean
  colourPalette: Vector3[]
  showGrid: boolean
  gridSize: number
}

const WavePlane: FC<Props> = ({ screenHeights, loopScroll, showGrid, gridSize, colourPalette }) => {
  const viewport = useThree((s) => s.viewport)

  const planeWidth = useMemo(() => Math.round(viewport.width + 2), [viewport.width])
  const planeHeight = useMemo(() => Math.round(viewport.height * 2), [viewport.height])
  const planeSize = useMemo(() => Math.max(planeWidth, planeHeight), [planeWidth, planeHeight])
  const planeSegments = useMemo(() => planeSize * 8, [planeSize])

  const shaderMaterial = useRef<ShaderMaterial & Uniforms>(null)
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
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
    shaderMaterial.current.uScrollProgress = (scrollProgress.current + scrollLoop.current) * screenHeights
  })

  return (
    <mesh position={[0, -viewport.height / 2.5, -1]} rotation={[-0.5 * Math.PI, 0, 0]}>
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      <wavePlaneShaderMaterial
        ref={shaderMaterial}
        key={WavePlaneShaderMaterial.key}
        uTime={0}
        uScrollProgress={0}
        uColourPalette={colourPalette}
        uShowGrid={showGrid}
        uGridSize={gridSize}
      />
    </mesh>
  )
}

// Config for the shader
function useConfig() {
  const { paletteKey, showGrid, gridSize } = useControls({
    paletteKey: {
      label: 'Palette',
      value: 'heat1' as CosineGradientPreset,
      options: Object.keys(COSINE_GRADIENTS),
    },
    showGrid: {
      label: 'Grid',
      value: true,
    },
    gridSize: {
      label: 'Grid Size',
      value: 24,
      step: 1,
      min: 4,
      max: 64,
      render: (get) => !!get('showGrid'),
    },
  })

  return {
    colourPalette: COSINE_GRADIENTS[paletteKey as CosineGradientPreset].map((color) => new Vector3(...color)),
    showGrid,
    gridSize,
  }
}

const WavePlaneWithControls: FC = () => {
  const { colourPalette, showGrid, gridSize } = useConfig()
  return (
    <WavePlane
      loopScroll={true}
      screenHeights={9}
      colourPalette={colourPalette}
      showGrid={showGrid}
      gridSize={gridSize}
    />
  )
}

type CanvasProps = {
  className?: string
  withControls?: boolean
}

const WavePlaneCanvas: FC<CanvasProps> = ({ className, withControls }) => {
  return (
    <>
      <Canvas
        className={className}
        camera={{ position: [0, 0, 5], fov: 60, far: 20, near: 0.001 }}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <color attach="background" args={['#000']} />
        {withControls ? (
          <WavePlaneWithControls />
        ) : (
          <WavePlane
            screenHeights={12}
            loopScroll={false}
            showGrid={true}
            gridSize={24}
            colourPalette={DEFAULT_COLOUR_PALETTE}
          />
        )}
        <PointerCamera />
      </Canvas>
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </>
  )
}

export default WavePlaneCanvas

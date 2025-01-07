'use client'
import { shaderMaterial } from '@react-three/drei'
import { Canvas, extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import { COSINE_GRADIENTS } from '@thi.ng/color'
import React, { type FC, PropsWithChildren, useMemo, useRef } from 'react'
import { ShaderMaterial, Vector3 } from 'three'

import PointerCamera from '@/components/PointerCamera'

import vertexShader from '../wavePlane.vert'
import basicFragmentShader from './basic.frag'
import gradientFragmentShader from './gradient.frag'
import gridFragmentShader from './grid.frag'

// Components used in the blog to show incremental development

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
  uGridSize: 16,
}

const WavePlaneBasicShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, basicFragmentShader)
const WavePlaneGradientShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, gradientFragmentShader)
const WavePlaneGridShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, gridFragmentShader)

extend({ WavePlaneBasicShaderMaterial, WavePlaneGradientShaderMaterial, WavePlaneGridShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    wavePlaneBasicShaderMaterial: ShaderMaterialProps & Uniforms
    wavePlaneGradientShaderMaterial: ShaderMaterialProps & Uniforms
    wavePlaneGridShaderMaterial: ShaderMaterialProps & Uniforms
  }
}

// Part 1 - Just a rotated plane with dynamic size and basic material
const RotatedPlane: FC = () => {
  const viewport = useThree((s) => s.viewport)
  const planeWidth = useMemo(() => Math.round(viewport.width + 2), [viewport.width])
  const planeHeight = useMemo(() => Math.round(viewport.height * 2), [viewport.height])
  const planeSize = useMemo(() => Math.max(planeWidth, planeHeight), [planeWidth, planeHeight])
  const planeSegments = useMemo(() => planeSize * 8, [planeSize])

  return (
    <mesh position={[0, -viewport.height / 2.5, -1]} rotation={[-0.5 * Math.PI, 0, 0]}>
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      {/* We'll be replacing this with our custom shader material */}
      <meshBasicMaterial color="grey" />
    </mesh>
  )
}

// Part 2 - Adding our shader material to the plane with vertex shader and simple fragment shader
const BasicFragmentShaderPlane: FC = () => {
  const viewport = useThree((s) => s.viewport)

  const planeWidth = useMemo(() => Math.round(viewport.width + 2), [viewport.width])
  const planeHeight = useMemo(() => Math.round(viewport.height * 2), [viewport.height])
  const planeSize = useMemo(() => Math.max(planeWidth, planeHeight), [planeWidth, planeHeight])
  const planeSegments = useMemo(() => planeSize * 8, [planeSize])

  const shaderMaterial = useRef<ShaderMaterial & Uniforms>(null)

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
  })

  return (
    <mesh position={[0, -viewport.height / 2.5, -1]} rotation={[-0.5 * Math.PI, 0, 0]}>
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      <wavePlaneBasicShaderMaterial
        ref={shaderMaterial}
        key={WavePlaneBasicShaderMaterial.key}
        uTime={0}
        uScrollProgress={0}
        uColourPalette={DEFAULT_COLOUR_PALETTE}
        uShowGrid={true}
        uGridSize={24}
      />
    </mesh>
  )
}

// Part 3 - Adding a fragment shader with gradient colours
const GradientFragmentShaderPlane: FC = () => {
  const viewport = useThree((s) => s.viewport)

  const planeWidth = useMemo(() => Math.round(viewport.width + 2), [viewport.width])
  const planeHeight = useMemo(() => Math.round(viewport.height * 2), [viewport.height])
  const planeSize = useMemo(() => Math.max(planeWidth, planeHeight), [planeWidth, planeHeight])
  const planeSegments = useMemo(() => planeSize * 8, [planeSize])

  const shaderMaterial = useRef<ShaderMaterial & Uniforms>(null)

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
  })

  return (
    <mesh position={[0, -viewport.height / 2.5, -1]} rotation={[-0.5 * Math.PI, 0, 0]}>
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      <wavePlaneGradientShaderMaterial
        ref={shaderMaterial}
        key={WavePlaneGradientShaderMaterial.key}
        uTime={0}
        uScrollProgress={0}
        uColourPalette={DEFAULT_COLOUR_PALETTE}
        uShowGrid={true}
        uGridSize={24}
      />
    </mesh>
  )
}

// Part 4 - Adding grid lines to the fragment shader

const GridLinesFragmentShaderPlane: FC = () => {
  const viewport = useThree((s) => s.viewport)

  const planeWidth = useMemo(() => Math.round(viewport.width + 2), [viewport.width])
  const planeHeight = useMemo(() => Math.round(viewport.height * 2), [viewport.height])
  const planeSize = useMemo(() => Math.max(planeWidth, planeHeight), [planeWidth, planeHeight])
  const planeSegments = useMemo(() => planeSize * 8, [planeSize])

  const shaderMaterial = useRef<ShaderMaterial & Uniforms>(null)

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
  })

  return (
    <mesh position={[0, -viewport.height / 2.5, -1]} rotation={[-0.5 * Math.PI, 0, 0]}>
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      <wavePlaneGridShaderMaterial
        ref={shaderMaterial}
        key={WavePlaneGridShaderMaterial.key}
        uTime={0}
        uScrollProgress={0}
        uColourPalette={DEFAULT_COLOUR_PALETTE}
        uShowGrid={true}
        uGridSize={24}
      />
    </mesh>
  )
}

const CanvasWrapper: FC<PropsWithChildren> = ({ children }) => (
  <section className="relative h-[704px] max-h-[70vh] w-full">
    <Canvas
      className=""
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      }}>
      <color attach="background" args={['#000']} />
      {children}
      <PointerCamera />
    </Canvas>
  </section>
)

export const RotatedPlaneCanvas: FC = () => {
  return (
    <CanvasWrapper>
      <RotatedPlane />
    </CanvasWrapper>
  )
}

export const BasicFragmentShaderPlaneCanvas: FC = () => {
  return (
    <CanvasWrapper>
      <BasicFragmentShaderPlane />
    </CanvasWrapper>
  )
}

export const GradientFragmentShaderPlaneCanvas: FC = () => {
  return (
    <CanvasWrapper>
      <GradientFragmentShaderPlane />
    </CanvasWrapper>
  )
}

export const GridLinesFragmentShaderPlaneCanvas: FC = () => {
  return (
    <CanvasWrapper>
      <GridLinesFragmentShaderPlane />
    </CanvasWrapper>
  )
}

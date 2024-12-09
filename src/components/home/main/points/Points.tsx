'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps } from '@react-three/fiber'
import React, { type FC, useEffect, useRef } from 'react'
import { AdditiveBlending, BufferAttribute, MathUtils, ShaderMaterial } from 'three'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { POINT_VEC3, SECTION_COLOURS } from '@/resources/colours'

import pointsFragmentShader from './points.frag'
import pointsVertexShader from './points.vert'

const PARTICLE_COUNT = 128

const getRandomSpherePositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3)
  const distance = 3
  // Create random positions within a sphere
  for (let i = 0; i < count; i++) {
    const theta = MathUtils.randFloatSpread(360)
    const phi = MathUtils.randFloatSpread(360)
    let x = distance * Math.sin(theta) * Math.cos(phi)
    let y = distance * Math.sin(theta) * Math.sin(phi)
    let z = distance * Math.cos(theta) + Math.random() * 0.5 - 0.25
    positions.set([x, y, z], i * 3)
  }
  return positions
}

const getColours = (count: number, activeSection: 'all' | SceneSection | null): Float32Array => {
  const colours = new Float32Array(count * 3)

  if (activeSection === null) {
    for (let i = 0; i < count; i++) {
      colours.set([...POINT_VEC3], i * 3)
    }
    return colours
  }

  if (activeSection === 'all') {
    for (let i = 0; i < count; i++) {
      //  There are 3 section, alternate each particle colour
      if (i % 3 === 0) colours.set([...SECTION_COLOURS[SceneSection.Purpose]], i * 3)
      if (i % 3 === 1) colours.set([...SECTION_COLOURS[SceneSection.Design]], i * 3)
      if (i % 3 === 2) colours.set([...SECTION_COLOURS[SceneSection.Engineering]], i * 3)
    }
    return colours
  }

  // Random value between 8 and 16 for the coloured particle
  const randomColourIndex = Math.floor(Math.random() * 8) + 8
  const activeColour = activeSection ? SECTION_COLOURS[activeSection] : POINT_VEC3

  for (let i = 0; i < count; i++) {
    if (i % randomColourIndex === 0) {
      colours.set([...activeColour], i * 3)
    } else {
      colours.set([...POINT_VEC3], i * 3)
    }
  }
  return colours
}

const POSITIONS = getRandomSpherePositions(PARTICLE_COUNT)
const INACTIVE_COLORS = getColours(PARTICLE_COUNT, null)

type Props = {}

const PointsPlane: FC<Props> = () => {
  const pointsShaderMaterial = useRef<ShaderMaterial & Uniforms>(null)
  const coloursAttribute = useRef<BufferAttribute>(null)

  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        if (!coloursAttribute.current) return
        // Generate the new colors array
        const newColours = getColours(PARTICLE_COUNT, s.allAreActive ? 'all' : s.activeSection)
        // Update the array and mark it for an update
        coloursAttribute.current.array = newColours
        coloursAttribute.current.needsUpdate = true
      }),
    [],
  )

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={POSITIONS} count={PARTICLE_COUNT} itemSize={3} />
        <bufferAttribute
          ref={coloursAttribute}
          attach="attributes-colour"
          array={INACTIVE_COLORS}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <torusPointsShaderMaterial
        attach="material"
        ref={pointsShaderMaterial}
        key={HomePointsShaderMaterial.key}
        vertexShader={pointsVertexShader}
        fragmentShader={pointsFragmentShader}
        depthTest={false}
        transparent={true}
        blending={AdditiveBlending}
      />
    </points>
  )
}

export default PointsPlane

type Uniforms = {}

const UNIFORMS: Uniforms = {}

const HomePointsShaderMaterial = shaderMaterial(UNIFORMS, pointsVertexShader, pointsFragmentShader)

extend({ HomePointsShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      homePointsShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
    }
  }
}

'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, BufferAttribute, MathUtils, ShaderMaterial } from 'three'

import { useHomeStore } from '@/hooks/home/HomeProvider'
import { POINT_VEC3, SceneSection, SECTION_COLOURS } from '@/resources/home'

import pointsFragmentShader from './points.frag'
import pointsVertexShader from './points.vert'

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

  // Random value between 6 and 10 for the coloured particle
  const randomColourIndex = Math.floor(Math.random() * 6) + 4
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

type Props = {
  isMobile: boolean
}

const PointsPlane: FC<Props> = ({ isMobile }) => {
  const pointsShaderMaterial = useRef<ShaderMaterial & Uniforms>(null)
  const coloursAttribute = useRef<BufferAttribute>(null)

  const particleCount = isMobile ? 48 : 128

  const POSITIONS = useMemo(() => getRandomSpherePositions(particleCount), [particleCount])
  const INACTIVE_COLORS = useMemo(() => getColours(particleCount, null), [particleCount])
  const activeSection = useHomeStore((s) => s.activeSection)
  const allAreActive = useHomeStore((s) => s.allAreActive)

  useEffect(() => {
    if (!coloursAttribute.current) return
    // Generate the new colors array
    const newColours = getColours(particleCount, allAreActive ? 'all' : activeSection)
    // Update the array and mark it for an update
    coloursAttribute.current.array = newColours
    coloursAttribute.current.needsUpdate = true
  }, [particleCount, activeSection, allAreActive])

  useFrame(({ clock }) => {
    if (!pointsShaderMaterial.current) return
    pointsShaderMaterial.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={POSITIONS} count={particleCount} itemSize={3} />
        <bufferAttribute
          ref={coloursAttribute}
          attach="attributes-colour"
          array={INACTIVE_COLORS}
          count={particleCount}
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

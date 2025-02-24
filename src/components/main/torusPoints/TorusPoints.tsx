'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { AdditiveBlending, Color, ShaderMaterial } from 'three'

import { useHomeStore } from '@/hooks/HomeProvider'
import { MID_VEC3_RGB } from '@/resources/colours'
import { SceneSection } from '@/resources/home'

import { POINTS_POSITIONS } from '../torusResources'
import pointsFragmentShader from './torusPoints.frag'
import pointsVertexShader from './torusPoints.vert'

type TorusPointsProps = {
  section: SceneSection
}

const TorusPoints: FC<TorusPointsProps> = ({ section }) => {
  const pointsShaderMaterial = useRef<ShaderMaterial & PointsUniforms>(null)
  const activeProgress = useHomeStore((s) => s.activeProgress[section])
  const rotateAngle = useHomeStore((s) => s.rotateAngles[section])
  const introScrollProgress = useHomeStore((s) => s.introScrollProgress)
  const outroScrollProgress = useHomeStore((s) => s.outroScrollProgress)

  useFrame(({ clock }) => {
    if (!pointsShaderMaterial.current) return
    const elapsedTime = clock.elapsedTime
    pointsShaderMaterial.current.uTime = elapsedTime
    pointsShaderMaterial.current.uActiveProgress = activeProgress.value
    pointsShaderMaterial.current.uRotateAngle = rotateAngle.value
    pointsShaderMaterial.current.uIntroScrollProgress = introScrollProgress.value
    pointsShaderMaterial.current.uOutroScrollProgress = outroScrollProgress.value
  })

  return (
    <points>
      <bufferGeometry>
        {/* TODO: fix this */}
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          array={POINTS_POSITIONS[section].activePositions}
          count={POINTS_POSITIONS[section].activePositions.length / 3}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-inactivePosition"
          array={POINTS_POSITIONS[section].inactivePositions}
          count={POINTS_POSITIONS[section].inactivePositions.length / 3}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-scatteredPosition"
          array={POINTS_POSITIONS[section].scatteredPositions}
          count={POINTS_POSITIONS[section].scatteredPositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <torusPointsShaderMaterial
        attach="material"
        ref={pointsShaderMaterial}
        key={TorusPointsShaderMaterial.key}
        vertexShader={pointsVertexShader}
        fragmentShader={pointsFragmentShader}
        depthTest={false}
        transparent={true}
        uRotateAngle={0}
        blending={AdditiveBlending}
      />
    </points>
  )
}

export default TorusPoints

type PointsUniforms = {
  uTime: number
  uRotateAngle: number
  uColour: Color
  uIntroScrollProgress: number
  uOutroScrollProgress: number
  uActiveProgress: number
}

const POINTS_UNIFORMS: PointsUniforms = {
  uTime: 0,
  uRotateAngle: 0,
  uColour: MID_VEC3_RGB,
  uIntroScrollProgress: 0,
  uOutroScrollProgress: 0,
  uActiveProgress: 0,
}

const TorusPointsShaderMaterial = shaderMaterial(POINTS_UNIFORMS, pointsVertexShader, pointsFragmentShader)

extend({ TorusPointsShaderMaterial })

// TODO: update this type.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      torusPointsShaderMaterial: any
    }
  }
}

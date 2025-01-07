'use client'
import { Torus } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { BufferGeometry, Color, Mesh, MeshLambertMaterial, type NormalBufferAttributes, ShaderMaterial } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

import { TORUS_ARGS } from '@/components/home/main/torusResources'
import { useHomeStore } from '@/hooks/home/HomeProvider'
import { OFF_BLACK_VEC3_RGB } from '@/resources/colours'
import { SceneSection, SECTION_COLOURS } from '@/resources/home'

import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'

type Props = {
  section: SceneSection
}

const SectionTorus: FC<Props> = ({ section }) => {
  const torusMesh = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const shaderMaterial = useRef<ShaderMaterial & UniformValues>(null)

  const activeProgress = useHomeStore((s) => s.activeProgress[section])
  const rotateAngle = useHomeStore((s) => s.rotateAngles[section])

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    const elapsedTime = clock.elapsedTime
    shaderMaterial.current.uniforms.uTime.value = elapsedTime
    shaderMaterial.current.uniforms.uActiveProgress.value = activeProgress.value
    shaderMaterial.current.uniforms.uRotateAngle.value = rotateAngle.value
  })

  return (
    <Torus ref={torusMesh} args={TORUS_ARGS[section]}>
      <CustomShaderMaterial
        ref={shaderMaterial}
        baseMaterial={MeshLambertMaterial}
        transparent={true}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={SHADER_UNIFORMS[section]}
      />
    </Torus>
  )
}

export default SectionTorus

type UniformValues = {
  uTime: {
    value: number
  }
  uRotateAngle: {
    value: number
  }
  uColour: {
    value: Color
  }
  uActiveColour: {
    value: Color
  }
  uActiveProgress: {
    value: number
  }
  uRadius: {
    value: number
  }
  uTube: {
    value: number
  }
}

const PURPOSE_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateAngle: { value: 0 },
  uColour: { value: OFF_BLACK_VEC3_RGB },
  uActiveColour: { value: SECTION_COLOURS[SceneSection.Purpose] },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.purpose[0] },
  uTube: { value: TORUS_ARGS.purpose[1] },
}

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateAngle: { value: 0 },
  uColour: { value: OFF_BLACK_VEC3_RGB },
  uActiveColour: { value: SECTION_COLOURS[SceneSection.Design] },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.design[0] },
  uTube: { value: TORUS_ARGS.design[1] },
}

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateAngle: { value: 0 },
  uColour: { value: OFF_BLACK_VEC3_RGB },
  uActiveColour: { value: SECTION_COLOURS[SceneSection.Engineering] },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.engineering[0] },
  uTube: { value: TORUS_ARGS.engineering[1] },
}

const SHADER_UNIFORMS: Record<SceneSection, UniformValues> = {
  [SceneSection.Purpose]: PURPOSE_UNIFORMS,
  [SceneSection.Design]: DESIGN_UNIFORMS,
  [SceneSection.Engineering]: ENGINEERING_UNIFORMS,
}

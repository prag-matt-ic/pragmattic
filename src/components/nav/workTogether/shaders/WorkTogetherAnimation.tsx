'use client'
import { useGSAP } from '@gsap/react'
import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { extend } from '@react-three/fiber'
import gsap from 'gsap'
import { type FC, RefObject, useRef } from 'react'
import React from 'react'
import { Color, ShaderMaterial } from 'three'

import { BLACK_VEC3_RGB, CYAN_VEC3_RGB, GREEN_VEC3_RGB, LIGHT_VEC3_RGB, ORANGE_VEC3_RGB } from '@/resources/colours'

import agencyFragment from './agency.frag'
import developerFragment from './developer.frag'
import vertexShader from './screen.vert'
import startupFragment from './startup.frag'

export type WorkTogetherShader = 'agency' | 'startup' | 'developer'

type Uniforms = {
  uTime: number
  uIsHovered: boolean
  uActiveColour: Color
  uLightColour: Color
  uDarkColour: Color
}

const AGENCY_UNIFORMS: Uniforms = {
  uTime: 0,
  uIsHovered: false,
  uLightColour: LIGHT_VEC3_RGB,
  uDarkColour: BLACK_VEC3_RGB,
  uActiveColour: ORANGE_VEC3_RGB,
}
const STARTUP_UNIFORMS: Uniforms = {
  uTime: 0,
  uIsHovered: false,
  uLightColour: LIGHT_VEC3_RGB,
  uDarkColour: BLACK_VEC3_RGB,
  uActiveColour: GREEN_VEC3_RGB,
}
const DEVELOPER_UNIFORMS: Uniforms = {
  uTime: 0,
  uIsHovered: false,
  uLightColour: LIGHT_VEC3_RGB,
  uDarkColour: BLACK_VEC3_RGB,
  uActiveColour: CYAN_VEC3_RGB,
}

const AgencyShaderMaterial = shaderMaterial(AGENCY_UNIFORMS, vertexShader, agencyFragment)
const StartupShaderMaterial = shaderMaterial(STARTUP_UNIFORMS, vertexShader, startupFragment)
const DeveloperShaderMaterial = shaderMaterial(DEVELOPER_UNIFORMS, vertexShader, developerFragment)

extend({ AgencyShaderMaterial, StartupShaderMaterial, DeveloperShaderMaterial })

type ShaderMaterialProps = Partial<ShaderMaterial> &
  Partial<Uniforms> & { ref: RefObject<ShaderMaterialProps | null>; key: string }

declare module '@react-three/fiber' {
  interface ThreeElements {
    agencyShaderMaterial: ShaderMaterialProps
    startupShaderMaterial: ShaderMaterialProps
    developerShaderMaterial: ShaderMaterialProps
  }
}

type Props = {
  type: WorkTogetherShader
  isHovered: boolean
}

export const WorkTogetherAnimation: FC<Props> = ({ type, isHovered }) => {
  const material = useRef<ShaderMaterialProps>(null)
  const time = useRef({ value: 0 }) // Time value for the shader accelerates when hovered

  useGSAP(() => {
    gsap.to(time.current, {
      duration: isHovered ? 2500 : 10000,
      value: 10000,
      ease: 'none',
    })
  }, [isHovered])

  useFrame((state) => {
    if (!material.current) return
    material.current.uTime = time.current.value
    material.current.uIsHovered = isHovered
  })

  return (
    <ScreenQuad>
      {type === 'agency' && (
        <agencyShaderMaterial ref={material} key={AgencyShaderMaterial.key} transparent={false} depthTest={false} />
      )}
      {type === 'startup' && (
        <startupShaderMaterial ref={material} key={StartupShaderMaterial.key} transparent={false} depthTest={false} />
      )}
      {type === 'developer' && (
        <developerShaderMaterial
          ref={material}
          key={DeveloperShaderMaterial.key}
          transparent={false}
          depthTest={false}
        />
      )}
    </ScreenQuad>
  )
}

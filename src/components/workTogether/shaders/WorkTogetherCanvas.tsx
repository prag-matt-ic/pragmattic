'use client'
import { useGSAP } from '@gsap/react'
import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { extend, ShaderMaterialProps } from '@react-three/fiber'
import gsap from 'gsap'
import { type FC, useRef } from 'react'
import React from 'react'
import { Color, ShaderMaterial } from 'three'

import { BLACK_VEC3, CYAN_VEC3, GREEN_VEC3, LIGHT_VEC3, ORANGE_VEC3 } from '@/resources/colours'

import agencyFragment from './agency.frag'
import developerFragment from './developer.frag'
import startupFragment from './startup.frag'
import vertexShader from './screen.vert'

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
  uLightColour: LIGHT_VEC3,
  uDarkColour: BLACK_VEC3,
  uActiveColour: ORANGE_VEC3,
}
const STARTUP_UNIFORMS: Uniforms = {
  uTime: 0,
  uIsHovered: false,
  uLightColour: LIGHT_VEC3,
  uDarkColour: BLACK_VEC3,
  uActiveColour: GREEN_VEC3,
}
const DEVELOPER_UNIFORMS: Uniforms = {
  uTime: 0,
  uIsHovered: false,
  uLightColour: LIGHT_VEC3,
  uDarkColour: BLACK_VEC3,
  uActiveColour: CYAN_VEC3,
}

const AgencyShaderMaterial = shaderMaterial(AGENCY_UNIFORMS, vertexShader, agencyFragment)
const StartupShaderMaterial = shaderMaterial(STARTUP_UNIFORMS, vertexShader, startupFragment)
const DeveloperShaderMaterial = shaderMaterial(DEVELOPER_UNIFORMS, vertexShader, developerFragment)

extend({ AgencyShaderMaterial, StartupShaderMaterial, DeveloperShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    agencyShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
    startupShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
    developerShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
  }
}

type Props = {
  type: WorkTogetherShader
  isHovered: boolean
}

export const WorkTogetherAnimation: FC<Props> = ({ type, isHovered }) => {
  const material = useRef<ShaderMaterial & Uniforms>(null)
  const time = useRef({ value: 0 }) // Time value for the shader - accelerates when hovered

  useGSAP(() => {
    gsap.to(time.current, {
      duration: isHovered ? 2500 : 10000,
      value: 10000,
      ease: 'none',
    })
  }, [isHovered])

  useFrame(() => {
    if (!material.current) return
    material.current.uTime = time.current.value
  })

  return (
    <ScreenQuad>
      {type === 'agency' && (
        <agencyShaderMaterial
          ref={material}
          key={StartupShaderMaterial.key}
          uTime={0}
          uIsHovered={false}
          transparent={false}
          depthTest={false}
        />
      )}
      {type === 'startup' && (
        <startupShaderMaterial
          ref={material}
          key={StartupShaderMaterial.key}
          uTime={0}
          uIsHovered={false}
          transparent={false}
          depthTest={false}
        />
      )}
      {type === 'developer' && (
        <developerShaderMaterial
          ref={material}
          key={StartupShaderMaterial.key}
          uTime={0}
          uIsHovered={false}
          transparent={false}
          depthTest={false}
        />
      )}
    </ScreenQuad>
  )
}

'use client'
import { ContextMode } from 'glsl-canvas-js/dist/esm/context/context'
import { Canvas, type ICanvasOptions } from 'glsl-canvas-js/dist/esm/glsl'
import { type FC, useEffect, useRef } from 'react'
import React from 'react'

import { CYAN_VEC3, GREEN_VEC3, LIGHT_VEC3, OFF_BLACK_VEC3, ORANGE_VEC3 } from '@/resources/colours'

import agencyFragment from './agency.frag'
import developerFragment from './developer.frag'
import startupFragment from './startup.frag'

type Shader = 'agency' | 'startup' | 'developer'

const FRAGMENT_SHADERS: Record<Shader, string> = {
  agency: agencyFragment,
  startup: startupFragment,
  developer: developerFragment,
}

// For syntax highlighting
const glsl = (x: any) => x

const vertexShader = glsl`#version 300 es
  in vec4 a_position;
  out vec2 v_uv;
  void main() {
    v_uv = a_position.xy;
    gl_Position = a_position;
  }
`

type Props = {
  type: Shader
  size: number
}

const WorkTogetherCanvas: FC<Props> = ({ type, size }) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const glsl = useRef<Canvas | null>(null)

  useEffect(() => {
    if (!canvas.current) return
    // https://actarian.github.io/glsl-canvas/api/
    const options: ICanvasOptions = {
      vertexString: vertexShader,
      fragmentString: FRAGMENT_SHADERS[type],
      alpha: false,
      depth: false,
      antialias: true,
      mode: ContextMode.Flat,
    }
    glsl.current = new Canvas(canvas.current, options)
    glsl.current.setUniform('u_orange', ORANGE_VEC3.toArray())
    glsl.current.setUniform('u_light', LIGHT_VEC3.toArray())
    glsl.current.setUniform('u_black', OFF_BLACK_VEC3.toArray())
    glsl.current.setUniform('u_green', GREEN_VEC3.toArray())
    glsl.current.setUniform('u_cyan', CYAN_VEC3.toArray())
  }, [canvas, type])

  return (
    <canvas
      ref={canvas}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

export default WorkTogetherCanvas

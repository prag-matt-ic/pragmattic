---
title: 'ScreenQuad shader boilerplate for Next.js + Typescript'
date: '2024-11-12'
tags: 'parallax, js'
youTubeUrl: ''
exampleUrl: '/examples/screen-quad-shader'
githubUrl: ''
---

## A fullscreen shader can be used to create cool backgrounds and fullscreen visuals

In this example I'll share the Typescript safe code for getting started with a <ScreenQuad/> in a Next.js website using React Three Fiber and drei shaderMaterial.

Using the ScreenQuad over a Plane has performance advantages because it has 3 vertices instead of 4. For more information see [this article](https://luruke.medium.com/simple-postprocessing-in-three-js-91936ecadfb7).

## Configuring Typescript for Shader files

Create a root 'shader.d.ts' file for importing GLSL files without error.

This declaration file informs Typescript that .frag, .vert and .glsl files should be treated as strings.

```typescript
// shader.d.ts

declare module '*.frag' {
  const value: string
  export default value
}

declare module '*.vert' {
  const value: string
  export default value
}

declare module '*.glsl' {
  const value: string
  export default value
}
```

## React Component Structure

- Uniforms are defined as a type
- The shader ref has the correct type (ShaderMaterial & Partial<Uniforms>)
- The custom JSX element (screenQuadShaderMaterial) is defined at the bottom

```jsx
// ScreenQuadShader.tsx
'use client'

import { ScreenQuad, shaderMaterial, useTexture } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { ShaderMaterial, Texture } from 'three'

import fragmentShader from './screen.frag'
import vertexShader from './screen.vert'
import textureImg from './texture.jpg'


type Uniforms = {
  uTime: number
  uAspect: number
  uTexture: Texture | null
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1,
  uTexture: null,
}

const ScreenQuadShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ ScreenQuadShaderMaterial })

const ScreenQuadShader: FC = () => {
  const texture = useTexture(textureImg.src)
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <ScreenQuad>
      <screenQuadShaderMaterial
        key={ScreenQuadShaderMaterial.key}
        ref={shader}
        // Uniforms
        uTime={0}
        uAspect={viewport.aspect}
        uTexture={texture}
      />
    </ScreenQuad>
  )
}

export default ScreenQuadShader

declare global {
  namespace JSX {
    interface IntrinsicElements {
      screenQuadShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}
```

### Vertex Shader for ScreenQuad component

<!-- TODO: reword this. -->

The vertex shader is setup differently to normal in order for it to work.
By removing transformation matrices, the vertex shader becomes more efficient
We are not going to use a “camera”, we simply pass the values directly in clip-space coordinates. This will save some matrix multiplication in the vertex shader.
We are not using any uvattribute, instead we use gl_FragCoord/resolution

```glsl
// screen.vert
// Vertex shader for <ScreenQuad />

varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5; // Map NDC to UV coordinates
    gl_Position = vec4(position.xy, 0.0, 1.0); // Use NDC position
}
```

### Fragment Shader for simple tiled texture

In this fragment shader we are receiving the texture and viewport aspect ratio as uniforms.
We can then create aspect ratio adjusted uv coordinates, and by getting the fractional (fract) value of that, we're able to tile the image.
The texture colour is then sampled using the adjusted uv value.

```glsl
// texture.frag

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAspect;

varying vec2 vUv;

void main() {

  vec2 textureUv = vUv * 2.0; // Scale the texture (optional)
  textureUv.x *= uAspect; // Correct aspect ratio
  textureUv = fract(textureUv); // Repeat the texture

  // Sample using adjusted uv value
  vec4 textureColour = texture2D(uTexture, textureUv);

  gl_FragColor = textureColour;
}
```

### Fragment Shader for organic animated background gradient

<!-- TODO: finish this. -->

In this shader we are importing a noise function.

```glsl
// gradient.frag

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAspect;

varying vec2 vUv;

// Color palette function
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float colourInput = noise(vec3(vUv, sin(uTime * 0.2)));

  // Getting these values from this site: http://dev.thi.ng/gradients/
  // [[0.500 0.500 0.500] [0.666 0.666 0.666] [1.000 1.000 1.000] [0.000 0.333 0.667]]
  vec3 color = palette(colourInput, vec3(0.5), vec3(0.166), vec3(1.0), vec3(0.0, 0.333, 0.667));

  // [[0.369 0.919 0.590] [0.344 0.306 0.378] [0.965 1.011 1.259] [0.976 4.801 2.072]]
  vec3 color2 = palette(colourNoise, vec3(0.369, 0.919, 0.590), vec3(0.344, 0.306, 0.378), vec3(0.965, 1.011, 1.259), vec3(0.976, 4.801, 2.072));

  gl_FragColor = vec4(color2, 1.0);;
}
```

'use client'
import { shaderMaterial, useGLTF } from '@react-three/drei'
import { extend, type ShaderMaterialProps } from '@react-three/fiber'
import React, { type FC } from 'react'

import { getRandomSpherePositions } from '@/utils/particles/particles'

import particleFragment from './particle.frag'
import particleVertex from './particle.vert'

type Uniforms = {
  uTime: number
}

const UNIFORMS: Uniforms = {
  uTime: 0,
}

const InstanceShaderMaterial = shaderMaterial(UNIFORMS, particleVertex, particleFragment)

extend({ InstanceShaderMaterial })

const InstancedParticles: FC = () => {
  // Load our model
  const { nodes } = useGLTF('/models/py-lod2.glb')
  const count = 512
  const positions: Float32Array = getRandomSpherePositions(count)

  return (
    <>
      {/* <instancedMesh geometry={nodes['py-lod2-object'].geometry} count={count}>
        <instancedBufferAttribute attach="instancePosition" args={[positions, 3]} />
        <instanceShaderMaterial attach="material" uTime={0} />
      </instancedMesh> */}
    </>
  )
}

useGLTF.preload('/models/py-lod2.glb')

declare global {
  namespace JSX {
    interface IntrinsicElements {
      instanceShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}

export default InstancedParticles

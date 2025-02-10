'use client'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import React, { type FC, useEffect, useMemo } from 'react'
import { AdditiveBlending, Color, Mesh } from 'three'

const GLTFParticles: FC = () => {
  const model = useGLTF('/models/black_panther.glb')
  const scene = useThree((s) => s.scene)

  // useEffect(() => {
  //   scene.add(model.scene)
  // }, [scene, model])

  const particlesGeometry: Float32Array = useMemo(() => {
    let count = 0
    let meshCount = 0

    // Find the mesh in the GLTF scene
    model.scene.traverse((object) => {
      if (object instanceof Mesh) {
        const meshPositionsCount = object.geometry.attributes.position.count
        count += meshPositionsCount
        meshCount++
      }
    })

    const positions = new Float32Array(count)

    model.scene.traverse((object) => {
      if (object instanceof Mesh) {
        const positionsArray = object.geometry.attributes.position.array
        for (let i = 0; i < count; i++) {
          // Add the position to the positions array
          const stride = 3
          positions[i * stride] = positionsArray[i * stride]
          positions[i * stride + 1] = positionsArray[i * stride + 1]
          positions[i * stride + 2] = positionsArray[i * stride + 2]
        }
      }
    })

    return positions
  }, [model])

  return (
    <>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={particlesGeometry}
            count={particlesGeometry.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={new Color('#45F1A6')}
          size={0.02}
          sizeAttenuation
          blending={AdditiveBlending}
          transparent={true}
          opacity={0.3}
        />
      </points>
    </>
  )
}

export default GLTFParticles

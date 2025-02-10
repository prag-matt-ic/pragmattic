'use client'
import { useGLTF } from '@react-three/drei'
import React, { type FC, useMemo } from 'react'
import { AdditiveBlending, Mesh, Vector3 } from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'

// The MeshSurfaceSampler allows us to position the particles over the model's surface at random positions

const MeshSamplerParticles: FC = () => {
  // Load our model
  // Credit: https://sketchfab.com/3d-models/black-panther-e73e355bdafa4fbeae0e42fca8c34bcc
  const gltf = useGLTF('/models/black_panther.glb')

  const meshSurfacePositions: Float32Array | null = useMemo(() => {
    if (!gltf.scene) return null

    const particlesCount = 2048 * 2
    const positions = new Float32Array(particlesCount * 3)

    // Find the mesh in the GLTF scene
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        // https://threejs.org/docs/index.html#examples/en/math/MeshSurfaceSampler
        // Create a MeshSurfaceSampler
        const sampler = new MeshSurfaceSampler(object).build()
        const position = new Vector3()

        for (let i = 0; i < particlesCount; i++) {
          // Sample the mesh surface and set the position
          sampler.sample(position)
          positions[i * 3] = position.x
          positions[i * 3 + 1] = position.y
          positions[i * 3 + 2] = position.z
        }
      }
    })

    return positions
  }, [gltf.scene])

  if (!meshSurfacePositions) return null

  return (
    <>
      <points position={[0, -1.5, 0]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={meshSurfacePositions}
            count={meshSurfacePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          color="#45F1A6"
          size={0.024}
          opacity={0.4}
          depthTest={false}
          transparent={true}
          sizeAttenuation={true}
          blending={AdditiveBlending}
        />
      </points>
    </>
  )
}

export default MeshSamplerParticles

'use client'
import { useGSAP } from '@gsap/react'
import { Plane, ScreenQuad, shaderMaterial, useFBO, useGLTF, useTrailTexture } from '@react-three/drei'
import { createPortal, extend, ObjectMap, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  DataTexture,
  FloatType,
  Group,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  OrthographicCamera,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
} from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'

import particleFragment from './particle.frag'
import particleVertex from './particle.vert'
import simulationFragment from './simulation/simulation.frag'
import simulationVertex from './simulation/simulation.vert'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Particle shader material
type ParticleUniforms = {
  uTime: number
  uPositions: Texture | null
  uPointerWorld: Vector3
  uInverseModelMatrix: Matrix4
  // uPointerTexture: Texture | null
}

const INITIAL_BG_UNIFORMS: ParticleUniforms = {
  uTime: 0,
  uPositions: null,
  uPointerWorld: new Vector3(0, 0),
  // uPointerTexture: null,
  uInverseModelMatrix: new Matrix4(),
}

const ParticleAnimationShaderMaterial = shaderMaterial(INITIAL_BG_UNIFORMS, particleVertex, particleFragment)

// Simulation shader material
type SimulationUniforms = {
  uTime: number
  uPositionsProgress: number
  uPositions0: DataTexture | null
  uPositions1: DataTexture | null
}

const INITIAL_SIMULATION_UNIFORMS: SimulationUniforms = {
  uTime: 0,
  uPositionsProgress: 0,
  uPositions0: null,
  uPositions1: null,
}

const SimulationShaderMaterial = shaderMaterial(INITIAL_SIMULATION_UNIFORMS, simulationVertex, simulationFragment)

extend({ ParticleAnimationShaderMaterial, SimulationShaderMaterial })

const FBOParticles: FC = () => {
  const { width, height } = useThree((s) => s.viewport)
  // Load the model
  const { scene } = useGLTF('/models/tree2.glb')
  const particlesCount = 512

  // // Generate a "buffer" of vertex of size "size" with normalized coordinates
  const particlesPosition = useMemo(() => {
    const particles = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      let i3 = i * 3
      particles[i3 + 0] = (i % particlesCount) / particlesCount
      particles[i3 + 1] = i / particlesCount / particlesCount
      particles[i3 + 2] = 0
    }
    return particles
  }, [])

  const simulationShader = useRef<ShaderMaterial & SimulationUniforms>(null)
  const particlesShader = useRef<ShaderMaterial & ParticleUniforms>(null)

  // Create a camera and a scene
  const FBOscene = useMemo(() => new Scene(), [])

  // https://drei.docs.pmnd.rs/misc/fbo-use-fbo
  const renderTarget = useFBO({
    stencilBuffer: false,
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: FloatType,
  })
  const fboCamera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)

  // Create a simple square geometry with custom uv and positions attributes
  const squareGeometryPositions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0])
  const squareUvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])

  const scrollProgress = useRef(0)

  // Temp
  const simVisMaterial = useRef<MeshBasicMaterial>(null)
  const meshRef = useRef<Mesh>(null)

  useFrame(({ gl, clock, pointer, camera }) => {
    if (!particlesShader.current || !simulationShader.current) return
    const time = clock.elapsedTime

    gl.setRenderTarget(renderTarget)
    gl.clear()
    gl.render(FBOscene, fboCamera)
    gl.setRenderTarget(null)

    simulationShader.current.uTime = time
    simulationShader.current.uPositionsProgress = scrollProgress.current

    particlesShader.current.uTime = time
    particlesShader.current.uPositions = renderTarget.texture

    // Compute the pointer world position at z = 0 (particles' depth)
    const ndcPointer = new Vector3(pointer.x, pointer.y, 0.5)
    ndcPointer.unproject(camera)

    const cameraPosition = camera.position.clone()
    const direction = ndcPointer.sub(cameraPosition).normalize()
    const distance = (0 - cameraPosition.z) / direction.z
    const pointerWorldPosition = cameraPosition.add(direction.multiplyScalar(distance))
    particlesShader.current.uPointerWorld = pointerWorldPosition

    // In your useFrame function, after updating the pointerWorldPosition
    meshRef.current!.updateMatrixWorld()
    const inverseModelMatrix = new Matrix4()
    inverseModelMatrix.copy(meshRef.current!.matrixWorld).invert()
    particlesShader.current.uInverseModelMatrix = inverseModelMatrix

    if (!simVisMaterial.current) return
    simVisMaterial.current.map = renderTarget.texture
  })

  // Update the progress value based on the scroll
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: '#section',
        start: 'top bottom',
        end: 'top top',
        snap: { snapTo: [0, 1], duration: 0.8, ease: 'power2.inOut' },
        onUpdate: (self) => {
          scrollProgress.current = self.progress
        },
      })
    },
    {
      dependencies: [],
    },
  )

  return (
    <>
      {/* Simulation material */}
      {/* Render off-screen simulation material with square geometry */}
      {createPortal(
        <mesh ref={meshRef}>
          <simulationShaderMaterial
            key={SimulationShaderMaterial.key}
            ref={simulationShader}
            uTime={0}
            uPositionsProgress={0}
            uPositions0={null}
            uPositions1={null}
            onBeforeCompile={(shader) => {
              if (!shader) return

              const positions0 = new DataTexture(
                // getMeshPositions(scene, size),
                getRandomSpherePositions(particlesCount),
                particlesCount,
                particlesCount,
                RGBAFormat,
                FloatType,
              )
              positions0.needsUpdate = true

              const positions1 = new DataTexture(
                getRandomBoxPositions(particlesCount),
                particlesCount,
                particlesCount,
                RGBAFormat,
                FloatType,
              )
              positions1.needsUpdate = true

              shader.uniforms.uPositions0 = { value: positions0 }
              shader.uniforms.uPositions1 = { value: positions1 }
            }}
          />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={squareGeometryPositions.length / 3}
              array={squareGeometryPositions}
              itemSize={3}
            />
            <bufferAttribute attach="attributes-uv" count={squareUvs.length / 2} array={squareUvs} itemSize={2} />
          </bufferGeometry>
        </mesh>,
        FBOscene,
      )}

      {/* Points */}
      <points position={[0, 0, 0]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={particlesPosition}
            count={particlesPosition.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <particleAnimationShaderMaterial
          attach="material"
          key={ParticleAnimationShaderMaterial.key}
          ref={particlesShader}
          depthTest={false}
          transparent={true}
          blending={AdditiveBlending}
          // uniforms
          uTime={0}
          uPositions={null}
          uPointerWorld={new Vector3(0, 0)}
          uInverseModelMatrix={new Matrix4()}
        />
      </points>

      {/* Simulation visualisation */}
      <Plane args={[2, 2]} position={[3, 1, 2]}>
        <meshBasicMaterial ref={simVisMaterial} map={renderTarget.texture} />
      </Plane>
    </>
  )
}

const getRandomSpherePositions = (size: number): Float32Array => {
  // we need to create a vec4 since we're passing the positions to the fragment shader
  // data textures need to have 4 components, R, G, B, and A
  // const particlesCount = size * size
  const particlesCount = size * size
  const data = new Float32Array(particlesCount * 4)

  for (let i = 0; i < particlesCount; i++) {
    const stride = i * 4

    const distance = Math.sqrt(Math.random()) * 2.0
    const theta = MathUtils.randFloatSpread(360)
    const phi = MathUtils.randFloatSpread(360)

    data[stride] = distance * Math.sin(theta) * Math.cos(phi)
    data[stride + 1] = distance * Math.sin(theta) * Math.sin(phi)
    data[stride + 2] = distance * Math.cos(theta)
    data[stride + 3] = 0.0 // not used
  }

  return data
}

const getRandomBoxPositions = (size: number): Float32Array => {
  // we need to create a vec4 since we're passing the positions to the fragment shader
  // data textures need to have 4 components, R, G, B, and A
  // const particlesCount = size * size
  const particlesCount = size * size
  const data = new Float32Array(particlesCount * 4)

  for (let i = 0; i < particlesCount; i++) {
    const stride = i * 4

    const distance = 4.0
    const x = Math.random() * 2 - 1
    const y = Math.random() * 2 - 1
    const z = Math.random() * 2 - 1

    data[stride] = x * distance
    data[stride + 1] = y * distance
    data[stride + 2] = z * distance
    data[stride + 3] = 0.0 // not used
  }

  return data
}

function getMeshPositions(scene: Group, size: number): Float32Array | null {
  if (!scene) return null

  const particlesCount = size * size

  // Position the particles over the model's surface
  const positions = new Float32Array(particlesCount * 4)

  // Find the mesh in the GLTF scene
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      // Create a MeshSurfaceSampler
      const sampler = new MeshSurfaceSampler(object).build()
      const position = new Vector3()

      for (let i = 0; i < particlesCount; i++) {
        // Sample the mesh surface and set the position
        sampler.sample(position)
        const stride = i * 4
        positions[stride] = position.x
        positions[stride + 1] = position.y
        positions[stride + 2] = position.z
        positions[stride + 3] = 1.0 // Placeholder for the alpha channel
      }
    }
  })

  return positions
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      particleAnimationShaderMaterial: ShaderMaterialProps & ParticleUniforms
      simulationShaderMaterial: ShaderMaterialProps & SimulationUniforms
    }
  }
}

export default FBOParticles

'use client'
import { useGSAP } from '@gsap/react'
import {
  Bvh,
  MeshTransmissionMaterial,
  ScreenQuad,
  shaderMaterial,
  useFBO,
  useGLTF,
  useTexture,
} from '@react-three/drei'
import { createPortal, extend, GroupProps, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, forwardRef, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  DataTexture,
  FloatType,
  Group,
  MathUtils,
  Mesh,
  NearestFilter,
  type Object3DEventMap,
  OrthographicCamera,
  Plane,
  PlaneHelper,
  Raycaster,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  Vector3,
} from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { type GLTF } from 'three-stdlib'

import particleFragment from './particle.frag'
import particleVertex from './particle.vert'
import simulationFragment from './simulation/simulation.frag'
import simulationVertex from './simulation/simulation.vert'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ParticleUniforms = {
  uTime: number
  uPositions: Texture | null
  uTransitionInProgress: number
  // uPointerPosition: Vector3
  // uNoiseMultiplier: number
}

const INITIAL_PARTICLE_UNIFORMS: ParticleUniforms = {
  uTime: 0,
  uPositions: null,
  uTransitionInProgress: 0,
}

const LoopspeedPointsShaderMaterial = shaderMaterial(INITIAL_PARTICLE_UNIFORMS, particleVertex, particleFragment)

// Simulation shader material
type SimulationUniforms = {
  uTime: number
  uTransitionInProgress: number
  uInitialPositions: DataTexture | null
  uPositions1: DataTexture | null
  uPositions2: DataTexture | null
  uBlendProgress: number
  uPointerPosition: Vector3
  uNoiseMultiplier: number
  uNoiseTexture: Texture | null
}

const INITIAL_SIMULATION_UNIFORMS: SimulationUniforms = {
  uTime: 0,
  uTransitionInProgress: 0,
  uInitialPositions: null,
  uPositions1: null,
  uPositions2: null,
  uBlendProgress: 0,
  uPointerPosition: new Vector3(0, 0, 0),
  uNoiseMultiplier: 0,
  uNoiseTexture: null,
}

const LoopspeedSimShaderMaterial = shaderMaterial(INITIAL_SIMULATION_UNIFORMS, simulationVertex, simulationFragment)

extend({ LoopspeedPointsShaderMaterial, LoopspeedSimShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    loopspeedPointsShaderMaterial: ShaderMaterialProps & ParticleUniforms
    loopspeedSimShaderMaterial: ShaderMaterialProps & SimulationUniforms
  }
}

const PARTICLES_COUNT = 3136 // 48 x 48 grid
const TEXTURE_SIZE = Math.sqrt(PARTICLES_COUNT)
console.log(TEXTURE_SIZE)

const LoopspeedParticles: FC = () => {
  const noiseTexture = useTexture('/images/noiseTexture.png')
  // SIMULATION ------
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

  // ------------------
  // PARTICLE GEOMETRY SETUP
  // ------------------
  // Use a dummy position attribute (all zeros) because our vertex shader will sample from uPositions.
  const particlesPositions = useMemo(() => {
    const positions = new Float32Array(PARTICLES_COUNT * 3)
    for (let i = 0; i < PARTICLES_COUNT; i++) {
      const i3 = i * 3
      positions[i3 + 0] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = 0
    }
    return positions
  }, [])

  // Create UVs for the particles (for sampling the simulation texture)
  const textureUvs = useMemo(() => {
    const uvs = new Float32Array(PARTICLES_COUNT * 2)
    for (let i = 0; i < PARTICLES_COUNT; i++) {
      const x = (i % TEXTURE_SIZE) / (TEXTURE_SIZE - 1)
      const y = Math.floor(i / TEXTURE_SIZE) / (TEXTURE_SIZE - 1)
      uvs[i * 2] = x
      uvs[i * 2 + 1] = y
    }
    return uvs
  }, [])

  const simulationShaderMaterial = useRef<ShaderMaterial & Partial<SimulationUniforms>>(null)
  const pointsShaderMaterial = useRef<ShaderMaterial & Partial<ParticleUniforms>>(null)

  // Model refs
  const loopModel = useRef<Group<Object3DEventMap>>(null)
  const lightbulbModel = useRef<Group<Object3DEventMap>>(null)

  const raycaster = useMemo(() => new Raycaster(), [])
  // Define a fallback plane; adjust the normal and constant so that the plane
  // is positioned slightly in front of the mesh. For example, a plane facing +Z with constant -0.5
  const pointerPlane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), [])
  const planeHelper = useMemo(() => new PlaneHelper(pointerPlane, 5, 0xff0000), [pointerPlane])
  // A persistent vector to store the fallback intersection
  const fallbackIntersection = new Vector3()
  // Store the smoothed pointer position
  const smoothedPointer = useRef(new Vector3(0, 0, 10))
  const currentNoise = useRef(0)

  // Animation values
  const transitionInProgress = useRef({ value: 0 })
  const blendProgress = useRef({ value: 0 })

  useFrame(({ gl, clock, pointer, camera }) => {
    if (!pointsShaderMaterial.current || !simulationShaderMaterial.current) return
    const time = clock.elapsedTime

    gl.setRenderTarget(renderTarget)
    gl.clear()
    gl.render(FBOscene, fboCamera)
    gl.setRenderTarget(null)

    // --- Raycasting the Pointer ---
    if (!loopModel.current || !lightbulbModel.current) return

    // Set the raycaster from the camera and pointer
    raycaster.setFromCamera(pointer, camera)

    // Try intersecting the mesh.
    raycaster.firstHitOnly = true
    const intersections = raycaster.intersectObjects(
      [...loopModel.current.children, ...lightbulbModel.current.children],
      false,
    )

    const isPointerOverModel = intersections.length > 0

    let intersectionPoint: Vector3

    if (isPointerOverModel) {
      intersectionPoint = intersections[0].point
    } else {
      // Compute the fallback intersection with our pointer plane.
      raycaster.ray.intersectPlane(pointerPlane, fallbackIntersection)
      intersectionPoint = fallbackIntersection
    }

    // Smooth the pointer position by lerping toward the target intersection.
    // Adjust the lerp factor (here, 0.1) to control how quickly the pointer moves.
    smoothedPointer.current.lerp(intersectionPoint, 0.08)

    // When the pointer is over, targetNoise = 1, otherwise 0.
    const noiseMultiplier = MathUtils.lerp(currentNoise.current, isPointerOverModel ? 1 : 0, 0.1)
    currentNoise.current = noiseMultiplier

    // Set uniforms
    simulationShaderMaterial.current.uTime = time
    simulationShaderMaterial.current.uTransitionInProgress = transitionInProgress.current.value
    simulationShaderMaterial.current.uBlendProgress = blendProgress.current.value
    simulationShaderMaterial.current.uPointerPosition = smoothedPointer.current
    simulationShaderMaterial.current.uNoiseMultiplier = noiseMultiplier

    pointsShaderMaterial.current.uTime = time
    pointsShaderMaterial.current.uPositions = renderTarget.texture
    pointsShaderMaterial.current.uTransitionInProgress = transitionInProgress.current.value
  })

  useGSAP(
    () => {
      // Transition in
      gsap.to(transitionInProgress.current, {
        value: 1,
        duration: 3,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.to(blendProgress.current, {
            keyframes: [
              { value: 1, duration: 3, ease: 'power3.inOut' },
              { value: 1, duration: 1 },
            ],
            yoyo: true,
            repeat: -1,
          })
        },
      })
    },
    {
      dependencies: [],
    },
  )

  return (
    <>
      {/* Render off-screen simulation material with square geometry */}
      {createPortal(
        <ScreenQuad>
          <loopspeedSimShaderMaterial
            key={LoopspeedSimShaderMaterial.key}
            ref={simulationShaderMaterial}
            uTime={0}
            attach="material"
            uTransitionInProgress={0}
            uBlendProgress={0}
            uInitialPositions={null}
            uPositions1={null}
            uPositions2={null}
            uNoiseMultiplier={0}
            uNoiseTexture={noiseTexture}
            uPointerPosition={smoothedPointer.current}
            onBeforeCompile={(shader) => {
              if (!shader) return
              if (!loopModel.current || !lightbulbModel.current) return

              const scatteredPositions = createDataTextureFromPositions(getRandomSpherePositions(PARTICLES_COUNT))

              const loopModelPositions = createDataTextureFromPositions(getMeshSurfacePositionsB(loopModel.current))
              const lightbulbModelPositions = createDataTextureFromPositions(
                getMeshSurfacePositionsB(lightbulbModel.current),
              )

              scatteredPositions.needsUpdate = true
              loopModelPositions.needsUpdate = true
              lightbulbModelPositions.needsUpdate = true

              shader.uniforms.uInitialPositions = { value: scatteredPositions }
              shader.uniforms.uPositions1 = { value: loopModelPositions }
              shader.uniforms.uPositions2 = { value: lightbulbModelPositions }
            }}
          />
        </ScreenQuad>,
        FBOscene,
      )}

      {/* Display plane for debugging */}
      {/* <primitive object={planeHelper} /> */}

      {/* mesh and particles */}
      <group dispose={null}>
        {/* MODEL */}
        {/* https://drei.docs.pmnd.rs/performances/bvh */}
        <Bvh firstHitOnly>
          <LoopModel ref={loopModel} />
          <LoopTargetModel ref={lightbulbModel} position={[0, 8, 0]} />
        </Bvh>

        {/* PARTICLES */}
        <points>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={particlesPositions}
              count={particlesPositions.length / 3}
              itemSize={3}
            />
            {/* Pass the computed UVs to the points */}
            <bufferAttribute attach="attributes-uv" array={textureUvs} count={textureUvs.length / 2} itemSize={2} />
          </bufferGeometry>
          <loopspeedPointsShaderMaterial
            attach="material"
            key={LoopspeedPointsShaderMaterial.key}
            ref={pointsShaderMaterial}
            transparent={true}
            uTime={0}
            uPositions={null}
            uTransitionInProgress={0}
          />
        </points>
      </group>
    </>
  )
}

useGLTF.preload('/models/loopspeed.glb')
useGLTF.preload('/models/lightbulb.glb')

const LoopModel = forwardRef<Group<Object3DEventMap>, GroupProps>((props, ref) => {
  const { nodes } = useGLTF('/models/loopspeed.glb')

  return (
    <group ref={ref} {...props}>
      {/* @ts-expect-error no types */}
      <mesh geometry={nodes.INFINITY_ThickMesh.geometry}>
        <MeshTransmissionMaterial
          thickness={1.6}
          backside={true}
          backsideThickness={0.2}
          roughness={0.3}
          // transmission={1}
        />
      </mesh>
    </group>
  )
})

LoopModel.displayName = 'LoopModel'

type GLTFResult = GLTF & {
  nodes: {
    INFINITY_ThickMesh: Mesh
    pegs: Mesh
    nest: Mesh
  }
  materials: {}
}

const LoopTargetModel = forwardRef<Group<Object3DEventMap>, GroupProps>((props, ref) => {
  const { nodes, materials } = useGLTF('/models/loopspeed/Logo_Pegs_Nest.glb') as GLTFResult

  return (
    <group {...props} ref={ref} dispose={null}>
      {/* <mesh name="loop-target" geometry={nodes.INFINITY_ThickMesh.geometry} /> */}
      <mesh name="pegs" geometry={nodes.pegs.geometry} material={nodes.pegs.material} />
      <mesh name="nest" geometry={nodes.nest.geometry} material={nodes.nest.material} />
    </group>
  )
})

LoopTargetModel.displayName = 'LoopTargetModel'

const createDataTextureFromPositions = (positions: Float32Array): DataTexture => {
  return new DataTexture(positions, TEXTURE_SIZE, TEXTURE_SIZE, RGBAFormat, FloatType)
}

const getMeshSurfacePositionsB = (group: Group): Float32Array => {
  // First, traverse the group and collect all meshes.
  const meshes: Mesh[] = []
  group.traverse((object) => {
    if (object instanceof Mesh) {
      meshes.push(object)
    }
  })

  const numMeshes = meshes.length
  if (numMeshes === 0) return new Float32Array(0)

  // Distribute particles evenly among the meshes.
  // (Optionally, you could distribute leftover particles as well.)
  const particlesPerMesh = Math.floor(PARTICLES_COUNT / numMeshes)
  // For simplicity, we sample only the evenly distributed particles.
  const totalParticles = particlesPerMesh * numMeshes

  // Create a typed array with 4 components per particle.
  const positions = new Float32Array(totalParticles * 4)
  let offset = 0

  // Loop over each mesh.
  for (const mesh of meshes) {
    // Build the sampler for this mesh.
    const sampler = new MeshSurfaceSampler(mesh).build()
    const pos = new Vector3()
    const normal = new Vector3()
    const offsetAmount = 0.03 // Adjust this value to control the extrusion distance

    // Sample the designated number of particles for this mesh.
    for (let i = 0; i < particlesPerMesh; i++) {
      sampler.sample(pos, normal)
      // Extrude the position slightly along its normal.
      pos.addScaledVector(normal, offsetAmount)
      // Write the 4-component vector into the positions array.
      positions.set([pos.x, pos.y, pos.z, 1.0], offset)
      offset += 4
    }
  }

  return positions
}

const getRandomSpherePositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 4)
  const spread = 4.2

  for (let i = 0; i < count; i++) {
    // Convert degrees to radians
    const theta = MathUtils.randFloatSpread(360) * MathUtils.DEG2RAD
    const phi = MathUtils.randFloatSpread(360) * MathUtils.DEG2RAD

    const x = spread * Math.sin(theta) * Math.cos(phi)
    const y = spread * Math.sin(theta) * Math.sin(phi)
    // The extra random offset on z is optional
    const z = spread * Math.cos(theta) + Math.random() * 0.5 - 0.25
    const a = 1.0

    positions.set([x, y, z, a], i * 4)
  }

  return positions
}

export default LoopspeedParticles

'use client'
import { useGSAP } from '@gsap/react'
import { shaderMaterial, useFBO } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import React, { forwardRef, type RefObject, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  FloatType,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
} from 'three'

import particleFragment from './point.frag'
import particleVertex from './point.vert'
import LoopParticleSimulationMaterial, { type SimulationUniforms } from './simulation/Simulation'

gsap.registerPlugin(useGSAP)

type PointsShaderUniforms = {
  uTime: number
  uPositions: Texture | null
  uScatteredAmount: number
}

const INITIAL_PARTICLE_UNIFORMS: PointsShaderUniforms = {
  uTime: 0,
  uPositions: null,
  uScatteredAmount: 1,
}

const LoopPointsShaderMaterial = shaderMaterial(INITIAL_PARTICLE_UNIFORMS, particleVertex, particleFragment)

extend({ LoopPointsShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    loopPointsShaderMaterial: ShaderMaterialProps & PointsShaderUniforms
  }
}

type Props = {
  isScattered: boolean
  loopMesh: RefObject<Mesh>
}

const LoopPoints = forwardRef<Points, Props>(({ isScattered, loopMesh }) => {
  const size = useThree((s) => s.size)

  // TODO: ADJUST DYANMICALLY BASED ON PERFORMANCE - usePerformanceMonitor hook
  const particlesCount = size.width < 768 ? 1024 : 16384 // make this a square number!!
  const textureSize = Math.sqrt(particlesCount)

  // Animation values
  const scatteredAmount = useRef({ value: 1 })

  useGSAP(() => {
    gsap.to(scatteredAmount.current, {
      value: isScattered ? 1 : 0,
      duration: 2,
      ease: 'power2.inOut',
    })
  }, [isScattered])

  const points = useRef<Points>(null)

  // ------------------
  // SIMULATION SETUP
  // ------------------
  const FBOscene = useMemo(() => new Scene(), [])
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
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3
      positions[i3 + 0] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = 0
    }
    return positions
  }, [particlesCount])

  // Random seed values for size and opacity fades
  const particlesSeeds = useMemo(() => {
    const seeds = new Float32Array(particlesCount)
    for (let i = 0; i < particlesCount; i++) {
      seeds[i] = Math.random()
    }
    return seeds
  }, [particlesCount])

  // Create UVs for the particles (for sampling the simulation texture)
  const textureUvs = useMemo(() => {
    const uvs = new Float32Array(particlesCount * 2)
    for (let i = 0; i < particlesCount; i++) {
      const x = (i % textureSize) / (textureSize - 1)
      const y = Math.floor(i / textureSize) / (textureSize - 1)
      uvs[i * 2] = x
      uvs[i * 2 + 1] = y
    }
    return uvs
  }, [particlesCount, textureSize])

  const simulationShaderMaterial = useRef<ShaderMaterial & Partial<SimulationUniforms>>(null)
  const pointsShaderMaterial = useRef<ShaderMaterial & Partial<PointsShaderUniforms>>(null)

  useFrame(({ gl, clock }) => {
    if (!pointsShaderMaterial.current || !simulationShaderMaterial.current || !loopMesh.current) return

    const time = clock.elapsedTime

    gl.setRenderTarget(renderTarget)
    gl.clear()
    gl.render(FBOscene, fboCamera)
    gl.setRenderTarget(null)

    // Simulation uniforms
    simulationShaderMaterial.current.uTime = time
    simulationShaderMaterial.current.uScatteredAmount = scatteredAmount.current.value

    // Points uniforms
    pointsShaderMaterial.current.uTime = time
    pointsShaderMaterial.current.uPositions = renderTarget.texture
    pointsShaderMaterial.current.uScatteredAmount = scatteredAmount.current.value
  })

  return (
    <>
      {/* Simulation */}
      <LoopParticleSimulationMaterial
        ref={simulationShaderMaterial}
        particlesCount={particlesCount}
        loopMesh={loopMesh}
        fboScene={FBOscene}
      />

      {/* Points */}
      <points ref={points} dispose={null}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={particlesPositions}
            count={particlesPositions.length / 3}
            itemSize={3}
          />
          {/* Pass the computed UVs to the points */}
          <bufferAttribute attach="attributes-uv" array={textureUvs} count={textureUvs.length / 2} itemSize={2} />
          {/* Pass seeds for randomising opacity */}
          <bufferAttribute attach="attributes-seed" array={particlesSeeds} count={particlesSeeds.length} itemSize={1} />
        </bufferGeometry>
        <loopPointsShaderMaterial
          attach="material"
          key={LoopPointsShaderMaterial.key}
          ref={pointsShaderMaterial}
          transparent={true}
          uTime={0}
          uPositions={null}
          uScatteredAmount={1}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </>
  )
})

LoopPoints.displayName = 'LoopPoints'

export default LoopPoints

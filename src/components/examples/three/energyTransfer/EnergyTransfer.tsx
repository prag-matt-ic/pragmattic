'use client'
import { useGSAP } from '@gsap/react'
import { PerformanceMonitor, Sphere, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import gsap from 'gsap'
import React, { type FC } from 'react'

import Camera from '@/components/three/Camera'

import EnergyTunnel, { HALF_TUNNEL_LENGTH } from './cylinder/EnergyTunnel'
import Environment from './environment/Environment'
import EnergyTunnelPoints from './points/EnergyPoints'

gsap.registerPlugin(useGSAP)

type Props = {}

const SPHERE_RADIUS = 0.24

const EnergyTransfer: FC<Props> = ({}) => {
  // Intermittently disengage the energy display
  return (
    <group rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
      <EnergyTunnel />
      <EnergyTunnelPoints />

      {/* Spheres either end */}
      <Sphere args={[SPHERE_RADIUS, 32, 32]} position={[0, -HALF_TUNNEL_LENGTH - SPHERE_RADIUS, 0]}>
        <meshPhysicalMaterial color="black" />
      </Sphere>

      <Sphere args={[SPHERE_RADIUS, 32, 32]} position={[0, HALF_TUNNEL_LENGTH + SPHERE_RADIUS, 0]}>
        <meshPhysicalMaterial color="black" />
      </Sphere>
    </group>
  )
}

type CanvasProps = {
  className?: string
}

const EnergyTransferCanvas: FC<CanvasProps> = ({ className }) => {
  return (
    <Canvas
      className={className}
      flat={true}
      camera={{ position: [0, 0, 5], fov: 60, far: 10, near: 0.01 }}
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}>
      <PerformanceMonitor>
        <Environment />
        <EnergyTransfer />
        <Camera />
        <Postprocessing />
      </PerformanceMonitor>
      <Stats />
    </Canvas>
  )
}

const Postprocessing: FC = () => {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.75} mipmapBlur={true} intensity={2} opacity={0.5} height={512} />
    </EffectComposer>
  )
}

export default EnergyTransferCanvas

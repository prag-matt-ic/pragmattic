'use client'
import { useGSAP } from '@gsap/react'
import { PerformanceMonitor, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import gsap from 'gsap'
import React, { type FC } from 'react'
import { Color } from 'three'

import Camera from '@/components/three/Camera'

import EnergyTunnel, { HALF_TUNNEL_LENGTH } from './cylinder/EnergyTunnel'
import Environment from './environment/Environment'
import EnergyTunnelPoints from './points/EnergyPoints'
import EnergySphere, { SPHERE_RADIUS } from './sphere/EnergySphere'

gsap.registerPlugin(useGSAP)

type Props = {}

const EnergyTransfer: FC<Props> = ({}) => {
  return (
    <group rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
      <EnergyTunnel />
      <EnergyTunnelPoints />
      <EnergySphere
        isOnLeft={true}
        seed={Math.random()}
        colour={new Color('#37F3FF')}
        position={[0.0, -HALF_TUNNEL_LENGTH - SPHERE_RADIUS, 0]}
      />
      <EnergySphere
        isOnLeft={false}
        seed={Math.random()}
        colour={new Color('#FF6DF5')}
        position={[0, HALF_TUNNEL_LENGTH + SPHERE_RADIUS, 0]}
      />
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
      camera={{ position: [0, 0, 2], fov: 70, far: 10, near: 0.01 }}
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
      {process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  )
}

const Postprocessing: FC = () => {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.8} mipmapBlur={true} intensity={2} opacity={0.5} height={512} />
    </EffectComposer>
  )
}

export default EnergyTransferCanvas

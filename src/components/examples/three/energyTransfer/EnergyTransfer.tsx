'use client'
import { useGSAP } from '@gsap/react'
import { PerformanceMonitor, PerformanceMonitorApi, Stats, usePerformanceMonitor } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import gsap from 'gsap'
import { KernelSize } from 'postprocessing'
import React, { type FC, useMemo, useState } from 'react'
import { Color, type Vector3Tuple } from 'three'

import Camera from '@/components/three/Camera'

import EnergyTunnel, { HALF_TUNNEL_LENGTH } from './cylinder/EnergyTunnel'
import Environment from './environment/Environment'
import EnergyTunnelPoints from './points/EnergyPoints'
import EnergySphere, { SPHERE_RADIUS } from './sphere/EnergySphere'

gsap.registerPlugin(useGSAP)

type Props = {}

const PINK_COLOUR = new Color('#37F3FF')
const CYAN_COLOUR = new Color('#FF6DF5')

const EnergyTransfer: FC<Props> = ({}) => {
  const size = useThree((s) => s.size)
  const isLandscape = size.width > size.height
  const rotation: Vector3Tuple = useMemo(() => (isLandscape ? [0, 0, Math.PI / 2] : [0, 0, 0]), [isLandscape])

  const seedA = useMemo(() => Math.random(), [])
  const seedB = useMemo(() => Math.random(), [])

  return (
    <group rotation={rotation} position={[0, 0, isLandscape ? 0 : -1]}>
      <EnergyTunnel />
      <EnergyTunnelPoints />
      <EnergySphere
        isOnLeft={true}
        seed={seedA}
        colour={PINK_COLOUR}
        position={[0.0, -HALF_TUNNEL_LENGTH - SPHERE_RADIUS, 0]}
      />
      <EnergySphere
        isOnLeft={false}
        seed={seedB}
        colour={CYAN_COLOUR}
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
    <main className="h-lvh w-full font-sans">
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
    </main>
  )
}

const Postprocessing: FC = () => {
  const [isEnabled, setIsEnabled] = useState(true)

  const onIncline = (api: PerformanceMonitorApi) => {
    setIsEnabled(api.fps > 50)
  }

  const onDecline = (api: PerformanceMonitorApi) => {
    setIsEnabled(!(api.fps > 50))
  }

  usePerformanceMonitor({ onIncline, onDecline })

  return (
    <EffectComposer enabled={isEnabled}>
      <Bloom
        luminanceThreshold={0.9}
        mipmapBlur={true}
        intensity={4}
        opacity={0.3}
        height={512}
        kernelSize={KernelSize.MEDIUM}
      />
    </EffectComposer>
  )
}

export default EnergyTransferCanvas

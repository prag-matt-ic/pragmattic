'use client'
import { useGSAP } from '@gsap/react'
import { PerformanceMonitor, type PerformanceMonitorApi } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC, useState } from 'react'

import HomeBackgroundPlane from '@/components/background/HomeBackgroundPlane'
import FloatingInfos from '@/components/floatingInfo/FloatingInfos'
import PointsPlane from '@/components/main/points/Points'
import TorusSections from '@/components/main/TorusSections'
import PointerCamera from '@/components/three/PointerCamera'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

type Props = {
  isMobile: boolean
}

const HomeCanvas: FC<Props> = ({ isMobile }) => {
  const [dpr, setDpr] = useState(1.4)
  const minDpr = isMobile ? 0.8 : 1

  const onPerformanceInline = (api: PerformanceMonitorApi) => {
    if (dpr < window.devicePixelRatio) setDpr((prev) => prev + 0.2)
  }

  const onPerformanceDecline = (api: PerformanceMonitorApi) => {
    if (dpr > minDpr) setDpr((prev) => prev - 0.2)
  }

  return (
    <Canvas
      className="!fixed inset-0"
      dpr={dpr}
      camera={{ position: [0, 0, 5], far: 20 }}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
      }}
      // TODO: custom performance implementation to scale the point sizes accordingly when the DPR is lowered
      // performance={{
      //   min: 0.4,
      //   max: 1,
      //   current: 1,
      // }}
    >
      <PerformanceMonitor
        onIncline={onPerformanceInline}
        onDecline={onPerformanceDecline}
        onFallback={onPerformanceDecline}
        flipflops={4}
      />
      {/* <Stats /> */}
      <ambientLight intensity={1} />
      {!isMobile && <PointerCamera cameraProps={{ far: 20, position: [0, 0, 5] }} intensity={0.04} />}
      <HomeBackgroundPlane />
      <PointsPlane isMobile={isMobile} />
      <TorusSections isMobile={isMobile} />
      <FloatingInfos isMobile={isMobile} />
    </Canvas>
  )
}

export default HomeCanvas

'use client'
import { useGSAP } from '@gsap/react'
import { PerformanceMonitor, type PerformanceMonitorApi } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC, useState } from 'react'

import HomeBackgroundPlane from '@/components/home/background/HomeBackgroundPlane'
import HomeMain from '@/components/home/main/HomeMain'
import PointsPlane from '@/components/home/main/points/Points'
import PointerCamera from '@/components/PointerCamera'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

type Props = {
  isMobile: boolean
}

const HomeCanvas: FC<Props> = ({ isMobile }) => {
  const [dpr, setDpr] = useState(1.4)
  const minDpr = isMobile ? 0.6 : 0.8

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
      }}>
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
      <HomeMain isMobile={isMobile} />
    </Canvas>
  )
}

export default HomeCanvas

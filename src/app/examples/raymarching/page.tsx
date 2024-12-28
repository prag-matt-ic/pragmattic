'use client'
import { useGSAP } from '@gsap/react'
import { OrthographicCamera, PerformanceMonitor, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { useState } from 'react'

import RayMarchingScreenQuadShader from '@/components/examples/raymarching/RayMarchingScreenQuad'
import ScrollDownArrow from '@/components/examples/ScrollDown'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Explorations in art and shaders
export default function RayMarchingPage() {
  const [dpr, setDpr] = useState(1)

  useGSAP(() => {
    gsap.to('h1', {
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        start: 80,
        once: true,
      },
    })
  }, [])

  return (
    <main className="h-[500vh] w-full font-sans">
      <Canvas
        className="!fixed inset-0"
        dpr={dpr}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <PerformanceMonitor flipflops={3} onFallback={() => setDpr(1)} onIncline={() => setDpr(1.5)}>
          <OrthographicCamera makeDefault={true} />
          <RayMarchingScreenQuadShader />
        </PerformanceMonitor>
        {/* <Stats className="!bottom-0" /> */}
      </Canvas>

      <header className="pointer-events-none relative z-10 flex h-svh w-full items-center justify-center">
        <h1 className="text-center text-3xl font-semibold text-white shadow-lg">
          Ray Marching <span className="text-white/20">|</span> Infinite Scroll
        </h1>
      </header>

      <ScrollDownArrow />

      {/* Controls */}
      {/* <Leva titleBar={{ position: { x: -8, y: 64 } }} /> */}
    </main>
  )
}

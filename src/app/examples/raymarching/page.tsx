'use client'
import { useGSAP } from '@gsap/react'
import { OrthographicCamera, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React from 'react'

import RayMarchingScreenQuadShader from '@/components/examples/raymarching/RayMarchingScreenQuad'
import ScrollDownArrow from '@/components/examples/ScrollDown'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Explorations in art and shaders
export default function RayMarchingPage() {
  return (
    <main className="h-[1000vh] w-full font-sans">
      <Canvas
        className="!fixed inset-0"
        dpr={1}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <OrthographicCamera makeDefault />
        <RayMarchingScreenQuadShader />
        <Stats />
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

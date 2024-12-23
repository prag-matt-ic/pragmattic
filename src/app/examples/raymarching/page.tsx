'use client'
import { OrthographicCamera, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'

import RayMarchingScreenQuadShader from '@/components/examples/raymarching/RayMarchingScreenQuad'
import ScrollDownArrow from '@/components/examples/ScrollDown'

// Explorations in art and shaders
export default function RayMarchingPage() {
  return (
    <main className="min-h-screen w-full font-sans">
      <Canvas
        className="!fixed inset-0"
        dpr={1.5}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <RayMarchingScreenQuadShader />
        <OrthographicCamera makeDefault />

        <Stats />
      </Canvas>

      <ScrollDownArrow />

      {/* Controls */}
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </main>
  )
}

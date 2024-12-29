'use client'
import { OrthographicCamera, PerformanceMonitor, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'

import TimeboxxArtShader from '@/components/examples/art/timeboxx/TimeboxxShader'

// Explorations in art and shaders
export default function TimeboxxShaderPage() {
  const [dpr, setDpr] = useState(1.5)

  return (
    <main className="h-screen w-full">
      <Canvas
        className="!fixed inset-0"
        dpr={dpr}
        // frameloop="demand"
        gl={{
          alpha: false,
          antialias: false,
          // powerPreference: 'high-performance',
        }}>
        <OrthographicCamera makeDefault={true} far={2} />
        <PerformanceMonitor flipflops={3} onFallback={() => setDpr(1)} onIncline={() => setDpr(1.5)}>
          <TimeboxxArtShader />
        </PerformanceMonitor>
        <Stats />
      </Canvas>

      {/* Controls */}
      {/* <Leva titleBar={{ position: { x: -8, y: 64 } }} /> */}
    </main>
  )
}

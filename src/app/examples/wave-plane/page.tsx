'use client'
import { useGSAP } from '@gsap/react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { Leva } from 'leva'

import ScrollDownArrow from '@/components/examples/ScrollDown'
import WavePlane from '@/components/examples/wavePlane/WavePlane'
import PointerCamera from '@/components/PointerCamera'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function WavePlaneExample() {
  return (
    <main className="h-[1000vh] w-full">
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <color attach="background" args={['#000']} />
        <WavePlane screenHeights={10 - 1} />
        <PointerCamera />
      </Canvas>

      <ScrollDownArrow />

      {/* Control positioning */}
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </main>
  )
}

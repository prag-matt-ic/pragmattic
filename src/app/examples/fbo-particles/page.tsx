'use client'
import { useGSAP } from '@gsap/react'
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React from 'react'

import LoopspeedParticles from '@/components/examples/particles/loopspeed/LoopspeedParticles'
import ScrollDownArrow from '@/components/examples/ScrollDown'
import PointerCamera from '@/components/PointerCamera'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function FBOParticlesPage() {
  return (
    <main className="w-full font-sans">
      {/* ThreeJS content */}
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <Environment
          background={true}
          ground={false}
          // files="https://cdnb.artstation.com/p/assets/panos/panos/074/909/685/large/67ed628115567a0a.jpg?1713275809"
          files="https://cdnb.artstation.com/p/assets/panos/panos/074/909/667/large/cecaaa372f280832.jpg?1713275782"
          resolution={1024}
        />

        <LoopspeedParticles />
        <pointLight position={[-0.5, 2, 1]} intensity={8} />
        <PointerCamera cameraProps={{ far: 20 }} />
        {/* <OrbitControls /> */}
        <Stats />
      </Canvas>

      {/* HTML content */}
      <section className="h-lvh w-full">
        <ScrollDownArrow />
      </section>
      <section className="h-lvh w-full" />
      <section className="h-lvh w-full" />
    </main>
  )
}

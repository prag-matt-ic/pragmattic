'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { Leva } from 'leva'

import ScrollDownArrow from '@/components/examples/ScrollDown'
import WavePlane from '@/components/examples/wavePlane/WavePlane'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// TODO: metadata

export default function WavePlaneExample() {
  return (
    <main className="h-[1000vh] w-full">
      <WavePlane className="!fixed inset-0" withControls={true} />
      <ScrollDownArrow />
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </main>
  )
}

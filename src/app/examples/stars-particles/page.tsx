'use client'
import { useGSAP } from '@gsap/react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useRef } from 'react'

// import BasicParticles from '@/components/examples/particles/basicParticles/BasicParticles'
// import MeshSamplerParticles from '@/components/examples/particles/gltfParticles/MeshSamplerParticles'
import Stars from '@/components/examples/three/particles/stars/Stars'
import ScrollDownArrow from '@/components/examples/ScrollDown'
import PointerCamera from '@/components/PointerCamera'

// Building modern day scroll controlled star wars intro with React Three Fiber and GSAP
// Inspiration: https://codepen.io/nucro/pen/yYWdPp

// Agenda
// 1 - Basic Points with a predefined geometry and points material
// 2 - Basic Points with custom geometry and custom shader material
// 3 - Mesh surface sampler particles on a 3D model
// 4 - Creating and animating our Stars with custom vertex and fragment shader

// 5 - HTML 3D transforms using perspective and rotateX
// 6 - GSAP ScrollTrigger to animate the text movement

// Not covered
// - fragment shader basics (uniforms, varyings, gl_FragColor etc) - see my other video
// - simulation shaders (using a FBO render target - future topic as I learn more about it)
// - peformance optimisations for mobile - look into Drei helpers and reduce particle count

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function StarsPage() {
  return (
    <main className="h-[300vh] w-full font-sans">
      {/* ThreeJS content */}
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        {/* <BasicParticles /> */}
        {/* <MeshSamplerParticles /> */}
        <Stars />
        <PointerCamera cameraProps={{ far: 20 }} />
        {/* <OrbitControls /> */}
        {/* <Stats /> */}
      </Canvas>

      {/* HTML content */}
      <TextSection />
      <ScrollDownArrow />
    </main>
  )
}

const TextSection: FC = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Match media
      const matchMedia = gsap.matchMedia()

      // Mobile
      matchMedia.add('screen and (max-width: 800px)', () => {
        gsap.set(container.current, {
          rotateX: 16,
        })
      })

      // Desktop
      matchMedia.add('screen and (min-width: 800px)', () => {
        gsap.set(container.current, {
          translateY: '-30vh',
          rotateX: 48,
        })
      })

      gsap.set('p', { opacity: 1 })

      gsap.fromTo(
        'p',
        {
          yPercent: 50,
        },
        {
          ease: 'none',
          yPercent: -100,
          scrollTrigger: { start: 0, end: 'max', scrub: true },
        },
      )
    },
    { dependencies: [], scope: container },
  )

  return (
    <section
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}>
      <div
        ref={container}
        className="h-fit w-full px-10"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%)',
        }}>
        <p className="block w-full text-justify text-sm font-bold uppercase tracking-wide text-white opacity-0 md:text-5xl md:leading-relaxed">
          The internet&apos;s journey began in the late 1960s with the development of ARPANET by the U.S. Department of
          Defense&apos;s Advanced Research Projects Agency (ARPA). ARPANET was designed as a decentralized communication
          network that could withstand outages and connect various research institutions. Utilizing packet-switching
          technology, it allowed multiple computers to communicate on a single network.
          <br />
          <br />
          By the early 1970s, email was introduced, becoming one of the first killer apps that showcased the
          network&apos;s potential for widespread communication.
          <br />
          <br />
          The 1980s witnessed significant advancements with the standardization of the Transmission Control
          Protocol/Internet Protocol (TCP/IP), which became the foundational communication language of the internet. In
          1989, Tim Berners-Lee, a British scientist at CERN, invented the World Wide Web, revolutionizing how
          information was accessed and shared. This period also saw the rise of Internet Service Providers (ISPs),
          making the internet more accessible to the general public.
          <br />
          <br />
          The 1990s experienced an internet boom with the emergence of web browsers like Mosaic and Netscape Navigator,
          facilitating exponential growth in online users and websites.
          <br />
          <br />
          Entering the 21st century, the internet evolved into an indispensable global network influencing nearly every
          aspect of daily life. Broadband connections replaced dial-up, offering faster and always-on internet access.
          The advent of smartphones and mobile internet expanded connectivity, enabling access anytime and anywhere.
          Social media platforms transformed communication and information dissemination, while advancements in cloud
          computing and the Internet of Things (IoT) interconnected devices on an unprecedented scale.
          <br />
          <br />
          As of 2024, the internet continues to evolve with innovations in artificial intelligence, 5G technology, and
          efforts to expand global access, shaping the future of digital interaction and information exchange.
        </p>
      </div>
    </section>
  )
}

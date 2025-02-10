'use client'
import { useGSAP } from '@gsap/react'
import { Environment, Sphere } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, type ReactNode, useMemo, useRef } from 'react'
import { twJoin } from 'tailwind-merge'
import { Group, MeshPhysicalMaterial, type Object3DEventMap } from 'three'

import Camera from '@/components/three/Camera'

// Install dependencies: npm install @gsap/react @react-three/drei @react-three/fiber gsap

gsap.registerPlugin(ScrollTrigger, useGSAP)

// --- 2D Setup ---
// 1. Create content for each section
// 2. Map sections to HTML elements
// 3. Animate the content on scroll
// 4. Add scroll progress bar

// --- 3D Setup ---
// 1. Canvas, lighting, environment
// 2. Pointer camera
// 3. Scrolling group
// 4. Animating scrolling group element(s)
// 5. Fixed group

export default function ScrollingScenePage() {
  return (
    <main className="w-full bg-black font-sans text-white">
      {/* ThreeJS content */}
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <ambientLight intensity={0.5} color="#fff" />
        {/* Image downloaded from: https://polyhaven.com/hdris */}
        <Environment files="/images/environment/panos.jpg" background={true} resolution={512} ground={false} />
        <ScrollingGroup />
        <FixedGroup />
        <Camera />
      </Canvas>

      {/* Scrolling HTML content */}
      <div className="relative z-50 w-full">
        {SECTIONS.map((content, i) => (
          <Section key={i} {...content} index={i} />
        ))}
      </div>

      <ProgressBar />
    </main>
  )
}

type SectionProps = SectionContent & {
  index: number
}

const Section: FC<SectionProps> = ({ heading, body, href, index }) => {
  const section = useRef<HTMLDivElement>(null)
  const isOnLeft = index % 2 === 1

  useGSAP(
    () => {
      gsap.fromTo(
        'h2, p',
        { opacity: 0, y: 48 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: '.text', start: 'top 90%', end: 'center center', scrub: true },
        },
      )
    },
    { dependencies: [], scope: section },
  )

  return (
    <section ref={section} id={`section-${index}`} className="grid h-screen w-full grid-cols-6 items-center">
      <div className={twJoin('text col-span-2 h-fit space-y-4', isOnLeft ? 'col-start-2 text-right' : 'col-start-4')}>
        <h2 className="text-2xl font-bold leading-normal tracking-tight text-white sm:text-3xl lg:text-6xl">
          {heading}
        </h2>
        <p className="text-base text-white/70 lg:text-lg">
          {body}
          {!!href && (
            <>
              <br />
              <br />
              <a
                target="_blank"
                href={href}
                rel="noreferrer"
                className="text-inherit w-fit rounded bg-black/40 px-3 py-1">
                Learn more
              </a>
            </>
          )}
        </p>
      </div>
    </section>
  )
}

const ProgressBar: FC = () => {
  useGSAP(() => {
    gsap.to('#progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true,
      },
    })
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[100] h-1 overflow-hidden bg-black">
      <div
        id="progress-bar"
        style={{ transform: 'scaleX(0)' }}
        className="absolute left-0 h-full w-full origin-left bg-white"
      />
    </div>
  )
}

const ScrollingGroup: FC = () => {
  const { height, width } = useThree((s) => s.viewport)
  const group = useRef<Group<Object3DEventMap>>(null)

  const pageHeight = height // Could be adjusted if each section is not full height
  // This needs to match the CSS grid (6 columns)
  const columnWidth = width / 6

  useGSAP(
    () => {
      if (!group.current) return
      gsap.fromTo(
        group.current.position,
        { y: 0 },
        {
          y: pageHeight * (SECTIONS.length - 1),
          ease: 'none',
          scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: 0.6,
            fastScrollEnd: true,
          },
        },
      )
    },
    { dependencies: [pageHeight] },
  )

  return (
    // The group is translated up/down to match the scroll position
    <group ref={group}>
      {Array.from({ length: SECTIONS.length }, (_, i) => (
        <ScenePage
          key={i}
          position={[0, i * -pageHeight, 0]}
          radius={Math.max(columnWidth / 2, 0.5)}
          columnWidth={columnWidth}
          sectionIndex={i}
        />
      ))}
    </group>
  )
}

type ScenePageProps = {
  position: [number, number, number]
  sectionIndex: number
  radius: number
  columnWidth: number
}

const SPHERE_COLOURS = ['grey', 'silver'] as const

const ScenePage: FC<ScenePageProps> = ({ position, radius = 1, columnWidth, sectionIndex }) => {
  const isOnLeft = sectionIndex % 2 === 0
  const onRightPosition = [columnWidth, 0, 0] as [number, number, number]
  const onLeftPosition = [-columnWidth, 0, 0] as [number, number, number]
  const modelPosition = isOnLeft ? onLeftPosition : onRightPosition
  const color = SPHERE_COLOURS[sectionIndex % SPHERE_COLOURS.length]

  const material = useRef<MeshPhysicalMaterial>(null)

  useGSAP(() => {
    // Fade in and out as the corresponding section enters/exits the viewport
    gsap.fromTo(
      material.current,
      {
        opacity: 0,
      },
      {
        keyframes: [
          { opacity: 1, duration: 0.33 }, // fade in for 1/3 of the scroll distance
          { opacity: 1, duration: 0.33 }, // be fully visible for 1/3 of the scroll distance
          { opacity: 0, duration: 0.33 }, // fade out for 1/3 of the scroll distance
        ],
        ease: 'none',
        scrollTrigger: {
          trigger: `#section-${sectionIndex}`,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: true,
        },
      },
    )
  }, [])

  return (
    <group position={position}>
      <Sphere args={[radius, 40, 40]} position={modelPosition}>
        <meshPhysicalMaterial
          ref={material}
          attach="material"
          color={color}
          roughness={0.12}
          reflectivity={1}
          transparent={true}
          opacity={0}
        />
      </Sphere>
    </group>
  )
}

const FixedGroup: FC = () => {
  // Random radius between 0.1 and 0.25
  const radius: number = useMemo(() => Math.random() * 0.1 + 0.15, [])

  return (
    <group>
      {/* Background spheres */}
      {Array.from({ length: 9 }, (_, i) => (
        <Sphere key={i} args={[radius, 16, 16]} position={[Math.cos(i) * 6.5, Math.sin(i) * 1.5, -4.5]}>
          <meshPhysicalMaterial
            attach="material"
            color={SPHERE_COLOURS[i % SPHERE_COLOURS.length]}
            roughness={0.2}
            reflectivity={1}
            opacity={1}
          />
        </Sphere>
      ))}
    </group>
  )
}

type SectionContent = {
  heading: ReactNode
  body: ReactNode
  href?: string
}

const SECTIONS: SectionContent[] = [
  {
    heading: (
      <>
        <span className="font-black">React Three</span> Scrolling Site
      </>
    ),
    body: 'Scroll down and watch the 3D content track the 2D HTML... Whilst discovering some of my book recommendations!',
  },
  {
    heading: 'Creativity, Inc',
    body: "Creativity, Inc. by Ed Catmull, co-founder of Pixar Animation Studios, offers an inside look at the creative processes and management principles that have driven Pixar's success. The book delves into building a culture that fosters originality and overcomes obstacles to true inspiration.",
    href: 'https://www.amazon.co.uk/Creativity-Inc-Overcoming-Unseen-Inspiration/dp/0812993012',
  },
  {
    heading: 'Blue Ocean Strategy',
    body: 'Presents a systematic approach to making the competition irrelevant by creating "blue oceans"—untapped new market spaces ripe for growth. Based on a study of 150 strategic moves across more than 100 years and 30 industries, the authors argue that lasting success comes from creating new markets rather than competing in existing ones.',
    href: 'https://www.amazon.co.uk/Blue-Ocean-Strategy-Expanded-Uncontested/dp/1625274491',
  },
  {
    heading: 'The Ride of a Lifetime',
    body: 'Robert Iger shares the lessons he learned during his 15 years as CEO of The Walt Disney Company. The book offers insights into leadership, innovation, and the importance of embracing change in a rapidly evolving industry.',
    href: 'https://www.amazon.co.uk/Ride-Lifetime-Lessons-Learned-Company/dp/0399592091',
  },
  {
    heading: 'Poor Charlie’s Almanack',
    body: "A collection of speeches and talks by Charlie Munger, the vice chairman of Berkshire Hathaway. The book provides wisdom on investing, decision-making, and life, reflecting Munger's multidisciplinary approach to thinking.",
    href: 'https://www.amazon.co.uk/Poor-Charlies-Almanack-Charles-Munger/dp/1578645018',
  },
  {
    heading: 'Start With Why',
    body: 'Explores how leaders can inspire others by identifying and communicating their core purpose. The book emphasizes the importance of understanding the "why" behind actions to foster loyalty and drive success.',
    href: 'https://www.amazon.co.uk/Start-Why-Leaders-Inspire-Everyone/dp/0241958229',
  },
  {
    heading: 'Shoe Dog',
    body: "The memoir of Phil Knight, co-founder of Nike. The book chronicles the company's early days, the challenges faced, and the innovative spirit that propelled Nike to become a global powerhouse in athletic footwear and apparel.",
    href: 'https://www.amazon.co.uk/Shoe-Dog-Memoir-Creator-NIKE/dp/1471146723',
  },
  {
    heading: 'Rework',
    body: 'Challenges traditional business practices and offers unconventional advice for entrepreneurs. The book advocates for simplicity, efficiency, and a focus on doing meaningful work.',
    href: 'https://www.amazon.co.uk/ReWork-Change-Way-Work-Forever/dp/0091929784',
  },
  {
    heading: 'No Rules Rules',
    body: 'Reed Hastings, co-founder of Netflix, and Erin Meyer explore the unique culture of Netflix, characterized by freedom and responsibility. The book discusses how this approach has fostered innovation and adaptability within the company.',
    href: 'https://www.amazon.co.uk/No-Rules-Netflix-Culture-Reinvention/dp/0753553635',
  },
] as const

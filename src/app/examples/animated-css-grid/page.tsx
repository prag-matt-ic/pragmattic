'use client'
import React from 'react'

import gsapIcon from '@/assets/icons/technologies/gsap.svg'
import nextIcon from '@/assets/icons/technologies/next.svg'
import reactIcon from '@/assets/icons/technologies/react.svg'
import tailwindIcon from '@/assets/icons/technologies/tailwind.svg'
import typescriptIcon from '@/assets/icons/technologies/typescript.svg'
import webGLIcon from '@/assets/icons/technologies/webgl.svg'
import AnimatedCSSGrid, { type GridCardProps } from '@/components/examples/animatedCSSGrid/AnimatedCSSGrid'
import ScrollDownArrow from '@/components/examples/ScrollDown'

const CARDS: GridCardProps[] = [
  {
    image: nextIcon,
    heading: 'Next.js',
    description:
      'A powerful React framework that supports hybrid static & server rendering, route pre-fetching, and more.',
  },
  {
    image: reactIcon,
    heading: 'React',
    description: 'A declarative, component-based JavaScript library for building modern user interfaces with ease.',
  },
  {
    image: tailwindIcon,
    heading: 'Tailwind CSS',
    description:
      'A utility-first CSS framework packed with classes that enable rapid and responsive design development.',
  },
  {
    image: gsapIcon,
    heading: 'GSAP',
    description:
      'A robust JavaScript library for high-performance animations that work seamlessly in every major browser.',
  },
  {
    image: typescriptIcon,
    heading: 'TypeScript',
    description: (
      // We can inline JSX in the description like this because it's of type ReactNode
      <>
        A <b>strongly typed</b> superset of JavaScript that enhances code quality and maintainability for large
        projects.
      </>
    ),
  },
  {
    image: webGLIcon,
    heading: 'WebGL',
    description:
      'A JavaScript API for rendering interactive 2D and 3D graphics directly in the browser, without plugins.',
  },
] as const

const fourCards = CARDS.slice(0, 4)
const threeCards = CARDS.slice(0, 3)

export default function AnimatedGridPage() {
  return (
    <main className="w-full space-y-16 pb-40 font-sans">
      <section className="h-lvh">
        <ScrollDownArrow />
      </section>
      <AnimatedCSSGrid cards={CARDS} className="horizontal-padding" />
      <AnimatedCSSGrid cards={fourCards} className="horizontal-padding" />
      <AnimatedCSSGrid cards={threeCards} className="horizontal-padding" />
      <AnimatedCSSGrid cards={[...CARDS, ...CARDS]} className="horizontal-padding" />
    </main>
  )
}

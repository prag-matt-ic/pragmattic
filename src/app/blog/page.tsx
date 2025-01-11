import { type Metadata } from 'next'
import Link from 'next/link'
import React, { FC, PropsWithChildren, ReactNode } from 'react'

import BlogBackgroundCanvas from '@/components/blog/blogBackground/BlogBackground'
import { GridLinesFragmentShaderPlaneCanvas } from '@/components/examples/wavePlane/blog/WavePlaneBlog'
import { BlogPathname } from '@/resources/navigation'
import { Canvas } from '@react-three/fiber'
import ScrollingBackgroundGradient, {
  ScrollBackgroundGradientCanvas,
} from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient'

type Props = {
  params: {
    slug: string
  }
}

export const metadata: Metadata = {
  title: 'Blog by Matthew Frawley',
  description: '',
}

export default function BlogPage({ params }: Props) {
  return (
    <>
      <BlogBackgroundCanvas />
      <main className="relative min-h-lvh w-full text-white">
        <header className="flex flex-col space-y-3 py-32 horizontal-padding">
          <h1 className="max-w-5xl text-3xl font-bold leading-relaxed text-white">
            A growing collection of examples, frontend patterns, and stuff I&apos;ve been learning about web design and
            engineering
          </h1>
        </header>

        <section className="w-full space-y-12 pb-24 horizontal-padding">
          <LinkCard
            href={BlogPathname.WavePlane}
            heading="Animated wave plane in Next.js Typescript app with React Three Fiber and custom shader material"
            description="This project is a great way to learn about ThreeJS shader materials and how to use them in Next.js with Typescript">
            <GridLinesFragmentShaderPlaneCanvas sectionClassName="overflow-hidden size-full" />
          </LinkCard>
          <LinkCard
            href={BlogPathname.NextJsShaderSetup}
            heading="Next.js GLSL shader setup guide"
            description="Setup guide for working with GLSL shaders in Next.js, React Three Fiber and TypeScript.">
            <ScrollBackgroundGradientCanvas />
          </LinkCard>
        </section>

        {/* TODO: add links to examples */}
      </main>
    </>
  )
}

type LinkCardProps = {
  href: BlogPathname
  heading: ReactNode
  description: ReactNode
}

const LinkCard: FC<PropsWithChildren<LinkCardProps>> = ({ children, href, heading, description }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border-black bg-black/20 p-4 hover:bg-black/40 lg:gap-12">
      <div className="relative aspect-square size-96 overflow-hidden rounded">{children}</div>
      <div className="max-w-2xl space-y-3">
        <h3 className="text-xl font-bold">{heading}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </Link>
  )
}

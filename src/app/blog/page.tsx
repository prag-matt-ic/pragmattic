import { type Metadata } from 'next'
import Link from 'next/link'
import React, { type FC, type PropsWithChildren, ReactNode } from 'react'

import BlogBackgroundCanvas from '@/components/blog/blogBackground/BlogBackground'
import { ScrollBackgroundGradientCanvas } from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient'
import { GridLinesFragmentShaderPlaneCanvas } from '@/components/examples/wavePlane/blog/WavePlaneBlog'
import { BlogPathname } from '@/resources/navigation'

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
          <h1 className="max-w-4xl text-balance text-xl font-bold text-white sm:text-3xl sm:leading-relaxed">
            A growing collection of guides, patterns, and fun stuff I&apos;ve been doing in the web design and
            engineering space
          </h1>
          <p className="text-light">Mostly React, Next, Typescript, GSAP, ThreeJS and GLSL Shaders</p>
        </header>

        <section className="w-full space-y-12 pb-24 horizontal-padding">
          <ArticleCard
            href={BlogPathname.WavePlane}
            heading="Animated wave plane in Next.js Typescript app with React Three Fiber and custom shader material"
            description="This project is a great way to learn about ThreeJS shader materials and how to use them in Next.js with Typescript">
            <GridLinesFragmentShaderPlaneCanvas sectionClassName="overflow-hidden size-full" />
          </ArticleCard>
          <ArticleCard
            href={BlogPathname.NextJsShaderSetup}
            heading="Next.js GLSL shader setup guide"
            description="Setup guide for working with GLSL shaders in Next.js, React Three Fiber and TypeScript.">
            <ScrollBackgroundGradientCanvas />
          </ArticleCard>
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

const ArticleCard: FC<PropsWithChildren<LinkCardProps>> = ({ children, href, heading, description }) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-4 rounded-lg border-black bg-black/20 p-2 hover:bg-black/40 sm:flex-row sm:p-4 lg:gap-12">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded sm:size-96 sm:w-auto">
        {children}
      </div>
      <div className="max-w-xl space-y-3 p-3 sm:p-0">
        {/* TODO: add relative formatted date */}
        <h3 className="text-lg font-bold sm:text-xl xl:text-2xl">{heading}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </Link>
  )
}

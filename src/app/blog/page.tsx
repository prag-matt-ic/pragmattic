import { format } from 'date-fns'
import { type Metadata } from 'next'
import Link from 'next/link'
import React, { type FC, type PropsWithChildren, type ReactNode } from 'react'

import BlogBackgroundCanvas from '@/components/blog/blogBackground/BlogBackground'
import { ScrollBackgroundGradientCanvas } from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient'
import { GridLinesFragmentShaderPlaneCanvas } from '@/components/examples/three/wavePlane/blog/WavePlaneBlog'
import { BLOG_METADATA } from '@/resources/blog/content/blog'
import { BlogSlug, Pathname } from '@/resources/navigation'

export const metadata: Metadata = {
  title: 'Blog by Matthew Frawley',
  description:
    'A growing collection of guides, patterns, and fun stuff I&apos;ve been doing in the web design and engineering space',
}

const Video: FC<{ src: string }> = ({ src }) => {
  return (
    <video autoPlay loop muted playsInline className="-mt-9 h-[calc(100%+36px)] w-full overflow-hidden object-cover">
      <source src={src} type="video/mp4" />
    </video>
  )
}

const BLOG_CARD_COMPONENTS: Record<BlogSlug, ReactNode> = {
  [BlogSlug.WavePlane]: <GridLinesFragmentShaderPlaneCanvas sectionClassName="overflow-hidden size-full" />,
  [BlogSlug.NextJsShaderSetup]: <ScrollBackgroundGradientCanvas />,
  [BlogSlug.ImageSequenceHeader]: <Video src="/blog/videos/scroll-driven-image-sequence.mp4" />,
  [BlogSlug.AnimatedCSSGrid]: null,
}

export default function BlogPage() {
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
          {Object.values(BLOG_METADATA).map((metadata) => {
            const { slug, title, description, date, isDraft } = metadata
            if (!!isDraft) return null
            return (
              <BlogPostCard
                key={slug}
                href={`${Pathname.Blog}/${slug}`}
                heading={title}
                description={description}
                date={date}>
                {BLOG_CARD_COMPONENTS[slug as BlogSlug]}
              </BlogPostCard>
            )
          })}
        </section>

        {/* TODO: add links to examples */}
      </main>
    </>
  )
}

type CardProps = {
  href: string
  heading: ReactNode
  description: ReactNode
  date: string
}

const BlogPostCard: FC<PropsWithChildren<CardProps>> = ({ children, href, heading, description, date }) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-4 rounded-lg border-black bg-black/20 p-2 hover:bg-black/40 sm:flex-row sm:p-4 lg:gap-12">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded sm:size-96 sm:w-auto">
        {children}
      </div>
      <div className="max-w-xl space-y-3 p-3 sm:p-0">
        <span className="block text-xs text-light">{format(new Date(date), 'MMM yyyy')}</span>
        <h3 className="text-lg font-bold sm:text-xl xl:text-2xl">{heading}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </Link>
  )
}

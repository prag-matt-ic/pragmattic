import { type FC } from 'react'

import { TagName } from '@/resources/blog/content/tag'
import { BlogSlug } from '@/resources/navigation'

import AnimatedCSSGrid from './drafts/animated-css-grid.mdx'
import ImageSequence from './posts/image-sequence.mdx'
import NextJsShaderSetup from './posts/next-shaders.mdx'
import WavePlane from './posts/wave-plane.mdx'

export type BlogMetadata = {
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
  demoPathname?: string
}

export const BLOG_CONTENT: Record<BlogSlug, FC> = {
  [BlogSlug.WavePlane]: WavePlane,
  [BlogSlug.NextJsShaderSetup]: NextJsShaderSetup,
  [BlogSlug.ImageSequenceHeader]: ImageSequence,
  [BlogSlug.AnimatedCSSGrid]: AnimatedCSSGrid,
}

export const BLOG_METADATA: Record<BlogSlug, BlogMetadata> = {
  [BlogSlug.WavePlane]: {
    title: 'Build an animated wave plane in Next.js (Typescript) with React Three Fiber and custom shader material',
    description:
      'This simple project is a great way to learn about ThreeJS shaders and how to use them in a React Typescript environment.',
    date: '2025-01-12',
    slug: BlogSlug.WavePlane,
    demoPathname: '/examples/wave-plane',
    tags: [
      TagName.Tutorial,
      TagName.NextJS,
      TagName.ThreeJS,
      TagName.Typescript,
      TagName.VertexShader,
      TagName.FragmentShader,
      'noise',
    ],
  },
  [BlogSlug.NextJsShaderSetup]: {
    title: 'Configure your Next.js Typescript project for custom shader materials and glsify in React Three Fiber',
    description:
      'Step-by-step guidance on packages, config and code. Get custom React Three Fiber shader materials with glslify working in your Next.js Typescript project.',
    date: '2025-01-12',
    demoPathname: '/examples/scrolling-background-shader',
    slug: BlogSlug.NextJsShaderSetup,
    tags: [TagName.Tutorial, TagName.NextJS, TagName.ThreeJS, TagName.Typescript, 'glslify', 'custom shader material'],
  },
  [BlogSlug.ImageSequenceHeader]: {
    title: 'Scroll-driven image sequence header in React with GSAP',
    description: 'A guide to creating a scroll-driven image sequence header in React/Next.js with GSAP',
    date: '2025-01-16',
    demoPathname: '/examples/scroll-driven-image-sequence',
    slug: BlogSlug.ImageSequenceHeader,
    tags: [TagName.Tutorial, TagName.NextJS, TagName.Typescript, 'canvas', TagName.GSAP],
  },
  [BlogSlug.AnimatedCSSGrid]: {
    title: 'Animating Your Next.js Grid: A Step-by-Step GSAP & Tailwind Tutorial',
    description: 'A guide to ...',
    date: '2025-02-04',
    // demoPathname: '/examples/animated-css-grid',
    slug: BlogSlug.AnimatedCSSGrid,
    tags: [TagName.Tutorial, TagName.React, TagName.GSAP, TagName.Tailwind],
  },
  // [BlogSlug.AppDevelopmentGuide]: {
  //   title: 'Marathon 1.0.0 - A complete app development guide for business and startup leaders',
  //   description: 'This comprehensive guide is geared towards those wishing to launch successful apps.',
  //   date: '2025-01-12',
  //   slug: BlogSlug.AppDevelopmentGuide,
  //   tags: [TagName.Startups, TagName.ProductDevelopment],
  // },
}

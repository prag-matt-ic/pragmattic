import { type FC } from 'react'

import { TagName } from '@/resources/blog/content/tag'
import { BlogSlug } from '@/resources/navigation'

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
  // [BlogSlug.AppDevelopmentGuide]: {
  //   title: 'Marathon 1.0.0 - A complete app development guide for business and startup leaders',
  //   description: 'This comprehensive guide is geared towards those wishing to launch successful apps.',
  //   date: '2025-01-12',
  //   slug: BlogSlug.AppDevelopmentGuide,
  //   tags: [TagName.Startups, TagName.ProductDevelopment],
  // },
  //   [BlogSlug.ImageSequenceHeader]: {
  //     title: 'Scroll-driven image sequence header in React with GSAP',
  //     description: 'A guide to creating a scroll-driven image sequence header in React with GSAP',
  //     date: '2025-01-13',
  //     slug: BlogSlug.ImageSequenceHeader,
  //   },
}

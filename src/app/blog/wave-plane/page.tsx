import { type Metadata } from 'next'
import React from 'react'

import BlogLayout, { type BlogMetadata } from '@/components/blog/BlogLayout'
import Article from '@/components/examples/wavePlane/blog/wavePlane.mdx'

type Props = {
  params: {
    slug: string
  }
}

const LAST_UPDATED = '2025-01-05'

const BLOG_METADATA: BlogMetadata = {
  title: 'Build an animated wave plane in a Next.js Typescript app with React Three Fiber and custom shader material',
  description:
    'This simple project is a great way to learn about ThreeJS shaders and how to use them in a React Typescript environment.',
  date: LAST_UPDATED,
  url: 'https://pragmattic.vercel.app/examples/wave-plane',
}

export const metadata: Metadata = {
  title: BLOG_METADATA.title,
  description: BLOG_METADATA.description,
}

export default function WavePlaneBlogPage({ params }: Props) {
  return (
    <BlogLayout
      title="Build an animated wave plane in Next.js (Typescript) with React Three Fiber and custom shader material"
      date={LAST_UPDATED}
      tags={['threejs', 'vertex shader', 'fragment shader', 'noise', 'react', 'nextjs']}
      demoUrl="/examples/wave-plane"
      metadata={BLOG_METADATA}>
      <Article />
    </BlogLayout>
  )
}

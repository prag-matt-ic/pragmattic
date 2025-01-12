import { type Metadata } from 'next'
import React from 'react'

import BlogLayout, { type BlogMetadata } from '@/components/blog/BlogLayout'
import { TagName } from '@/resources/blog/blog'
import { BlogPathname } from '@/resources/navigation'

import Content from './wave-plane.mdx'

type Props = {
  params: {
    slug: string
  }
}

const LAST_UPDATED = '2025-01-12'

const BLOG_METADATA: BlogMetadata = {
  title: 'Build an animated wave plane in a Next.js Typescript app with React Three Fiber and custom shader material',
  description:
    'This simple project is a great way to learn about ThreeJS shaders and how to use them in a React Typescript environment.',
  date: LAST_UPDATED,
  url: `${process.env.NEXT_PUBLIC_BASE_URL}${BlogPathname.WavePlane}`,
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
      tags={[
        TagName.Tutorial,
        TagName.NextJS,
        TagName.ThreeJS,
        TagName.Typescript,
        TagName.VertexShader,
        TagName.FragmentShader,
        'noise',
      ]}
      demoUrl="/examples/wave-plane"
      metadata={BLOG_METADATA}>
      <Content />
    </BlogLayout>
  )
}

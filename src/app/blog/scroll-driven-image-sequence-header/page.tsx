import { type Metadata } from 'next'
import React from 'react'

import BlogLayout, { type BlogMetadata } from '@/components/blog/BlogLayout'
import { TagName } from '@/resources/blog/blog'
import { BlogPathname, ExamplePathname } from '@/resources/navigation'

import Content from './image-sequence.mdx'

type Props = {
  params: {
    slug: string
  }
}

const LAST_UPDATED = '2025-01-13'

const BLOG_METADATA: BlogMetadata = {
  title: '',
  description: '',
  date: LAST_UPDATED,
  url: `${process.env.NEXT_PUBLIC_BASE_URL}${BlogPathname.NextJsShaderSetup}`,
}

export const metadata: Metadata = {
  title: BLOG_METADATA.title,
  description: BLOG_METADATA.description,
}

export default function ImageSequenceBlogPage({ params }: Props) {
  return (
    <BlogLayout
      title="Scroll-driven image sequence header in React with GSAP"
      date={LAST_UPDATED}
      tags={[TagName.Tutorial, TagName.React, TagName.GSAP, 'canvas', TagName.Typescript]}
      demoUrl={ExamplePathname.ImageSequence}
      metadata={BLOG_METADATA}>
      <Content />
    </BlogLayout>
  )
}

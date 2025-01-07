import { type Metadata } from 'next'
import React from 'react'

import BlogLayout, { type BlogMetadata } from '@/components/blog/BlogLayout'
import { BlogPathname } from '@/resources/navigation'

import Content from './blog.mdx'

type Props = {
  params: {
    slug: string
  }
}

const LAST_UPDATED = '2025-01-07'

const BLOG_METADATA: BlogMetadata = {
  title: 'Configure your Next.js Typescript project for custom shader materials and glsify in React Three Fiber',
  description:
    'Step-by-step guidance on packages, config and code. Get custom React Three Fiber shader materials with glslify working in your Next.js Typescript project.',
  date: LAST_UPDATED,
  url: `${process.env.NEXT_PUBLIC_BASE_URL}${BlogPathname.NextJsShaderSetup}`,
}

console.log(`HELLOOOOO ${process.env.NEXT_PUBLIC_BASE_URL}${BlogPathname.NextJsShaderSetup}`)

export const metadata: Metadata = {
  title: BLOG_METADATA.title,
  description: BLOG_METADATA.description,
}

export default function ShaderSetupBlogPage({ params }: Props) {
  return (
    <BlogLayout
      title="Configure your Next.js Typescript project for custom shader materials and glsify in React Three Fiber"
      date={LAST_UPDATED}
      tags={['threejs', 'nextjs', 'shaders', 'typescript']}
      metadata={BLOG_METADATA}>
      <Content />
    </BlogLayout>
  )
}

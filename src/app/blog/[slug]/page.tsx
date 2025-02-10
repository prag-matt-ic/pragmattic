import { type Metadata, type ResolvingMetadata } from 'next'
import React from 'react'

import BlogLayout from '@/components/blog/BlogLayout'
import { BLOG_CONTENT, BLOG_METADATA } from '@/resources/blog/blog'
import { BlogSlug } from '@/resources/pathname'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateStaticParams(): string[] {
  return Object.values(BlogSlug)
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const metadata = BLOG_METADATA[params.slug as BlogSlug]
  return {
    title: metadata.title,
    description: metadata.description,
  }
}

export default function BlogPage({ params }: Props) {
  const metadata = BLOG_METADATA[params.slug as BlogSlug]
  const Content = BLOG_CONTENT[params.slug as BlogSlug]
  return (
    <BlogLayout {...metadata}>
      <Content />
    </BlogLayout>
  )
}

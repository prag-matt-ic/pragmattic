import { type Metadata } from 'next'
import React from 'react'

import BlogLayout, { type BlogMetadata } from '@/components/blog/BlogLayout'
import { TagName } from '@/resources/blog/blog'
import { BlogPathname } from '@/resources/navigation'

import Content from './app-development-guide.mdx'

type Props = {
  params: {
    slug: string
  }
}

const LAST_UPDATED = '2025-01-12'

const BLOG_METADATA: BlogMetadata = {
  title: 'Marathon 1.0.0 - A complete app development guide for business and startup leaders',
  description: 'This comprehensive guide is geared towards those wishing to launch successful apps.',
  date: LAST_UPDATED,
  url: `${process.env.NEXT_PUBLIC_BASE_URL}${BlogPathname.AppDevelopmentGuide}`,
}

export const metadata: Metadata = {
  title: BLOG_METADATA.title,
  description: BLOG_METADATA.description,
}

export default function AppGuidePage({ params }: Props) {
  return (
    <BlogLayout
      title="Marathon 1.0.0 - A complete app development guide for business and startup leaders"
      date={LAST_UPDATED}
      tags={[TagName.Startups, TagName.ProductDevelopment]}
      metadata={BLOG_METADATA}>
      <Content />
    </BlogLayout>
  )
}

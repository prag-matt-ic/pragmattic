import type { MetadataRoute } from 'next'

import { BlogSlug, ExamplePathname } from '@/resources/navigation'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://pragmattic.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = Object.values(BlogSlug)

  const lastModified = new Date().toISOString().split('T')[0]

  const blogs: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: lastModified,
    priority: 1,
  }))

  const examples: MetadataRoute.Sitemap = Object.values(ExamplePathname).map((pathname) => ({
    url: `${baseUrl}${pathname}`,
    lastModified: lastModified,
    priority: 0.5,
  }))

  const site: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...blogs,
    ...examples,
  ]

  return site
}

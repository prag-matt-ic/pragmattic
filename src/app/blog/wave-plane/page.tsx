import { type Metadata } from 'next'
import React, { type FC, type PropsWithChildren } from 'react'

import BlogHeader from '@/components/blog/blogHeader/BlogHeader'
import Article from '@/components/examples/wavePlane/blog/wavePlane.mdx'

type Props = {
  params: {
    slug: string
  }
}

type BlogMetadata = {
  title: string
  description: string
  date: string
  url: string
}

const LAST_UPDATED = '2025-01-05'

const BLOG_METADATA: BlogMetadata = {
  title: 'Build an animated wave plane using React Three Fiber and custom shaders in a Next.js Typescript app',
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
      title="Animated wave plane with custom shaders"
      date={LAST_UPDATED}
      tags={['threejs', 'vertex shader', 'fragment shader', 'noise', 'react', 'nextjs']}
      demoUrl="/examples/wave-plane"
      metadata={BLOG_METADATA}>
      <Article />
    </BlogLayout>
  )
}

type BlogProps = {
  title: string
  date: string
  tags: string[]
  demoUrl: string
  metadata: BlogMetadata
}

const BlogLayout: FC<PropsWithChildren<BlogProps>> = ({ children, metadata, ...articleProps }) => {
  return (
    <>
      <JSONSchema {...metadata} />
      <main className="flex w-full flex-col items-center bg-off-black font-sans">
        <BlogHeader {...articleProps} />

        {/* // https://github.com/tailwindlabs/tailwindcss-typography */}
        <article className="prose w-full max-w-[1024px] text-pretty bg-white px-12 py-16 text-black">
          {children}

          {/* TODO: CTA * Thank you block */}
          {/* <section>
          <a>View the code on Github</a>
        </section> */}
        </article>
      </main>
    </>
  )
}

const JSONSchema: FC<BlogMetadata> = ({ title, description, date, url }) => {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          datePublished: date,
          dateModified: date,
          description: description,
          // image: post.metadata.image
          //   ? `${baseUrl}${post.metadata.image}`
          //   : `/og?title=${encodeURIComponent(post.metadata.title)}`,
          url: url,
          author: {
            '@type': 'Person',
            name: 'Matthew Frawley (pragmattic)',
          },
        }),
      }}
    />
  )
}

//https://github.com/vercel/examples/blob/main/solutions/blog/app/blog/%5Bslug%5D/page.tsx

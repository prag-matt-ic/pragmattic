import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { type FC, type PropsWithChildren } from 'react'

// TODO: USE MDX instead or markdown
import BlogHeader from '@/components/blog/blogHeader/BlogHeader'
// import Markdown from 'react-markdown'
import Article from '@/components/examples/wavePlane/blog/wavePlane.mdx'
// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// SyntaxHighlighter.registerLanguage('javascript', js)
// import { getBlogBySlug, getSortedPostsData } from '@/utils/blogPosts'

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
  title: 'Build an animated wave plane with React Three Fiber and custom shaders in Next.js',
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
      demoUrl="/examples/wave-plane/demo"
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
  // TODO: create separate metadata type
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
        </article>

        {/* <section>
          <a>View the code on Github</a>
        </section> */}
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

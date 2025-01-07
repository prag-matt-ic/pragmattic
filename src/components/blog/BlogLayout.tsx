import React, { type FC, type PropsWithChildren } from 'react'

import BlogHeader from '@/components/blog/BlogHeader'

import BlogBackground from './blogBackground/BlogBackground'

export type BlogMetadata = {
  title: string
  description: string
  date: string
  url: string
}

type BlogProps = {
  title: string
  date: string
  tags: string[]
  demoUrl?: string
  metadata: BlogMetadata
}

const BlogLayout: FC<PropsWithChildren<BlogProps>> = ({ children, metadata, ...articleProps }) => {
  return (
    <>
      <JSONSchema {...metadata} />
      <BlogBackground />
      <main className="relative w-full font-sans">
        <BlogHeader {...articleProps} />

        {/* // https://github.com/tailwindlabs/tailwindcss-typography */}
        <article className="prose-sm mx-auto w-full !max-w-[1024px] overflow-hidden text-pretty bg-white px-4 py-12 text-black md:prose prose-pre:bg-off-black md:px-12">
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

export default BlogLayout

//https://github.com/vercel/examples/blob/main/solutions/blog/app/blog/%5Bslug%5D/page.tsx

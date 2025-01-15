import React, { type FC, type PropsWithChildren } from 'react'

import BlogPostHeader from '@/components/blog/ArticleHeader'
import BlogNavTitle from '@/components/blog/BlogNavTitle'
import { type BlogMetadata } from '@/resources/blog/content/blog'

type Props = PropsWithChildren<BlogMetadata>

const BlogLayout: FC<PropsWithChildren<Props>> = ({ children, ...metadata }) => {
  return (
    <>
      <JSONSchema {...metadata} />
      <BlogNavTitle title={metadata.title} />
      <main className="relative w-full font-sans">
        <BlogPostHeader {...metadata} />

        {/* // https://github.com/tailwindlabs/tailwindcss-typography */}
        <article className="prose-sm mx-auto w-full !max-w-5xl overflow-hidden text-pretty bg-white px-4 py-12 text-black md:prose prose-pre:bg-off-black md:px-12">
          {children}
        </article>

        {/* TODO: CTA * Thank you block */}
        {/* <section>
          <a>View the code on Github</a>
        </section> */}
      </main>
    </>
  )
}

const JSONSchema: FC<BlogMetadata> = ({ title, description, date, slug }) => {
  const url = `https://pragmattic.vercel.app/blog/${slug}`
  console.warn('JSONSchema', { url, slug })
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
          image: 'https://pragmattic.vercel.app/opengraph-image.jpg',
          // TODO: dynamically generated image with the blog title.
          // image: post.metadata.image
          //   ? `${baseUrl}${post.metadata.image}`
          //   : `/og?title=${encodeURIComponent(post.metadata.title)}`,
          url: url,
          author: {
            '@type': 'Person',
            name: 'Matthew Frawley',
          },
        }),
      }}
    />
  )
}

export default BlogLayout

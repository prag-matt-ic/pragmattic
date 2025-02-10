import React, { type FC, type PropsWithChildren } from 'react'

import BlogHeadingsNav from '@/components/blog/BlogHeadingsNav'
import BlogNavSetter from '@/components/blog/BlogNavSetter'
import BlogPostHeader from '@/components/blog/BlogPostHeader'
import { type BlogMetadata } from '@/resources/blog/content/blog'

type Props = PropsWithChildren<BlogMetadata>

const BlogLayout: FC<PropsWithChildren<Props>> = ({ children, ...metadata }) => {
  return (
    <>
      <JSONSchema {...metadata} />
      <BlogNavSetter title={metadata.title} />
      <main className="relative w-full font-sans">
        <BlogPostHeader {...metadata} />

        <div className="grid grid-cols-1 grid-rows-1 xl:grid-cols-[auto_1fr]">
          <article className="prose-sm mx-auto w-full !max-w-5xl overflow-hidden text-pretty bg-white px-4 py-12 text-black md:prose xl:prose-lg prose-pre:bg-off-black md:px-12 xl:px-16 xl:py-16">
            {children}
            <hr />
            <h3>Thanks for reading, Matt ✌️</h3>
          </article>
          <BlogHeadingsNav />
        </div>
      </main>
    </>
  )
}

const JSONSchema: FC<BlogMetadata> = ({ title, description, date, slug }) => {
  const url = `https://pragmattic.vercel.app/blog/${slug}`
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
            givenName: 'Matthew',
            name: 'Matthew Frawley',
            brand: 'Pragmattic',
            email: 'pragmattic.ltd@gmail.com',
          },
        }),
      }}
    />
  )
}

export default BlogLayout

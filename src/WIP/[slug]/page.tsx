import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { type ButtonHTMLAttributes, type FC, type PropsWithChildren } from 'react'
import Markdown from 'react-markdown'

// TODO: USE MDX instead or markdown
import BlogHeader from '@/components/blog/blogHeader/BlogHeader'
// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// SyntaxHighlighter.registerLanguage('javascript', js)
import { getBlogBySlug, getSortedPostsData } from '@/utils/blogPosts'

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({ params: { slug: post.slug } }))
}

export function generateMetadata({ params }: Props, parent: ResolvingMetadata): Metadata {
  const { metadata } = getBlogBySlug(params.slug)
  return {
    title: metadata.title,
    description: metadata.date,
  }
}

// https://github.com/tailwindlabs/tailwindcss-typography

export default function PostPage({ params }: Props) {
  const post = getBlogBySlug(params.slug)
  console.log(post)

  const { content, metadata } = post

  return (
    <main className="flex w-full flex-col items-center bg-off-black font-sans">
      <BlogHeader {...metadata} />
      <article className="prose w-full max-w-[1024px] text-pretty bg-white px-12 py-20 text-black xl:prose-lg">
        <Markdown className="w-full">{content}</Markdown>
      </article>
    </main>
  )
}

// TODO: handle code blocks syntax highlighting and "copy code to clipboard" button
// TODO: handle images

//   code: string
//   language?: string
//   className?: string
// }

//  components={{
//             code(props) {
//               const { children, className, node, ...rest } = props
//               const match = /language-(\w+)/.exec(className || '')
//               return match ? (
//                 <SyntaxHighlighter
//                   language={match[1]}
//                   customStyle={{ background: 'none' }}
//                   codeTagProps={{ className: 'text-lg' }}>
//                   {String(children).replace(/\n$/, '')}
//                 </SyntaxHighlighter>
//               ) : (
//                 <code {...rest} className={className}>
//                   {children}
//                 </code>
//               )
//             },
//           }}

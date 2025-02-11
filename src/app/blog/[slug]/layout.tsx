import './code.css'

import BlogBackgroundCanvas from '@/components/blog/blogBackground/BlogBackground'
import BlogNav from '@/components/nav/BlogNav'
import { BlogSlug } from '@/resources/pathname'

export default async function BlogLayout({
  children,
  params,
}: {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}) {
  const slug = (await params).slug as BlogSlug
  return (
    <>
      <BlogBackgroundCanvas />
      {children}
      <BlogNav slug={slug} />
    </>
  )
}

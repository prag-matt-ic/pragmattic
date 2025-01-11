import './code.css'

import BlogBackgroundCanvas from '@/components/blog/blogBackground/BlogBackground'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogBackgroundCanvas />
      {children}
    </>
  )
}

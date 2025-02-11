'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type FC } from 'react'

import { BLOG_METADATA } from '@/resources/blog/blog'
import { BlogSlug } from '@/resources/pathname'

type Props = {
  slug: BlogSlug
}

const BlogNav: FC<Props> = ({ slug }) => {
  const blogMetadata = BLOG_METADATA[slug]

  useGSAP(
    () => {
      gsap.to('#nav-blog', {
        duration: 0.3,
        opacity: 1,
        ease: 'power1.in',
        scrollTrigger: {
          start: 24,
          toggleActions: 'play none none reverse',
        },
      })
    },
    {
      dependencies: [],
    },
  )

  if (!blogMetadata) return null

  return (
    <div className="pointer-events-none fixed top-0 z-[1001] hidden h-14 w-full items-center justify-center overflow-hidden lg:flex">
      <span
        id="nav-blog"
        className="pointer-events-auto block max-w-[calc(100%-620px)] overflow-hidden text-ellipsis whitespace-nowrap px-3 text-center text-lg font-semibold text-white opacity-0">
        {blogMetadata.title}
      </span>
    </div>
  )
}

export default BlogNav

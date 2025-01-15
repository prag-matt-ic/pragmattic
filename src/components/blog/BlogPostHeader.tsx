import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React, { type FC } from 'react'

import avatarPic from '@/assets/avatar.jpg'
import openNewIcon from '@/assets/icons/open-new.svg'
import Tag from '@/components/blog/Tag'
import Button from '@/components/buttons/Button'
import { BlogMetadata } from '@/resources/blog/content/blog'

const BlogPostHeader: FC<BlogMetadata> = ({ title, tags, demoPathname, date }) => {
  const formattedDate = format(new Date(date), 'PPP')
  return (
    <>
      <header className="relative flex w-full select-none bg-gradient-to-t from-black/60 to-black/0 to-40%">
        <div className="relative z-10 mx-auto flex size-full max-w-6xl flex-col items-center space-y-5 px-4 pb-20 pt-28 sm:px-12 sm:pt-40">
          <div className="hidden flex-wrap justify-center gap-1.5 sm:flex">
            {tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>

          <h1
            className="text-balance text-center text-2xl font-extrabold tracking-tight text-white sm:text-4xl sm:leading-snug md:text-5xl md:leading-snug"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
            {title}
          </h1>

          <div className="relative flex w-fit items-center gap-2 whitespace-nowrap text-sm font-medium text-white/90 sm:gap-3 sm:text-base">
            <Image
              src={avatarPic}
              width={80}
              height={80}
              alt="Matthew Frawley"
              className="size-10 overflow-hidden rounded-full object-cover md:size-14"
            />
            <span>Matthew Frawley</span>
            <span className="text-3xl">•</span>
            <span>{formattedDate}</span>
          </div>

          {!!demoPathname && (
            <Link href={demoPathname} passHref target="_blank" rel="noopener noreferrer">
              <Button variant="outlined" colour="secondary">
                Live demo
                <Image
                  src={openNewIcon}
                  alt="open"
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                />
              </Button>
            </Link>
          )}
        </div>
      </header>
    </>
  )
}

export default BlogPostHeader

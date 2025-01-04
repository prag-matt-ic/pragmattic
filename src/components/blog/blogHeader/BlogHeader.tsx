import { format } from 'date-fns'
import Image from 'next/image'
import React, { type FC, type ReactNode } from 'react'

import avatarPic from '@/assets/avatar.jpg'
import openNewIcon from '@/assets/icons/open-new.svg'

import HeaderCanvas from './HeaderCanvas'
import Button from '@/components/buttons/Button'

type BlogHeaderProps = { title: ReactNode; date: string; tags: string[]; demoUrl?: string }

const BlogHeader: FC<BlogHeaderProps> = ({ title, tags, demoUrl, date }) => {
  const formattedDate = format(new Date(date), 'PPP')
  return (
    <>
      <header className="relative flex w-full select-none bg-off-black">
        <HeaderCanvas />
        <div className="relative z-10 flex size-full flex-col items-center space-y-6 px-12 pb-20 pt-28">
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-mid px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wide text-white/80 shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
          <h1
            className="max-w-[1024px] text-center text-5xl font-extrabold leading-snug tracking-tight text-white"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
            {title}
          </h1>

          <div className="relative flex w-fit items-center gap-3 text-sm font-medium text-white">
            <Image
              src={avatarPic}
              width={80}
              height={80}
              alt="Matthew Frawley"
              className="size-10 overflow-hidden rounded-full object-cover md:size-12"
            />
            <span>Matthew Frawley</span>
            <span>{formattedDate}</span>
          </div>

          {!!demoUrl && (
            <Button variant="outlined" colour="secondary" href={demoUrl}>
              View it live
              <Image src={openNewIcon} alt="open" className="size-4" />
            </Button>
          )}
        </div>
      </header>
    </>
  )
}

export default BlogHeader

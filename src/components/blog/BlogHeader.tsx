import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React, { type FC, type ReactNode } from 'react'

import avatarPic from '@/assets/avatar.jpg'
import openNewIcon from '@/assets/icons/open-new.svg'
import Button from '@/components/buttons/Button'

type Props = { title: ReactNode; date: string; tags: string[]; demoUrl?: string }

// TODO: update sizing for mobile viewing...
const BlogHeader: FC<Props> = ({ title, tags, demoUrl, date }) => {
  const formattedDate = format(new Date(date), 'PPP')
  return (
    <>
      <header className="relative flex w-full select-none">
        <div className="relative z-10 mx-auto flex size-full max-w-[1024px] flex-col items-center space-y-5 bg-gradient-to-t from-light/40 to-light/0 to-30% px-12 pb-20 pt-40">
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-black px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wide text-white/70 shadow-md">
                #{tag}
              </span>
            ))}
          </div>
          <h1
            className="text-balance text-center text-5xl font-extrabold leading-snug tracking-tight text-white"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
            {title}
          </h1>

          <div className="relative flex w-fit items-center gap-3 font-medium text-white/90">
            <Image
              src={avatarPic}
              width={80}
              height={80}
              alt="Matthew Frawley"
              className="size-12 overflow-hidden rounded-full object-cover md:size-14"
            />
            <span>Matthew Frawley</span>
            <span>{formattedDate}</span>
          </div>

          {!!demoUrl && (
            <Link href={demoUrl} passHref target="_blank" rel="noopener noreferrer">
              <Button variant="outlined" colour="secondary">
                Live demo
                <Image src={openNewIcon} alt="open" className="size-4" />
              </Button>
            </Link>
          )}
        </div>
      </header>
    </>
  )
}

export default BlogHeader

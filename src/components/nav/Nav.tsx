'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { type FC } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import openNewIcon from '@/assets/icons/open-new.svg'

const WorkTogether = dynamic(() => import('./workTogether/WorkTogether'))

const Nav: FC = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-[500] flex h-12 items-center justify-between gap-3 pl-6 pr-4 md:h-14 md:gap-4 lg:gap-6">
      <div id="nav-bg" className="absolute inset-0 bg-black opacity-0" />
      <Link href="/" className="relative shrink-0">
        <Image alt="Pragmattic" src={logo} height={20} className="opacity-100 transition-opacity duration-200 sm:h-5" />
      </Link>

      <div className="relative flex shrink-0 items-center gap-2 md:gap-4">
        <a
          href="https://blog.pragmattic.dev"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1.5 font-semibold text-white hover:text-green">
          Dev Blog
          <Image
            src={openNewIcon}
            alt="open"
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
          />
        </a>
        <WorkTogether />
      </div>
    </nav>
  )
}

export default Nav

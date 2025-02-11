'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC } from 'react'
import { twJoin } from 'tailwind-merge'

import logo from '@/assets/brand/pragmattic.svg'
import { ExampleSlug, Pathname } from '@/resources/pathname'

const WorkTogether = dynamic(() => import('./workTogether/WorkTogether'), { ssr: false })

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Nav: FC = () => {
  const pathname = usePathname()
  const isRebuildPage = pathname.includes('/rebuild')

  useGSAP(
    () => {
      if (isRebuildPage) return
      gsap.to('#nav-bg', {
        duration: 0.3,
        opacity: 1,
        ease: 'power1.in',
        scrollTrigger: {
          start: 24,
          toggleActions: 'play none none reverse',
        },
      })
    },
    { dependencies: [isRebuildPage] },
  )

  return (
    <nav className="fixed left-0 right-0 top-0 z-[500] flex h-12 items-center justify-between gap-3 pl-6 pr-4 md:h-14 md:gap-4 lg:gap-6">
      <div id="nav-bg" className="absolute inset-0 bg-black opacity-0" />
      <Link href="/" className="relative shrink-0">
        <Image
          alt="Pragmattic"
          src={logo}
          height={20}
          className={twJoin('transition-opacity duration-200 sm:h-5', isRebuildPage ? 'opacity-0' : 'opacity-100')}
        />
      </Link>

      <div className="relative flex shrink-0 items-center gap-2 md:gap-4">
        <Link
          href={`${Pathname.Example}/${ExampleSlug.EnergyTransfer}`}
          className={twJoin(
            'font-semibold',
            pathname.includes(Pathname.Example) ? 'text-green' : 'text-white hover:text-green',
          )}>
          Examples
        </Link>
        <Link
          href={Pathname.Blog}
          className={twJoin(
            'font-semibold',
            pathname.includes(Pathname.Blog) ? 'text-green' : 'text-white hover:text-green',
          )}>
          Blog
        </Link>
        <WorkTogether />
      </div>
    </nav>
  )
}

export default Nav

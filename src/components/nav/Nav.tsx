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
import useNavStore, { type BlogNavProps } from '@/hooks/useNavStore'
import { ExamplePathname, Pathname } from '@/resources/navigation'

const WorkTogether = dynamic(() => import('../workTogether/WorkTogether'), { ssr: false })
const ExampleNav = dynamic(() => import('./ExampleNav'), { ssr: false })

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Nav: FC = () => {
  const pathname = usePathname()
  const isRebuildPage = pathname.includes('rebuilds/')
  const isExamplePage = pathname.includes('examples/')
  const blogProps = useNavStore((s) => s.blogProps)

  useGSAP(
    () => {
      if (isRebuildPage) return
      const targets = !!blogProps ? ['#nav-bg', '#nav-blog'] : '#nav-bg'
      gsap.to(targets, {
        duration: 0.3,
        opacity: 1,
        ease: 'power1.in',
        scrollTrigger: {
          start: 24,
          toggleActions: 'play none none reverse',
        },
      })
    },
    { dependencies: [isRebuildPage, blogProps] },
  )

  // Fade in the blog or example Navs

  return (
    <nav className="fixed left-0 right-0 top-0 z-[500] flex items-center justify-between gap-3 py-1.5 pl-6 pr-4 md:gap-4 md:py-2.5 lg:gap-6">
      <div id="nav-bg" className="absolute inset-0 bg-black opacity-0" />
      <Link href="/" className="relative">
        <Image
          alt="Pragmattic"
          src={logo}
          height={20}
          className={twJoin('transition-opacity duration-200 sm:h-5', isRebuildPage ? 'opacity-0' : 'opacity-100')}
        />
      </Link>

      <div className="relative hidden h-12 flex-1 justify-center md:flex">
        {!!blogProps && <BlogNav {...blogProps} />}
        {(isExamplePage || isRebuildPage) && <ExampleNav />}
      </div>

      <div className="relative flex items-center gap-2 md:gap-4">
        <Link
          href={ExamplePathname.EnergyTransfer}
          className={twJoin(
            'font-semibold',
            pathname.includes(Pathname.Examples) ? 'text-green' : 'text-white hover:text-green',
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

const BlogNav: FC<BlogNavProps> = ({ title }) => {
  return (
    <span
      id="nav-blog"
      className="block overflow-hidden text-ellipsis whitespace-nowrap text-center text-lg font-semibold text-white opacity-0">
      {title}
    </span>
  )
}

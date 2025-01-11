'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, useState } from 'react'
import { twJoin } from 'tailwind-merge'

import logo from '@/assets/brand/pragmattic.svg'
import menuIcon from '@/assets/icons/menu.svg'
import Menu from '@/components/Menu'
import useNavStore from '@/hooks/useNavStore'
import { Pathname } from '@/resources/navigation'

const WorkTogether = dynamic(() => import('./workTogether/WorkTogether'), { ssr: false })

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Nav: FC = () => {
  const pathname = usePathname()
  const isRebuildPage = pathname.includes('rebuild')
  const [isMenuShowing, setIsMenuShowing] = useState(false)

  const navChildren = useNavStore((s) => s.children)

  useGSAP(
    () => {
      if (isRebuildPage) return
      gsap.to(['#nav-bg', '#nav-children'], {
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
    <>
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

        <div id="nav-children" className="relative hidden flex-1 overflow-hidden opacity-0 sm:block">
          {navChildren}
        </div>

        <div className="relative flex items-center gap-2 md:gap-4">
          <Link
            href={Pathname.Blog}
            className={twJoin(
              'font-semibold',
              pathname.includes(Pathname.Blog) ? 'text-green' : 'text-white hover:text-green',
            )}>
            Blog
          </Link>
          <WorkTogether />
          <button className="p-1" onClick={() => setIsMenuShowing((prev) => !prev)}>
            <Image src={menuIcon} alt="menu" width={24} height={24} />
          </button>
        </div>
      </nav>
      <Menu isShowing={isMenuShowing} onClose={() => setIsMenuShowing(false)} />
    </>
  )
}

export default Nav

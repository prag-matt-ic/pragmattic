'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, useState } from 'react'
import { Transition } from 'react-transition-group'
import { twJoin } from 'tailwind-merge'

import logo from '@/assets/brand/pragmattic.svg'
import menuIcon from '@/assets/icons/menu.svg'
import Button from '@/components/buttons/Button'
import Menu from '@/components/Menu'

import WorkTogether from './workTogether/WorkTogether'

const Nav: FC = () => {
  const pathname = usePathname()
  const isRebuildPage = pathname.includes('rebuild')
  const [isMenuShowing, setIsMenuShowing] = useState(false)
  const [isWorkTogetherShowing, setIsWorkTogetherShowing] = useState(false)

  useGSAP(() => {
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
  }, [isRebuildPage])

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[500] flex items-center justify-between py-1.5 pl-6 pr-4 md:py-2">
        <div id="nav-bg" className="absolute inset-0 bg-black opacity-0" />
        <Link href="/" className="relative">
          <Image
            alt="Pragmattic"
            src={logo}
            height={20}
            className={twJoin('h-11 transition-opacity duration-200', isRebuildPage ? 'opacity-0' : 'opacity-100')}
          />
        </Link>

        <div className="relative flex items-center gap-2">
          <WorkTogether />
          <button className="p-2" onClick={() => setIsMenuShowing((prev) => !prev)}>
            <Image src={menuIcon} alt="menu" width={32} height={32} />
          </button>
        </div>
      </nav>
      <Menu isShowing={isMenuShowing} onClose={() => setIsMenuShowing(false)} />
    </>
  )
}

export default Nav

// href="mailto:pragmattic.ltd@gmail.com&subject=Let's%20work%20together"

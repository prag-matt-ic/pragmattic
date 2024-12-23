'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, useState } from 'react'
import { twJoin } from 'tailwind-merge'

import logo from '@/assets/brand/pragmattic.svg'
import menuIcon from '@/assets/icons/menu.svg'
import Menu from '@/components/Menu'

import Button from './buttons/Button'

const Nav: FC = () => {
  const pathname = usePathname()
  const hideLogo = pathname.includes('rebuild')
  const [isMenuShowing, setIsMenuShowing] = useState(false)

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[500] flex items-center justify-between py-2 pl-6 pr-4">
        <Link href="/">
          <Image
            alt="Pragmattic"
            src={logo}
            height={20}
            className={twJoin('h-11 transition-opacity duration-200', hideLogo ? 'opacity-0' : 'opacity-100')}
          />
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="filled" size="small" href="mailto:pragmattic.ltd@gmail.com&subject=Let's%20work%20together">
            Work together
          </Button>

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

// const WorkTogetherFloatingMenu: FC = () => {
//   return <div></div>
// }

// href="mailto:pragmattic.ltd@gmail.com&subject=Let's%20work%20together"

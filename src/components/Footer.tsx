import Image from 'next/image'
import React, { type FC } from 'react'

import githubIcon from '@/assets/icons/socials/github.svg'
import instagramIcon from '@/assets/icons/socials/instagram.svg'
import linkedInIcon from '@/assets/icons/socials/linkedin.svg'
import youtubeIcon from '@/assets/icons/socials/youtube.svg'

const socialLinkClasses = 'transition-all duration-200 hover:opacity-80 hover:animate-pulse p-2'

const Footer: FC = () => {
  return (
    <footer className="relative z-50 grid w-full grid-cols-1 items-center gap-3 bg-black py-3 text-xs horizontal-padding md:grid-cols-3 md:gap-4">
      <span className="order-3 whitespace-nowrap text-center font-mono text-light md:order-1 md:text-left">
        © {new Date().getFullYear()} Pragmattic Ltd. All Rights Reserved.
      </span>
      <span className="order-2 text-balance text-center font-mono text-light">
        💡 Do what you can, with all that you have
      </span>

      <div className="order-1 flex items-center justify-center md:order-3 md:justify-end">
        <a
          href="https://www.linkedin.com/in/pragmattic/"
          rel="noreferrer"
          target="_blank"
          className={socialLinkClasses}>
          <Image src={linkedInIcon} alt="LinkedIn" width={24} height={24} className="size-6" />
        </a>

        <a href="https://github.com/prag-matt-ic/" rel="noreferrer" target="_blank" className={socialLinkClasses}>
          <Image src={githubIcon} alt="GitHub" width={24} height={24} className="size-6" />
        </a>

        <a
          href="https://www.youtube.com/@pragmattic-dev"
          rel="noreferrer"
          target="_blank"
          className={socialLinkClasses}>
          <Image src={youtubeIcon} alt="YouTube" width={24} height={24} className="size-6" />
        </a>

        <a
          href="https://www.instagram.com/prag.matt.ic/"
          rel="noreferrer"
          target="_blank"
          className={socialLinkClasses}>
          <Image src={instagramIcon} alt="Instagram" width={24} height={24} className="size-6" />
        </a>
      </div>
    </footer>
  )
}

export default Footer

'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import Image from 'next/image'
import React, { type FC, type ReactNode, useRef } from 'react'

import profilePic from '@/assets/brand/about-pic.png'
import githubIcon from '@/assets/icons/socials/github.svg'
import instagramIcon from '@/assets/icons/socials/instagram.svg'
import linkedInIcon from '@/assets/icons/socials/linkedin.svg'
import youtubeIcon from '@/assets/icons/socials/youtube.svg'
import Marquee from '@/components/examples/Marquee'

const HomeFooter: FC = () => {
  const socialLinkClasses = 'transition-all duration-200 hover:opacity-80 hover:animate-pulse p-2'
  const aboutSection = useRef<HTMLDivElement>(null)

  const bio: ReactNode = (
    <>
      I&apos;ve spent the last decade designing and building web and mobile apps.
      <br />
      <br />
      I&apos;m currently leading development efforts at Associo as CTO. We&apos;re transforming how legal analysis is
      prepared using structured data and AI.
      <br />
      <br />I also co-run a development team over at Loopspeed: We help startups and agencies launch exciting digital
      products.
    </>
  )

  useGSAP(
    () => {
      const pSplit = new SplitText('#bio', { type: 'lines,words', wordsClass: 'opacity-0 blur-sm' })

      gsap.to(pSplit.words, {
        keyframes: [
          { opacity: 0.6, filter: 'blur(4px)' },
          { opacity: 1, filter: 'blur(0px)' },
        ],
        duration: 0.5,
        stagger: 0.05,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: aboutSection.current,
          start: 'top 90%',
          end: 'center center',
          scrub: 2,
        },
      })
    },
    {
      dependencies: [],
      scope: aboutSection,
    },
  )

  return (
    <div id="home-footer" className="relative grid w-full grid-cols-1 grid-rows-[1fr_auto_auto] gap-4 pt-16 md:h-lvh">
      {/* About Section */}
      <section className="flex flex-col items-center justify-center gap-4 horizontal-padding md:flex-row md:gap-8">
        <div className="relative flex aspect-square size-fit w-3/4 items-center justify-center md:w-auto">
          <div className="absolute size-4/5 rounded-full bg-light/20 backdrop-blur-sm" />
          <Image src={profilePic} alt="Matthew Frawley" width={400} height={400} className="relative object-contain" />
        </div>
        {/* Bio */}
        <div ref={aboutSection} className="h-fit max-w-lg space-y-4 sm:space-y-6">
          <h3 className="text-xl font-bold md:text-3xl">
            Hi, I&apos;m <span className="text-green">Matt</span>
          </h3>
          <div className="relative mt-2 size-fit">
            <p className="absolute inset-0 text-sm text-white opacity-15 sm:text-lg xl:text-xl">{bio}</p>
            <p id="bio" className="relative z-10 text-sm text-white sm:text-lg xl:text-xl">
              {bio}
            </p>
          </div>
        </div>
      </section>

      <Marquee className="py-4 opacity-40" />

      <footer className="grid w-full grid-cols-1 items-center gap-3 bg-black py-3 text-xs horizontal-padding md:grid-cols-3 md:gap-4">
        <span className="order-3 text-balance text-center font-mono text-light md:order-1 md:text-left">
          © 2024 Pragmattic Ltd. All Rights Reserved.
        </span>
        <span className="order-2 text-balance text-center font-mono text-light">
          💡 Do what you can, with all that you have
        </span>

        <div className="order-1 flex items-center justify-center md:order-3 md:justify-end">
          <a
            href="https://www.linkedin.com/in/matthewjfrawley/"
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
    </div>
  )
}

export default HomeFooter

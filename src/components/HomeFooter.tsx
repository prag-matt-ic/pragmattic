'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import Image from 'next/image'
import React, { type FC, type ReactNode, useRef } from 'react'

import profilePic from '@/assets/brand/about-pic.png'
// import Marquee from '@/components/examples/animatedMarquee/Marquee'

const HomeFooter: FC = () => {
  const aboutSection = useRef<HTMLDivElement>(null)

  const bio: ReactNode = (
    <>
      I&apos;ve spent the last decade designing and building web and mobile apps.
      <br />
      <br />
      I&apos;m currently leading development efforts at{' '}
      <a
        href="https://associo.com"
        target="_blank"
        rel="noreferrer"
        className="text-cyan underline underline-offset-2 hover:text-orange">
        Associo
      </a>{' '}
      as CTO. We&apos;re transforming how legal analysis is prepared using structured data and AI.
      <br />
      <br />I also co-run a development team over at{' '}
      <a
        href="https://loopspeed.co.uk"
        target="_blank"
        rel="noreferrer"
        className="text-cyan underline underline-offset-2 hover:text-orange">
        Loopspeed
      </a>
      , where we help creative agencies and startups develop exciting digital products.
    </>
  )

  useGSAP(
    () => {
      const pSplit = new SplitText('#bio', { type: 'lines,words', wordsClass: 'opacity-0 blur-sm' })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: aboutSection.current,
            start: 'top 90%',
            end: 'center center',
            scrub: 2.5,
          },
        })
        .to(pSplit.words, {
          keyframes: [
            { opacity: 0.6, filter: 'blur(4px)', ease: 'power1.out' },
            { opacity: 1, filter: 'blur(0px)', ease: 'power1.out' },
          ],
          duration: 0.6,
          delay: 1,
          stagger: 0.06,
          ease: 'none',
        })
        .fromTo(
          '#profile-pic',
          {
            scale: 1.1,
          },
          {
            scale: 1,
            duration: 3.8,
            ease: 'power1.out',
          },
          0,
        )
        .fromTo(
          '#profile-pic-bg',
          {
            scale: 0,
          },
          { scale: 1, duration: 3.8, ease: 'power1.in' },
          0,
        )
    },
    {
      dependencies: [],
      scope: aboutSection,
    },
  )

  return (
    <div
      id="home-footer"
      className="relative grid w-full grid-cols-1 grid-rows-[1fr_auto_auto] place-items-center gap-4 pt-16 md:h-lvh">
      {/* About Section */}
      <section
        ref={aboutSection}
        className="flex flex-col items-center justify-center gap-4 horizontal-padding md:flex-row md:gap-8">
        <div className="relative flex aspect-square size-fit w-3/4 items-center justify-center md:w-auto">
          <div id="profile-pic-bg" className="absolute size-4/5 rounded-full bg-light/20 backdrop-blur-sm" />
          <Image
            id="profile-pic"
            src={profilePic}
            alt="Matthew Frawley"
            width={400}
            height={400}
            className="relative object-contain"
          />
        </div>
        {/* Bio */}
        <div className="h-fit max-w-lg space-y-4 sm:space-y-6">
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

      {/* <Marquee className="py-4 opacity-40" /> */}
    </div>
  )
}

export default HomeFooter

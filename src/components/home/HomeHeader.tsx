'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { type FC, useRef } from 'react'

const HomeHeader: FC = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '#home-header',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 2.0, delay: 0.3, ease: 'elastic.out(2.0,0.75)' },
      )

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            start: 0,
            end: 1000,
            scrub: true,
            fastScrollEnd: true,
            pin: '#home-header',
          },
        })
        .to('h1', {
          scale: 0.9,
          opacity: 0,
          duration: 0.15,
        })
        .to('h2', {
          keyframes: [
            { scale: 1, opacity: 1, duration: 0.2 },
            { scale: 0.9, opacity: 0, duration: 0.1 },
          ],
        })
    },
    { scope: container, dependencies: [] },
  )

  return (
    <div ref={container} className="pointer-events-none relative z-20 h-[1000px] w-full">
      <header
        id="home-header"
        className="flex h-lvh w-full select-none flex-col items-center justify-center px-6 pb-20 text-center text-white opacity-0 sm:pb-0">
        <h1 className="relative max-w-4xl text-4xl font-extrabold !leading-[1.3] tracking-tight md:text-6xl xl:text-7xl">
          Helping innovative teams <span className="text-green">bring big web ideas to life</span>
        </h1>
        <h2 className="absolute max-w-4xl scale-110 text-balance p-4 text-4xl font-extrabold !leading-[1.3] tracking-tight opacity-0 md:text-6xl xl:text-7xl">
          with purposeful design and engineering
        </h2>
      </header>
    </div>
  )
}

export default HomeHeader

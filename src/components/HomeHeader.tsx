'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC, useEffect, useRef, useState } from 'react'
import { twJoin } from 'tailwind-merge'

import ClientLogos from './ClientLogos'

const HomeHeader: FC = () => {
  const container = useRef<HTMLDivElement>(null)
  const [isCyclingText, setIsCyclingText] = useState(true)
  const [splitTexts, setSplitTexts] = useState<SplitText[]>()
  const currentMissionIndex = useRef(1)

  useGSAP(
    () => {
      const missionTexts: HTMLElement[] = gsap.utils.toArray('.mission')
      const splitTexts = missionTexts.map((el) => new SplitText(el, { charsClass: 'opacity-0 blur-sm' }))
      setSplitTexts(splitTexts)

      gsap.fromTo(
        '#home-header',
        { opacity: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          delay: 0.1,
        },
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
            onToggle: ({ isActive }) => {
              setIsCyclingText(isActive)
            },
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
        .to(
          '#client-logos',
          {
            opacity: 0,
            duration: 0.1,
          },
          '-=0.1',
        )
    },
    { scope: container, dependencies: [] },
  )

  useEffect(() => {
    if (!splitTexts) return

    let timeline: gsap.core.Timeline
    let timeout: NodeJS.Timeout

    const cycleMissionText = () => {
      const newIndex = (currentMissionIndex.current + 1) % 2
      timeline = gsap
        .timeline({
          onComplete: () => {
            currentMissionIndex.current = newIndex
            timeout = setTimeout(cycleMissionText, 600)
          },
        })
        .to(splitTexts[currentMissionIndex.current].chars, {
          opacity: 0,
          filter: 'blur(4px)',
          duration: 0.2,
          stagger: -0.02,
          ease: 'none',
        })
        .fromTo(
          splitTexts[newIndex].chars,
          {
            opacity: 0,
            filter: 'blur(4px)',
          },
          {
            keyframes: [
              { opacity: 0.6, filter: 'blur(4px)', ease: 'power1.out' },
              { opacity: 1, filter: 'blur(0px)', ease: 'power1.out' },
            ],
            duration: 0.4,
            stagger: 0.05,
          },
        )
    }

    if (isCyclingText) cycleMissionText()

    return () => {
      clearTimeout(timeout)
      timeline?.kill()
    }
  }, [isCyclingText, splitTexts])

  const headingClasses = 'text-3xl font-extrabold tracking-tight md:text-6xl xl:text-7xl !leading-[1.3]'

  return (
    <div ref={container} className="pointer-events-none relative z-20 h-[1000px] w-full">
      <header
        id="home-header"
        className="flex h-lvh w-full select-none flex-col items-center justify-center px-4 text-center text-white opacity-0 sm:pb-20">
        <h1 className={twJoin(headingClasses, 'relative')}>
          Helping innovative teams
          <br />
          <span className="relative inline-block h-24 w-full text-green md:h-32">
            <span className="mission absolute inset-0 py-2">build interactive 3D experiences</span>
            <span className="mission absolute inset-0 py-2">launch web and mobile apps</span>
          </span>
        </h1>
        <h2 className={twJoin(headingClasses, 'absolute max-w-4xl scale-110 text-balance opacity-0')}>
          with bespoke design and engineering
        </h2>
        <ClientLogos />
      </header>
    </div>
  )
}

export default HomeHeader

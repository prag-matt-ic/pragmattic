'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { type FC } from 'react'
import { twJoin } from 'tailwind-merge'

import positionArrow from '@/assets/icons/scroll-position.svg'
import { useHomeStore } from '@/hooks/home/HomeProvider'
import { SceneSection } from '@/resources/home'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP)

const HomeScrollManager: FC = () => {
  const activeSection = useHomeStore((s) => s.activeSection)
  const setActiveSection = useHomeStore((s) => s.setActiveSection)

  useGSAP(
    () => {
      Object.values(SceneSection).forEach((section) => {
        ScrollTrigger.create({
          trigger: `#${section}-section`,
          start: 'top top',
          end: 'bottom top',
          onEnter: () => {
            setActiveSection(section)
          },
          onEnterBack: () => {
            setActiveSection(section)
          },
          onLeave: () => {
            setActiveSection(null)
          },
          onLeaveBack: () => {
            setActiveSection(null)
          },
        })
      })
    },
    { dependencies: [] },
  )

  useGSAP(() => {
    // Update scroll progress indicator
    const matchMedia = gsap.matchMedia()
    matchMedia.add('(min-width: 640px)', () => {
      const scrollBarHeight = document.getElementById('scroll-bar')?.getBoundingClientRect()?.height
      if (!scrollBarHeight) return
      gsap.to('#scroll-indicator', {
        y: scrollBarHeight,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: true,
        },
      })
    })
  }, [])

  const onLinkClick = (section: SceneSection) => {
    gsap.to(window, { scrollTo: { y: `#${section}-section`, offsetY: -16 } })
  }

  // "h-10" corresponds to a 1000px height section */
  const spacerClasses = 'h-10 w-full shrink-0'
  const buttonClasses = 'h-10 w-full shrink-0 rounded-full hover:opacity-100'

  return (
    <nav className="fixed bottom-0 left-6 top-0 z-[100] hidden items-center justify-center sm:flex xl:left-8">
      <div id="scroll-bar" className="relative w-1 rounded-full bg-light/30 xl:w-2">
        <div className={spacerClasses} />
        <button
          aria-label="Purpose"
          className={twJoin(
            buttonClasses,
            'bg-green',
            activeSection === SceneSection.Purpose ? 'animate-pulse opacity-100' : 'opacity-20',
          )}
          onClick={() => onLinkClick(SceneSection.Purpose)}
        />
        <button
          aria-label="Design"
          className={twJoin(
            buttonClasses,
            'bg-orange',
            activeSection === SceneSection.Design ? 'animate-pulse opacity-100' : 'opacity-20',
          )}
          onClick={() => onLinkClick(SceneSection.Design)}
        />
        <button
          aria-label="Engineering"
          className={twJoin(
            buttonClasses,
            'bg-cyan',
            activeSection === SceneSection.Engineering ? 'animate-pulse opacity-100' : 'opacity-20',
          )}
          onClick={() => onLinkClick(SceneSection.Engineering)}
        />
        <div className={spacerClasses} />

        <div id="scroll-indicator" className="absolute left-1 top-0 size-4 xl:size-5">
          {/* Bounce this on the X axis */}
          <Image src={positionArrow} alt="arrow" className="size-full -translate-y-1/2" />
        </div>
      </div>
    </nav>
  )
}

export default HomeScrollManager

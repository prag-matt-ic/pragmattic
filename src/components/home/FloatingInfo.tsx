'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { useGSAP } from '@gsap/react'
import { Billboard, Html } from '@react-three/drei'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import { type FC, type ReactNode, useRef } from 'react'
import { Transition } from 'react-transition-group'
import { twJoin } from 'tailwind-merge'

import { useHomeStore } from '@/hooks/home/HomeProvider'
import { SceneSection } from '@/resources/home'

type Props = {
  isMobile: boolean
  section: SceneSection
}

const FloatingInfo: FC<Props> = ({ isMobile, section }) => {
  const activeSection = useHomeStore((s) => s.activeSection)
  const isOpen = activeSection === section

  const container = useRef<HTMLDivElement>(null)
  const timeline = useRef<GSAPTimeline>()
  const { contextSafe } = useGSAP({ scope: container })

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'top',
    middleware: [shift({ padding: 80 }), offset({ mainAxis: 0 }), flip()],
  })

  const onModalEnter = contextSafe(() => {
    if (!refs.floating.current) return
    timeline.current?.kill()

    const splitHeading = new SplitText('h3', {
      charsClass: 'opacity-0',
    })

    gsap.set(refs.floating.current, { opacity: 1 })

    timeline.current = gsap
      .timeline()
      .to('.span', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      })
      .fromTo(
        splitHeading.chars,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.016,
          ease: 'power2.out',
        },
        0,
      )
      .fromTo(
        'p',
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.5,
      )
  })

  const onModalExit = () => {
    timeline.current?.kill()
    timeline.current = gsap.timeline().to(refs.floating.current, {
      opacity: 0,
      duration: 0.5,
      scale: 0.95,
      ease: 'power2.out',
    })
  }

  return (
    // Mobile position is same for each section
    <Billboard position={isMobile ? [0, -3.5, 0] : CONFIG[section].position}>
      <Html ref={container} className="pointer-events-none select-none">
        <div ref={refs.setReference} className="size-4 -translate-x-1/2 -translate-y-1/2" />
        <Transition
          in={isOpen}
          timeout={{ enter: 0, exit: 500 }}
          mountOnEnter={true}
          unmountOnExit={true}
          onEnter={onModalEnter}
          onExit={onModalExit}
          nodeRef={refs.floating}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="pointer-events-none absolute w-[calc(100vw-64px)] origin-top-left space-y-2.5 opacity-0 md:w-[420px] lg:w-[560px]">
            <span
              className={twJoin(
                CONFIG[section].overlineClassName,
                'span flex w-full items-center gap-3 text-xl font-semibold capitalize tracking-wide opacity-0 lg:text-2xl',
              )}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2" />
              </svg>
              {section}
            </span>
            <h3 className="w-full text-xl font-extrabold md:text-2xl lg:text-4xl">{CONFIG[section].heading}</h3>
            <p className="w-full max-w-md text-light md:text-lg">{CONFIG[section].paragraph}</p>
          </div>
        </Transition>
      </Html>
    </Billboard>
  )
}

const CONFIG: Record<
  SceneSection,
  {
    position: [number, number, number]
    overlineClassName: string
    heading: ReactNode
    paragraph: ReactNode
  }
> = {
  [SceneSection.Purpose]: {
    position: [-1.2, 0.6, 1],
    overlineClassName: 'text-green',
    heading: 'Use technology to improve human performance',
    paragraph: `Purpose fuels progress. That's why it's at the core of everything we create together. What's your mission?`,
  },
  [SceneSection.Design]: {
    position: [-1.4, -0.2, 2],
    overlineClassName: 'text-orange',
    heading: 'Where form meets function',
    paragraph:
      'By deeply understanding the problem and any constraints, we can design solutions that are both effective and delightful for your audience.',
  },
  [SceneSection.Engineering]: {
    position: [-1.2, -1.2, 1],
    overlineClassName: 'text-cyan',
    heading: 'From concept to impact',
    paragraph: 'Bring your vision to life with cutting-edge web solutions. Fast, secure, and built to maintain.',
  },
} as const

export default FloatingInfo

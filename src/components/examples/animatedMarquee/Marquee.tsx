'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import Image, { type StaticImageData } from 'next/image'
import { type FC, useMemo, useRef } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

import gsapIcon from '@/assets/icons/technologies/gsap.svg'
import nextIcon from '@/assets/icons/technologies/next.svg'
import reactIcon from '@/assets/icons/technologies/react.svg'
import tailwindIcon from '@/assets/icons/technologies/tailwind.svg'
import threeIcon from '@/assets/icons/technologies/three.svg'
import typescriptIcon from '@/assets/icons/technologies/typescript.svg'
import webGLIcon from '@/assets/icons/technologies/webgl.svg'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Props = {
  isReversed?: boolean
  className?: string
}

const TECHNOLOGY_ICONS: StaticImageData[] = [
  gsapIcon,
  nextIcon,
  webGLIcon,
  reactIcon,
  tailwindIcon,
  threeIcon,
  typescriptIcon,
]

const ELEMENTS = [...TECHNOLOGY_ICONS, ...TECHNOLOGY_ICONS]

const Marquee: FC<Props> = ({ isReversed = false, className }) => {
  const movingContainer = useRef<HTMLDivElement>(null)
  const timeline = useRef<GSAPTimeline>()

  useGSAP(
    () => {
      // Translate the container half of its width to the left (the width of list)
      // Then set it back to the start, and repeat infinitely.
      const setupInfiniteMarqueeTimeline = () => {
        gsap.set(movingContainer.current, {
          xPercent: isReversed ? -50 : 0,
        })
        timeline.current = gsap
          .timeline({
            defaults: { ease: 'none', repeat: -1 },
          })
          .to(movingContainer.current, {
            xPercent: isReversed ? 0 : -50,
            duration: 20,
          })
          .set(movingContainer.current, { xPercent: 0 })
      }

      setupInfiniteMarqueeTimeline()
    },
    { dependencies: [isReversed] },
  )

  let timelineTimeScaleTween = useRef<GSAPTween>()

  const onPointerEnter = () => {
    if (!timeline.current) return
    timelineTimeScaleTween.current?.kill()
    timelineTimeScaleTween.current = gsap.to(timeline.current, { timeScale: 0.25, duration: 0.4 })
  }

  const onPointerLeave = () => {
    if (!timeline.current) return
    timelineTimeScaleTween.current?.kill()
    timelineTimeScaleTween.current = gsap.to(timeline.current, { timeScale: 1, duration: 0.2 })
  }

  const list = useMemo(
    () => (
      <div className="flex w-fit items-center gap-10">
        {ELEMENTS.map((src, index) => {
          const isLast = index === ELEMENTS.length - 1
          return (
            <div
              key={index}
              className={twJoin('relative flex shrink-0 items-center justify-center', isLast && 'mr-10')}
              style={{ height: src.height, width: src.width }}>
              <Image src={src} alt="technologies icon" height={40} className="object-contain" />
            </div>
          )
        })}
      </div>
    ),
    [],
  )

  return (
    <div
      className={twMerge('max-w-full select-none overflow-hidden', className)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
      }}>
      <div ref={movingContainer} className="flex w-fit">
        {list}
        {list}
      </div>
    </div>
  )
}

export default Marquee

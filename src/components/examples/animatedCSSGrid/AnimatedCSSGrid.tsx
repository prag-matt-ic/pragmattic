'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import Image, { type StaticImageData } from 'next/image'
import { type FC, type ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type GridCardProps = {
  image: StaticImageData
  heading: string
  description: ReactNode
}

type Props = {
  className?: string
  cards: GridCardProps[]
}

const AnimatedGrid: FC<Props> = ({ className, cards = [] }) => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!container.current) return

      // Initialize matchMedia for responsive animations
      const matchMedia = gsap.matchMedia()

      // Smaller screens
      matchMedia.add('screen and (max-width: 639px)', () => {
        const cards = gsap.utils.toArray('.card') as HTMLDivElement[]
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              scale: 0.9,
              y: 24,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.in',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })
        // Reset Y temporarily when the scroll trigger refreshes for calculation
        ScrollTrigger.addEventListener('refreshInit', () => {
          gsap.set('.card', { y: 0 })
        })
      })

      // Larger screens
      matchMedia.add('screen and (min-width: 640px)', () => {
        const staggerParams: gsap.StaggerVars = {
          each: 0.12,
          from: 'start',
          grid: 'auto',
          ease: 'power2.inOut',
        }
        // Animation timeline with a scroll trigger on the container
        gsap
          .timeline({
            scrollTrigger: {
              trigger: container.current,
              start: 'top 75%', // start when the top of the <section> is at 75% of the viewport (25% from the bottom)
              toggleActions: 'play none none reverse', // play animation when in view, reverse when out
            },
          })
          .fromTo(
            '.card',
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: staggerParams,
            },
          )
          .fromTo(
            'img',
            { opacity: 0, scale: 0.6 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
              stagger: staggerParams,
            },
            0.5,
          )
          .fromTo(
            'h5',
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
            },
            '-=0.3',
          )
          .fromTo(
            'p',
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
            },
            '-=0.3',
          )
      })
    },
    { scope: container, dependencies: [] },
  )

  return (
    <section
      ref={container}
      // Merge the base classes, grid classes and optional className prop
      className={twMerge(
        'relative grid w-full grid-cols-1 gap-6 px-14 py-10 text-white',
        cards.length === 3
          ? 'grid-cols-1 md:grid-cols-3'
          : cards.length === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}>
      {cards.map((item, index) => (
        // The 'card' class is used as a selector in the animation
        // 'opacity-0' ensures the card is invisible until animated in
        <div key={index} className="card space-y-3 rounded-xl bg-white/5 p-6 opacity-0 shadow-2xl">
          <Image src={item.image} alt={item.heading} className="h-20" />
          <h5 className="text-sm font-semibold uppercase tracking-wide">{item.heading}</h5>
          <p className="text-base text-white/60">{item.description}</p>
        </div>
      ))}
    </section>
  )
}

export default AnimatedGrid

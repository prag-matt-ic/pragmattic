'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useLayoutEffect, useRef, useState } from 'react'
import { twJoin } from 'tailwind-merge'

gsap.registerPlugin(ScrollTrigger, useGSAP, ScrollToPlugin)

type Props = {}

const BlogAsideMenu: FC<Props> = () => {
  const [headingLinks, setHeadingLinks] = useState<HTMLAnchorElement[]>([])
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)
  const container = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Find headings from the rich text using the class name
    const richTextHeadingLinks = gsap.utils.toArray('.blog-heading') as HTMLAnchorElement[]
    if (richTextHeadingLinks.length === 0) return
    setHeadingLinks(richTextHeadingLinks)
    setActiveHeadingId(richTextHeadingLinks[0].id)
  }, [])

  useGSAP(
    () => {
      // Create a scroll trigger for setting the active heading id
      gsap.matchMedia().add('(min-width: 1280px)', () => {
        headingLinks.forEach((el) => {
          const id = el.id
          ScrollTrigger.create({
            trigger: el,
            start: 'top 40%',
            end: 'top top',
            onEnter: () => setActiveHeadingId(id),
            onEnterBack: () => setActiveHeadingId(id),
          })
        })
      })
    },
    {
      scope: container,
      dependencies: [headingLinks],
    },
  )

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 0.9,
      ease: 'power2.out',
      scrollTo: { y: 0 },
    })
  }

  const scrollToHeading = (id: string) => {
    gsap.to(window, {
      duration: 0.8,
      ease: 'power2.out',
      scrollTo: { y: `#${id}`, offsetY: 96 },
      onComplete: () => {
        setActiveHeadingId(id)
      },
    })
  }

  if (!headingLinks.length) return null

  return (
    <aside ref={container} className="sticky top-12 z-50 hidden h-fit shrink-0 px-12 pb-10 pt-16 xl:block 2xl:px-16">
      <h4 role="button" className="mb-2 w-full text-sm uppercase tracking-wide text-light" onClick={scrollToTop}>
        Contents
      </h4>
      <ul className="flex w-full flex-col">
        {headingLinks.map((element, index) => {
          const heading = element.dataset.heading!
          const isActive = activeHeadingId === element.id
          return (
            <li
              key={index}
              role="button"
              onClick={() => scrollToHeading(element.id)}
              className={twJoin(
                'py-1.5 text-base font-medium hover:text-white',
                isActive ? 'font-semibold text-white' : 'text-light',
              )}>
              {heading}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default BlogAsideMenu

'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { useGSAP } from '@gsap/react'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import { type FC, type ReactNode, useRef } from 'react'
import { Transition } from 'react-transition-group'
import { twJoin } from 'tailwind-merge'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

type Props = {
  section: SceneSection
}

const HEADING_CLASSES: Record<SceneSection, string> = {
  [SceneSection.Purpose]: 'text-green',
  [SceneSection.Design]: 'text-orange',
  [SceneSection.Engineering]: 'text-cyan',
} as const

const TEXT_CONTENT: Record<SceneSection, ReactNode> = {
  [SceneSection.Purpose]: 'Using technology to improve human performance',
  [SceneSection.Design]: 'Balanced function and aesthetics',
  [SceneSection.Engineering]: 'Turn your vision into reality using modern web technologies',
} as const

const FloatingInfo: FC<Props> = ({ section }) => {
  const activeSection = useHomeSceneStore((s) => s.activeSection)
  const hasCompletedIntroScroll = useHomeSceneStore((s) => s.hasCompletedIntroScroll)
  const isOpen = hasCompletedIntroScroll && activeSection === section

  const modalTextTween = useRef<GSAPTween>()
  const container = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: container })

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'top',
    middleware: [shift({ padding: 24 }), offset({ mainAxis: 24 }), flip()],
  })

  const onModalEnter = contextSafe(() => {
    if (!refs.floating.current) return
    modalTextTween.current?.kill()

    const splitParagraph = new SplitText('p', {
      charsClass: 'opacity-0',
    })

    gsap.set(refs.floating.current, { opacity: 1 })

    gsap.to('h3', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    })

    modalTextTween.current = gsap.fromTo(
      splitParagraph.chars,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        stagger: 0.016,
        ease: 'power2.out',
      },
    )
  })

  const onModalExit = () => {
    modalTextTween.current?.kill()
    modalTextTween.current = gsap.to(refs.floating.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
    })
  }

  return (
    <Html ref={container} className="pointer-events-none select-none">
      <div ref={refs.setReference} className="size-5 -translate-x-1/2 -translate-y-1/2" />
      <Transition
        in={isOpen}
        timeout={{ enter: 0, exit: 350 }}
        mountOnEnter={true}
        unmountOnExit={true}
        onEnter={onModalEnter}
        onExit={onModalExit}
        nodeRef={refs.floating}>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="pointer-events-none absolute w-[calc(100vw-80px)] space-y-2 opacity-0 md:w-[420px] 2xl:w-[560px]">
          <h3
            className={twJoin(
              HEADING_CLASSES[section],
              'w-full text-xl font-black capitalize italic tracking-wide opacity-0 xl:text-2xl',
            )}>
            {section}
          </h3>
          <p className="w-full text-lg font-bold md:text-2xl lg:text-3xl 2xl:text-4xl">{TEXT_CONTENT[section]}</p>
        </div>
      </Transition>
    </Html>
  )
}

export default FloatingInfo

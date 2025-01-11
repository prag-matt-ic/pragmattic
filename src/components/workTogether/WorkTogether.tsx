'use client'
import { autoUpdate, FloatingPortal, offset, shift, useFloating, useInteractions } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useHover } from '@mantine/hooks'
import { OrthographicCamera, View } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import Link from 'next/link'
import { type FC, useState } from 'react'
import { Transition } from 'react-transition-group'
import { twJoin } from 'tailwind-merge'

import Button from '@/components/buttons/Button'

import { WorkTogetherAnimation, type WorkTogetherShader } from './shaders/WorkTogetherAnimation'

const WorkTogether: FC = () => {
  const [isShowing, setIsShowing] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    transform: false,
    open: isShowing,
    onOpenChange: setIsShowing,
    middleware: [shift({ padding: 8 }), offset({ mainAxis: 8 })],
    whileElementsMounted: autoUpdate,
  })
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  const onEnter = () => {
    gsap.fromTo(
      refs.floating.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.inOut' },
    )
  }

  const onExit = () => {
    gsap.to(refs.floating.current, { opacity: 0, duration: 0.24, ease: 'power2.out' })
  }

  return (
    <>
      <Button
        ref={refs.setReference}
        {...getReferenceProps()}
        variant="filled"
        size="small"
        className={isShowing ? 'bg-white' : ''}
        onClick={() => setIsShowing((prev) => !prev)}>
        talk to Matt
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={twJoin('-mr-2 transition-transform duration-200', isShowing && 'rotate-180')}>
          <path d="M12 15L7 10H17L12 15Z" className="fill-black" />
        </svg>
      </Button>

      <FloatingPortal>
        <Transition
          in={isShowing}
          timeout={{ enter: 0, exit: 250 }}
          nodeRef={refs.floating}
          mountOnEnter={true}
          unmountOnExit={true}
          onEnter={onEnter}
          onExit={onExit}>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            style={floatingStyles}
            className="absolute z-[1000] max-w-[calc(100%-16px)] select-none overflow-hidden rounded-lg border border-off-black bg-black opacity-0 shadow-2xl">
            {/* Views from inside the content cards are rendered using this single canvas */}
            <Canvas
              key="work-together-canvas"
              className="pointer-events-none !absolute inset-0 overflow-hidden"
              eventSource={refs.floating.current!}
              gl={{ alpha: false, antialias: false }}>
              <OrthographicCamera makeDefault />
              <View.Port />
            </Canvas>

            <ContentCard
              shader="agency"
              title="Agency"
              description="Discuss a project or business partnership"
              href="mailto:pragmattic.ltd@gmail.com?subject=Agency%20partnership"
            />
            <ContentCard
              shader="startup"
              title="Startup"
              description="Discuss a new product or MVP launch"
              href="mailto:pragmattic.ltd@gmail.com?subject=Product%20launch"
            />
            <ContentCard
              shader="developer"
              title="Developer"
              description="Discuss work opportunities or team training"
              href="mailto:pragmattic.ltd@gmail.com?subject=Developer%20Collaboration"
            />
          </div>
        </Transition>
      </FloatingPortal>
    </>
  )
}

const TITLE_CLASSNAMES: Record<WorkTogetherShader, string> = {
  agency: 'text-orange sm:text-light group-hover:text-orange',
  startup: 'text-green sm:text-light group-hover:text-green',
  developer: 'text-cyan sm:text-light group-hover:text-cyan',
}

type CardProps = {
  shader: WorkTogetherShader
  title: string
  description: string
  href: string
}

const ContentCard: FC<CardProps> = ({ shader, title, description, href }) => {
  const { hovered: isHovered, ref } = useHover()
  return (
    <Link href={href}>
      <div
        ref={ref}
        className={twJoin('group flex items-center', shader !== 'developer' && 'border-b border-b-off-black')}>
        <View frames={Infinity} visible={true} className="aspect-square size-[104px] sm:size-[120px] md:size-[148px]">
          <WorkTogetherAnimation type={shader} isHovered={isHovered} />
        </View>
        <div className="px-4 lg:px-6">
          <h3 className={twJoin('text-xs uppercase transition-colors duration-300', TITLE_CLASSNAMES[shader])}>
            {title}
          </h3>
          <p className="text-sm text-white sm:text-base">{description}</p>
        </div>
      </div>
    </Link>
  )
}

export default WorkTogether

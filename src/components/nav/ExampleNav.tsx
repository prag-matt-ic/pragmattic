'use client'
import { FloatingPortal, offset, useFloating, useInteractions } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { type FC, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'
import { twJoin } from 'tailwind-merge'

import articleIcon from '@/assets/icons/article-white.svg'
import collapseIcon from '@/assets/icons/collapse-green.svg'
import dropDownIcon from '@/assets/icons/drop-down-white.svg'
import expandIcon from '@/assets/icons/expand-green.svg'
import forwardSlashIcon from '@/assets/icons/forward-slash-light.svg'
import githubIcon from '@/assets/icons/socials/github.svg'
import youtubeIcon from '@/assets/icons/socials/youtube.svg'
import Button from '@/components/buttons/Button'
import { EXAMPLES_METADATA } from '@/resources/examples/examples'
import { ExampleSlug, Pathname } from '@/resources/pathname'

gsap.registerPlugin(useGSAP)

type Props = {
  pathname: string
}

const ExampleNav: FC<Props> = ({ pathname: currentPathname }) => {
  const container = useRef<HTMLDivElement>(null)
  const expandedContainer = useRef<HTMLDivElement>(null)
  const containerHeight = 48

  const [isExpanded, setIsExpanded] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const { x, y, floatingStyles, refs, context } = useFloating({
    strategy: 'absolute',
    placement: 'bottom-start',
    transform: true,
    open: isPickerOpen,
    onOpenChange: setIsPickerOpen,
    middleware: [
      offset({
        mainAxis: 8,
        crossAxis: -16,
      }),
    ],
  })
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  const onInfoEnter = () => {
    if (!expandedContainer.current) return
    const expandedSectionHeight = expandedContainer.current.getBoundingClientRect().height
    gsap
      .timeline()
      .to('#example-nav-border', {
        height: expandedSectionHeight + containerHeight,
        duration: 0.3,
        ease: 'power2.inOut',
      })
      .to('#example-nav-bg', { opacity: 1, duration: 0.3, ease: 'power2.in' }, 0)
      .to(expandedContainer.current, { opacity: 1, duration: 0.24, ease: 'power2.in' }, 0.2)
  }

  const onInfoExit = () => {
    gsap
      .timeline()
      .to(expandedContainer.current, { opacity: 0, duration: 0.16, ease: 'power1.out' })
      .to('#example-nav-bg', { opacity: 0, duration: 0.2, ease: 'power2.out' })
      .to('#example-nav-border', { height: containerHeight, duration: 0.2, opacity: 1, ease: 'power2.out' }, '<')
  }

  // Extract the example slug from the pathname
  const exampleSlug = currentPathname.split('/').pop() as ExampleSlug
  const currentExample = EXAMPLES_METADATA[exampleSlug]
  if (!currentExample) return null
  const { title, description, githubUrl, youtubeUrl, blogSlug } = currentExample

  return (
    <>
      <section
        ref={container}
        className="absolute top-0 max-w-full text-white md:w-[480px] lg:w-[540px] xl:w-[600px]"
        style={{ height: containerHeight }}>
        {/* background container which expands */}
        <div
          id="example-nav-border"
          style={{ height: containerHeight }}
          className="absolute w-full overflow-hidden rounded-md border border-mid backdrop-blur-md will-change-transform">
          <div id="example-nav-bg" className="absolute inset-0 bg-black" />
        </div>

        <header className="relative flex h-12 w-full items-center justify-between gap-2 pl-3">
          <div className="flex select-none items-center gap-1.5">
            <span className="text-sm text-light">Examples</span>
            <Image src={forwardSlashIcon} alt="/" className="size-5" />
            <button
              ref={refs.setReference}
              {...getReferenceProps()}
              className="flex items-center gap-1 transition-opacity duration-200 hover:opacity-70"
              onClick={() => setIsPickerOpen((prev) => !prev)}>
              <span className="text-ellipsis whitespace-nowrap text-base font-semibold">{title}</span>
              <Image src={dropDownIcon} alt="open menu" className="size-6" />
            </button>
          </div>

          <Button variant="text" colour="secondary" size="small" onClick={() => setIsExpanded((prev) => !prev)}>
            {isExpanded ? (
              <Image src={collapseIcon} alt="collapse" className="size-5" />
            ) : (
              <Image src={expandIcon} alt="expand" className="size-5" />
            )}
          </Button>
        </header>

        {/* Expanded Info Section */}
        <Transition
          in={isExpanded}
          timeout={{ enter: 0, exit: 300 }}
          mountOnEnter={true}
          unmountOnExit={true}
          nodeRef={expandedContainer}
          onEnter={onInfoEnter}
          onExit={onInfoExit}>
          <div ref={expandedContainer} className="relative w-full space-y-3 overflow-hidden px-4 pb-4 pt-2 opacity-0">
            {!!description && <p className="h-fit text-sm text-light">{description}</p>}

            <div className="flex items-center gap-6 text-sm font-medium">
              {!!blogSlug && (
                <a
                  href={`${Pathname.Blog}/${blogSlug}`}
                  target="_blank"
                  className="flex items-center gap-2 hover:opacity-50">
                  <Image src={articleIcon} alt="Article" className="size-6" />
                  Deep Dive
                </a>
              )}
              {!!youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-50">
                  <Image src={youtubeIcon} alt="Youtube" className="size-6" />
                  YouTube Video
                </a>
              )}
              {!!githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-50">
                  <Image src={githubIcon} alt="Github" className="size-6" />
                  Code
                </a>
              )}
            </div>
          </div>
        </Transition>
      </section>

      {/* Floating picker menu */}
      {isPickerOpen && (
        <FloatingPortal>
          <section
            ref={refs.setFloating}
            style={{ ...floatingStyles, transform: `translate3d(${x}px, ${y}px, 0)` }}
            {...getFloatingProps()}
            className="absolute left-0 top-0 z-[1000] max-w-[calc(100%-16px)] overflow-hidden rounded-lg bg-black/80 shadow-xl backdrop-blur-md">
            <div className="w-full overflow-y-auto">
              {Object.values(EXAMPLES_METADATA).map(({ title, pathname, youtubeUrl, githubUrl }, index) => {
                const isActive = pathname === currentPathname
                const hasLinks = !!youtubeUrl || !!githubUrl
                if (isActive) return null
                return (
                  <div
                    key={title}
                    className={twJoin(
                      'example flex items-center justify-between gap-6 px-4 py-3 text-white',
                      index % 2 === 0 && 'bg-black/40',
                    )}>
                    <Link
                      href={pathname}
                      className="block font-medium hover:text-green"
                      onClick={() => {
                        setIsPickerOpen(false)
                        setIsExpanded(false)
                      }}>
                      {title}
                    </Link>
                    {hasLinks && (
                      <div className="flex items-center gap-4">
                        {!!youtubeUrl && (
                          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-50">
                            <Image src={youtubeIcon} alt="Youtube" className="size-5" />
                          </a>
                        )}
                        {!!githubUrl && (
                          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-50">
                            <Image src={githubIcon} alt="Github" className="size-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </FloatingPortal>
      )}
    </>
  )
}

export default ExampleNav

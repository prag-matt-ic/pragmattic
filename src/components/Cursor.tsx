'use client'
import { useGSAP } from '@gsap/react'
import { OS, useOs } from '@mantine/hooks'
import gsap from 'gsap'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { type FC } from 'react'

import useCursorStore from '@/hooks/useCursorStore'

// Show the cursor on desktop devices only
const CustomCursor: FC = () => {
  const os: OS = useOs()
  const showCustomCursor = os !== 'ios' && os !== 'android' && os !== 'undetermined'

  if (!showCustomCursor) return null

  return (
    <div id="cursor-container" className="pointer-events-none fixed inset-0 z-[500] select-none">
      <Cursor />
    </div>
  )
}

export default CustomCursor

const Cursor: FC = () => {
  const pointer = useRef<HTMLDivElement>(null)
  const { type, label } = useCursorStore()

  useLayoutEffect(() => {
    gsap.set(pointer.current, {
      xPercent: -50,
      yPercent: -50,
    })
  }, [])

  useGSAP(
    () => {
      const isHovered = type === 'hover'
      if (isHovered) {
        gsap.to('#pointer-ring', { scale: 3, duration: 0.4 })
        gsap.fromTo(
          '#pointer-label',
          { opacity: 0, scale: 0.6 },
          { opacity: isHovered ? 1 : 0, scale: 1, duration: 0.3 },
        )
      } else {
        gsap.to('#pointer-ring', { scale: 1, duration: 0.4 })
        gsap.to('#pointer-label', {
          opacity: 0,
          scale: 0.6,
          duration: 0.3,
        })
      }
    },
    { scope: pointer, dependencies: [type, label] },
  )

  // Event listener for pointer move
  useEffect(() => {
    const setCursorX = gsap.quickTo(pointer.current, 'x', { duration: 0.15 })
    const setCursorY = gsap.quickTo(pointer.current, 'y', { duration: 0.15 })

    const onPointerMove = (e: PointerEvent) => {
      setCursorX(e.clientX)
      setCursorY(e.clientY)
    }

    document.body.addEventListener('pointermove', onPointerMove)
    return () => {
      document.body.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div ref={pointer} className="pointer-events-none absolute flex items-center justify-center">
      <div id="pointer-ring" className="size-5 rounded-full border border-white" />
      <div id="pointer-label" className="absolute size-10 text-center text-4xl opacity-0">
        {label}
      </div>
    </div>
  )
}

'use client'
import { useEffect, useRef } from 'react'
import { LinearFilter, NearestFilter, RGBAFormat, WebGLRenderTarget } from 'three'

// https://code.tutsplus.com/how-to-write-a-smoke-shader--cms-25587t
// Article on smoke texture: https://codepen.io/tutsplus/full/RrVpxd/

type RenderTargets = {
  current: WebGLRenderTarget
  previous: WebGLRenderTarget
}

export const useDoubleBufferedRenderTarget = ([width, height]: [width: number, height: number]) => {
  const targetA = useRef(
    new WebGLRenderTarget(width, height, {
      minFilter: LinearFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
    }),
  )

  const targetB = useRef(
    new WebGLRenderTarget(width, height, {
      minFilter: LinearFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
    }),
  )

  const targets = useRef<RenderTargets>({
    current: targetA.current,
    previous: targetB.current,
  })

  const swapTargets = () => {
    const temp = targets.current.previous
    targets.current.previous = targets.current.current
    targets.current.current = temp
  }

  useEffect(() => {
    const ta = targetA.current
    const tb = targetB.current
    return () => {
      ta.dispose()
      tb.dispose()
    }
  }, [])

  return { targets: targets.current, swapTargets }
}

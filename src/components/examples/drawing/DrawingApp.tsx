'use client'
import { OrthographicCamera, ScreenQuad, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import { saveAs } from 'file-saver'
import { Leva, useControls } from 'leva'
import React, { type FC, type MouseEvent, useEffect, useRef, useState } from 'react'
import { Color, Mesh, PlaneGeometry, ShaderMaterial, Texture, Vector2 } from 'three'

import fragmentShader from './drawing.frag'
import vertexShader from './screen.vert'
import { useDoubleBufferedRenderTarget } from './useDoubleBufferedRenderTarget'

const DrawingCanvas: FC = () => {
  const [version, setVersion] = useState<string>(new Date().toISOString())
  useControls({
    reset: { value: false, onChange: () => setVersion(new Date().toISOString()) },
  })

  const onResetClick = (e: MouseEvent) => {
    e.stopPropagation()
    setVersion(new Date().toISOString())
  }

  const onDownloadPress = (e: MouseEvent) => {
    e.stopPropagation()
    try {
      const canvas = document.querySelector('canvas')
      if (!canvas) throw new Error('Canvas not found')
      canvas.toBlob(
        function (blob) {
          if (!blob) return
          saveAs(blob, `drawing-${version}.png`)
        },
        'image/png',
        1,
      )
    } catch (error) {
      console.error('Error downloading', { error })
    }
  }
  return (
    <>
      <Canvas
        frameloop="always"
        gl={{
          alpha: false,
          localClippingEnabled: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}>
        <OrthographicCamera makeDefault={true} position={[0, 0, 1]} />
        <Drawing version={version} />
      </Canvas>
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </>
  )
}

export default DrawingCanvas

type Uniforms = {
  uTime: number
  uAspect: number
  uIsPointerDown: boolean
  uPointers: Vector2[]
  // uPointer: Vector2
  // uPrevPointer: Vector2
  uPrevTexture: Texture | null
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1.0,
  uIsPointerDown: false,
  uPointers: [],
  // uPointer: new Vector2(0, 0),
  // uPrevPointer: new Vector2(0, 0),
  uPrevTexture: null,
}

const DrawingShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

type ResetUniforms = {
  uColour: Color
}

const ResetDrawingShaderMaterial = shaderMaterial(
  { uColour: new Color('#000') },
  vertexShader,
  `
    uniform vec3 uColour;
    void main() {
      gl_FragColor = vec4(uColour, 1.0);
    }
  `,
)

extend({ DrawingShaderMaterial, ResetDrawingShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    drawingShaderMaterial: ShaderMaterialProps & Uniforms
    resetDrawingShaderMaterial: ShaderMaterialProps & ResetUniforms
  }
}

type DrawingProps = {
  version: string
}

const Drawing: FC<DrawingProps> = ({ version }) => {
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)
  const resetShader = useRef<ShaderMaterial & Partial<ResetUniforms>>(null)
  const isPointerDown = useRef(false)

  const { viewport, size, gl, camera } = useThree()
  const renderTargets = useDoubleBufferedRenderTarget([size.width, size.height])

  useEffect(() => {
    const resetOnVersionChange = () => {
      // Render black quad to both render targets
      const { targets } = renderTargets
      const blackQuad = new Mesh(new PlaneGeometry(size.width, size.height), resetShader.current!)
      gl.setRenderTarget(targets.current)
      gl.render(blackQuad, camera)
      gl.setRenderTarget(targets.previous)
      gl.render(blackQuad, camera)
      gl.setRenderTarget(null) // Reset to default framebuffer
    }
    resetOnVersionChange()
  }, [version, camera, size.width, size.height, renderTargets, gl])

  useEffect(() => {
    const target = gl.domElement

    const handlePointerDown = () => {
      isPointerDown.current = true
    }

    const handlePointerUp = () => {
      isPointerDown.current = false
    }

    target.addEventListener('pointerdown', handlePointerDown)
    target.addEventListener('pointerup', handlePointerUp)

    return () => {
      target.removeEventListener('pointerdown', handlePointerDown)
      target.removeEventListener('pointerup', handlePointerUp)
    }
  }, [gl])

  const prevPointer = useRef<Vector2>(new Vector2(0, 0))

  function catmullRomPoints(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, steps = 24) {
    const curve: Vector2[] = []

    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const t2 = t * t
      const t3 = t2 * t

      // Catmull–Rom basis functions
      const b0 = 0.5 * (-t3 + 2 * t2 - t)
      const b1 = 0.5 * (3 * t3 - 5 * t2 + 2)
      const b2 = 0.5 * (-3 * t3 + 4 * t2 + t)
      const b3 = 0.5 * (t3 - t2)

      const x = p0.x * b0 + p1.x * b1 + p2.x * b2 + p3.x * b3
      const y = p0.y * b0 + p1.y * b1 + p2.y * b2 + p3.y * b3

      curve.push(new Vector2(x, y))
    }

    console.log(curve)
    return curve
  }

  // TODO: update to store a history of multiple previous pointers
  // Then use them in the catmull-Rom function
  // TODO: Update to use Centripetal Catmull-Rom logic
  // https://chatgpt.com/c/67842fde-a920-8006-8909-85df23e9e6b9

  function getInterpolatedPoints(pointer: Vector2): Vector2[] {
    const steps = 24
    const points: Vector2[] = []
    // Generate intermediate points from prevPointer -> pointer
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const intermediate = prevPointer.current.clone().lerp(pointer, t)
      points.push(intermediate)
    }

    // return catmullRomPoints(points[0], points[1], points[2], points[3], 24)
    // Smooth these
    return points
  }

  useFrame(({ clock, pointer, gl, scene, camera }) => {
    if (!shader.current) return
    const { targets, swapTargets } = renderTargets

    const pointerPoints = getInterpolatedPoints(pointer)
    shader.current.uPointers = pointerPoints
    shader.current.uIsPointerDown = isPointerDown.current
    shader.current.uTime = clock.elapsedTime
    shader.current.uPrevTexture = targets.previous.texture

    // Render to the 'current' target
    gl.setRenderTarget(targets.current)
    gl.render(scene, camera)
    gl.setRenderTarget(null) // Reset to default framebuffer

    // Swap the render targets for the next frame
    swapTargets()
    // now update prevPointer for the next frame
    prevPointer.current.copy(pointer)
  })

  return (
    <ScreenQuad>
      <resetDrawingShaderMaterial ref={resetShader} uColour={new Color('#000')} />
      <drawingShaderMaterial
        ref={shader}
        transparent={true}
        uAspect={viewport.aspect}
        uTime={0}
        uIsPointerDown={false}
        uPrevTexture={null}
        uPointers={[]}
      />
    </ScreenQuad>
  )
}

// TODO: support touch force for pressure sensitivity
// https://codesandbox.io/p/sandbox/html-canvas-apple-pencil-3d-touch-api-qr4uq?file=%2Findex.js

'use client'
import { useGSAP } from '@gsap/react'
import { OrthographicCamera, Plane, ScreenQuad, shaderMaterial, Stats, useFBO, useTexture } from '@react-three/drei'
import { Canvas, createPortal, extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, type PropsWithChildren, useMemo, useRef } from 'react'
import { Scene, ShaderMaterial, Texture } from 'three'

import backgroundFragment from './background/background.frag'
import backgroundVertex from './background/background.vert'
import backgroundColour from './background/roof-colour.jpg'
// Create custom shader.d.ts file for .vert and .frag files
import effectsFragment from './effects.frag'
import effectsVertex from './effects.vert'
import imageSequenceFragment from './imageSequence.frag'
import imageSequenceVertex from './imageSequence.vert'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Ensure packages are installed: "npm install @react-three/drei @react-three/fiber three raw-loader glslify-loader glslify glsl-noise glsl-fast-gaussian-blur"

// Setup Next.js config for handling glsl files

// Process
// 0. Look into existing effects composition
// 1. Setup canvas etc.
// 2. Create background shader - see other video
// 3. Create image sequence shader
// 4. Create effects component

const FBOEffectsCanvas: FC = () => (
  <main className="h-[200vh] w-full bg-black font-sans">
    <Canvas
      className="!fixed inset-0"
      gl={{
        alpha: false,
        // Recommended settings for postprocessing performance:
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}>
      <OrthographicCamera makeDefault position={[0, 0, 1]} />
      <CustomEffects>
        <Main />
      </CustomEffects>
      {process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  </main>
)

export default FBOEffectsCanvas

// Background Shader
type BGUniforms = {
  uTime: number
  uAspectRatio: number
  uTextureColour: Texture | null
}
const INITIAL_BG_UNIFORMS: BGUniforms = {
  uTime: 0,
  uAspectRatio: 1,
  uTextureColour: null,
}
const BackgroundShader = shaderMaterial(INITIAL_BG_UNIFORMS, backgroundVertex, backgroundFragment)

// Image Sequence Shader
type ISUniforms = {
  uAspectRatio: number
  uTexture: Texture | null
  uTextureAspect: number
}
const INITIAL_IS_UNIFORMS: ISUniforms = {
  uAspectRatio: 1,
  uTextureAspect: 1,
  uTexture: null,
}
const ImageSequenceShader = shaderMaterial(INITIAL_IS_UNIFORMS, imageSequenceVertex, imageSequenceFragment)

extend({ ImageSequenceShader, BackgroundShader })

// Generate image sequence texture paths
const imgSequenceSrcs: string[] = Array.from(
  { length: 60 },
  (_, i) => `/images/bottle/pragma100${i + 1 < 10 ? `0${i + 1}` : i + 1}.png`,
)

const Main: FC = () => {
  const imageSequenceTextures = useTexture(imgSequenceSrcs) // Array of 60 textures
  let imageSequenceTexture = useRef<Texture | null>(null) // Current texture
  const imageSequenceShader = useRef<ShaderMaterial & Partial<ISUniforms>>(null)

  const backgroundColourTexture = useTexture(backgroundColour.src)
  const backgroundShader = useRef<ShaderMaterial & Partial<BGUniforms>>(null)

  const { viewport } = useThree()

  useGSAP(() => {
    if (!imageSequenceTextures.length) return
    imageSequenceTexture.current = imageSequenceTextures[0]
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: ({ progress }) => {
        const currentTextureIndex = Math.floor(progress * imgSequenceSrcs.length)
        imageSequenceTexture.current = imageSequenceTextures[currentTextureIndex]
      },
    })
  }, [])

  useFrame(({ clock }) => {
    if (!imageSequenceShader.current) return
    if (!backgroundShader.current) return

    imageSequenceShader.current.uTexture = imageSequenceTexture.current
    backgroundShader.current.uTime = clock.elapsedTime
  })

  return (
    <group>
      {/* Background */}
      <Plane args={[viewport.width, viewport.height, 1, 1]}>
        <backgroundShader
          key={BackgroundShader.key}
          ref={backgroundShader}
          uTime={0}
          uAspectRatio={viewport.aspect}
          uTextureColour={backgroundColourTexture}
        />
      </Plane>
      {/* Image Sequence */}
      <Plane args={[viewport.width, viewport.height, 1, 1]}>
        <imageSequenceShader
          key={ImageSequenceShader.key}
          ref={imageSequenceShader}
          uAspectRatio={viewport.aspect}
          uTextureAspect={1920 / 1080}
          uTexture={null}
          transparent={true}
        />
      </Plane>
    </group>
  )
}

type EffectsUniforms = {
  uTime: number
  uResolution: [number, number]
  uSceneTexture: Texture | null
}

const EFFECTS_INITIAL_UNIFORMS: EffectsUniforms = {
  uTime: 0,
  uResolution: [0, 0],
  uSceneTexture: null,
}

const EffectsShader = shaderMaterial(EFFECTS_INITIAL_UNIFORMS, effectsVertex, effectsFragment)

extend({ EffectsShader })

// https://threejs.org/docs/#examples/en/postprocessing/EffectComposer

const CustomEffects: FC<PropsWithChildren> = ({ children }) => {
  const { viewport } = useThree()
  const material = useRef<ShaderMaterial & Partial<EffectsUniforms>>(null)

  const FBOscene = useMemo(() => new Scene(), [])
  const renderTarget = useFBO({ stencilBuffer: false }) // https://drei.docs.pmnd.rs/misc/fbo-use-fbo

  useFrame(({ gl, scene, camera, clock }) => {
    if (!material.current) return

    // Render the FBO scene (offscreen) into the render target
    gl.setRenderTarget(renderTarget)
    gl.render(FBOscene, camera)
    gl.setRenderTarget(null)
    // Update the shader uniforms
    material.current.uSceneTexture = renderTarget.texture
    material.current.uTime = clock.elapsedTime
    // Render the effects scene (default scene) using the effects shader

    gl.render(scene, camera)
  })

  return (
    <>
      {createPortal(children, FBOscene)}
      {/* Uses ScreenQuad for better full screen effects performance */}
      {/* https://drei.docs.pmnd.rs/shapes/screen-quad */}
      <ScreenQuad>
        <effectsShader
          attach="material"
          key={EffectsShader.key}
          ref={material}
          uTime={0}
          uResolution={[viewport.width, viewport.height]}
          uSceneTexture={null}
        />
      </ScreenQuad>
    </>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      backgroundShader: ShaderMaterialProps & BGUniforms
      imageSequenceShader: ShaderMaterialProps & ISUniforms
      effectsShader: ShaderMaterialProps & EffectsUniforms
    }
  }
}

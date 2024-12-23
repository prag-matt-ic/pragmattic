'use client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { createStore, type StoreApi } from 'zustand'

import { ROTATE_DURATION } from '@/components/home/main/torusResources'
import { SceneSection } from '@/resources/home'

export type HomeState = {
  introScrollProgress: { value: number }
  outroScrollProgress: { value: number }

  activeSection: SceneSection | null
  setActiveSection: (activeSection: SceneSection | null) => void

  activeProgressTweens: Record<SceneSection, GSAPTween | null>
  activeProgress: Record<SceneSection, { value: number }>

  rotateTweens: Record<SceneSection, GSAPTween>
  rotateTimescaleTweens: Record<SceneSection, GSAPTween | null>
  rotateAngles: Record<SceneSection, { value: number }>
}

export type HomeStore = StoreApi<HomeState>

export const createHomeStore = (isMobile: boolean) => {
  const rotateAngles: HomeState['rotateAngles'] = {
    [SceneSection.Purpose]: { value: 0 },
    [SceneSection.Design]: { value: 0 },
    [SceneSection.Engineering]: { value: 0 },
  }

  const createRotateTween = (section: SceneSection) =>
    gsap.to(rotateAngles[section], {
      duration: ROTATE_DURATION[section],
      value: Math.PI * 2,
      repeat: -1,
      ease: 'none',
    })

  const initialValues: Omit<HomeState, 'setActiveSection'> = {
    introScrollProgress: {
      value: 0,
    },
    outroScrollProgress: {
      value: 0,
    },
    activeSection: null,
    rotateAngles,
    rotateTweens: {
      [SceneSection.Purpose]: createRotateTween(SceneSection.Purpose),
      [SceneSection.Design]: createRotateTween(SceneSection.Design),
      [SceneSection.Engineering]: createRotateTween(SceneSection.Engineering),
    },
    rotateTimescaleTweens: {
      [SceneSection.Purpose]: null,
      [SceneSection.Design]: null,
      [SceneSection.Engineering]: null,
    },
    activeProgressTweens: {
      [SceneSection.Purpose]: null,
      [SceneSection.Design]: null,
      [SceneSection.Engineering]: null,
    },
    activeProgress: {
      [SceneSection.Purpose]: { value: 0 },
      [SceneSection.Design]: { value: 0 },
      [SceneSection.Engineering]: { value: 0 },
    },
  }

  ScrollTrigger.create({
    start: 0,
    end: 1000,
    scrub: true,
    onUpdate: ({ progress }) => {
      initialValues.introScrollProgress.value = progress
    },
  })

  setTimeout(() => {
    ScrollTrigger.create({
      trigger: '#home-footer',
      start: 'top bottom',
      end: 'max',
      scrub: true,
      onUpdate: ({ progress }) => {
        initialValues.outroScrollProgress.value = progress
      },
    })
  }, 300) // Delay for footer to mount

  const rotateFast = (rotateTween: GSAPTween) => gsap.to(rotateTween, { timeScale: 6, duration: 2 })
  const rotateNormal = (rotateTween: GSAPTween) => gsap.to(rotateTween, { timeScale: 1, duration: 0.5 })

  const activate = (progressValue: { value: number }) =>
    gsap.to(progressValue, {
      duration: 1.2,
      delay: 0.2,
      ease: 'power2.in',
      value: 1,
    })
  const deactivate = (progressValue: { value: number }) =>
    gsap.to(progressValue, {
      duration: 0.7,
      ease: 'power1.out',
      value: 0,
    })

  return createStore<HomeState>()((set, get) => ({
    ...initialValues,
    setActiveSection: (newActiveSection) => {
      const currentActiveSection = get().activeSection
      if (newActiveSection === currentActiveSection) return

      let activeProgressTweens = { ...get().activeProgressTweens }
      let rotateTimescaleTweens = { ...get().rotateTimescaleTweens }

      if (!!currentActiveSection) {
        activeProgressTweens[currentActiveSection]?.kill()
        rotateTimescaleTweens[currentActiveSection]?.kill()
        activeProgressTweens[currentActiveSection] = deactivate(get().activeProgress[currentActiveSection])
        rotateTimescaleTweens[currentActiveSection] = rotateNormal(get().rotateTweens[currentActiveSection])
      }

      if (!newActiveSection) {
        set({
          activeSection: null,
          activeProgressTweens,
          rotateTimescaleTweens,
        })
        return
      }

      activeProgressTweens[newActiveSection] = activate(get().activeProgress[newActiveSection])
      rotateTimescaleTweens[newActiveSection] = rotateFast(get().rotateTweens[newActiveSection])
      set({
        activeSection: newActiveSection,
        activeProgressTweens,
        rotateTimescaleTweens,
      })
    },
  }))
}

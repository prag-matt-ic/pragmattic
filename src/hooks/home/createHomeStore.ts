'use client'
import gsap from 'gsap'
import { createStore, type StoreApi } from 'zustand'

import { ROTATE_DURATION } from '@/components/home/main/torusResources'
import { SceneSection } from '@/resources/home'

export type HomeState = {
  activeSection: SceneSection | null
  setActiveSection: (activeSection: SceneSection | null) => void

  activeProgressTweens: Record<SceneSection, GSAPTween | null>
  activeProgress: Record<SceneSection, { value: number }>

  rotateTweens: Record<SceneSection, GSAPTween>
  rotateTimescaleTween: GSAPTween | null
  rotateAngles: Record<SceneSection, { value: number }>

  allAreActive: boolean
  setAllAreActive: (allAreActive: boolean) => void
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

  const initialValues: Omit<HomeState, 'setActiveSection' | 'setAllAreActive'> = {
    activeSection: null,
    allAreActive: false,
    rotateAngles,
    rotateTweens: {
      [SceneSection.Purpose]: createRotateTween(SceneSection.Purpose),
      [SceneSection.Design]: createRotateTween(SceneSection.Design),
      [SceneSection.Engineering]: createRotateTween(SceneSection.Engineering),
    },
    rotateTimescaleTween: null,
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
  return createStore<HomeState>()((set, get) => ({
    ...initialValues,
    setAllAreActive: (allAreActive) => set({ allAreActive }),
    setActiveSection: (newActiveSection) => {
      const currentActiveSection = get().activeSection
      if (newActiveSection === currentActiveSection) return

      const rotateFast = (rotateTween: GSAPTween) => gsap.to(rotateTween, { timeScale: 4, duration: 1.6 })
      const rotateNormal = (rotateTween: GSAPTween) => gsap.to(rotateTween, { timeScale: 1, duration: 0.6 })

      get().rotateTimescaleTween?.kill()

      if (!newActiveSection) {
        if (!currentActiveSection) return
        get().activeProgressTweens[currentActiveSection]?.kill()
        set({
          activeSection: null,
          activeProgressTweens: {
            ...get().activeProgressTweens,
            [currentActiveSection]: gsap.to(get().activeProgress[currentActiveSection], {
              duration: 0.7,
              ease: 'power1.out',
              value: 0,
            }),
          },
          rotateTimescaleTween: rotateNormal(get().rotateTweens[currentActiveSection]),
        })
      } else {
        set({
          activeSection: newActiveSection,
          activeProgressTweens: {
            ...get().activeProgressTweens,
            [newActiveSection]: gsap.to(get().activeProgress[newActiveSection], {
              duration: 1.2,
              delay: 0.2,
              ease: 'power2.in',
              value: 1,
            }),
          },
          rotateTimescaleTween: rotateFast(get().rotateTweens[newActiveSection]),
        })
      }
    },
  }))
}

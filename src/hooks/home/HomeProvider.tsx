'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { type FC, type PropsWithChildren, useContext, useRef } from 'react'
import { createContext } from 'react'
import { useStore } from 'zustand'

import { createHomeStore, type HomeState, type HomeStore } from './createHomeStore'

export const HomeContext = createContext<HomeStore | null>(null)

type Props = PropsWithChildren<{
  isMobile: boolean
}>

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const HomeProvider: FC<Props> = ({ children, isMobile }) => {
  const store = useRef(createHomeStore(isMobile))
  return <HomeContext.Provider value={store.current}>{children}</HomeContext.Provider>
}

export function useHomeStore<T>(selector: (state: HomeState) => T): T {
  const store = useContext(HomeContext)
  if (!store) throw new Error('useHomeStore must be used within HomeProvider')
  return useStore(store, selector)
}

'use client'
import type { ReactNode } from 'react'
import { create } from 'zustand'

type Store = {
  children: ReactNode
  setChildren: (children: ReactNode) => void
}

const useNavStore = create<Store>((set, get) => ({
  children: null,
  setChildren: (children) => set({ children }),
}))

export default useNavStore

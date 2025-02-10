'use client'
import { create } from 'zustand'

export type BlogNavProps = {
  title: string
}

type Store = {
  blogProps: BlogNavProps | null
  setBlogProps: (props: BlogNavProps | null) => void
}

const useNavStore = create<Store>((set, get) => ({
  blogProps: null,
  setBlogProps: (props) => set({ blogProps: props }),
}))

export default useNavStore

'use client'

import { useState } from 'react'

import Button from '@/components/buttons/Button'
import { SectionId } from '@/components/examples/HomeNav'
import Modal from '@/components/examples/Modal'

export default function ButtonsExample() {
  const [isModalShowing, setIsModalShowing] = useState(false)

  return (
    <main className="w-full bg-black font-sans">
      <section
        id={SectionId.Welcome}
        className="nav-section relative flex h-screen w-full flex-col items-center justify-center gap-10">
        <h2 className="text-3xl font-bold text-white">Next.js Tailwind Buttons</h2>
        <p className="max-w-3xl text-white/80">
          Lightweight buttons which can accept onClick or href props. The buttons are styled using Tailwind CSS and can
          be customised with size, variant, and colour.
        </p>
        <div className="grid grid-cols-3 gap-8">
          {/* Primary */}
          <Button variant="filled" colour="primary" onClick={() => setIsModalShowing(true)}>
            Primary Filled
          </Button>

          <Button variant="outlined" colour="primary" onClick={() => setIsModalShowing(true)}>
            Primary Outlined
          </Button>

          <Button variant="text" colour="primary" onClick={() => setIsModalShowing(true)}>
            Text button
          </Button>

          {/* Secondary */}
          <Button variant="filled" colour="secondary" onClick={() => setIsModalShowing(true)}>
            Filled Button
          </Button>

          <Button variant="outlined" colour="secondary" onClick={() => setIsModalShowing(true)}>
            Open Menu
          </Button>

          <Button variant="text" colour="secondary" onClick={() => setIsModalShowing(true)}>
            Text button
          </Button>
        </div>
      </section>

      <Modal isShowing={isModalShowing} onClose={() => setIsModalShowing(false)} />
    </main>
  )
}

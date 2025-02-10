import { type FC } from 'react'

import BackgroundCanvas from '@/components/backgroundCanvas/BackgroundCanvas'
import Marquee from '@/components/examples/animatedMarquee/Marquee'

const MarqueePage: FC = () => {
  return (
    <>
      <BackgroundCanvas />
      <main className="w-full bg-black font-sans">
        <section className="relative flex h-lvh w-full flex-col justify-center space-y-12 p-20">
          <p className="p-4 text-center text-white/50">Mouse over slows it down!</p>
          <Marquee />
          <Marquee isReversed />
        </section>
      </main>
    </>
  )
}

export default MarqueePage

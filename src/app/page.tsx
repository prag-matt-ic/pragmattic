import dynamic from 'next/dynamic'
import { headers } from 'next/headers'

import CustomCursor from '@/components/Cursor'
import HomeFooter from '@/components/home/HomeFooter'
import HomeHeader from '@/components/home/HomeHeader'
import HomeScrollManager from '@/components/home/HomeScrollManager'
import { HomeProvider } from '@/hooks/home/HomeProvider'

const HomeCanvas = dynamic(() => import('@/components/home/HomeCanvas'), { ssr: false })

export default async function HomePage() {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const isMobile = !!userAgent?.includes('Mobile')

  return (
    <HomeProvider isMobile={isMobile}>
      <main className="w-full overflow-x-hidden bg-black text-white">
        <HomeCanvas isMobile={isMobile} />
        <HomeHeader />
        <div id="purpose-section" className={SECTION_CLASSES} />
        <div id="design-section" className={SECTION_CLASSES} />
        <div id="engineering-section" className={SECTION_CLASSES} />
        <div className={SECTION_CLASSES} />
        <HomeFooter />
        <HomeScrollManager />
      </main>
      <CustomCursor />
    </HomeProvider>
  )
}

const SECTION_CLASSES = 'relative z-10 pointer-events-none h-[1000px] w-full'

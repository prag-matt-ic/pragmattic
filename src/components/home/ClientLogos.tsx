import Image from 'next/image'
import React, { type FC } from 'react'

import ballantinesLogo from '@/assets/icons/clients/ballantines.svg'
import bootsLogo from '@/assets/icons/clients/boots.svg'
import cliniqueLogo from '@/assets/icons/clients/clinique.svg'
import evianLogo from '@/assets/icons/clients/evian.svg'
import levisLogo from '@/assets/icons/clients/levis.svg'

const ClientLogos: FC = () => {
  return (
    <section id="client-logos" className="absolute bottom-8 flex w-full justify-center sm:bottom-12">
      <div className="grid grid-cols-3 items-center justify-items-center gap-5 px-8 text-xs text-light sm:mt-24 sm:flex sm:text-base md:gap-6">
        <span className="">Delivered for</span>
        <Image src={bootsLogo} alt="Boots" className="h-5 md:h-6" />
        <Image src={levisLogo} alt="Levis" className="h-5 md:h-6" />
        <Image src={cliniqueLogo} alt="Clinique" className="h-5 md:h-6" />
        <Image src={evianLogo} alt="Evian" className="h-5 md:h-6" />
        <Image src={ballantinesLogo} alt="Ballantines" className="h-5 md:h-6" />
        <span className="hidden sm:inline-block">and more</span>
      </div>
    </section>
  )
}

export default ClientLogos

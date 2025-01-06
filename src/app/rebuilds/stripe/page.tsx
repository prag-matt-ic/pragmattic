import Image, { type StaticImageData } from 'next/image'
import { type FC } from 'react'
import { twJoin } from 'tailwind-merge'

import airbnbLogo from '@/assets/rebuilds/stripe/airbnb.svg'
import amazonLogo from '@/assets/rebuilds/stripe/amazon.svg'
import anthropicLogo from '@/assets/rebuilds/stripe/anthropic.svg'
import googleLogo from '@/assets/rebuilds/stripe/google.svg'
import marriottLogo from '@/assets/rebuilds/stripe/marriott.svg'
import openAiLogo from '@/assets/rebuilds/stripe/openai.svg'
import phoneImg from '@/assets/rebuilds/stripe/phone.svg'
import shopifyLogo from '@/assets/rebuilds/stripe/shopify.svg'
import urbnLogo from '@/assets/rebuilds/stripe/urbn.svg'
import GLSLCanvas from '@/components/glsl/GLSLCanvas'

// Rebuild of the Stripe home page header using Tailwind CSS and React (November 2024)
// https://stripe.com/gb

export default function StripeHeaderRebuild() {
  const gridWidthClass = 'grid w-full max-w-[1080px]'
  const headerGridClass = `${gridWidthClass} relative grid-cols-1 pb-24 pt-32 md:grid-cols-[max(50%,400px)_1fr]`
  const h1Class = 'text-[min(88px,7vmax)] font-bold leading-[1.1] tracking-tighter text-[#2F2E31]'

  return (
    <>
      <main className="relative min-h-screen w-full overflow-x-hidden bg-white pb-20 text-black">
        {/* Layer beneath the canvas */}
        <div className="pointer-events-none absolute flex h-full w-full flex-col items-center px-5">
          {/* Pinstripe lines created using borders */}
          <div className={twJoin(gridWidthClass, 'absolute h-full grid-cols-2 px-5 md:grid-cols-4 md:px-0')}>
            <div className="size-full border-l-2 border-[#F1F1F1]" />
            <div className="hidden size-full border-l-2 border-r-2 border-dashed border-[#F1F1F1] md:block" />
            <div className="hidden size-full border-r-2 border-dashed border-[#F1F1F1] md:block" />
            <div className="size-full border-r-2 border-[#F1F1F1]" />
          </div>
          {/* heading aligned to the one above */}
          <div className={headerGridClass}>
            <div className="px-4">
              <h1 className={twJoin(h1Class, 'mt-14')}>Financial infrastructure to grow your revenue</h1>
            </div>
          </div>
        </div>

        {/* Background shader */}
        <GLSLCanvas />

        {/* Main content */}
        <div className="relative flex w-full flex-col items-center px-5">
          <header className={headerGridClass}>
            {/* Text section */}
            <div className="space-y-8 sm:px-4">
              <div className="flex h-6 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-black/30 py-0.5 pl-3 pr-2 text-xs font-semibold text-white backdrop-blur">
                Sessions 2025<span className="block pb-1 text-[20px]">•</span>
                <a className="group flex cursor-pointer items-center gap-2 hover:opacity-60">
                  Early-bird registration now open
                  <ArrowIcon />
                </a>
              </div>

              <span className={twJoin(h1Class, 'isolate block mix-blend-color-burn')}>
                Financial infrastructure to grow your revenue
              </span>

              <p className="text-base md:text-lg">
                Join the millions of companies of all sizes that use Stripe to accept payments online and in person,
                embed financial services, power custom revenue models, and build a more profitable business.
              </p>

              <form className="max-w-w-96 relative flex w-full items-center">
                <input
                  type="email"
                  className="relative h-12 w-full rounded-full border border-black/10 bg-[#f6f9fb] py-2 pl-4 pr-32 outline-offset-2 focus:outline-[#4d5ae0]"
                  placeholder="Email address"
                />
                <button
                  type="submit"
                  className="group absolute right-2 flex items-center gap-2.5 rounded-full bg-black py-1 pl-4 pr-2 font-semibold text-white hover:bg-black/70">
                  Start now
                  <ArrowIcon />
                </button>
              </form>
            </div>

            {/* Images section */}
            <div className="absolute bottom-48 left-56 col-start-2 h-[580px] w-[920px] overflow-hidden rounded-2xl bg-white/30 shadow-2xl">
              <div className="ml-56 mt-16 size-full rounded-tl-lg bg-white" />
            </div>
            <div className="relative hidden h-full items-center justify-center md:flex">
              <Image
                src={phoneImg}
                alt="phone"
                width={270}
                height={536}
                className="relative object-contain"
                style={{
                  filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.4))',
                }}
              />
            </div>
          </header>

          <section className={twJoin(gridWidthClass, 'grid-cols-2 place-items-center gap-y-12 py-10 md:grid-cols-4')}>
            {BRAND_LOGOS.map((logos) => (
              <Image src={logos.src} key={logos.name} alt={logos.name} />
            ))}
          </section>
        </div>
      </main>
    </>
  )
}

const ArrowIcon: FC = () => {
  return (
    <svg width="12" height="12" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="2"
        y="34"
        width="56"
        height="11"
        fill="white"
        className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      <path
        d="M27.5104 71L20 63.4896L43.9896 39.5L20 15.5104L27.5104 8L59.0104 39.5L27.5104 71Z"
        fill="white"
        className="-translate-x-2 transition-transform duration-200 group-hover:translate-x-3"
      />
    </svg>
  )
}

const BRAND_LOGOS: { name: string; src: StaticImageData }[] = [
  { name: 'OpenAI', src: openAiLogo },
  { name: 'Amazon', src: amazonLogo },
  { name: 'Google', src: googleLogo },
  { name: 'Anthropic', src: anthropicLogo },
  { name: 'Marriott', src: marriottLogo },
  { name: 'Shopify', src: shopifyLogo },
  { name: 'Airbnb', src: airbnbLogo },
  { name: 'Urbn', src: urbnLogo },
] as const

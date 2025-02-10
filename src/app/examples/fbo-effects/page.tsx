import React from 'react'

import ExampleLayout from '@/components/examples/ExampleLayout'
import EffectsCanvas from '@/components/examples/three/fboEffectShader/FBOEffects'
import { ExamplePathname, EXAMPLES } from '@/resources/navigation'

export const metadata = {
  title: EXAMPLES[ExamplePathname.FBOEffects].title,
  description: EXAMPLES[ExamplePathname.FBOEffects].description,
}

export default function FBOEffectsBasic() {
  return (
    <ExampleLayout {...EXAMPLES[ExamplePathname.FBOEffects]}>
      <main className="h-[200vh] w-full bg-black font-sans">
        <EffectsCanvas />
      </main>
    </ExampleLayout>
  )
}

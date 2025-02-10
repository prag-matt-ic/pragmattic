import React from 'react'

import ExampleLayout from '@/components/examples/ExampleLayout'
import EnergyTransferCanvas from '@/components/examples/three/energyTransfer/EnergyTransfer'
import { ExamplePathname, EXAMPLES } from '@/resources/navigation'

const title = EXAMPLES[ExamplePathname.EnergyTransfer].title
const description = EXAMPLES[ExamplePathname.EnergyTransfer].description

export const metadata = {
  title: title,
  description: description,
}

export default function EnergyTransferPage() {
  return (
    <ExampleLayout {...EXAMPLES[ExamplePathname.EnergyTransfer]}>
      <main className="h-lvh w-full font-sans">
        <EnergyTransferCanvas />
      </main>
    </ExampleLayout>
  )
}

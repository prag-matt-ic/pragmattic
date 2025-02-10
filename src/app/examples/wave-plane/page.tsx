import ExampleLayout from '@/components/examples/ExampleLayout'
import ScrollDownArrow from '@/components/examples/ScrollDown'
import WavePlane from '@/components/examples/three/wavePlane/WavePlane'
import { ExamplePathname, EXAMPLES } from '@/resources/navigation'

// TODO: add metadata to all examples by using dynamic [slug].tsx page
export const metadata = {
  title: EXAMPLES[ExamplePathname.WavePlane].title,
  description: EXAMPLES[ExamplePathname.WavePlane].description,
}

export default function WavePlaneExample() {
  return (
    <ExampleLayout {...EXAMPLES[ExamplePathname.WavePlane]}>
      <main className="h-[1000vh] w-full">
        <WavePlane className="!fixed inset-0" withControls={true} />
        <ScrollDownArrow />
      </main>
    </ExampleLayout>
  )
}

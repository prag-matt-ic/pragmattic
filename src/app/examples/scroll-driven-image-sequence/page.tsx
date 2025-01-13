import BackgroundCanvas from '@/components/backgroundCanvas/BackgroundCanvas'
import ImageSequenceHeader from '@/components/examples/imageSequence/ImageSequenceHeader'

export default function ImageSequenceExample() {
  return (
    <>
      <BackgroundCanvas />
      <main className="w-full bg-black font-sans">
        <ImageSequenceHeader />

        <section className="h-lvh"></section>
      </main>
    </>
  )
}

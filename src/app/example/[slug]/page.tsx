import { type Metadata, type ResolvingMetadata } from 'next'
import React from 'react'

import ExampleLayout from '@/components/examples/ExampleLayout'
import { EXAMPLES_CONTENT, EXAMPLES_METADATA } from '@/resources/examples/examples'
import { ExampleSlug } from '@/resources/pathname'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function generateStaticParams(): string[] {
  return Object.values(ExampleSlug)
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const example = EXAMPLES_METADATA[params.slug as ExampleSlug]
  return {
    title: example.title,
    description: example.description ?? 'Creative development work by Matthew Frawley',
  }
}

export default function ExamplePage({ params }: Props) {
  const Content = EXAMPLES_CONTENT[params.slug as ExampleSlug]
  return (
    <ExampleLayout {...EXAMPLES_METADATA[params.slug as ExampleSlug]}>
      <Content />
    </ExampleLayout>
  )
}

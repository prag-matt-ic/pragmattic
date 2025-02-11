import { type ReactNode } from 'react'

import ExampleNav from '@/components/nav/ExampleNav'
import { ExampleSlug } from '@/resources/pathname'

export default async function ExampleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug as ExampleSlug
  return (
    <>
      {children}
      <ExampleNav slug={slug} />
    </>
  )
}

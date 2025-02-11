import React, { type FC, type PropsWithChildren } from 'react'

import { type Example } from '@/resources/examples/examples'

type Props = PropsWithChildren<Example>

const ExampleLayout: FC<Props> = ({ children, ...example }) => {
  return (
    <>
      <JSONSchema {...example} />
      {children}
    </>
  )
}

export default ExampleLayout

const JSONSchema: FC<Example> = ({ title, description, slug: pathname }) => {
  const url = `https://pragmattic.vercel.app/${pathname}`
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: title, // using "name" instead of "headline" for a generic work
          abstract: description,
          image: 'https://pragmattic.vercel.app/opengraph-image.jpg',
          url: url,
          // Tells search engines that this creative work is the main entity on the page
          mainEntityOfPage: url,
          author: {
            '@type': 'Person',
            givenName: 'Matthew',
            name: 'Matthew Frawley',
            email: 'pragmattic.ltd@gmail.com',
          },
          // TODO: update dates
          datePublished: '2025-02-10',
          dateModified: '2025-02-10',
        }),
      }}
    />
  )
}

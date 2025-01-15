import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import { type HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import infoIcon from '@/assets/icons/info.svg'
import CodeBlock from '@/components/blog/Code'

const getHeadingLinkValues = (props: HTMLAttributes<HTMLHeadingElement>) => {
  const heading = props.children as string
  const id = heading
    .trim()
    .split(' ')
    .join('-')
    .toLowerCase()
    // Remove special characters and numbers
    .replace(/[^a-zA-Z-]/g, '')
  const href = '#' + id
  return { heading, id, href }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: (props) => {
      return (
        <a
          {...props}
          target="_blank"
          rel="noreferrer"
          className="text-mid underline underline-offset-2 hover:text-black"
        />
      )
    },
    h2: (props) => {
      const { id, href, heading } = getHeadingLinkValues(props)
      return (
        <Link id={id} className="blog-heading !no-underline" href={href} data-heading={heading}>
          <h2 {...props}>{props.children}</h2>
        </Link>
      )
    },
    pre: (props) => {
      return <CodeBlock {...props} />
    },
    // Custom components which don't need importing in each MDX file
    Quote: ({ children, author, ...props }) => {
      return (
        <blockquote
          {...props}
          className={twMerge('not-prose my-4 border-l-2 border-light/20 px-4 py-2', props?.className)}>
          <span className="font-medium italic">&quot;{children}&quot;</span>
          {author && <span className="text-mid"> - {author}</span>}
        </blockquote>
      )
    },
    Aside: ({ children, title, ...props }) => {
      return (
        <aside
          {...props}
          className={twMerge(
            'shadow-inner-lg overflow-hidden rounded-md border border-light/10 bg-mid/5 prose-headings:my-2',
            props?.className,
          )}>
          {!!title && (
            <header className="not-prose flex w-full items-center gap-2 bg-mid/5 px-4 py-2">
              <Image src={infoIcon} alt="info" className="!m-0 size-5" />
              <h3 className="!my-0 leading-none text-mid">{title}</h3>
            </header>
          )}
          <div className="px-4">{children}</div>
        </aside>
      )
    },
  }
}

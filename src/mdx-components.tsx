import type { MDXComponents } from 'mdx/types'

import CodeBlock from '@/components/blog/Code'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
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
    pre: (props) => {
      return <CodeBlock {...props} />
    },
    ...components,
  }
}

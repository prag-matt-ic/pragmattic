import type { MDXComponents } from 'mdx/types'

import CodeBlock from '@/components/blog/Code'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => {
      return <CodeBlock {...props} />
    },
  }
}

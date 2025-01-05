/** @type {import('next').NextConfig} */

import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify', 'glslify-loader'],
    })
    return config
  },
}

const options = {
  theme: 'github-dark',
  defaultLang: {
    inline: 'plaintext',
  },
}

// https://rehype-pretty.pages.dev/
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [[rehypePrettyCode, options]],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)

/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify', 'glslify-loader'],
    })
    return config
  },
  redirects: async () => {
    return [
      {
        source: '/blog/:slug*',
        destination: 'https://blog.pragmattic.dev/:slug*',
        permanent: true,
      },
      {
        source: '/example/:slug*',
        destination: 'https://blog.pragmattic.dev/example/:slug*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

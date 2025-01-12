import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/mdx-components.tsx',
  ],
  theme: {
    colors: {
      white: '#F6F6F6',
      green: '#45F1A6',
      'green-alt': '#0DAF69',
      cyan: '#37F3FF',
      light: '#7A718E',
      orange: '#E5A019',
      mid: '#2E2A37',
      'off-black': '#1E1B23',
      black: '#0A090C',
      transparent: 'transparent',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '13px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'xs-h': { raw: '(max-height: 667px)' },
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        '.horizontal-padding': {
          paddingLeft: '24px', // px-6 equivalent
          paddingRight: '24px',
          '@screen md': {
            paddingLeft: '3rem', // md:px-12 equivalent
            paddingRight: '3rem',
          },
          '@screen lg': {
            paddingLeft: '4rem', // lg:px-16 equivalent
            paddingRight: '4rem',
          },
          '@screen xl': {
            paddingLeft: '6rem', // xl:px-24 equivalent
            paddingRight: '6rem',
          },
        },
      }

      addUtilities(newUtilities)
    },
  ],
}
export default config

export enum Pathname {
  Home = '/',
  Blog = '/blog',
  Examples = '/example',
}

export enum BlogSlug {
  WavePlane = 'wave-plane',
  NextJsShaderSetup = 'nextjs-setup-glsl-shaders',
  ImageSequenceHeader = 'scroll-driven-image-sequence-header',
  // AppDevelopmentGuide = 'app-development-guide',
  AnimatedCSSGrid = 'animated-css-grid-with-tailwind-gsap',
}

export enum ExamplePathname {
  ImageSequence = '/examples/scroll-driven-image-sequence',
  ScrollingBackgroundShader = '/examples/scrolling-background-shader',
  ScrollingThreeJs = '/examples/scrolling-three-scene',
  StarsParticles = '/examples/stars-particles',
  FBOEffects = '/examples/fbo-effects',
  InfiniteMarquee = '/examples/infinite-scrolling-marquee',
  WavePlane = '/examples/wave-plane',
  RayMarching = '/examples/raymarching',
  AnimatedCSSGrid = '/examples/animated-css-grid',
  EnergyTransfer = '/examples/three/energy-transfer',
  // Rebuilds
  StripeHeader = '/rebuilds/stripe',
  VercelHeader = '/rebuilds/vercel',
}

export type Example = {
  title: string
  description?: string
  pathname: ExamplePathname
  youtubeUrl?: string
  githubUrl?: string
  blogSlug?: BlogSlug
}

// TODO: add blog links here.
export const EXAMPLES: Record<ExamplePathname, Example> = {
  [ExamplePathname.ImageSequence]: {
    title: 'Scroll-driven image sequence header',
    description: '',
    pathname: ExamplePathname.ImageSequence,
    youtubeUrl: 'https://youtu.be/l8hwkDAr0Eg',
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/imageSequence/ImageSequenceHeader.tsx',
  },
  [ExamplePathname.ScrollingBackgroundShader]: {
    title: 'Magical gradients in a scrolling background shader',
    pathname: ExamplePathname.ScrollingBackgroundShader,
    youtubeUrl: 'https://youtu.be/_YvCZ4I16Vg',
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient.tsx',
  },
  [ExamplePathname.ScrollingThreeJs]: {
    title: 'Scrolling React Three Fiber Scene',
    pathname: ExamplePathname.ScrollingThreeJs,
    youtubeUrl: 'https://youtu.be/1GGe3j59aKQ',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/examples/scrolling-three-scene/page.tsx',
  },
  [ExamplePathname.StarsParticles]: {
    title: 'Stars Wars particles with scrolling text',
    pathname: ExamplePathname.StarsParticles,
    youtubeUrl: 'https://youtu.be/E4XKY-ISKdU',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/examples/stars-particles/page.tsx',
  },
  [ExamplePathname.FBOEffects]: {
    title: 'FBO Effects',
    pathname: ExamplePathname.FBOEffects,
    youtubeUrl: 'https://youtu.be/vJaLN3UMnso',
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/fboEffectShader/FBOEffects.tsx',
  },
  [ExamplePathname.InfiniteMarquee]: {
    title: 'Infinite marquee for logos or icons',
    pathname: ExamplePathname.InfiniteMarquee,
    youtubeUrl: 'https://youtu.be/KLruwdU28bw',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/Marquee.tsx',
  },
  [ExamplePathname.WavePlane]: {
    title: 'ThreeJS Wave Plane',
    pathname: ExamplePathname.WavePlane,
    youtubeUrl: 'https://youtu.be/CepFdiDe3Lw',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/wavePlane/WavePlane.tsx',
    blogSlug: BlogSlug.WavePlane,
  },
  [ExamplePathname.RayMarching]: {
    title: 'GLSL Ray Marching with infinite scroll',
    pathname: ExamplePathname.RayMarching,
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/raymarching/RayMarchingScreenQuad.tsx',
  },
  [ExamplePathname.AnimatedCSSGrid]: {
    title: 'Animated CSS Grid using Tailwind and GSAP',
    pathname: ExamplePathname.AnimatedCSSGrid,
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/animatedCSSGrid/AnimatedCSSGrid.tsx',
  },
  [ExamplePathname.EnergyTransfer]: {
    title: 'Energy Transfer Concept',
    description: `This was inspired by a magnet attraction effect in the thoroughly enjoyable game "It Takes Two"! It's essentially just a cylindrical tunnel, points and two spheres. Each with
      their own vertex and fragment shader. The energy “lines” are spawned in JS with random colour, length and
      duration before being drawn in the cylinder fragment shader. I've been learning that it's much easier to manage animation progress and randomise parameters outside of
      the shader code!`,
    pathname: ExamplePathname.EnergyTransfer,
    githubUrl: '',
  },

  // REBUILDS
  [ExamplePathname.StripeHeader]: {
    title: 'Stripe Header Rebuild',
    pathname: ExamplePathname.StripeHeader,
    youtubeUrl: 'https://youtu.be/fhQuxZJ3YgQ',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/rebuilds/stripe/page.tsx',
  },
  [ExamplePathname.VercelHeader]: {
    title: 'Vercel Header Rebuild',
    pathname: ExamplePathname.VercelHeader,
    youtubeUrl: 'https://youtu.be/M9ifse-uhIs',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/rebuilds/vercel/page.tsx',
  },
} as const

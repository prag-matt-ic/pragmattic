import { type FC } from 'react'

import AnimatedGridPage from '@/components/examples/animatedCSSGrid/AnimatedGridPage'
import MarqueePage from '@/components/examples/animatedMarquee/MarqueePage'
import ImageSequencePage from '@/components/examples/imageSequence/ImageSequenceHeader'
import RayMarchingPage from '@/components/examples/raymarching/RayMarchingPage'
import ScrollingBackgroundShaderPage from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradientPage'
import EnergyTransferCanvas from '@/components/examples/three/energyTransfer/EnergyTransfer'
import FBOEffectsCanvas from '@/components/examples/three/fboEffectShader/FBOEffects'
import LoopPointsCanvas from '@/components/examples/three/loopPoints/LoopPointsCanvas'
import StarWarsPage from '@/components/examples/three/particles/stars/StarWarsPage'
import ScrollingScenePage from '@/components/examples/three/scrollingScene/ScrollingScenePage'
import { WavePlanePage } from '@/components/examples/three/wavePlane/WavePlane'
import { BlogSlug, ExampleSlug } from '@/resources/pathname'
import { TagName } from '@/resources/tags'

export enum RebuildPathname {
  StripeHeader = '/rebuild/stripe',
  VercelHeader = '/rebuild/vercel',
}

export const EXAMPLES_CONTENT: Record<ExampleSlug, FC> = {
  [ExampleSlug.ImageSequence]: ImageSequencePage,
  [ExampleSlug.EnergyTransfer]: EnergyTransferCanvas,
  [ExampleSlug.FBOEffects]: FBOEffectsCanvas,
  [ExampleSlug.WavePlane]: WavePlanePage,
  [ExampleSlug.InfiniteMarquee]: MarqueePage,
  [ExampleSlug.AnimatedCSSGrid]: AnimatedGridPage,
  [ExampleSlug.RayMarching]: RayMarchingPage,
  [ExampleSlug.ScrollingThreeJs]: ScrollingScenePage,
  [ExampleSlug.ScrollingBackgroundShader]: ScrollingBackgroundShaderPage,
  [ExampleSlug.StarsParticles]: StarWarsPage,
  [ExampleSlug.LoopPoints]: LoopPointsCanvas,
}

export type Example = {
  title: string
  description?: string
  tags: TagName[]
  slug: ExampleSlug
  youtubeUrl?: string
  githubUrl?: string
  blogSlug?: BlogSlug
}

export const EXAMPLES_METADATA: Record<ExampleSlug, Example> = {
  [ExampleSlug.ImageSequence]: {
    title: 'Scroll-driven image sequence header',
    description: '',
    tags: [TagName.React, TagName.GSAP, TagName.Tailwind],
    slug: ExampleSlug.ImageSequence,
    blogSlug: BlogSlug.ImageSequenceHeader,
    youtubeUrl: 'https://youtu.be/l8hwkDAr0Eg',
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/imageSequence/ImageSequenceHeader.tsx',
  },
  [ExampleSlug.ScrollingBackgroundShader]: {
    title: 'Magical gradients in a scrolling background shader',
    slug: ExampleSlug.ScrollingBackgroundShader,
    tags: [TagName.NextJS, TagName.FragmentShader, TagName.GSAP],
    youtubeUrl: 'https://youtu.be/_YvCZ4I16Vg',
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient.tsx',
  },
  [ExampleSlug.ScrollingThreeJs]: {
    title: 'Scrolling React Three Fiber Scene',
    slug: ExampleSlug.ScrollingThreeJs,
    tags: [TagName.React, TagName.ThreeJS, TagName.GSAP],
    youtubeUrl: 'https://youtu.be/1GGe3j59aKQ',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/examples/scrolling-three-scene/page.tsx',
  },
  [ExampleSlug.StarsParticles]: {
    title: 'Stars Wars particles with scrolling text',
    slug: ExampleSlug.StarsParticles,
    tags: [TagName.React, TagName.ThreeJS, TagName.Particles, TagName.Tailwind],
    youtubeUrl: 'https://youtu.be/E4XKY-ISKdU',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/examples/stars-particles/page.tsx',
  },
  [ExampleSlug.FBOEffects]: {
    title: 'FBO Effects',
    slug: ExampleSlug.FBOEffects,
    tags: [TagName.PostProcessing, TagName.ThreeJS, TagName.FragmentShader],
    youtubeUrl: 'https://youtu.be/vJaLN3UMnso',
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/fboEffectShader/FBOEffects.tsx',
  },
  [ExampleSlug.InfiniteMarquee]: {
    title: 'Infinite marquee for logos or icons',
    slug: ExampleSlug.InfiniteMarquee,
    tags: [TagName.React, TagName.GSAP, TagName.Tailwind],
    youtubeUrl: 'https://youtu.be/KLruwdU28bw',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/Marquee.tsx',
  },
  [ExampleSlug.WavePlane]: {
    title: 'ThreeJS Wave Plane',
    slug: ExampleSlug.WavePlane,
    tags: [TagName.React, TagName.ThreeJS, TagName.FragmentShader, TagName.VertexShader],
    youtubeUrl: 'https://youtu.be/CepFdiDe3Lw',
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/tree/main/src/components/examples/three/wavePlane',
    blogSlug: BlogSlug.WavePlane,
  },
  [ExampleSlug.RayMarching]: {
    title: 'GLSL Ray Marching with infinite scroll',
    tags: [TagName.FragmentShader, TagName.GSAP],
    slug: ExampleSlug.RayMarching,
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/raymarching/RayMarchingScreenQuad.tsx',
  },
  [ExampleSlug.AnimatedCSSGrid]: {
    title: 'Animated CSS Grid using Tailwind and GSAP',
    tags: [TagName.NextJS, TagName.GSAP, TagName.Responsive, TagName.Tailwind],
    slug: ExampleSlug.AnimatedCSSGrid,
    githubUrl:
      'https://github.com/prag-matt-ic/pragmattic/blob/main/src/components/examples/animatedCSSGrid/AnimatedCSSGrid.tsx',
  },
  [ExampleSlug.EnergyTransfer]: {
    title: 'Energy Transfer',
    description: `This was inspired by a magnet attraction effect in the thoroughly enjoyable game "It Takes Two"! It's essentially just a cylindrical tunnel, points and two spheres. Each with
        their own vertex and fragment shader. The energy “lines” are spawned in JS with random colour, length and
        duration before being drawn in the cylinder fragment shader. I've been learning that it's much easier to manage animation progress and randomise parameters outside of
        the shader code!`,
    tags: [TagName.ThreeJS, TagName.FragmentShader, TagName.VertexShader, TagName.PostProcessing, TagName.Particles],
    slug: ExampleSlug.EnergyTransfer,
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/tree/main/src/components/examples/three/energyTransfer',
  },
  [ExampleSlug.LoopPoints]: {
    title: 'Scatty Loop Points',
    description: `In this example I'm sampling points on the loop mesh and creating a second set of scattered 3D positions. Both position sets are passed into a simulation shader as a data texture. Noise is then applied to animate the positions. Toggling between the two states triggers a GSAP tween on the scattered value, which is used in the simulation shader to mix between the two positions. The output of the simulation is then passed into the points vertex shader to set their positions. The code is written in such a way that any mesh can be used as the basis for points. You could make something pretty cool if you used a scroll trigger to update the scattered value!`,
    tags: [TagName.ThreeJS, TagName.FragmentShader, TagName.VertexShader, TagName.Particles],
    slug: ExampleSlug.LoopPoints,
    githubUrl: 'https://github.com/prag-matt-ic/pragmattic/tree/main/src/components/examples/three/loopPoints',
  },
} as const

//   // REBUILDS
//   [ExamplePathname.StripeHeader]: {
//     title: 'Stripe Header Rebuild',
//     pathname: ExamplePathname.StripeHeader,
//     youtubeUrl: 'https://youtu.be/fhQuxZJ3YgQ',
//     githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/rebuilds/stripe/page.tsx',
//   },
//   [ExamplePathname.VercelHeader]: {
//     title: 'Vercel Header Rebuild',
//     pathname: ExamplePathname.VercelHeader,
//     youtubeUrl: 'https://youtu.be/M9ifse-uhIs',
//     githubUrl: 'https://github.com/prag-matt-ic/pragmattic/blob/main/src/app/rebuilds/vercel/page.tsx',
//   },

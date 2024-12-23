import { MathUtils } from 'three'

import { SceneSection } from '@/resources/home'

const PURPOSE_TORUS_RADIUS = 0.5 as const
const PURPOSE_TORUS_TUBE = 0.08 as const

const DESIGN_TORUS_RADIUS = 0.85 as const
const DESIGN_TORUS_TUBE = 0.08 as const

const ENGINEERING_TORUS_RADIUS = 1.2 as const
const ENGINEERING_TORUS_TUBE = 0.08 as const

const TORUS_ARGS: Record<SceneSection, [number, number, number, number]> = {
  [SceneSection.Purpose]: [PURPOSE_TORUS_RADIUS, PURPOSE_TORUS_TUBE, 10, 32],
  [SceneSection.Design]: [DESIGN_TORUS_RADIUS, DESIGN_TORUS_TUBE, 10, 32 * 2],
  [SceneSection.Engineering]: [ENGINEERING_TORUS_RADIUS, ENGINEERING_TORUS_TUBE, 10, 32 * 3],
}

function getTorusParticlePositions({
  radius,
  tube,
  radialSegments,
  tubularSegments,
}: {
  radius: number
  tube: number
  radialSegments: number
  tubularSegments: number
}): {
  activePositions: Float32Array
  inactivePositions: Float32Array
  scatteredPositions: Float32Array
} {
  const activePositions = []
  const inactivePositions = []
  const scatteredPositions = []

  for (let j = 0; j <= tubularSegments; j++) {
    const u = (j / tubularSegments) * Math.PI * 2
    for (let i = 0; i <= radialSegments; i++) {
      const v = (i / radialSegments) * Math.PI * 2

      const x = (radius + tube * Math.cos(v)) * Math.cos(u)
      const y = (radius + tube * Math.cos(v)) * Math.sin(u)
      const z = tube * Math.sin(v)

      activePositions.push(x, y, z)

      // Spread the particles out
      inactivePositions.push(
        x + (Math.random() - 0.5) * 0.12,
        y + (Math.random() - 0.5) * 0.12,
        z + (Math.random() - 0.5) * 0.12,
      )

      // Create random positions around a sphere
      const distance = 3
      const theta = MathUtils.randFloatSpread(360)
      const phi = MathUtils.randFloatSpread(360)
      scatteredPositions.push(
        distance * Math.sin(theta) * Math.cos(phi),
        distance * Math.sin(theta) * Math.sin(phi),
        distance * Math.cos(theta) + Math.random() * 0.5 - 0.25,
      )
    }
  }

  return {
    activePositions: new Float32Array(activePositions),
    inactivePositions: new Float32Array(inactivePositions),
    scatteredPositions: new Float32Array(scatteredPositions),
  }
}

const TORUS_POINTS_POSITIONS: Record<SceneSection, ReturnType<typeof getTorusParticlePositions>> = {
  [SceneSection.Purpose]: getTorusParticlePositions({
    radius: PURPOSE_TORUS_RADIUS,
    tube: PURPOSE_TORUS_TUBE,
    radialSegments: 6,
    tubularSegments: 16,
  }),
  [SceneSection.Design]: getTorusParticlePositions({
    radius: DESIGN_TORUS_RADIUS,
    tube: DESIGN_TORUS_TUBE,
    radialSegments: 6,
    tubularSegments: 16 * 2,
  }),
  [SceneSection.Engineering]: getTorusParticlePositions({
    radius: ENGINEERING_TORUS_RADIUS,
    tube: ENGINEERING_TORUS_TUBE,
    radialSegments: 6,
    tubularSegments: 16 * 3,
  }),
} as const

const ROTATE_DURATION: Record<SceneSection, number> = {
  [SceneSection.Purpose]: 40,
  [SceneSection.Design]: 50,
  [SceneSection.Engineering]: 60,
} as const

export { TORUS_POINTS_POSITIONS as POINTS_POSITIONS, ROTATE_DURATION, TORUS_ARGS }

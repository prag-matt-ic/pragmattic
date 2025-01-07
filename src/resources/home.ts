import { Color } from 'three'

import { CYAN_VEC3_RGB, GREEN_VEC3_RGB, ORANGE_VEC3_RGB } from './colours'

export enum SceneSection {
  Purpose = 'purpose',
  Design = 'design',
  Engineering = 'engineering',
}

export const SECTION_COLOURS: Record<SceneSection, Color> = {
  [SceneSection.Purpose]: GREEN_VEC3_RGB,
  [SceneSection.Design]: ORANGE_VEC3_RGB,
  [SceneSection.Engineering]: CYAN_VEC3_RGB,
}

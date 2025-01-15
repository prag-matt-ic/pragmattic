import { Color } from 'three'

// const GREEN_VEC3 = new Color('#37FFA8')
// const ORANGE_VEC3 = new Color('#E5A019')
// const CYAN_VEC3 = new Color('#37F3FF')

// const LIGHT_VEC3 = new Color('#7A718E')
// const MID_VEC3 = new Color('#2E2A37')
// const OFF_BLACK_VEC3 = new Color('#1E1B23')
// const BLACK_VEC3 = new Color('#0A090C')

const LIGHT_VEC3_RGB = new Color('#9D97AA').convertLinearToSRGB()
const MID_VEC3_RGB = new Color('#2E2A37').convertLinearToSRGB()
const BLACK_VEC3_RGB = new Color('#0A090C').convertLinearToSRGB()
const OFF_BLACK_VEC3_RGB = new Color('#1E1B23').convertLinearToSRGB()

const GREEN_VEC3_RGB = new Color('#37FFA8').convertLinearToSRGB()
const CYAN_VEC3_RGB = new Color('#37F3FF').convertLinearToSRGB()
const ORANGE_VEC3_RGB = new Color('#E5A019').convertLinearToSRGB()

export {
  // BLACK_VEC3,
  BLACK_VEC3_RGB,
  // CYAN_VEC3,
  CYAN_VEC3_RGB,
  // GREEN_VEC3,
  GREEN_VEC3_RGB,
  // LIGHT_VEC3,
  LIGHT_VEC3_RGB,
  // MID_VEC3,
  MID_VEC3_RGB,
  // OFF_BLACK_VEC3,
  OFF_BLACK_VEC3_RGB,
  // ORANGE_VEC3,
  ORANGE_VEC3_RGB,
}

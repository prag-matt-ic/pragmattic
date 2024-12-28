import { type FC } from 'react'

import { SceneSection } from '@/resources/home'

import FloatingInfo from './FloatingInfo'

type Props = {
  isMobile: boolean
}

const FloatingInfos: FC<Props> = ({ isMobile }) => {
  return (
    <group>
      <FloatingInfo section={SceneSection.Purpose} isMobile={isMobile} />
      <FloatingInfo section={SceneSection.Design} isMobile={isMobile} />
      <FloatingInfo section={SceneSection.Engineering} isMobile={isMobile} />
    </group>
  )
}

export default FloatingInfos

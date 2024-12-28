'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { type FC, useRef } from 'react'
import { Group, PointLight } from 'three'

import { SceneSection } from '@/resources/home'

import Torus from './torus/Torus'
import TorusPoints from './torusPoints/TorusPoints'

type Props = {
  isMobile: boolean
}

const TorusSections: FC<Props> = ({ isMobile }) => {
  const torusGroup = useRef<Group>(null)
  const pointLight = useRef<PointLight>(null)

  useGSAP(
    () => {
      if (!torusGroup.current) return
      gsap.to(torusGroup.current.position, {
        z: 5,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#home-footer',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { dependencies: [] },
  )

  return (
    <group ref={torusGroup} position={isMobile ? [0, 0.5, 0] : [0, 0, 0]}>
      <pointLight ref={pointLight} position={[1.0, 1.7, 0.5]} intensity={5.0} color="#FFF" />
      <Torus section={SceneSection.Purpose} />
      <TorusPoints section={SceneSection.Purpose} />
      <Torus section={SceneSection.Design} />
      <TorusPoints section={SceneSection.Design} />
      <Torus section={SceneSection.Engineering} />
      <TorusPoints section={SceneSection.Engineering} />
    </group>
  )
}

export default TorusSections

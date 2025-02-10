'use client'

import { OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { type FC } from 'react'

import BackdropPlane from '@/components/backgroundCanvas/BackdropPlane'

type Props = {
  className?: string
}

const BackgroundCanvas: FC<Props> = ({ className }) => {
  return (
    <Canvas gl={{ alpha: false, antialias: false }} className="!fixed inset-0">
      <OrthographicCamera makeDefault={true} position={[0, 0, 5]} />
      <BackdropPlane />
    </Canvas>
  )
}

export default BackgroundCanvas

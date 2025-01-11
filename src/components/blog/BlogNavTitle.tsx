'use client'
import React, { type FC, useEffect } from 'react'

import useNavStore from '@/hooks/useNavStore'

type Props = { title: string }

const BlogNavTitle: FC<Props> = ({ title }) => {
  const setNavChildren = useNavStore((s) => s.setChildren)

  useEffect(() => {
    setNavChildren(
      <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-center text-lg font-semibold text-white">
        {title}
      </span>,
    )

    return () => {
      setNavChildren(null)
    }
  }, [setNavChildren, title])

  return <></>
}

export default BlogNavTitle

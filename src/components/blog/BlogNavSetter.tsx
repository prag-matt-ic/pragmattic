'use client'
import React, { type FC, useLayoutEffect } from 'react'

import useNavStore, { type BlogNavProps } from '@/hooks/useNavStore'

type Props = BlogNavProps

const BlogNavSetter: FC<Props> = (props) => {
  const setBlogProps = useNavStore((s) => s.setBlogProps)

  useLayoutEffect(() => {
    setBlogProps(props)

    return () => {
      setBlogProps(null)
    }
  }, [setBlogProps, props])

  return <></>
}

export default BlogNavSetter

import React, { type FC } from 'react'

type Props = {
  name: string
}

const Tag: FC<Props> = ({ name }) => {
  return (
    <span className="rounded-sm bg-black px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wide text-white/70 shadow-sm">
      #{name}
    </span>
  )
}

export default Tag

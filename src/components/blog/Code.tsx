'use client'
import Image from 'next/image'
import { type FC, type HTMLAttributes, type PropsWithChildren, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import copyIcon from '@/assets/icons/content-copy.svg'
import checkIcon from '@/assets/icons/content-copy-check.svg'

const CodeBlock: FC<PropsWithChildren<HTMLAttributes<HTMLPreElement>>> = ({ children, className, ...attributes }) => {
  const pre = useRef<HTMLPreElement>(null)
  const [isCopied, setIsCopied] = useState(false)

  const onCopyClick = async () => {
    try {
      if (!pre.current) throw new Error('No code block found')
      navigator.clipboard.writeText(pre.current.innerText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err)
    }
  }

  return (
    <pre {...attributes} ref={pre} className={twMerge('relative overflow-x-auto bg-off-black', className)}>
      {children}
      <button
        aria-label="Copy code"
        className="group absolute right-2 top-2 z-50 hidden size-8 items-center justify-center rounded border border-white/20 bg-black hover:border-white/50 md:flex"
        onClick={onCopyClick}>
        {isCopied ? (
          <Image src={checkIcon} width={20} height={20} alt="copied" className="m-0 p-0" />
        ) : (
          <Image
            src={copyIcon}
            width={20}
            height={20}
            alt="copy"
            className="m-0 p-0 opacity-60 group-hover:opacity-100"
          />
        )}
      </button>
    </pre>
  )
}
export default CodeBlock

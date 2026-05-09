'use client'

import { useEffect, useState } from 'react'

export default function AnimatedBio({ text }: { text: string }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 320)
    return () => clearTimeout(t)
  }, [])

  const words = text.split(' ')

  return (
    <p className="text-muted text-[0.9375rem] leading-[1.9] max-w-lg" aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="animated-word"
          style={{
            transitionDelay: `${i * 28}ms`,
            opacity: revealed ? 1 : 0,
            filter: revealed ? 'blur(0px)' : 'blur(4px)',
          }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

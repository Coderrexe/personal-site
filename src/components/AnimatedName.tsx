'use client'

import { useEffect, useState } from 'react'

export default function AnimatedName({ name }: { name: string }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <span aria-label={name} className="inline-flex">
      {name.split('').map((char, i) => (
        <span
          key={i}
          className="animated-char"
          style={{
            transitionDelay: `${i * 48}ms`,
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(0.4em)',
            display: char === ' ' ? 'inline' : 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

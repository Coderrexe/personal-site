'use client'

import { useEffect, useState } from 'react'

export default function AnimatedBio({ paragraphs }: { paragraphs: string[] }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 320)
    return () => clearTimeout(t)
  }, [])

  let globalWordIndex = 0

  return (
    <div className="space-y-4 max-w-lg">
      {paragraphs.map((para, pi) => {
        const words = para.split(' ')
        const paraStart = globalWordIndex
        globalWordIndex += words.length

        return (
          <p key={pi} className="text-muted text-[0.9375rem] leading-[1.9]">
            {words.map((word, wi) => (
              <span
                key={wi}
                className="animated-word"
                style={{
                  transitionDelay: `${(paraStart + wi) * 20}ms`,
                  opacity: revealed ? 1 : 0,
                  filter: revealed ? 'blur(0px)' : 'blur(4px)',
                }}
              >
                {word}
                {wi < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

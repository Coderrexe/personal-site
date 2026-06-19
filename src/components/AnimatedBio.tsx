'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useBootReady } from '@/lib/bootContext'

type Paragraph = string | { node: ReactNode; words?: number }

export default function AnimatedBio({ paragraphs }: { paragraphs: Paragraph[] }) {
  const [revealed, setRevealed] = useState(false)
  const { bootReady } = useBootReady()

  useEffect(() => {
    if (!bootReady) return
    const t = setTimeout(() => setRevealed(true), 320)
    return () => clearTimeout(t)
  }, [bootReady])

  let globalWordIndex = 0

  return (
    <div className="space-y-4 max-w-lg">
      {paragraphs.map((para, pi) => {
        if (typeof para !== 'string') {
          const delay = globalWordIndex * 20
          globalWordIndex += para.words ?? 20
          return (
            <p
              key={pi}
              className="text-muted text-[0.9375rem] leading-[1.9]"
              style={{
                opacity: revealed ? 1 : 0,
                filter: revealed ? 'blur(0px)' : 'blur(4px)',
                transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
              }}
            >
              {para.node}
            </p>
          )
        }

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

'use client'

import { useEffect, useState } from 'react'
import { useBootReady } from '@/lib/bootContext'

const NBSP = ' '

export default function AnimatedName({ name }: { name: string }) {
  const { bootReady } = useBootReady()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (!bootReady) return
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [bootReady])

  return (
    <span aria-label={name} className="inline-flex">
      {name.split('').map((c, i) => (
        <span
          key={i}
          className="name-char"
          style={
            animate
              ? { animation: `char-in 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 40}ms backwards` }
              : { opacity: 0 }
          }
        >
          {c === ' ' ? NBSP : c}
        </span>
      ))}
    </span>
  )
}

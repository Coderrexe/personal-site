'use client'

import { useEffect, useRef } from 'react'

// Fades the whole page in once on load (no scroll-triggered reveal).
// Used on the writing pages so every word is on screen after the first paint.
export default function PageFade({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const frame = requestAnimationFrame(() => el.classList.add('visible'))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div ref={ref} className="fade-in">
      {children}
    </div>
  )
}

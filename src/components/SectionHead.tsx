'use client'

import { useEffect, useRef } from 'react'

export default function SectionHead({ index, children }: { index: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('line-visible')
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="section-head">
      <span className="index">{index}</span>
      <span className="title">{children}</span>
      <span className="rule" />
    </div>
  )
}

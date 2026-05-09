'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  baseDelay?: number
  stagger?: number
  className?: string
}

export default function StaggerList({ children, baseDelay = 0, stagger = 60, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const items = React.Children.toArray(children)

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <div
          key={i}
          style={{
            transitionDelay: visible ? `${baseDelay + i * stagger}ms` : '0ms',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

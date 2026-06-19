'use client'

import { useEffect, useRef } from 'react'
import { springStep, SpringState } from '@/lib/spring'

export default function Magnetic({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const spring = useRef<{ x: SpringState; y: SpringState }>({
    x: { value: 0, velocity: 0 },
    y: { value: 0, velocity: 0 },
  })
  const raf = useRef<number>(0)
  const last = useRef(performance.now())

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      target.current = { x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength }
    }
    const onLeave = () => {
      target.current = { x: 0, y: 0 }
    }

    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - last.current) / 1000, 0.05)
      last.current = now
      spring.current.x = springStep(spring.current.x, target.current.x, dt, 220, 20)
      spring.current.y = springStep(spring.current.y, target.current.y, dt, 220, 20)
      el.style.transform = `translate(${spring.current.x.value}px, ${spring.current.y.value}px)`
      raf.current = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    raf.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [strength])

  return (
    <span ref={ref} className="inline-block will-change-transform">
      {children}
    </span>
  )
}

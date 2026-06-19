'use client'

import { useEffect, useRef } from 'react'
import { springStep, SpringState } from '@/lib/spring'

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -100, y: -100 })
  const ringX = useRef<SpringState>({ value: -100, velocity: 0 })
  const ringY = useRef<SpringState>({ value: -100, velocity: 0 })
  const raf = useRef<number>(0)
  const last = useRef(performance.now())

  useEffect(() => {
    const touch = window.matchMedia('(hover: none)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (touch || reduceMotion) return

    document.documentElement.classList.add('cursor-fx-active')
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let visible = false

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
        ringX.current.value = e.clientX
        ringY.current.value = e.clientY
      }
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const onOver = (e: MouseEvent) => {
      const interactive = !!(e.target as Element).closest('a, button, [role="button"], input, textarea')
      ring.classList.toggle('cursor-fx-hover', interactive)
    }

    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - last.current) / 1000, 0.05)
      last.current = now

      ringX.current = springStep(ringX.current, mouse.current.x, dt)
      ringY.current = springStep(ringY.current, mouse.current.y, dt)
      ring.style.transform = `translate(${ringX.current.value}px, ${ringY.current.value}px)`

      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    raf.current = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('cursor-fx-active')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-fx-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-fx-ring" style={{ opacity: 0 }} />
    </>
  )
}

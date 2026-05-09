'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -200, y: -200 })
  const smoothPos = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>(0)
  const hovering = useRef(false)
  const visible = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (!visible.current) {
        visible.current = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
        // Snap ring to cursor on first appearance
        smoothPos.current = { x: e.clientX, y: e.clientY }
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element
      const isInteractive = !!target.closest('a, button, [role="button"]')
      if (isInteractive !== hovering.current) {
        hovering.current = isInteractive
        ring.classList.toggle('cursor-ring--hover', isInteractive)
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      smoothPos.current.x = lerp(smoothPos.current.x, pos.current.x, 0.13)
      smoothPos.current.y = lerp(smoothPos.current.y, pos.current.y, 0.13)

      dot.style.transform = `translate(calc(${pos.current.x}px - 50%), calc(${pos.current.y}px - 50%))`
      ring.style.transform = `translate(calc(${smoothPos.current.x}px - 50%), calc(${smoothPos.current.y}px - 50%))`

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} />
    </>
  )
}

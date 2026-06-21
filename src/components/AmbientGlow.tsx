'use client'

import { useEffect, useRef } from 'react'

/**
 * A soft accent glow that follows the cursor.
 *
 * Critically, this moves a fixed-size element with `translate3d` (a GPU-
 * composited transform — no repaint) instead of repositioning a full-viewport
 * gradient via CSS variables (which forces a full-screen main-thread repaint
 * every frame). The RAF loop also idle-stops once the glow settles, so nothing
 * runs while the pointer is still.
 */
export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef<number>(0)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const running = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const initX = window.innerWidth / 2
    const initY = window.innerHeight * 0.18
    target.current = { x: initX, y: initY }
    current.current = { x: initX, y: initY }
    el.style.transform = `translate3d(${initX}px, ${initY}px, 0)`

    const tick = () => {
      const dx = target.current.x - current.current.x
      const dy = target.current.y - current.current.y
      current.current.x += dx * 0.08
      current.current.y += dy * 0.08
      el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`

      // Idle-stop: once we're within half a pixel of the target, stop the loop.
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        running.current = false
        return
      }
      raf.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running.current) return
      running.current = true
      raf.current = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      start()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return <div ref={ref} className="ambient-glow" aria-hidden />
}

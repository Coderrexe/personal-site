'use client'

import { useEffect, useRef } from 'react'

export default function AmbientGlow() {
  const raf = useRef<number>(0)
  const target = useRef({ x: 50, y: 20 })
  const current = useRef({ x: 50, y: 20 })

  useEffect(() => {
    const root = document.documentElement

    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.06)
      current.current.y = lerp(current.current.y, target.current.y, 0.06)
      root.style.setProperty('--mx', `${current.current.x}%`)
      root.style.setProperty('--my', `${current.current.y}%`)
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return <div className="ambient-glow" aria-hidden />
}

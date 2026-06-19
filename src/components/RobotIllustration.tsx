'use client'

import { useEffect, useRef } from 'react'
import { springStep, SpringState } from '@/lib/spring'

const EYE_L = { cx: 125, cy: 140 }
const EYE_R = { cx: 195, cy: 140 }
const MAX_OFFSET = 5

export default function RobotIllustration() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pupilLRef = useRef<SVGCircleElement>(null)
  const pupilRRef = useRef<SVGCircleElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const gaze = useRef<{ x: SpringState; y: SpringState }>({
    x: { value: 0, velocity: 0 },
    y: { value: 0, velocity: 0 },
  })
  const raf = useRef<number>(0)
  const last = useRef(performance.now())

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      const svg = svgRef.current
      const pupilL = pupilLRef.current
      const pupilR = pupilRRef.current
      if (svg && pupilL && pupilR) {
        const rect = svg.getBoundingClientRect()
        const scaleX = 320 / rect.width
        const scaleY = 320 / rect.height
        const sx = (mouse.current.x - rect.left) * scaleX
        const sy = (mouse.current.y - rect.top) * scaleY

        const cx = (EYE_L.cx + EYE_R.cx) / 2
        const cy = (EYE_L.cy + EYE_R.cy) / 2
        const dx = sx - cx
        const dy = sy - cy
        const dist = Math.min(Math.sqrt(dx * dx + dy * dy), MAX_OFFSET)
        const angle = Math.atan2(dy, dx)
        const targetX = Math.cos(angle) * dist
        const targetY = Math.sin(angle) * dist

        const now = performance.now()
        const dt = Math.min((now - last.current) / 1000, 0.05)
        last.current = now

        gaze.current.x = springStep(gaze.current.x, targetX, dt, 140, 18)
        gaze.current.y = springStep(gaze.current.y, targetY, dt, 140, 18)

        pupilL.setAttribute('cx', String(EYE_L.cx + gaze.current.x.value))
        pupilL.setAttribute('cy', String(EYE_L.cy + gaze.current.y.value))
        pupilR.setAttribute('cx', String(EYE_R.cx + gaze.current.x.value))
        pupilR.setAttribute('cy', String(EYE_R.cy + gaze.current.y.value))
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div className="hero-illustration-wrap w-full h-full">
      <svg
        ref={svgRef}
        className="hero-illustration w-full h-full"
        viewBox="0 0 320 320"
        fill="none"
        strokeWidth="1.6"
        aria-hidden
      >
        {/* head */}
        <rect x="70" y="60" width="180" height="170" rx="34" className="draw" />

        {/* antennae */}
        <line x1="115" y1="60" x2="115" y2="28" className="draw" style={{ animationDelay: '0.1s' }} />
        <line x1="205" y1="60" x2="205" y2="28" className="draw" style={{ animationDelay: '0.15s' }} />
        <circle cx="115" cy="22" r="5" className="pulse-node" style={{ animationDelay: '0.3s' }} />
        <circle cx="205" cy="22" r="5" className="pulse-node" style={{ animationDelay: '0.5s' }} />

        {/* eyes */}
        <circle cx={EYE_L.cx} cy={EYE_L.cy} r="16" className="draw" style={{ animationDelay: '0.5s' }} />
        <circle cx={EYE_R.cx} cy={EYE_R.cy} r="16" className="draw" style={{ animationDelay: '0.6s' }} />
        <circle ref={pupilLRef} cx={EYE_L.cx} cy={EYE_L.cy} r="4" className="pulse-node" style={{ animationDelay: '0.2s' }} />
        <circle ref={pupilRRef} cx={EYE_R.cx} cy={EYE_R.cy} r="4" className="pulse-node" style={{ animationDelay: '0.5s' }} />

        {/* neural brain trace */}
        <line x1="125" y1="140" x2="160" y2="100" className="draw" style={{ animationDelay: '0.7s' }} />
        <line x1="195" y1="140" x2="160" y2="100" className="draw" style={{ animationDelay: '0.75s' }} />
        <circle cx="160" cy="100" r="6" className="pulse-node" style={{ animationDelay: '0.6s' }} />

        {/* speaker grille mouth */}
        <line x1="130" y1="195" x2="130" y2="207" className="draw" style={{ animationDelay: '0.85s' }} />
        <line x1="148" y1="195" x2="148" y2="207" className="draw" style={{ animationDelay: '0.88s' }} />
        <line x1="166" y1="195" x2="166" y2="207" className="draw" style={{ animationDelay: '0.91s' }} />
        <line x1="184" y1="195" x2="184" y2="207" className="draw" style={{ animationDelay: '0.94s' }} />

        {/* ear / port modules */}
        <rect x="50" y="125" width="20" height="34" rx="4" className="draw" style={{ animationDelay: '0.95s' }} />
        <rect x="250" y="125" width="20" height="34" rx="4" className="draw" style={{ animationDelay: '1s' }} />
        <circle cx="60" cy="142" r="2.5" className="pulse-node" style={{ animationDelay: '1.2s' }} />
        <circle cx="260" cy="142" r="2.5" className="pulse-node" style={{ animationDelay: '1.3s' }} />

        {/* shoulders */}
        <line x1="100" y1="230" x2="92" y2="262" className="draw" style={{ animationDelay: '1.05s' }} />
        <line x1="220" y1="230" x2="228" y2="262" className="draw" style={{ animationDelay: '1.1s' }} />
        <line x1="92" y1="262" x2="228" y2="262" className="draw" style={{ animationDelay: '1.2s' }} />
      </svg>
    </div>
  )
}

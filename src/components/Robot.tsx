'use client'

import { useEffect, useRef } from 'react'
import { springStep, SpringState } from '@/lib/spring'

const EYE_L = { cx: 84, cy: 42 }
const EYE_R = { cx: 116, cy: 42 }
const MAX_OFFSET = 3

type Phase = 'drawing' | 'igniting' | 'scripted' | 'live'

export default function Robot({
  playIntro,
  onIntroComplete,
}: {
  playIntro: boolean
  onIntroComplete?: () => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pupilLRef = useRef<SVGCircleElement>(null)
  const pupilRRef = useRef<SVGCircleElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const gaze = useRef<{ x: SpringState; y: SpringState }>({
    x: { value: 0, velocity: 0 },
    y: { value: 0, velocity: 0 },
  })
  const scripted = useRef({ x: 0, y: 0 })
  const phase = useRef<Phase>(playIntro ? 'drawing' : 'live')
  const raf = useRef<number>(0)
  const last = useRef(performance.now())

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const timers: ReturnType<typeof setTimeout>[] = []
    if (playIntro) {
      // phase.current's initial value reflects the very first render, which
      // is always pre-boot (false) by construction — correct it here so the
      // gaze RAF loop doesn't live-track during the silent drawing phase.
      phase.current = 'drawing'
      // eyes ignite after line-art finishes drawing
      timers.push(setTimeout(() => {
        phase.current = 'igniting'
        pupilLRef.current?.classList.add('robot-pupil-lit')
        pupilRRef.current?.classList.add('robot-pupil-lit')
      }, 1700))
      timers.push(setTimeout(() => { phase.current = 'scripted' }, 2000))
      // scripted glance: left, right, center
      timers.push(setTimeout(() => { scripted.current = { x: -MAX_OFFSET, y: 0 } }, 2050))
      timers.push(setTimeout(() => { scripted.current = { x: MAX_OFFSET, y: 0 } }, 2650))
      timers.push(setTimeout(() => { scripted.current = { x: 0, y: 1 } }, 3150))
      timers.push(setTimeout(() => {
        phase.current = 'live'
        onIntroComplete?.()
      }, 3550))
    }

    const tick = () => {
      const svg = svgRef.current
      const pupilL = pupilLRef.current
      const pupilR = pupilRRef.current
      const now = performance.now()
      const dt = Math.min((now - last.current) / 1000, 0.05)
      last.current = now

      if (svg && pupilL && pupilR && phase.current !== 'drawing' && phase.current !== 'igniting') {
        let targetX = 0
        let targetY = 0
        if (phase.current === 'scripted') {
          targetX = scripted.current.x
          targetY = scripted.current.y
        } else {
          const rect = svg.getBoundingClientRect()
          const scaleX = 200 / rect.width
          const scaleY = 420 / rect.height
          const sx = (mouse.current.x - rect.left) * scaleX
          const sy = (mouse.current.y - rect.top) * scaleY
          const cx = (EYE_L.cx + EYE_R.cx) / 2
          const cy = (EYE_L.cy + EYE_R.cy) / 2
          const dx = sx - cx
          const dy = sy - cy
          const dist = Math.min(Math.sqrt(dx * dx + dy * dy), MAX_OFFSET)
          const angle = Math.atan2(dy, dx)
          targetX = Math.cos(angle) * dist
          targetY = Math.sin(angle) * dist
        }

        gaze.current.x = springStep(gaze.current.x, targetX, dt, 130, 16)
        gaze.current.y = springStep(gaze.current.y, targetY, dt, 130, 16)
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
      timers.forEach(clearTimeout)
    }
  }, [playIntro, onIntroComplete])

  // Only the skip-intro (already-booted) case starts lit. The boot case
  // always starts dark — ignition is applied imperatively via classList
  // when the timer fires, never re-derived from a render.
  const eyesLit = !playIntro
  const cls = playIntro ? '' : 'robot-no-anim'

  return (
    <svg
      ref={svgRef}
      className={`robot-svg w-full h-full ${cls}`}
      viewBox="0 0 200 420"
      fill="none"
      strokeWidth="2.2"
      aria-hidden
    >
      {/* head */}
      <rect className="draw" x="68" y="14" width="64" height="56" rx="16" style={{ animationDelay: '0.0s' }} />

      {/* eye sockets */}
      <circle className="draw" cx={EYE_L.cx} cy={EYE_L.cy} r="8" style={{ animationDelay: '0.1s' }} />
      <circle className="draw" cx={EYE_R.cx} cy={EYE_R.cy} r="8" style={{ animationDelay: '0.15s' }} />

      {/* pupils — hidden until ignite */}
      <circle
        ref={pupilLRef}
        cx={EYE_L.cx}
        cy={EYE_L.cy}
        r="3"
        className={`robot-pupil ${eyesLit ? 'robot-pupil-lit' : ''}`}
      />
      <circle
        ref={pupilRRef}
        cx={EYE_R.cx}
        cy={EYE_R.cy}
        r="3"
        className={`robot-pupil ${eyesLit ? 'robot-pupil-lit' : ''}`}
      />

      {/* side sensors */}
      <circle className="pulse-node" cx="64" cy="42" r="3" style={{ animationDelay: '0.2s' }} />
      <circle className="pulse-node" cx="136" cy="42" r="3" style={{ animationDelay: '0.3s' }} />

      {/* mouth grille */}
      <line className="draw" x1="88" y1="60" x2="88" y2="68" style={{ animationDelay: '0.2s' }} />
      <line className="draw" x1="100" y1="60" x2="100" y2="68" style={{ animationDelay: '0.22s' }} />
      <line className="draw" x1="112" y1="60" x2="112" y2="68" style={{ animationDelay: '0.24s' }} />

      {/* neck */}
      <rect className="draw" x="88" y="70" width="24" height="12" style={{ animationDelay: '0.3s' }} />

      {/* torso */}
      <path className="draw" d="M62,82 L138,82 L130,220 L70,220 Z" style={{ animationDelay: '0.35s' }} />

      {/* chest core */}
      <circle className="draw" cx="100" cy="145" r="16" style={{ animationDelay: '0.55s' }} />
      <circle className="pulse-node" cx="100" cy="145" r="4" style={{ animationDelay: '0.7s' }} />

      {/* shoulder joints */}
      <circle className="fade-shape" cx="62" cy="86" r="5" style={{ animationDelay: '0.4s' }} />
      <circle className="fade-shape" cx="138" cy="86" r="5" style={{ animationDelay: '0.42s' }} />

      {/* left arm */}
      <line className="draw" x1="58" y1="90" x2="35" y2="145" style={{ animationDelay: '0.45s' }} />
      <circle className="fade-shape" cx="35" cy="145" r="4" style={{ animationDelay: '0.6s' }} />
      <line className="draw" x1="35" y1="145" x2="26" y2="205" style={{ animationDelay: '0.62s' }} />
      <circle className="fade-shape" cx="26" cy="205" r="6" style={{ animationDelay: '0.8s' }} />

      {/* right arm */}
      <line className="draw" x1="142" y1="90" x2="165" y2="145" style={{ animationDelay: '0.48s' }} />
      <circle className="fade-shape" cx="165" cy="145" r="4" style={{ animationDelay: '0.63s' }} />
      <line className="draw" x1="165" y1="145" x2="174" y2="205" style={{ animationDelay: '0.65s' }} />
      <circle className="fade-shape" cx="174" cy="205" r="6" style={{ animationDelay: '0.82s' }} />

      {/* left leg */}
      <line className="draw" x1="78" y1="222" x2="72" y2="300" style={{ animationDelay: '0.85s' }} />
      <circle className="fade-shape" cx="72" cy="300" r="4" style={{ animationDelay: '1.05s' }} />
      <line className="draw" x1="72" y1="300" x2="68" y2="375" style={{ animationDelay: '1.08s' }} />
      <rect className="fade-shape" x="56" y="373" width="28" height="11" rx="4" style={{ animationDelay: '1.3s' }} />

      {/* right leg */}
      <line className="draw" x1="122" y1="222" x2="128" y2="300" style={{ animationDelay: '0.88s' }} />
      <circle className="fade-shape" cx="128" cy="300" r="4" style={{ animationDelay: '1.07s' }} />
      <line className="draw" x1="128" y1="300" x2="132" y2="375" style={{ animationDelay: '1.1s' }} />
      <rect className="fade-shape" x="116" y="373" width="28" height="11" rx="4" style={{ animationDelay: '1.32s' }} />
    </svg>
  )
}

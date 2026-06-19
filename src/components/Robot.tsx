'use client'

import { useEffect, useRef } from 'react'
import { springStep, SpringState } from '@/lib/spring'

const EYE_L = { cx: 58, cy: 38 }
const EYE_R = { cx: 82, cy: 38 }
const MAX_OFFSET = 2.5

type Phase = 'assembling' | 'igniting' | 'scripted' | 'live'

export default function Robot({
  playIntro,
  onIntroComplete,
}: {
  playIntro: boolean
  onIntroComplete?: () => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const eyeLRef = useRef<SVGCircleElement>(null)
  const eyeRRef = useRef<SVGCircleElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const gaze = useRef<{ x: SpringState; y: SpringState }>({
    x: { value: 0, velocity: 0 },
    y: { value: 0, velocity: 0 },
  })
  const scripted = useRef({ x: 0, y: 0 })
  const phase = useRef<Phase>('live')
  const raf = useRef<number>(0)
  const last = useRef(performance.now())

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const timers: ReturnType<typeof setTimeout>[] = []
    if (playIntro) {
      phase.current = 'assembling'
      timers.push(setTimeout(() => {
        phase.current = 'igniting'
        eyeLRef.current?.classList.add('robot-eye-lit')
        eyeRRef.current?.classList.add('robot-eye-lit')
      }, 850))
      timers.push(setTimeout(() => { phase.current = 'scripted' }, 1000))
      timers.push(setTimeout(() => { scripted.current = { x: -MAX_OFFSET, y: 0 } }, 1020))
      timers.push(setTimeout(() => { scripted.current = { x: MAX_OFFSET, y: 0 } }, 1220))
      timers.push(setTimeout(() => { scripted.current = { x: 0, y: 0 } }, 1420))
      timers.push(setTimeout(() => {
        phase.current = 'live'
        onIntroComplete?.()
      }, 1550))
    }

    const tick = () => {
      const svg = svgRef.current
      const eyeL = eyeLRef.current
      const eyeR = eyeRRef.current
      const now = performance.now()
      const dt = Math.min((now - last.current) / 1000, 0.05)
      last.current = now

      if (svg && eyeL && eyeR && phase.current !== 'assembling' && phase.current !== 'igniting') {
        let targetX = 0
        let targetY = 0
        if (phase.current === 'scripted') {
          targetX = scripted.current.x
          targetY = scripted.current.y
        } else {
          const rect = svg.getBoundingClientRect()
          const scaleX = 140 / rect.width
          const scaleY = 250 / rect.height
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

        gaze.current.x = springStep(gaze.current.x, targetX, dt, 140, 16)
        gaze.current.y = springStep(gaze.current.y, targetY, dt, 140, 16)
        eyeL.setAttribute('cx', String(EYE_L.cx + gaze.current.x.value))
        eyeL.setAttribute('cy', String(EYE_L.cy + gaze.current.y.value))
        eyeR.setAttribute('cx', String(EYE_R.cx + gaze.current.x.value))
        eyeR.setAttribute('cy', String(EYE_R.cy + gaze.current.y.value))
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

  const eyesLit = !playIntro
  const cls = playIntro ? '' : 'robot-no-anim'

  return (
    <svg
      ref={svgRef}
      className={`robot-svg w-full h-full ${cls}`}
      viewBox="0 0 140 250"
      aria-hidden
    >
      {/* torso */}
      <rect className="robot-part" x="35" y="80" width="70" height="88" rx="30" style={{ animationDelay: '0.0s' }} />

      {/* legs */}
      <rect className="robot-part" x="42" y="162" width="24" height="70" rx="12" style={{ animationDelay: '0.08s' }} />
      <rect className="robot-part" x="74" y="162" width="24" height="70" rx="12" style={{ animationDelay: '0.12s' }} />

      {/* feet */}
      <rect className="robot-part" x="36" y="226" width="34" height="11" rx="5" style={{ animationDelay: '0.18s' }} />
      <rect className="robot-part" x="70" y="226" width="34" height="11" rx="5" style={{ animationDelay: '0.21s' }} />

      {/* arms */}
      <rect className="robot-part" x="10" y="84" width="22" height="66" rx="11" transform="rotate(8 21 84)" style={{ animationDelay: '0.25s' }} />
      <rect className="robot-part" x="108" y="84" width="22" height="66" rx="11" transform="rotate(-8 119 84)" style={{ animationDelay: '0.3s' }} />

      {/* head */}
      <rect className="robot-part robot-part-pop" x="42" y="14" width="56" height="50" rx="24" style={{ animationDelay: '0.4s' }} />

      {/* antenna */}
      <line className="robot-part" x1="70" y1="14" x2="70" y2="2" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: '0.55s' }} />
      <circle className="robot-glow" cx="70" cy="2" r="4" style={{ animationDelay: '0.6s' }} />

      {/* chest light */}
      <circle className="robot-glow" cx="70" cy="112" r="7" style={{ animationDelay: '0.68s' }} />

      {/* eyes — hidden until ignite */}
      <circle ref={eyeLRef} cx={EYE_L.cx} cy={EYE_L.cy} r="5" className={`robot-eye ${eyesLit ? 'robot-eye-lit' : ''}`} />
      <circle ref={eyeRRef} cx={EYE_R.cx} cy={EYE_R.cy} r="5" className={`robot-eye ${eyesLit ? 'robot-eye-lit' : ''}`} />
    </svg>
  )
}

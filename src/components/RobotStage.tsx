'use client'

import { useEffect, useRef, useState } from 'react'
import Robot from './Robot'
import { springStep, SpringState } from '@/lib/spring'

const DOCK_MARGIN = 20
const DOCK_HEIGHT = 64 // px, final companion height — small, a corner presence
const NATURAL_W = 140
const NATURAL_H = 250
const BOOT_HEIGHT_CAP_RATIO = 0.32 // boot figure never exceeds ~1/3 of viewport height

interface DockTarget {
  dx: number
  dy: number
  scale: number
}

function computeBootScale(): number {
  const vh = window.innerHeight
  const capped = Math.max(120, Math.min(NATURAL_H, vh * BOOT_HEIGHT_CAP_RATIO))
  return capped / NATURAL_H
}

function computeDockTarget(): DockTarget {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scale = DOCK_HEIGHT / NATURAL_H
  const dockedW = NATURAL_W * scale
  const dockedCenterX = vw - DOCK_MARGIN - dockedW / 2
  const dockedCenterY = vh - DOCK_MARGIN - DOCK_HEIGHT / 2
  return {
    dx: dockedCenterX - vw / 2,
    dy: dockedCenterY - vh / 2,
    scale,
  }
}

export default function RobotStage() {
  const [playIntro, setPlayIntro] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [idle, setIdle] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dockTarget = useRef<DockTarget>({ dx: 0, dy: 0, scale: 0.5 })
  const current = useRef<{ dx: SpringState; dy: SpringState; scale: SpringState }>({
    dx: { value: 0, velocity: 0 },
    dy: { value: 0, velocity: 0 },
    scale: { value: 0.5, velocity: 0 },
  })
  const revealProgress = useRef(0)
  const docking = useRef(false)
  const raf = useRef<number>(0)
  const last = useRef(performance.now())

  const applyTransform = () => {
    const wrap = wrapRef.current
    if (!wrap) return
    const { dx, dy, scale } = current.current
    wrap.style.transform = `translate(-50%, -50%) translate(${dx.value}px, ${dy.value}px) scale(${scale.value})`
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadyBooted = sessionStorage.getItem('booted')
    dockTarget.current = computeDockTarget()

    const onResize = () => { dockTarget.current = computeDockTarget() }
    window.addEventListener('resize', onResize)

    if (reduceMotion || alreadyBooted) {
      sessionStorage.setItem('booted', '1')
      current.current.dx.value = dockTarget.current.dx
      current.current.dy.value = dockTarget.current.dy
      current.current.scale.value = dockTarget.current.scale
      applyTransform()
      setIdle(true)
      return () => window.removeEventListener('resize', onResize)
    }

    sessionStorage.setItem('booted', '1')
    current.current.scale.value = computeBootScale()
    setPlayIntro(true)
    setShowOverlay(true)
    document.body.style.overflow = 'hidden'
    applyTransform()

    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - last.current) / 1000, 0.05)
      last.current = now

      if (docking.current) {
        const t = dockTarget.current
        current.current.dx = springStep(current.current.dx, t.dx, dt, 120, 17)
        current.current.dy = springStep(current.current.dy, t.dy, dt, 120, 17)
        current.current.scale = springStep(current.current.scale, t.scale, dt, 120, 17)
        applyTransform()

        revealProgress.current += dt
        const overlay = overlayRef.current
        if (overlay) {
          const elapsed = revealProgress.current
          const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.75
          const eased = 1 - Math.pow(1 - Math.min(elapsed / 0.7, 1), 3)
          const radius = eased * maxRadius
          const vw = window.innerWidth
          const vh = window.innerHeight
          const cx = vw / 2 + current.current.dx.value
          const cy = vh / 2 + current.current.dy.value
          const inner = Math.max(radius * 0.82, 0)
          const grad = `radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, transparent ${inner}px, black ${radius}px)`
          overlay.style.maskImage = grad
          overlay.style.setProperty('-webkit-mask-image', grad)
        }

        const dxDist = Math.abs(current.current.dx.value - t.dx)
        const dyDist = Math.abs(current.current.dy.value - t.dy)
        if (dxDist < 1 && dyDist < 1 && revealProgress.current > 0.75) {
          document.body.style.overflow = ''
          setShowOverlay(false)
          setIdle(true)
          return
        }
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf.current)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleIntroComplete = () => {
    docking.current = true
  }

  return (
    <>
      {showOverlay && <div ref={overlayRef} className="boot-overlay" aria-hidden />}
      <div
        ref={wrapRef}
        className={`robot-wrap ${idle ? 'robot-idle' : ''}`}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Robot playIntro={playIntro} onIntroComplete={handleIntroComplete} />
      </div>
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Robot from './Robot'
import { pickActiveZone, useRobotDockRegistry, DockZoneEntry } from '@/lib/robotDock'

const NATURAL_W = 140
const NATURAL_H = 232
const FALLBACK_DOCK_HEIGHT = 56
const FALLBACK_MARGIN = 20

interface Target {
  dx: number
  dy: number
  scale: number
}

function computeFallbackTarget(): Target {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scale = FALLBACK_DOCK_HEIGHT / NATURAL_H
  const w = NATURAL_W * scale
  const cx = vw - FALLBACK_MARGIN - w / 2
  const cy = vh - FALLBACK_MARGIN - FALLBACK_DOCK_HEIGHT / 2
  return { dx: cx - vw / 2, dy: cy - vh / 2, scale }
}

function computeZoneTarget(zone: DockZoneEntry): Target {
  const rect = zone.el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scale = zone.size / NATURAL_H
  const w = NATURAL_W * scale
  const cx = Math.min(rect.right - w / 2 - 8, vw - 16 - w / 2)
  const cy = Math.min(Math.max(rect.top + rect.height / 2, vh * 0.18), vh * 0.85)
  return { dx: cx - vw / 2, dy: cy - vh / 2, scale }
}

function computeBootScale(): number {
  const vh = window.innerHeight
  const capped = Math.max(110, Math.min(NATURAL_H, vh * 0.3))
  return capped / NATURAL_H
}

type BootDecision = 'pending' | 'play' | 'skip'

export default function RobotStage() {
  const [bootDecision, setBootDecision] = useState<BootDecision>('pending')
  const [showOverlay, setShowOverlay] = useState(false)
  const [settled, setSettled] = useState(false)
  const [danceNonce, setDanceNonce] = useState(0)
  const { zones } = useRobotDockRegistry()

  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const scaleMv = useMotionValue(0.5)
  const springDx = useSpring(dx, { stiffness: 85, damping: 17 })
  const springDy = useSpring(dy, { stiffness: 85, damping: 17 })
  const springScale = useSpring(scaleMv, { stiffness: 85, damping: 17 })

  const overlayRef = useRef<HTMLDivElement>(null)
  const revealStart = useRef(0)
  const revealRaf = useRef(0)
  const settledGuard = useRef(false)
  const activeZoneId = useRef<string | null>(null)
  const trackingZones = useRef(false)

  const trackToActiveZone = () => {
    if (!trackingZones.current) return
    const zone = pickActiveZone(zones)
    const t = zone ? computeZoneTarget(zone) : computeFallbackTarget()
    dx.set(t.dx)
    dy.set(t.dy)
    scaleMv.set(t.scale)

    const newId = zone ? [...zones.entries()].find(([, e]) => e === zone)?.[0] ?? null : null
    if (newId !== activeZoneId.current) {
      activeZoneId.current = newId
      setDanceNonce(n => n + 1)
    }
  }

  // Scroll/resize-driven retargeting, active once the boot decision is made.
  useEffect(() => {
    if (bootDecision === 'pending') return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(trackToActiveZone)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootDecision])

  // One-time boot decision. Robot is not rendered at all until this
  // resolves — Motion's `initial` prop only evaluates at first mount, so
  // rendering with a placeholder `playIntro` value and changing it later
  // would silently bake in the wrong entrance state.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadyBooted = sessionStorage.getItem('booted')

    if (reduceMotion || alreadyBooted) {
      sessionStorage.setItem('booted', '1')
      trackingZones.current = true
      const zone = pickActiveZone(zones)
      const t = zone ? computeZoneTarget(zone) : computeFallbackTarget()
      dx.set(t.dx)
      dy.set(t.dy)
      scaleMv.set(t.scale)
      springDx.jump(t.dx)
      springDy.jump(t.dy)
      springScale.jump(t.scale)
      settledGuard.current = true
      setSettled(true)
      setBootDecision('skip')
      return
    }

    sessionStorage.setItem('booted', '1')
    scaleMv.set(computeBootScale())
    springScale.jump(computeBootScale())
    setShowOverlay(true)
    document.body.style.overflow = 'hidden'
    setBootDecision('play')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Drives the reveal independently of whether the robot's position is
  // actually changing — a previous version hooked this to the position
  // springs' "change" events, which silently never fired (and left the
  // overlay permanently black) whenever the resting zone happened to be
  // at dead-center already.
  const runReveal = () => {
    const overlay = overlayRef.current
    const elapsed = (performance.now() - revealStart.current) / 1000
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.75
    const eased = 1 - Math.pow(1 - Math.min(elapsed / 0.75, 1), 3)
    const radius = eased * maxRadius
    const cx = window.innerWidth / 2 + springDx.get()
    const cy = window.innerHeight / 2 + springDy.get()
    const inner = Math.max(radius * 0.82, 0)
    if (overlay) {
      const grad = `radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, transparent ${inner}px, black ${radius}px)`
      overlay.style.maskImage = grad
      overlay.style.setProperty('-webkit-mask-image', grad)
    }

    if (elapsed > 0.85) {
      if (!settledGuard.current) {
        settledGuard.current = true
        document.body.style.overflow = ''
        setShowOverlay(false)
        setSettled(true)
        trackingZones.current = true
        trackToActiveZone()
      }
      return
    }
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  const handleIntroComplete = () => {
    revealStart.current = performance.now()
    // Kick the position toward its real resting zone right away, so the
    // reveal-aperture (centered on the robot's current position every
    // frame) and the dock transition happen together, not sequentially.
    trackingZones.current = true
    trackToActiveZone()
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  useEffect(() => () => cancelAnimationFrame(revealRaf.current), [])

  if (bootDecision === 'pending') return null

  return (
    <>
      {showOverlay && <div ref={overlayRef} className="boot-overlay" aria-hidden />}
      <motion.div className="robot-wrap" style={{ x: springDx, y: springDy, scale: springScale }}>
        <motion.div
          key={danceNonce}
          className="w-full h-full"
          animate={danceNonce > 0 ? { rotate: [0, -7, 7, -3, 3, 0] } : undefined}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-full h-full"
            animate={settled ? { y: [0, -6, 0] } : undefined}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Robot key={bootDecision} playIntro={bootDecision === 'play'} onIntroComplete={handleIntroComplete} />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}

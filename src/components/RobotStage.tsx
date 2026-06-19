'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Robot from './Robot'
import { pickActiveZone, useRobotDockRegistry, DockZoneEntry } from '@/lib/robotDock'

const NATURAL_W = 140
const NATURAL_H = 232
const FALLBACK_DOCK_HEIGHT = 56
const FALLBACK_MARGIN = 20
// How long user must stay scrolled into a new zone before robot follows
const ZONE_SWITCH_DEBOUNCE = 450

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
  const capped = Math.max(110, Math.min(NATURAL_H, vh * 0.32))
  return capped / NATURAL_H
}

type BootDecision = 'pending' | 'play' | 'skip'

export default function RobotStage() {
  const [bootDecision, setBootDecision] = useState<BootDecision>('pending')
  const [showOverlay, setShowOverlay] = useState(false)
  const [settled, setSettled] = useState(false)
  const [isTraveling, setIsTraveling] = useState(false)
  const { zones } = useRobotDockRegistry()

  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const scaleMv = useMotionValue(0.5)
  const springDx = useSpring(dx, { stiffness: 80, damping: 18 })
  const springDy = useSpring(dy, { stiffness: 80, damping: 18 })
  const springScale = useSpring(scaleMv, { stiffness: 80, damping: 18 })

  const overlayRef = useRef<HTMLDivElement>(null)
  const revealStart = useRef(0)
  const revealRaf = useRef(0)
  const settledGuard = useRef(false)
  const activeZoneId = useRef<string | null>(null)
  const pendingZoneId = useRef<string | null>(null)
  const trackingZones = useRef(false)
  const travelTimer = useRef<ReturnType<typeof setTimeout>>()
  const zoneSwitchTimer = useRef<ReturnType<typeof setTimeout>>()

  // Immediately move to the best current zone with no debounce.
  // Used during boot reveal and on the skip path.
  const snapToActiveZone = () => {
    const zone = pickActiveZone(zones)
    const t = zone ? computeZoneTarget(zone) : computeFallbackTarget()
    const newId = zone ? ([...zones.entries()].find(([, e]) => e === zone)?.[0] ?? null) : null
    activeZoneId.current = newId
    pendingZoneId.current = newId
    dx.set(t.dx)
    dy.set(t.dy)
    scaleMv.set(t.scale)
  }

  // Debounced — waits ZONE_SWITCH_DEBOUNCE ms before committing to a new zone.
  // This prevents the robot from chasing every pixel of scroll.
  const trackToActiveZone = () => {
    if (!trackingZones.current) return
    const zone = pickActiveZone(zones)
    const newId = zone ? ([...zones.entries()].find(([, e]) => e === zone)?.[0] ?? null) : null

    if (newId === activeZoneId.current) return
    if (newId === pendingZoneId.current) return

    pendingZoneId.current = newId
    clearTimeout(zoneSwitchTimer.current)
    zoneSwitchTimer.current = setTimeout(() => {
      if (newId === activeZoneId.current) return
      activeZoneId.current = newId

      const z = pickActiveZone(zones)
      const t = z ? computeZoneTarget(z) : computeFallbackTarget()
      dx.set(t.dx)
      dy.set(t.dy)
      scaleMv.set(t.scale)

      setIsTraveling(true)
      clearTimeout(travelTimer.current)
      travelTimer.current = setTimeout(() => setIsTraveling(false), 950)
    }, ZONE_SWITCH_DEBOUNCE)
  }

  // Scroll/resize retargeting
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

  // Boot decision — plays every page load (no sessionStorage gate).
  // Robot is not rendered while 'pending' so Motion's `initial` prop always
  // evaluates with the correct, final `playIntro` value.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      trackingZones.current = true
      const zone = pickActiveZone(zones)
      const t = zone ? computeZoneTarget(zone) : computeFallbackTarget()
      dx.set(t.dx); dy.set(t.dy); scaleMv.set(t.scale)
      springDx.jump(t.dx); springDy.jump(t.dy); springScale.jump(t.scale)
      const newId = zone ? ([...zones.entries()].find(([, e]) => e === zone)?.[0] ?? null) : null
      activeZoneId.current = newId; pendingZoneId.current = newId
      settledGuard.current = true
      setSettled(true)
      setBootDecision('skip')
      return
    }

    // Full boot sequence
    scaleMv.set(computeBootScale())
    springScale.jump(computeBootScale())
    setShowOverlay(true)
    document.body.style.overflow = 'hidden'
    setBootDecision('play')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reveal mask — independent RAF loop, not coupled to spring events.
  // The aperture follows the robot's live position every frame, creating
  // the effect of the page opening up from wherever the robot travels to.
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
      }
      return
    }
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  // Called by Robot when the scripted intro animation finishes (~1.6 s after mount).
  // Kick the robot toward its dock zone so the reveal aperture follows it there.
  const handleIntroComplete = () => {
    trackingZones.current = true
    snapToActiveZone()
    revealStart.current = performance.now()
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  useEffect(() => () => {
    cancelAnimationFrame(revealRaf.current)
    clearTimeout(travelTimer.current)
    clearTimeout(zoneSwitchTimer.current)
  }, [])

  if (bootDecision === 'pending') return null

  return (
    <>
      {showOverlay && <div ref={overlayRef} className="boot-overlay" aria-hidden />}
      <motion.div className="robot-wrap" style={{ x: springDx, y: springDy, scale: springScale }}>
        <motion.div
          className="w-full h-full"
          animate={settled && !isTraveling ? { y: [0, -5, 0] } : { y: 0 }}
          transition={{ duration: 5.5, repeat: settled && !isTraveling ? Infinity : 0, ease: 'easeInOut' }}
        >
          <Robot
            key={bootDecision}
            playIntro={bootDecision === 'play'}
            isTraveling={isTraveling}
            onIntroComplete={handleIntroComplete}
          />
        </motion.div>
      </motion.div>
    </>
  )
}

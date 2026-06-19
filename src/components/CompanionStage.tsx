'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Robot from './Robot'

const NATURAL_W = 140
const NATURAL_H = 232
const DISPLAY_SCALE = 0.65      // ~151px tall at rest
const DEFAULT_Y_FRAC = 0.42     // y on non-homepage pages
const WIDE_BREAKPOINT = 1180    // px — narrower uses corner fallback
const SETTLE_DEBOUNCE_MS = 320
const WALK_DURATION_MS = 950
const WALK_THRESHOLD_PX = 40

// y-fraction of viewport height for each homepage .room section (by index)
const ROOM_Y_FRACS = [0.38, 0.46, 0.52, 0.58]

interface Target { dx: number; dy: number; scale: number }

const SPRING_CFG = { stiffness: 190, damping: 28 }

function computeTarget(yFrac: number): Target {
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (vw < WIDE_BREAKPOINT) {
    // Corner fallback: small icon, bottom-right
    const scale = 0.22
    const rw = NATURAL_W * scale
    const rh = NATURAL_H * scale
    return {
      dx: vw / 2 - 12 - rw / 2,
      dy: vh / 2 - 16 - rh / 2,
      scale,
    }
  }

  const scale = DISPLAY_SCALE
  const rw = NATURAL_W * scale

  // Right edge of the 58rem (928px) content column, centered in viewport
  const maxContentPx = 928
  const contentRight = (vw + Math.min(maxContentPx, vw - 48)) / 2
  // Robot center: just right of content, clamped to never overflow viewport
  let cx = contentRight + 14 + rw / 2
  cx = Math.min(cx, vw - 8 - rw / 2)

  return {
    dx: cx - vw / 2,
    dy: vh * yFrac - vh / 2,
    scale,
  }
}

function computeBootTarget(): Target {
  const vh = window.innerHeight
  const scale = Math.min(1, (vh * 0.28) / NATURAL_H)
  return { dx: 0, dy: 0, scale }
}

type BootDecision = 'pending' | 'play' | 'skip'

export default function CompanionStage() {
  const [bootDecision, setBootDecision] = useState<BootDecision>('pending')
  const [showOverlay, setShowOverlay] = useState(false)
  const [settled, setSettled] = useState(false)
  const [walking, setWalking] = useState(false)

  const dxMv = useMotionValue(0)
  const dyMv = useMotionValue(0)
  const scaleMv = useMotionValue(0.5)
  const springDx = useSpring(dxMv, SPRING_CFG)
  const springDy = useSpring(dyMv, SPRING_CFG)
  const springScale = useSpring(scaleMv, SPRING_CFG)

  const walkTimer = useRef<ReturnType<typeof setTimeout>>()
  const trackingRef = useRef(false)
  const activeRoomRef = useRef(-1)
  const overlayRef = useRef<HTMLDivElement>(null)
  const revealStart = useRef(0)
  const revealRaf = useRef(0)
  const settledGuard = useRef(false)
  const settleTimer = useRef<ReturnType<typeof setTimeout>>()
  const reduceMotionRef = useRef(false)

  const moveTo = (t: Target, triggerWalk = true) => {
    const moved =
      !reduceMotionRef.current &&
      triggerWalk &&
      (Math.abs(t.dx - dxMv.get()) > WALK_THRESHOLD_PX ||
        Math.abs(t.dy - dyMv.get()) > WALK_THRESHOLD_PX)
    dxMv.set(t.dx)
    dyMv.set(t.dy)
    scaleMv.set(t.scale)
    if (moved) {
      setWalking(true)
      clearTimeout(walkTimer.current)
      walkTimer.current = setTimeout(() => setWalking(false), WALK_DURATION_MS)
    }
  }

  const jumpTo = (t: Target) => {
    dxMv.set(t.dx); dyMv.set(t.dy); scaleMv.set(t.scale)
    springDx.jump(t.dx); springDy.jump(t.dy); springScale.jump(t.scale)
  }

  // IntersectionObserver: watch .room sections, move on section change
  useEffect(() => {
    if (bootDecision === 'pending') return

    const rooms = Array.from(document.querySelectorAll<HTMLElement>('.room'))

    if (rooms.length === 0) {
      if (trackingRef.current) moveTo(computeTarget(DEFAULT_Y_FRAC))
      return
    }

    const ratios = new Map<Element, number>()

    const pick = () => {
      let bestIdx = 0
      let bestRatio = -1
      rooms.forEach((el, i) => {
        const r = ratios.get(el) ?? 0
        if (r > bestRatio) { bestRatio = r; bestIdx = i }
      })
      activeRoomRef.current = bestIdx
      if (!trackingRef.current) return
      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(() => {
        if (!trackingRef.current) return
        moveTo(computeTarget(ROOM_Y_FRACS[bestIdx] ?? DEFAULT_Y_FRAC))
      }, SETTLE_DEBOUNCE_MS)
    }

    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => ratios.set(e.target, e.intersectionRatio)); pick() },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75] }
    )

    rooms.forEach(el => observer.observe(el))
    return () => { observer.disconnect(); clearTimeout(settleTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootDecision])

  // Resize: reposition without triggering walk animation
  useEffect(() => {
    if (bootDecision === 'pending') return
    const onResize = () => {
      if (!trackingRef.current) return
      const idx = activeRoomRef.current
      moveTo(computeTarget(idx >= 0 ? (ROOM_Y_FRACS[idx] ?? DEFAULT_Y_FRAC) : DEFAULT_Y_FRAC), false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootDecision])

  // Boot decision
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    reduceMotionRef.current = reduceMotion

    if (reduceMotion) {
      trackingRef.current = true
      jumpTo(computeTarget(DEFAULT_Y_FRAC))
      setSettled(true)
      setBootDecision('skip')
      return
    }

    jumpTo(computeBootTarget())
    setShowOverlay(true)
    document.body.style.overflow = 'hidden'
    setBootDecision('play')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        trackingRef.current = true
        // Walk from center to resting position beside the hero
        const roomIdx = Math.max(activeRoomRef.current, 0)
        moveTo(computeTarget(ROOM_Y_FRACS[roomIdx] ?? DEFAULT_Y_FRAC))
      }
      return
    }
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  const handleIntroComplete = () => {
    revealStart.current = performance.now()
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  useEffect(() => () => cancelAnimationFrame(revealRaf.current), [])

  if (bootDecision === 'pending') return null

  return (
    <>
      {showOverlay && <div ref={overlayRef} className="boot-overlay" aria-hidden />}
      <motion.div
        className="companion-wrap"
        style={{
          x: springDx,
          y: springDy,
          scale: springScale,
          width: NATURAL_W,
          height: NATURAL_H,
          marginLeft: -NATURAL_W / 2,
          marginTop: -NATURAL_H / 2,
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={settled ? { y: [0, -5, 0] } : undefined}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Robot
            key={bootDecision}
            playIntro={bootDecision === 'play'}
            walking={walking}
            onIntroComplete={handleIntroComplete}
          />
        </motion.div>
      </motion.div>
    </>
  )
}

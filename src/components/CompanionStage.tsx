'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, MotionValue } from 'motion/react'
import Robot from './Robot'
import Quadruped from './Quadruped'
import RoboticArm from './RoboticArm'
import { pickActiveZone, useRobotDockRegistry, DockZoneEntry, CompanionSlot } from '@/lib/robotDock'

interface Sizing {
  naturalW: number
  naturalH: number
  fallbackDockHeight: number
}

const SIZING: Record<CompanionSlot, Sizing> = {
  humanoid: { naturalW: 140, naturalH: 232, fallbackDockHeight: 56 },
  quadruped: { naturalW: 200, naturalH: 110, fallbackDockHeight: 46 },
  arm: { naturalW: 120, naturalH: 160, fallbackDockHeight: 50 },
}

const FALLBACK_MARGIN = 20
const SETTLE_DEBOUNCE_MS = 220
const WALK_DURATION_MS = 750

interface Target {
  dx: number
  dy: number
  scale: number
}

function computeFallbackTarget(slot: CompanionSlot, index: number): Target {
  const { naturalW, naturalH, fallbackDockHeight } = SIZING[slot]
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scale = fallbackDockHeight / naturalH
  const w = naturalW * scale
  const cx = vw - FALLBACK_MARGIN - w / 2
  const cy = vh - FALLBACK_MARGIN - fallbackDockHeight / 2 - index * (fallbackDockHeight + 14)
  return { dx: cx - vw / 2, dy: cy - vh / 2, scale }
}

function computeZoneTarget(slot: CompanionSlot, zone: DockZoneEntry): Target {
  const { naturalW, naturalH } = SIZING[slot]
  const rect = zone.el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scale = zone.size / naturalH
  const w = naturalW * scale
  const cx = Math.min(rect.right - w / 2 - 8, vw - 16 - w / 2)
  const cy = Math.min(Math.max(rect.top + rect.height / 2, vh * 0.18), vh * 0.85)
  return { dx: cx - vw / 2, dy: cy - vh / 2, scale }
}

function computeBootScale(): number {
  const vh = window.innerHeight
  const capped = Math.max(110, Math.min(SIZING.humanoid.naturalH, vh * 0.3))
  return capped / SIZING.humanoid.naturalH
}

/** One companion's spring-driven position/scale + walk/trot gating. */
function useCompanion(slot: CompanionSlot, fallbackIndex: number) {
  const { zones } = useRobotDockRegistry()
  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const scaleMv = useMotionValue(0.5)
  const springDx = useSpring(dx, { stiffness: 85, damping: 17 })
  const springDy = useSpring(dy, { stiffness: 85, damping: 17 })
  const springScale = useSpring(scaleMv, { stiffness: 85, damping: 17 })
  const [walking, setWalking] = useState(false)
  const walkTimer = useRef<ReturnType<typeof setTimeout>>()
  const trackingRef = useRef(false)

  const retarget = () => {
    if (!trackingRef.current) return
    const zone = pickActiveZone(zones, slot)
    const t = zone ? computeZoneTarget(slot, zone) : computeFallbackTarget(slot, fallbackIndex)
    const moved = Math.abs(t.dx - dx.get()) > 4 || Math.abs(t.dy - dy.get()) > 4
    dx.set(t.dx)
    dy.set(t.dy)
    scaleMv.set(t.scale)
    if (moved) {
      setWalking(true)
      clearTimeout(walkTimer.current)
      walkTimer.current = setTimeout(() => setWalking(false), WALK_DURATION_MS)
    }
  }

  const snapInstantly = () => {
    trackingRef.current = true
    const zone = pickActiveZone(zones, slot)
    const t = zone ? computeZoneTarget(slot, zone) : computeFallbackTarget(slot, fallbackIndex)
    dx.set(t.dx)
    dy.set(t.dy)
    scaleMv.set(t.scale)
    springDx.jump(t.dx)
    springDy.jump(t.dy)
    springScale.jump(t.scale)
  }

  const beginTracking = () => {
    trackingRef.current = true
    retarget()
  }

  /** Instant, un-sprung placement — used to arrange the trio during boot,
   * while they're still hidden behind full darkness. */
  const jumpTo = (t: Target) => {
    dx.set(t.dx)
    dy.set(t.dy)
    scaleMv.set(t.scale)
    springDx.jump(t.dx)
    springDy.jump(t.dy)
    springScale.jump(t.scale)
  }

  return { springDx, springDy, springScale, dx, dy, scaleMv, walking, retarget, snapInstantly, beginTracking, jumpTo }
}

type BootDecision = 'pending' | 'play' | 'skip'

export default function CompanionStage() {
  const [bootDecision, setBootDecision] = useState<BootDecision>('pending')
  const [showOverlay, setShowOverlay] = useState(false)
  const [settled, setSettled] = useState(false)

  const humanoid = useCompanion('humanoid', 0)
  const quadruped = useCompanion('quadruped', 1)
  const arm = useCompanion('arm', 2)

  const overlayRef = useRef<HTMLDivElement>(null)
  const revealStart = useRef(0)
  const revealRaf = useRef(0)
  const settledGuard = useRef(false)
  const settleTimer = useRef<ReturnType<typeof setTimeout>>()

  // Debounced scroll/resize retargeting — only re-evaluate once scrolling
  // has actually paused, so the companions settle deliberately into a spot
  // rather than chasing the viewport on every pixel of scroll.
  useEffect(() => {
    if (bootDecision === 'pending') return
    const onScroll = () => {
      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(() => {
        humanoid.retarget()
        quadruped.retarget()
        arm.retarget()
      }, SETTLE_DEBOUNCE_MS)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(settleTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootDecision])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      humanoid.snapInstantly()
      quadruped.snapInstantly()
      arm.snapInstantly()
      setSettled(true)
      setBootDecision('skip')
      return
    }

    // Arrange the trio in a small cluster for the reveal — humanoid front
    // and center, quadruped and arm just behind/beside it — instead of all
    // three defaulting to the same (0,0) and rendering stacked on top of
    // each other. Hidden behind full darkness until the reveal begins, so
    // no animation is needed here, just correct starting positions.
    const bootScale = computeBootScale()
    humanoid.jumpTo({ dx: 0, dy: 0, scale: bootScale })
    quadruped.jumpTo({ dx: -95, dy: 118, scale: bootScale * 0.62 })
    arm.jumpTo({ dx: 88, dy: 100, scale: bootScale * 0.58 })

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
    const cx = window.innerWidth / 2 + humanoid.springDx.get()
    const cy = window.innerHeight / 2 + humanoid.springDy.get()
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
        humanoid.beginTracking()
        quadruped.beginTracking()
        arm.beginTracking()
      }
      return
    }
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  const handleIntroComplete = () => {
    revealStart.current = performance.now()
    humanoid.beginTracking()
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  useEffect(() => () => cancelAnimationFrame(revealRaf.current), [])

  if (bootDecision === 'pending') return null

  return (
    <>
      {showOverlay && <div ref={overlayRef} className="boot-overlay" aria-hidden />}

      <CompanionWrap x={humanoid.springDx} y={humanoid.springDy} scale={humanoid.springScale} settled={settled} naturalW={140} naturalH={232}>
        <Robot key={bootDecision} playIntro={bootDecision === 'play'} walking={humanoid.walking} onIntroComplete={handleIntroComplete} />
      </CompanionWrap>

      <CompanionWrap x={quadruped.springDx} y={quadruped.springDy} scale={quadruped.springScale} settled={settled} naturalW={200} naturalH={110}>
        <Quadruped playIntro={bootDecision === 'play'} walking={quadruped.walking} />
      </CompanionWrap>

      <CompanionWrap x={arm.springDx} y={arm.springDy} scale={arm.springScale} settled={settled} naturalW={120} naturalH={160}>
        <RoboticArm playIntro={bootDecision === 'play'} />
      </CompanionWrap>
    </>
  )
}

function CompanionWrap({
  x,
  y,
  scale,
  settled,
  naturalW,
  naturalH,
  children,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
  settled: boolean
  naturalW: number
  naturalH: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="companion-wrap"
      style={{
        x,
        y,
        scale,
        width: naturalW,
        height: naturalH,
        marginLeft: -naturalW / 2,
        marginTop: -naturalH / 2,
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={settled ? { y: [0, -6, 0] } : undefined}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

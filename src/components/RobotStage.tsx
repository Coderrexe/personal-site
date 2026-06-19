'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useMotionValueEvent } from 'motion/react'
import Robot from './Robot'

const NATURAL_W = 140
const NATURAL_H = 232
const CONTENT_COLUMN_PX = 690 // approx outer width of the max-w-[42rem] column + padding
const GUTTER_NEEDED_PX = 110
const DOCK_MARGIN = 20

interface DockTarget {
  dx: number
  dy: number
  scale: number
  opacity: number
}

function computeDockTarget(): DockTarget {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gutter = (vw - CONTENT_COLUMN_PX) / 2
  const hasGutter = gutter >= GUTTER_NEEDED_PX

  const dockHeight = hasGutter ? 66 : 46
  const scale = dockHeight / NATURAL_H
  const dockedW = NATURAL_W * scale

  let dockedCenterX: number
  let dockedCenterY: number

  if (hasGutter) {
    // Live in the dead margin beside the text column — never over content.
    dockedCenterX = vw - gutter / 2
    dockedCenterY = Math.max(vh * 0.5, 220)
  } else {
    // No margin to live in — tuck small into a corner, out of the way.
    dockedCenterX = vw - DOCK_MARGIN - dockedW / 2
    dockedCenterY = vh - DOCK_MARGIN - dockHeight / 2
  }

  return {
    dx: dockedCenterX - vw / 2,
    dy: dockedCenterY - vh / 2,
    scale,
    opacity: hasGutter ? 1 : 0.88,
  }
}

function computeBootScale(): number {
  const vh = window.innerHeight
  const capped = Math.max(110, Math.min(NATURAL_H, vh * 0.3))
  return capped / NATURAL_H
}

export default function RobotStage() {
  const [playIntro, setPlayIntro] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [settled, setSettled] = useState(false)

  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const scaleMv = useMotionValue(0.5)
  const opacityMv = useMotionValue(1)
  const springDx = useSpring(dx, { stiffness: 90, damping: 17 })
  const springDy = useSpring(dy, { stiffness: 90, damping: 17 })
  const springScale = useSpring(scaleMv, { stiffness: 90, damping: 17 })

  const overlayRef = useRef<HTMLDivElement>(null)
  const dockTarget = useRef<DockTarget>({ dx: 0, dy: 0, scale: 0.28, opacity: 1 })
  const revealStart = useRef(0)
  const revealing = useRef(false)
  // One-time guard for the reveal-complete check below — distinct from the
  // `settled` state, which exists purely to retrigger a render so the idle
  // float animation can turn on.
  const settledGuard = useRef(false)

  useMotionValueEvent(springDx, 'change', () => updateMaskIfRevealing())
  useMotionValueEvent(springDy, 'change', () => updateMaskIfRevealing())

  const updateMaskIfRevealing = () => {
    if (!revealing.current) return
    const overlay = overlayRef.current
    if (!overlay) return

    const elapsed = (performance.now() - revealStart.current) / 1000
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.75
    const eased = 1 - Math.pow(1 - Math.min(elapsed / 0.75, 1), 3)
    const radius = eased * maxRadius
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cx = vw / 2 + springDx.get()
    const cy = vh / 2 + springDy.get()
    const inner = Math.max(radius * 0.82, 0)
    const grad = `radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, transparent ${inner}px, black ${radius}px)`
    overlay.style.maskImage = grad
    overlay.style.setProperty('-webkit-mask-image', grad)

    if (elapsed > 0.85 && !settledGuard.current) {
      settledGuard.current = true
      revealing.current = false
      document.body.style.overflow = ''
      setShowOverlay(false)
      setSettled(true)
    }
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadyBooted = sessionStorage.getItem('booted')
    dockTarget.current = computeDockTarget()

    const onResize = () => {
      dockTarget.current = computeDockTarget()
      if (!playIntro || settledGuard.current) {
        dx.set(dockTarget.current.dx)
        dy.set(dockTarget.current.dy)
        scaleMv.set(dockTarget.current.scale)
        opacityMv.set(dockTarget.current.opacity)
      }
    }
    window.addEventListener('resize', onResize)

    if (reduceMotion || alreadyBooted) {
      sessionStorage.setItem('booted', '1')
      // Jump the springs themselves — jumping the base values would still
      // leave the derived springs animating from their defaults to the
      // new target, producing an unwanted glide-in for repeat visitors.
      dx.set(dockTarget.current.dx)
      dy.set(dockTarget.current.dy)
      scaleMv.set(dockTarget.current.scale)
      opacityMv.jump(dockTarget.current.opacity)
      springDx.jump(dockTarget.current.dx)
      springDy.jump(dockTarget.current.dy)
      springScale.jump(dockTarget.current.scale)
      settledGuard.current = true
      setSettled(true)
      return () => window.removeEventListener('resize', onResize)
    }

    sessionStorage.setItem('booted', '1')
    scaleMv.set(computeBootScale())
    springScale.jump(computeBootScale())
    setPlayIntro(true)
    setShowOverlay(true)
    document.body.style.overflow = 'hidden'

    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleIntroComplete = () => {
    const t = dockTarget.current
    revealStart.current = performance.now()
    revealing.current = true
    dx.set(t.dx)
    dy.set(t.dy)
    scaleMv.set(t.scale)
    opacityMv.set(t.opacity)
  }

  return (
    <>
      {showOverlay && <div ref={overlayRef} className="boot-overlay" aria-hidden />}
      <motion.div
        className="robot-wrap"
        style={{
          x: springDx,
          y: springDy,
          scale: springScale,
          opacity: opacityMv,
        }}
      >
        {/* Idle float lives on a nested element so it doesn't fight the
            spring-driven position/scale on the outer wrapper. */}
        <motion.div
          className="w-full h-full"
          animate={settled ? { y: [0, -6, 0] } : undefined}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Robot playIntro={playIntro} onIntroComplete={handleIntroComplete} />
        </motion.div>
      </motion.div>
    </>
  )
}

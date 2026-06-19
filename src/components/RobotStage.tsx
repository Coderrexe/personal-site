'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { usePathname } from 'next/navigation'
import Robot from './Robot'
import { pickActiveZone, useRobotDockRegistry, DockZoneEntry } from '@/lib/robotDock'
import { useBootReady } from '@/lib/bootContext'

const NATURAL_W = 140
const NATURAL_H = 232

interface Target { dx: number; dy: number; scale: number }

function computeZoneTarget(zone: DockZoneEntry): Target {
  const rect = zone.el.getBoundingClientRect()
  const vw = window.innerWidth, vh = window.innerHeight
  const scale = zone.size / NATURAL_H
  const w = NATURAL_W * scale
  const cx = Math.min(rect.right - w / 2 - 8, vw - 16 - w / 2)
  const cy = Math.min(Math.max(rect.top + rect.height / 2, vh * 0.18), vh * 0.85)
  return { dx: cx - vw / 2, dy: cy - vh / 2, scale }
}

function computeBootScale(): number {
  const vh = window.innerHeight
  return Math.max(110, Math.min(NATURAL_H, vh * 0.32)) / NATURAL_H
}

type BootDecision = 'pending' | 'play' | 'skip'

export default function RobotStage() {
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  useEffect(() => { pathnameRef.current = pathname }, [pathname])
  const { setBootReady } = useBootReady()

  const [bootDecision, setBootDecision] = useState<BootDecision>('pending')
  const [showOverlay, setShowOverlay] = useState(false)
  const [settled, setSettled] = useState(false)
  const [isTraveling, setIsTraveling] = useState(false)
  // Start visible — overlay covers page during boot; fade to 0 after boot on mobile/other pages
  const [robotOpacity, setRobotOpacity] = useState(1)
  const { zones } = useRobotDockRegistry()

  const dx = useMotionValue(0), dy = useMotionValue(0), scaleMv = useMotionValue(0.5)
  const springDx = useSpring(dx, { stiffness: 95, damping: 17 })
  const springDy = useSpring(dy, { stiffness: 95, damping: 17 })
  const springScale = useSpring(scaleMv, { stiffness: 95, damping: 17 })

  const overlayRef = useRef<HTMLDivElement>(null)
  const revealStart = useRef(0)
  const revealRaf = useRef(0)
  const settledGuard = useRef(false)
  const activeZoneId = useRef<string | null>(null)
  const trackingZones = useRef(false)
  const travelTimer = useRef<ReturnType<typeof setTimeout>>()

  const isDesktop = () => window.innerWidth >= 1024

  // Move robot to a target, optionally triggering leg animation
  const moveTo = (target: Target, running: boolean) => {
    dx.set(target.dx); dy.set(target.dy); scaleMv.set(target.scale)
    if (running) {
      setIsTraveling(true)
      clearTimeout(travelTimer.current)
      travelTimer.current = setTimeout(() => setIsTraveling(false), 900)
    }
  }

  // Called on every scroll / resize frame.
  // Always recomputes the target from the zone's live getBoundingClientRect so
  // the robot tracks the zone's screen position as the user scrolls — this is
  // what makes the robot return to the exact intro-text position when scrolling
  // back to the top.  Running legs only fire when the active zone changes.
  const trackToActiveZone = () => {
    if (!trackingZones.current) return
    const zone = pickActiveZone(zones)
    if (!zone) return
    const newId = [...zones.entries()].find(([, e]) => e === zone)?.[0] ?? null
    const target = computeZoneTarget(zone)

    if (newId !== activeZoneId.current) {
      // Switched to a different zone — animate with running legs
      activeZoneId.current = newId
      moveTo(target, true)
    } else {
      // Same zone, user is still scrolling — silently track its live position
      dx.set(target.dx)
      dy.set(target.dy)
      scaleMv.set(target.scale)
    }
  }

  // Scroll / resize listener
  useEffect(() => {
    if (bootDecision === 'pending') return
    let raf = 0
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(trackToActiveZone) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootDecision])

  // When client-side route changes, show/hide robot
  useEffect(() => {
    if (!settled) return
    if (pathnameRef.current === '/' && isDesktop()) {
      setRobotOpacity(1)
      trackingZones.current = true
      const zone = pickActiveZone(zones)
      if (zone) {
        const newId = [...zones.entries()].find(([, e]) => e === zone)?.[0] ?? null
        if (newId !== activeZoneId.current) { activeZoneId.current = newId; moveTo(computeZoneTarget(zone), false) }
      }
    } else {
      setRobotOpacity(0)
      trackingZones.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, settled])

  // Boot decision — runs on every page load.
  // Boot plays only when the user's first page is the homepage.
  // Other pages (and prefers-reduced-motion) skip straight to settled.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isHomepage = pathnameRef.current === '/'

    if (!isHomepage || reduceMotion) {
      // No boot: settle immediately, robot invisible
      settledGuard.current = true
      setSettled(true)
      setRobotOpacity(0)
      setBootDecision('skip')
      setBootReady(true)
      return
    }

    // Full boot on homepage — plays on both mobile and desktop.
    // After reveal: robot stays visible on desktop, fades on mobile.
    scaleMv.set(computeBootScale())
    springScale.jump(computeBootScale())
    setShowOverlay(true)
    document.body.style.overflow = 'hidden'
    setBootDecision('play')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reveal mask RAF — drives the aperture independently of spring motion
  const runReveal = () => {
    const overlay = overlayRef.current
    const elapsed = (performance.now() - revealStart.current) / 1000
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.75
    const eased = 1 - Math.pow(1 - Math.min(elapsed / 1.1, 1), 3)
    const radius = eased * maxRadius
    const cx = window.innerWidth / 2 + springDx.get()
    const cy = window.innerHeight / 2 + springDy.get()
    const inner = Math.max(radius * 0.82, 0)
    if (overlay) {
      const grad = `radial-gradient(circle at ${cx}px ${cy}px, transparent 0px, transparent ${inner}px, black ${radius}px)`
      overlay.style.maskImage = grad
      overlay.style.setProperty('-webkit-mask-image', grad)
    }
    if (elapsed > 1.25) {
      if (!settledGuard.current) {
        settledGuard.current = true
        document.body.style.overflow = ''
        setShowOverlay(false)
        setSettled(true)
        setBootReady(true)
        // Hide robot on mobile after boot
        if (!isDesktop()) {
          setRobotOpacity(0)
          trackingZones.current = false
        }
      }
      return
    }
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  // Called by Robot when its scripted intro finishes (~1.6 s)
  const handleIntroComplete = () => {
    if (isDesktop()) {
      // Run to dock zone — legs animate, aperture follows
      trackingZones.current = true
      const zone = pickActiveZone(zones)
      if (zone) {
        activeZoneId.current = [...zones.entries()].find(([, e]) => e === zone)?.[0] ?? null
        moveTo(computeZoneTarget(zone), true)
      }
    }
    revealStart.current = performance.now()
    revealRaf.current = requestAnimationFrame(runReveal)
  }

  useEffect(() => () => {
    cancelAnimationFrame(revealRaf.current)
    clearTimeout(travelTimer.current)
  }, [])

  if (bootDecision === 'pending') return null

  return (
    <>
      {showOverlay && <div ref={overlayRef} className="boot-overlay" aria-hidden />}
      <motion.div
        className="robot-wrap"
        style={{ x: springDx, y: springDy, scale: springScale }}
        animate={{ opacity: robotOpacity }}
        transition={{ opacity: { duration: 0.5, ease: 'easeOut' } }}
      >
        <motion.div
          className="w-full h-full"
          animate={settled && !isTraveling && robotOpacity > 0 ? { y: [0, -5, 0] } : { y: 0 }}
          transition={{
            duration: 5.5,
            repeat: settled && !isTraveling && robotOpacity > 0 ? Infinity : 0,
            ease: 'easeInOut',
          }}
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

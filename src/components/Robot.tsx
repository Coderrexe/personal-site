'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, MotionValue, Variants } from 'motion/react'

// Head proportions adapted from Lucide's open-source "bot" icon
// (github.com/lucide-icons/lucide, ISC license) — a proven, legible
// robot-face glyph — rather than hand-guessed geometry.
const EYE_L = { cx: 58, cy: 53 }
const EYE_R = { cx: 82, cy: 53 }
const MAX_OFFSET = 3

const partVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

interface RobotProps {
  playIntro: boolean
  onIntroComplete?: () => void
}

export default function Robot({ playIntro, onIntroComplete }: RobotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const gazeX = useSpring(0, { stiffness: 120, damping: 14 })
  const gazeY = useSpring(0, { stiffness: 120, damping: 14 })
  const scriptedActive = useRef(false)

  const eyeLCx = useTransform(gazeX, v => EYE_L.cx + v)
  const eyeLCy = useTransform(gazeY, v => EYE_L.cy + v)
  const eyeRCx = useTransform(gazeX, v => EYE_R.cx + v)
  const eyeRCy = useTransform(gazeY, v => EYE_R.cy + v)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (scriptedActive.current) return
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      if (rect.width === 0) return
      const scaleX = 140 / rect.width
      const scaleY = 232 / rect.height
      const sx = (e.clientX - rect.left) * scaleX
      const sy = (e.clientY - rect.top) * scaleY
      const cx = (EYE_L.cx + EYE_R.cx) / 2
      const cy = (EYE_L.cy + EYE_R.cy) / 2
      const dx = sx - cx
      const dy = sy - cy
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), MAX_OFFSET)
      const angle = Math.atan2(dy, dx)
      gazeX.set(Math.cos(angle) * dist)
      gazeY.set(Math.sin(angle) * dist)
    }
    window.addEventListener('mousemove', onMove)

    const timers: ReturnType<typeof setTimeout>[] = []
    if (playIntro) {
      scriptedActive.current = true
      timers.push(setTimeout(() => { gazeX.set(-MAX_OFFSET); gazeY.set(0) }, 950))
      timers.push(setTimeout(() => { gazeX.set(MAX_OFFSET); gazeY.set(0) }, 1180))
      timers.push(setTimeout(() => { gazeX.set(0); gazeY.set(0) }, 1410))
      timers.push(setTimeout(() => {
        scriptedActive.current = false
        onIntroComplete?.()
      }, 1600))
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playIntro])

  return (
    <motion.svg
      ref={svgRef}
      className="w-full h-full"
      viewBox="0 0 140 232"
      initial={playIntro ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      aria-hidden
    >
      {/* torso */}
      <motion.rect variants={partVariants} x="39" y="82" width="62" height="76" rx="26" fill="var(--fg)" />

      {/* legs */}
      <motion.rect variants={partVariants} x="46" y="156" width="22" height="60" rx="11" fill="var(--fg)" />
      <motion.rect variants={partVariants} x="72" y="156" width="22" height="60" rx="11" fill="var(--fg)" />

      {/* feet */}
      <motion.rect variants={partVariants} x="41" y="210" width="32" height="10" rx="5" fill="var(--fg)" />
      <motion.rect variants={partVariants} x="67" y="210" width="32" height="10" rx="5" fill="var(--fg)" />

      {/* arms */}
      <motion.rect variants={partVariants} x="12" y="86" width="20" height="58" rx="10" fill="var(--fg)" transform="rotate(8 22 86)" />
      <motion.rect variants={partVariants} x="108" y="86" width="20" height="58" rx="10" fill="var(--fg)" transform="rotate(-8 118 86)" />

      {/* head (Lucide bot-icon proportions) */}
      <motion.rect variants={partVariants} x="34" y="20" width="72" height="54" rx="14" fill="var(--fg)" />
      <motion.rect variants={partVariants} x="22" y="40" width="12" height="18" rx="6" fill="var(--fg)" />
      <motion.rect variants={partVariants} x="106" y="40" width="12" height="18" rx="6" fill="var(--fg)" />

      {/* antenna */}
      <motion.line variants={partVariants} x1="70" y1="20" x2="70" y2="4" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" />
      <RobotGlow variants={partVariants} cx={70} cy={4} r={4.5} />

      {/* chest light */}
      <RobotGlow variants={partVariants} cx={70} cy={118} r={7} />

      {/* eyes */}
      <EyeIgnite playIntro={playIntro} cx={eyeLCx} cy={eyeLCy} />
      <EyeIgnite playIntro={playIntro} cx={eyeRCx} cy={eyeRCy} />
    </motion.svg>
  )
}

function RobotGlow({ variants, cx, cy, r }: { variants: Variants; cx: number; cy: number; r: number }) {
  // Outer group handles the one-time pop-in via the parent's stagger
  // (variants). Inner circle runs its own continuous pulse independently —
  // mixing `variants` and an explicit `animate` on the same element makes
  // Motion drop the inherited stagger entirely, so the two are split.
  return (
    <motion.g variants={variants}>
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="var(--accent)"
        animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.3, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
    </motion.g>
  )
}

function EyeIgnite({
  playIntro,
  cx,
  cy,
}: {
  playIntro: boolean
  cx: MotionValue<number>
  cy: MotionValue<number>
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="6"
      fill="var(--accent)"
      style={{ filter: 'drop-shadow(0 0 3px var(--accent))' }}
      initial={playIntro ? { opacity: 0, scale: 0.2 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: playIntro ? 0.85 : 0 }}
    />
  )
}

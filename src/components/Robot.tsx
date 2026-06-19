'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, MotionValue, Variants } from 'motion/react'

// Head proportions adapted from Lucide's open-source "bot" icon
// (github.com/lucide-icons/lucide, ISC license) — a proven, legible
// robot-face glyph — rather than hand-guessed geometry.
const VISOR = { left: 52, right: 88, cy: 52 }
const MAX_OFFSET = (VISOR.right - VISOR.left) / 2 - 5

const BODY_STROKE = { stroke: 'var(--accent)', strokeWidth: 1, strokeOpacity: 0.35 }

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
  const scriptedActive = useRef(false)

  const highlightCx = useTransform(gazeX, v => (VISOR.left + VISOR.right) / 2 + v)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (scriptedActive.current) return
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      if (rect.width === 0) return
      const scaleX = 140 / rect.width
      const sx = (e.clientX - rect.left) * scaleX
      const center = (VISOR.left + VISOR.right) / 2
      const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, sx - center))
      gazeX.set(offset)
    }
    window.addEventListener('mousemove', onMove)

    const timers: ReturnType<typeof setTimeout>[] = []
    if (playIntro) {
      scriptedActive.current = true
      timers.push(setTimeout(() => gazeX.set(-MAX_OFFSET), 950))
      timers.push(setTimeout(() => gazeX.set(MAX_OFFSET), 1180))
      timers.push(setTimeout(() => gazeX.set(0), 1410))
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
      <motion.rect variants={partVariants} x="39" y="82" width="62" height="76" rx="26" fill="var(--fg)" {...BODY_STROKE} />

      {/* legs */}
      <motion.rect variants={partVariants} x="46" y="156" width="22" height="60" rx="11" fill="var(--fg)" {...BODY_STROKE} />
      <motion.rect variants={partVariants} x="72" y="156" width="22" height="60" rx="11" fill="var(--fg)" {...BODY_STROKE} />

      {/* feet */}
      <motion.rect variants={partVariants} x="41" y="210" width="32" height="10" rx="5" fill="var(--fg)" {...BODY_STROKE} />
      <motion.rect variants={partVariants} x="67" y="210" width="32" height="10" rx="5" fill="var(--fg)" {...BODY_STROKE} />

      {/* arms */}
      <motion.rect variants={partVariants} x="12" y="86" width="20" height="58" rx="10" fill="var(--fg)" transform="rotate(8 22 86)" {...BODY_STROKE} />
      <motion.rect variants={partVariants} x="108" y="86" width="20" height="58" rx="10" fill="var(--fg)" transform="rotate(-8 118 86)" {...BODY_STROKE} />

      {/* shoulder + hip joint highlights */}
      <JointGlow variants={partVariants} cx={22} cy={86} r={3} />
      <JointGlow variants={partVariants} cx={118} cy={86} r={3} />
      <JointGlow variants={partVariants} cx={57} cy={158} r={2.5} />
      <JointGlow variants={partVariants} cx={83} cy={158} r={2.5} />

      {/* head (Lucide bot-icon proportions) */}
      <motion.rect variants={partVariants} x="34" y="20" width="72" height="54" rx="14" fill="var(--fg)" {...BODY_STROKE} />
      <motion.rect variants={partVariants} x="22" y="40" width="12" height="18" rx="6" fill="var(--fg)" {...BODY_STROKE} />
      <motion.rect variants={partVariants} x="106" y="40" width="12" height="18" rx="6" fill="var(--fg)" {...BODY_STROKE} />

      {/* antenna */}
      <motion.line variants={partVariants} x1="70" y1="20" x2="70" y2="4" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" />
      <JointGlow variants={partVariants} cx={70} cy={4} r={4.5} pulse />

      {/* chest light */}
      <JointGlow variants={partVariants} cx={70} cy={118} r={7} pulse />

      {/* visor — replaces dot eyes with an Iron-Man-style HUD slit */}
      <Visor playIntro={playIntro} highlightCx={highlightCx} />
    </motion.svg>
  )
}

function JointGlow({
  variants,
  cx,
  cy,
  r,
  pulse = false,
}: {
  variants: Variants
  cx: number
  cy: number
  r: number
  pulse?: boolean
}) {
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
        animate={pulse ? { opacity: [0.55, 1, 0.55], scale: [1, 1.3, 1] } : undefined}
        transition={pulse ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } : undefined}
        style={{ transformOrigin: `${cx}px ${cy}px`, opacity: pulse ? undefined : 0.9 }}
      />
    </motion.g>
  )
}

function Visor({
  playIntro,
  highlightCx,
}: {
  playIntro: boolean
  highlightCx: MotionValue<number>
}) {
  return (
    <>
      <motion.rect
        x={VISOR.left}
        y={VISOR.cy - 6}
        width={VISOR.right - VISOR.left}
        height={12}
        rx={6}
        fill="var(--bg)"
        initial={playIntro ? { opacity: 0, scaleX: 0.2 } : { opacity: 1, scaleX: 1 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: playIntro ? 0.78 : 0 }}
        style={{ transformOrigin: `${(VISOR.left + VISOR.right) / 2}px ${VISOR.cy}px` }}
      />
      <motion.circle
        cx={highlightCx}
        cy={VISOR.cy}
        r="4.5"
        fill="var(--accent)"
        style={{ filter: 'drop-shadow(0 0 4px var(--accent))' }}
        initial={playIntro ? { opacity: 0, scale: 0.2 } : { opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: playIntro ? 0.95 : 0 }}
      />
    </>
  )
}

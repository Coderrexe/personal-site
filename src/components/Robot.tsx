'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, MotionValue, Variants } from 'motion/react'

const VISOR = { left: 52, right: 88, cy: 52 }
const MAX_OFFSET = (VISOR.right - VISOR.left) / 2 - 5

const BODY_STROKE = { stroke: 'var(--accent)', strokeWidth: 1, strokeOpacity: 0.35 }

// Used on plain <rect> inside motion.g (not motion.rect)
const BS = { stroke: 'var(--accent)' as string, strokeWidth: 1, strokeOpacity: 0.35 }

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

const LEG_SWING = 22   // degrees
const ARM_SWING = 15   // degrees
const STRIDE = 0.28    // seconds per half-stride

function limbTransition(traveling: boolean) {
  if (traveling) {
    return { duration: STRIDE, repeat: Infinity, repeatType: 'mirror' as const, ease: 'easeInOut' as const }
  }
  return { type: 'spring' as const, stiffness: 220, damping: 24 }
}

interface RobotProps {
  playIntro: boolean
  isTraveling?: boolean
  onIntroComplete?: () => void
}

export default function Robot({ playIntro, isTraveling = false, onIntroComplete }: RobotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const gazeX = useSpring(0, { stiffness: 120, damping: 14 })
  const scriptedActive = useRef(false)

  const highlightCx = useTransform(gazeX, v => (VISOR.left + VISOR.right) / 2 + v)

  // Natural running gait: opposite limbs swing together
  // Left leg forward → right arm forward (and vice versa)
  const leftLegAnim  = isTraveling ? { rotate: [-LEG_SWING, LEG_SWING] } : { rotate: 0 }
  const rightLegAnim = isTraveling ? { rotate: [LEG_SWING, -LEG_SWING] } : { rotate: 0 }
  const leftArmAnim  = isTraveling ? { rotate: [ARM_SWING, -ARM_SWING] } : { rotate: 0 }
  const rightArmAnim = isTraveling ? { rotate: [-ARM_SWING, ARM_SWING] } : { rotate: 0 }
  const lt = limbTransition(isTraveling)

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
      timers.push(setTimeout(() => gazeX.set(-MAX_OFFSET), 1200))
      timers.push(setTimeout(() => gazeX.set(MAX_OFFSET), 1700))
      timers.push(setTimeout(() => gazeX.set(0), 2100))
      timers.push(setTimeout(() => {
        scriptedActive.current = false
        onIntroComplete?.()
      }, 2600))
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

      {/* LEFT ARM — outer motion.g handles boot pop-in, inner handles running swing */}
      <motion.g variants={partVariants}>
        <motion.g style={{ transformOrigin: '22px 86px' }} animate={leftArmAnim} transition={lt}>
          <rect x="12" y="86" width="20" height="58" rx="10" fill="var(--fg)" transform="rotate(8 22 86)" {...BS} />
        </motion.g>
      </motion.g>
      <JointGlow variants={partVariants} cx={22} cy={86} r={3} />

      {/* RIGHT ARM */}
      <motion.g variants={partVariants}>
        <motion.g style={{ transformOrigin: '118px 86px' }} animate={rightArmAnim} transition={lt}>
          <rect x="108" y="86" width="20" height="58" rx="10" fill="var(--fg)" transform="rotate(-8 118 86)" {...BS} />
        </motion.g>
      </motion.g>
      <JointGlow variants={partVariants} cx={118} cy={86} r={3} />

      {/* LEFT LEG — leg + foot swing as one rigid unit from hip */}
      <motion.g variants={partVariants}>
        <motion.g style={{ transformOrigin: '57px 156px' }} animate={leftLegAnim} transition={lt}>
          <rect x="46" y="156" width="22" height="60" rx="11" fill="var(--fg)" {...BS} />
          <rect x="41" y="210" width="32" height="10" rx="5" fill="var(--fg)" {...BS} />
        </motion.g>
      </motion.g>
      <JointGlow variants={partVariants} cx={57} cy={158} r={2.5} />

      {/* RIGHT LEG */}
      <motion.g variants={partVariants}>
        <motion.g style={{ transformOrigin: '83px 156px' }} animate={rightLegAnim} transition={lt}>
          <rect x="72" y="156" width="22" height="60" rx="11" fill="var(--fg)" {...BS} />
          <rect x="67" y="210" width="32" height="10" rx="5" fill="var(--fg)" {...BS} />
        </motion.g>
      </motion.g>
      <JointGlow variants={partVariants} cx={83} cy={158} r={2.5} />

      {/* head */}
      <motion.rect variants={partVariants} x="34" y="20" width="72" height="54" rx="14" fill="var(--fg)" {...BODY_STROKE} />
      <motion.rect variants={partVariants} x="22" y="40" width="12" height="18" rx="6" fill="var(--fg)" {...BODY_STROKE} />
      <motion.rect variants={partVariants} x="106" y="40" width="12" height="18" rx="6" fill="var(--fg)" {...BODY_STROKE} />

      {/* antenna */}
      <motion.line variants={partVariants} x1="70" y1="20" x2="70" y2="4" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" />
      <JointGlow variants={partVariants} cx={70} cy={4} r={4.5} pulse />

      {/* chest light */}
      <JointGlow variants={partVariants} cx={70} cy={118} r={7} pulse />

      {/* visor — Iron-Man-style HUD slit with tracking highlight */}
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

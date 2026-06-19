'use client'

import { motion, Variants } from 'motion/react'

const partVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const STRIDE = 16
const TROT_TRANSITION = { duration: 0.42, repeat: Infinity, ease: 'easeInOut' as const }

function Leg({
  hipX,
  hipY,
  offsetX,
  phase,
  walking,
}: {
  hipX: number
  hipY: number
  offsetX: number
  phase: 1 | -1
  walking: boolean
}) {
  return (
    <motion.rect
      variants={partVariants}
      x={hipX + offsetX - 4.5}
      y={hipY}
      width="9"
      height="40"
      rx="4.5"
      fill="var(--fg)"
      stroke="var(--accent)"
      strokeWidth="1"
      strokeOpacity="0.3"
      style={{ transformOrigin: `${hipX + offsetX}px ${hipY}px` }}
      animate={walking ? { rotate: [STRIDE * phase, -STRIDE * phase, STRIDE * phase] } : { rotate: 0 }}
      transition={walking ? TROT_TRANSITION : { duration: 0.3 }}
    />
  )
}

export default function Quadruped({
  playIntro,
  walking = false,
}: {
  playIntro: boolean
  walking?: boolean
}) {
  return (
    <motion.svg
      className="w-full h-full"
      viewBox="0 0 200 110"
      initial={playIntro ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      aria-hidden
    >
      {/* back legs (diagonal trot pairing: outer syncs with front-inner) */}
      <Leg hipX={62} hipY={60} offsetX={-4} phase={1} walking={walking} />
      <Leg hipX={62} hipY={60} offsetX={4} phase={-1} walking={walking} />

      {/* front legs */}
      <Leg hipX={138} hipY={60} offsetX={-4} phase={-1} walking={walking} />
      <Leg hipX={138} hipY={60} offsetX={4} phase={1} walking={walking} />

      {/* body */}
      <motion.rect variants={partVariants} x="48" y="28" width="104" height="34" rx="15" fill="var(--fg)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.35" />

      {/* head / sensor module */}
      <motion.rect variants={partVariants} x="148" y="20" width="32" height="26" rx="9" fill="var(--fg)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.35" />

      {/* sensor glow */}
      <motion.g variants={partVariants}>
        <motion.circle
          cx="172"
          cy="33"
          r="3.5"
          fill="var(--accent)"
          animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ transformOrigin: '172px 33px' }}
        />
      </motion.g>
    </motion.svg>
  )
}

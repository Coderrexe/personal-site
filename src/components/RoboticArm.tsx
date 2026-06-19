'use client'

import { motion, Variants } from 'motion/react'

const partVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
}
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export default function RoboticArm({ playIntro }: { playIntro: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 120 160"
      className="w-full h-full"
      fill="none"
      aria-hidden
      initial={playIntro ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
    >
      {/* outer group: boot entrance pop-in via parent stagger */}
      <motion.g variants={partVariants}>
        {/* inner group: continuous sway — separate from variants to avoid conflict */}
        <motion.g
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 140px' }}
        >
          {/* base mount */}
          <circle cx="100" cy="140" r="11" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="100" cy="140" r="4" fill="var(--accent)" opacity="0.8" />
          {/* upper arm */}
          <rect x="92" y="62" width="16" height="78" rx="8" fill="var(--fg)" transform="rotate(-22 100 140)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />
          {/* elbow joint */}
          <circle cx="78" cy="68" r="6" fill="var(--fg)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.4" />
          {/* forearm */}
          <rect x="71" y="14" width="14" height="58" rx="7" fill="var(--fg)" transform="rotate(18 78 68)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />
          {/* end effector glow */}
          <motion.circle
            cx="86"
            cy="16"
            r="6"
            fill="var(--accent)"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ transformOrigin: '86px 16px', opacity: 0.85 }}
          />
        </motion.g>
      </motion.g>
    </motion.svg>
  )
}

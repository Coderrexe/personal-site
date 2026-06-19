'use client'

import { motion } from 'motion/react'

/**
 * A small decorative robotic-arm accent — a second "robot" on the site,
 * purely ornamental (no cursor-tracking, no dock-zone participation).
 * Sits near the Research room as a quiet "lab equipment" touch.
 */
export default function RoboticArm({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 120 160"
      className={className}
      fill="none"
      aria-hidden
      animate={{ rotate: [0, -3, 0, 3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '100px 140px' }}
    >
      {/* base mount */}
      <circle cx="100" cy="140" r="11" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
      <circle cx="100" cy="140" r="4" fill="var(--accent)" opacity="0.8" />

      {/* upper arm */}
      <rect x="92" y="62" width="16" height="78" rx="8" fill="var(--fg)" transform="rotate(-22 100 140)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />

      {/* elbow joint */}
      <circle cx="78" cy="68" r="6" fill="var(--fg)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.4" />

      {/* forearm */}
      <rect x="71" y="14" width="14" height="58" rx="7" fill="var(--fg)" transform="rotate(18 78 68)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />

      {/* end effector glow */}
      <circle cx="86" cy="16" r="6" fill="var(--accent)" opacity="0.85" />
    </motion.svg>
  )
}

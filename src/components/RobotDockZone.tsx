'use client'

import { useEffect, useId, useRef } from 'react'
import { useRobotDockRegistry, CompanionSlot } from '@/lib/robotDock'

/**
 * An invisible marker that tells one of the three companions (humanoid,
 * quadruped, arm — pick via `slot`) "you may rest here." Place one
 * anywhere in a page's layout, and that companion drifts to whichever of
 * its own zones is closest to the vertical center of the viewport as the
 * user scrolls. Different slots can have entirely different zones, which
 * is what lets the three companions end up in different parts of the page
 * at once instead of piling on top of each other.
 */
export default function RobotDockZone({
  slot,
  size = 70,
  className = '',
}: {
  slot: CompanionSlot
  size?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const { registerZone, unregisterZone } = useRobotDockRegistry()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    registerZone(id, el, size, slot)
    return () => unregisterZone(id)
  }, [id, size, slot, registerZone, unregisterZone])

  return <div ref={ref} aria-hidden className={`pointer-events-none ${className}`} />
}

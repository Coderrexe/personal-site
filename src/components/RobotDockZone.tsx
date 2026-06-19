'use client'

import { useEffect, useId, useRef } from 'react'
import { useRobotDockRegistry } from '@/lib/robotDock'

/**
 * An invisible marker that tells the global robot companion "you may rest
 * here." Place one anywhere in a page's layout — a margin column, a gap
 * beside a paragraph, a quiet corner — and the companion will drift to
 * whichever registered zone is closest to the vertical center of the
 * viewport as the user scrolls.
 *
 * `size` is the preferred robot height (px) while resting in this zone —
 * give the homepage's hero zone room to be large, and small page margins a
 * smaller size so it never crowds text.
 */
export default function RobotDockZone({
  size = 70,
  className = '',
}: {
  size?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const { registerZone, unregisterZone } = useRobotDockRegistry()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    registerZone(id, el, size)
    return () => unregisterZone(id)
  }, [id, size, registerZone, unregisterZone])

  return <div ref={ref} aria-hidden className={`pointer-events-none ${className}`} />
}

'use client'

import { createContext, useContext, useRef, useCallback, ReactNode } from 'react'

export interface DockZoneEntry {
  el: HTMLElement
  size: number // preferred robot height, in px, while resting in this zone
}

interface RobotDockContextType {
  registerZone: (id: string, el: HTMLElement, size: number) => void
  unregisterZone: (id: string) => void
  zones: Map<string, DockZoneEntry>
}

const RobotDockContext = createContext<RobotDockContextType | null>(null)

export function RobotDockProvider({ children }: { children: ReactNode }) {
  const zonesRef = useRef(new Map<string, DockZoneEntry>())

  const registerZone = useCallback((id: string, el: HTMLElement, size: number) => {
    zonesRef.current.set(id, { el, size })
  }, [])

  const unregisterZone = useCallback((id: string) => {
    zonesRef.current.delete(id)
  }, [])

  return (
    <RobotDockContext.Provider value={{ registerZone, unregisterZone, zones: zonesRef.current }}>
      {children}
    </RobotDockContext.Provider>
  )
}

export function useRobotDockRegistry() {
  const ctx = useContext(RobotDockContext)
  if (!ctx) throw new Error('useRobotDockRegistry must be used within RobotDockProvider')
  return ctx
}

/** Picks whichever registered zone is currently closest to the viewport's
 * vertical center. Includes zones up to BUFFER px outside the viewport so
 * the robot never loses its target during the brief gap between sections. */
export function pickActiveZone(zones: Map<string, DockZoneEntry>): DockZoneEntry | null {
  const BUFFER = 300
  let best: DockZoneEntry | null = null
  let bestDist = Infinity
  const viewportCenter = window.innerHeight / 2

  for (const entry of zones.values()) {
    const rect = entry.el.getBoundingClientRect()
    if (rect.bottom < -BUFFER || rect.top > window.innerHeight + BUFFER) continue
    const zoneCenter = rect.top + rect.height / 2
    const dist = Math.abs(zoneCenter - viewportCenter)
    if (dist < bestDist) {
      bestDist = dist
      best = entry
    }
  }
  return best
}

'use client'

import { createContext, useContext, useRef, useCallback, ReactNode } from 'react'

export type CompanionSlot = 'humanoid' | 'quadruped' | 'arm'

export interface DockZoneEntry {
  el: HTMLElement
  size: number // preferred companion height, in px, while resting in this zone
  slot: CompanionSlot
}

interface RobotDockContextType {
  registerZone: (id: string, el: HTMLElement, size: number, slot: CompanionSlot) => void
  unregisterZone: (id: string) => void
  zones: Map<string, DockZoneEntry>
}

const RobotDockContext = createContext<RobotDockContextType | null>(null)

export function RobotDockProvider({ children }: { children: ReactNode }) {
  const zonesRef = useRef(new Map<string, DockZoneEntry>())

  const registerZone = useCallback((id: string, el: HTMLElement, size: number, slot: CompanionSlot) => {
    zonesRef.current.set(id, { el, size, slot })
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

/** Picks whichever zone registered for the given companion slot is
 * currently closest to the viewport's vertical center, among zones that
 * are at least partially on-screen. */
export function pickActiveZone(zones: Map<string, DockZoneEntry>, slot: CompanionSlot): DockZoneEntry | null {
  let best: DockZoneEntry | null = null
  let bestDist = Infinity
  const viewportCenter = window.innerHeight / 2

  for (const entry of zones.values()) {
    if (entry.slot !== slot) continue
    const rect = entry.el.getBoundingClientRect()
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue
    const zoneCenter = rect.top + rect.height / 2
    const dist = Math.abs(zoneCenter - viewportCenter)
    if (dist < bestDist) {
      bestDist = dist
      best = entry
    }
  }
  return best
}

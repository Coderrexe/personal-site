'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const UNLOCK_PASSWORD = 'MicrosoftUX'
const UNLOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const STORAGE_KEY = 'unlock_until'

interface UnlockContextType {
  unlocked: boolean
  unlock: (password: string) => boolean
}

const UnlockContext = createContext<UnlockContextType>({
  unlocked: false,
  unlock: () => false,
})

export function UnlockProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const until = localStorage.getItem(STORAGE_KEY)
    if (until && Date.now() < parseInt(until, 10)) {
      setUnlocked(true)
    }
  }, [])

  const unlock = (password: string) => {
    if (password === UNLOCK_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + UNLOCK_DURATION_MS))
      setUnlocked(true)
      return true
    }
    return false
  }

  return (
    <UnlockContext.Provider value={{ unlocked, unlock }}>
      {children}
    </UnlockContext.Provider>
  )
}

export function useUnlock() {
  return useContext(UnlockContext)
}

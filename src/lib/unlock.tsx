'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

const UNLOCK_PASSWORD = 'MicrosoftUX'

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

  const unlock = (password: string) => {
    if (password === UNLOCK_PASSWORD) {
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

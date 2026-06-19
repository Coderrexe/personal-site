'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface BootContextType {
  bootReady: boolean
  setBootReady: (v: boolean) => void
}

const BootContext = createContext<BootContextType>({ bootReady: false, setBootReady: () => {} })

export function BootProvider({ children }: { children: ReactNode }) {
  const [bootReady, setBootReady] = useState(false)
  return (
    <BootContext.Provider value={{ bootReady, setBootReady }}>
      {children}
    </BootContext.Provider>
  )
}

export function useBootReady() {
  return useContext(BootContext)
}

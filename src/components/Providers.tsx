'use client'

import { UnlockProvider } from '@/lib/unlock'
import UnlockModal from './UnlockModal'
import AmbientGlow from './AmbientGlow'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UnlockProvider>
      <AmbientGlow />
      {children}
      <UnlockModal />
    </UnlockProvider>
  )
}

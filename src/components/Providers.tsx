'use client'

import { UnlockProvider } from '@/lib/unlock'
import UnlockModal from './UnlockModal'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UnlockProvider>
      {children}
      <UnlockModal />
    </UnlockProvider>
  )
}

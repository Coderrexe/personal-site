'use client'

import { UnlockProvider } from '@/lib/unlock'
import UnlockModal from './UnlockModal'
import AmbientGlow from './AmbientGlow'
import BootSequence from './BootSequence'
import CursorFX from './CursorFX'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UnlockProvider>
      <BootSequence />
      <CursorFX />
      <AmbientGlow />
      {children}
      <UnlockModal />
    </UnlockProvider>
  )
}

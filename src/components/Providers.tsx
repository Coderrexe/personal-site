'use client'

import { UnlockProvider } from '@/lib/unlock'
import { RobotDockProvider } from '@/lib/robotDock'
import UnlockModal from './UnlockModal'
import AmbientGlow from './AmbientGlow'
import CompanionStage from './CompanionStage'
import CursorFX from './CursorFX'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UnlockProvider>
      <RobotDockProvider>
        <CursorFX />
        <AmbientGlow />
        {children}
        <UnlockModal />
        <CompanionStage />
      </RobotDockProvider>
    </UnlockProvider>
  )
}

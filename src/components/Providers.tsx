'use client'

import { UnlockProvider } from '@/lib/unlock'
import UnlockModal from './UnlockModal'
import AmbientGlow from './AmbientGlow'
import RobotStage from './RobotStage'
import CursorFX from './CursorFX'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UnlockProvider>
      <CursorFX />
      <AmbientGlow />
      {children}
      <UnlockModal />
      <RobotStage />
    </UnlockProvider>
  )
}

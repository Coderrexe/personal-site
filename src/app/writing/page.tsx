import type { Metadata } from 'next'
import { orderedEssays } from '@/lib/data'
import FadeIn from '@/components/FadeIn'
import WritingList from '@/components/WritingList'
import RobotDockZone from '@/components/RobotDockZone'

export const metadata: Metadata = {
  title: 'Writing — Simba Shi',
}

export default function Writing() {
  return (
    <div>
    <div className="hidden lg:block fixed top-1/3 right-[4%] xl:right-[8%]">
      <RobotDockZone size={110} className="w-24 h-28" />
    </div>
    <div className="max-w-[60rem] mx-auto px-6">

      <FadeIn>
        <section className="pt-20 pb-14">
          <h1 className="font-serif text-[2.2rem] text-fg tracking-[-0.02em] leading-tight">Writing</h1>
        </section>
      </FadeIn>

      <FadeIn delay={80}>
        <blockquote className="mb-14 max-w-lg">
          <p className="text-muted text-[0.9375rem] leading-[1.85] whitespace-pre-line mb-3">{`But let me see if – using these words as a little plot of land\nand my life as a cornerstone –\nI can build you a center.`}</p>
          <cite className="font-mono text-xs text-muted not-italic">— Qiu Miaojin</cite>
        </blockquote>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="pb-24">
          <WritingList essays={orderedEssays} />
        </div>
      </FadeIn>

    </div>
    </div>
  )
}

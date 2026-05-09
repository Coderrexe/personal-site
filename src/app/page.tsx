import Link from 'next/link'
import { orderedEssays, workItems, researchItems } from '@/lib/data'
import FadeIn from '@/components/FadeIn'
import ResearchList from '@/components/ResearchList'
import ExperienceList from '@/components/ExperienceList'
import AnimatedName from '@/components/AnimatedName'
import AnimatedBio from '@/components/AnimatedBio'
import WritingList from '@/components/WritingList'
import SectionLabel from '@/components/SectionLabel'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="pt-24 pb-20">
        <h1 className="text-fg text-[1.6rem] font-semibold tracking-[-0.01em] mb-6 overflow-hidden">
          <AnimatedName name="Simba Shi" />
        </h1>
        <AnimatedBio text="Hey, I'm Simba. I'm a student at Yale, and I love building AI and robots. In another life, I'm a creative writer. Here, you'll find small, scattered fragments of my life & work." />
      </section>

      {/* ── Experience ────────────────────────────────────── */}
      <FadeIn delay={0}>
        <section className="pb-20">
          <SectionLabel>Experience</SectionLabel>
          <ExperienceList items={workItems} />
          <div className="mt-5">
            <Link href="/work" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
              Learn more →
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* ── Research & Projects ───────────────────────────── */}
      <FadeIn delay={160}>
        <section className="pb-20">
          <SectionLabel>Research &amp; Projects</SectionLabel>
          <ResearchList items={researchItems} />
          <div className="mt-5">
            <Link href="/work#research" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
              Learn more →
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* ── Writing ───────────────────────────────────────── */}
      <FadeIn delay={240}>
        <section className="pb-24">
          <SectionLabel>Writing</SectionLabel>
          <WritingList essays={orderedEssays} />
        </section>
      </FadeIn>

    </div>
  )
}

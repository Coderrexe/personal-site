import Link from 'next/link'
import { orderedEssays, workItems, researchItems } from '@/lib/data'
import AnimatedName from '@/components/AnimatedName'
import AnimatedBio from '@/components/AnimatedBio'
import HorizontalRail from '@/components/HorizontalRail'
import MosaicGrid from '@/components/MosaicGrid'
import ScatteredWriting from '@/components/ScatteredWriting'
import Magnetic from '@/components/Magnetic'

export default function Home() {
  return (
    <div>

      {/* ── Room 1: Identity ─────────────────────────────────── */}
      <section className="room max-w-[60rem] mx-auto px-6">
        <h1 className="hero-name text-fg text-[2.1rem] sm:text-[2.6rem] font-semibold tracking-[-0.01em] mb-7 overflow-hidden">
          <AnimatedName name="Simba Shi" />
        </h1>
        <AnimatedBio paragraphs={[
          "Hey, I'm Simba. I'm a student at Yale, and I love building AI and robots.",
          "Previously, I cofounded ReefSound, an AI and robotics startup for ocean monitoring scaled across 7 countries, featured by The Independent, NASA, United Nations, and National Geographic.",
          "My current research is in machine learning and robotics, spanning multimodal LLMs, RL, mechanistic interpretability, generalist robot policies, and I'm interested broadly in intelligence in both its digital and biological forms.",
          "In another life, I'm a creative writer. Here, you'll find small, scattered fragments of my life & work.",
        ]} />
        <div className="font-mono text-xs text-subtle mt-12 animate-pulse">scroll ↓</div>
      </section>

      {/* ── Room 2: Experience ───────────────────────────────── */}
      <section className="room">
        <div className="max-w-[60rem] mx-auto px-6 w-full">
          <p className="room-kicker">01 — where I&apos;ve built</p>
          <h2 className="room-title">Experience</h2>
        </div>
        <div className="px-6">
          <HorizontalRail items={workItems} />
        </div>
        <div className="max-w-[60rem] mx-auto px-6 w-full mt-6">
          <Magnetic strength={0.25}>
            <Link href="/work" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
              Full history →
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ── Room 3: Research ─────────────────────────────────── */}
      <section className="room max-w-[60rem] mx-auto px-6">
        <p className="room-kicker">02 — what I&apos;ve discovered</p>
        <h2 className="room-title">Research</h2>
        <MosaicGrid items={researchItems} />
        <div className="mt-6">
          <Magnetic strength={0.25}>
            <Link href="/work#research" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
              Full archive →
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ── Room 4: Writing ──────────────────────────────────── */}
      <section className="room max-w-[60rem] mx-auto px-6 pb-32">
        <p className="room-kicker">03 — what I write</p>
        <h2 className="room-title">Writing</h2>
        <ScatteredWriting essays={orderedEssays} />
      </section>

    </div>
  )
}

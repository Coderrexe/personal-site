'use client'

import { useState } from 'react'
import Link from 'next/link'
import { orderedEssays, workItems, researchItems } from '@/lib/data'
import AnimatedName from '@/components/AnimatedName'
import AnimatedBio from '@/components/AnimatedBio'
import Magnetic from '@/components/Magnetic'
import { useUnlock } from '@/lib/unlock'

export default function Home() {
  const { unlocked } = useUnlock()
  const visibleWork = workItems.filter(item => !item.hidden || unlocked)
  const visibleResearch = researchItems.filter(item => !item.hidden || unlocked)
  const [expandedWork, setExpandedWork] = useState<number | null>(null)
  const [expandedResearch, setExpandedResearch] = useState<number | null>(null)

  return (
    <div>

      {/* ── Room 1: Identity ─────────────────────────────────── */}
      <section className="room max-w-[58rem] mx-auto px-6 pt-28 sm:pt-36">
        <div className="max-w-[38rem]">
          <h1 className="hero-name text-fg text-[2.1rem] sm:text-[2.6rem] font-semibold tracking-[-0.01em] mb-7 overflow-hidden">
            <AnimatedName name="Simba Shi" />
          </h1>
          <AnimatedBio paragraphs={[
            "Hey, I'm Simba. I'm a student at Yale, and I love building AI and robots.",
            "Previously, I cofounded ReefSound, an AI and robotics startup for ocean monitoring scaled across 7 countries, featured by The Independent, NASA, United Nations, and National Geographic.",
            "My current research is in machine learning and robotics, spanning multimodal LLMs, RL, mechanistic interpretability, generalist robot policies, and I'm interested broadly in intelligence in both its digital and biological forms.",
            "In another life, I'm a creative writer. Here, you'll find small, scattered fragments of my life & work.",
          ]} />
        </div>
      </section>

      {/* ── Room 2: Experience ───────────────────────────────── */}
      <section className="room">
        <div className="max-w-[42rem] mx-auto px-6">
        <p className="room-kicker">01 — where I&apos;ve built</p>
        <h2 className="room-title">Experience</h2>
        <div className="circuit-list">
          {visibleWork.map((item, idx) => {
            const hasLinks = item.links && item.links.length > 0
            const isOpen = expandedWork === idx
            return (
              <div
                key={item.company}
                className="circuit-row tilt-row relative py-5 -mx-3 px-3 rounded-lg border-b border-line last:border-0 cursor-default"
                onMouseEnter={() => hasLinks ? setExpandedWork(idx) : undefined}
                onMouseLeave={() => setExpandedWork(null)}
              >
                <span className="circuit-node" />
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <p className="text-[0.9375rem] text-fg font-medium">{item.company}</p>
                  <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums whitespace-nowrap">{item.period}</span>
                </div>
                <p className="text-sm mb-1">
                  <span className="text-fg">{item.role}</span>
                  {item.note && <span className="text-muted"> · {item.note}</span>}
                </p>
                <p className="text-[0.8125rem] text-muted leading-relaxed">{item.tagline}</p>
                {hasLinks && (
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-8 opacity-100 mt-2.5' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center gap-4 flex-wrap">
                      {item.links!.map(link => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-accent hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-6">
          <Magnetic strength={0.25}>
            <Link href="/work" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
              Full history →
            </Link>
          </Magnetic>
        </div>
        </div>
      </section>

      {/* ── Room 3: Research ─────────────────────────────────── */}
      <section className="room">
        <div className="max-w-[42rem] mx-auto px-6">
        <p className="room-kicker">02 — what I&apos;ve discovered</p>
        <h2 className="room-title">Research</h2>
        <div className="circuit-list">
          {visibleResearch.map((item, idx) => {
            const hasLinks = item.links && item.links.length > 0
            const isOpen = expandedResearch === idx
            return (
              <div
                key={item.title}
                className="circuit-row tilt-row relative py-5 -mx-3 px-3 rounded-lg border-b border-line last:border-0 cursor-default"
                onMouseEnter={() => hasLinks ? setExpandedResearch(idx) : undefined}
                onMouseLeave={() => setExpandedResearch(null)}
              >
                <span className="circuit-node" />
                <div className="flex items-start justify-between gap-4 mb-1">
                  <span className={`tag ${item.tagAccent ? 'tag-accent' : ''}`}>{item.tag}</span>
                  <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums whitespace-nowrap mt-0.5">{item.period}</span>
                </div>
                {item.titleHtml ? (
                  <p className="text-[0.9375rem] text-fg font-medium mb-1" dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
                ) : (
                  <p className="text-[0.9375rem] text-fg font-medium mb-1">{item.title}</p>
                )}
                <p className="text-[0.8125rem] text-muted leading-relaxed">{item.tagline}</p>
                {hasLinks && (
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-8 opacity-100 mt-2.5' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center gap-4 flex-wrap">
                      {item.links!.map(link => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-accent hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-6">
          <Magnetic strength={0.25}>
            <Link href="/work#research" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
              Full archive →
            </Link>
          </Magnetic>
        </div>
        </div>
      </section>

      {/* ── Room 4: Writing ──────────────────────────────────── */}
      <section className="room pb-32">
        <div className="max-w-[42rem] mx-auto px-6">
        <p className="room-kicker">03 — what I write</p>
        <h2 className="room-title">Writing</h2>
        <div className="circuit-list border-t border-line">
          {orderedEssays.map(essay => {
            const href = essay.comingSoon
              ? `/writing/${essay.collectionSlug}`
              : `/writing/${essay.collectionSlug}/${essay.slug}`
            return (
              <Link
                key={essay.slug}
                href={href}
                className="circuit-row tilt-row group relative flex items-baseline justify-between py-5 -mx-3 px-3 rounded-lg border-b border-line"
              >
                <span className="circuit-node" />
                <div>
                  <span className="text-fg text-sm group-hover:text-accent transition-colors duration-150">{essay.title}</span>
                  {essay.description && <p className="text-xs text-muted mt-0.5">{essay.description}</p>}
                </div>
                {essay.comingSoon ? (
                  <span className="font-mono text-xs text-muted flex-shrink-0 ml-8">coming soon</span>
                ) : (
                  <span className="font-mono text-xs text-muted group-hover:text-accent transition-colors duration-150 flex-shrink-0 ml-8 tabular-nums">
                    {essay.displayDate}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
        </div>
      </section>

    </div>
  )
}

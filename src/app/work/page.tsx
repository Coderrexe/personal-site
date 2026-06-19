'use client'

import { useState } from 'react'
import { workItems, researchItems } from '@/lib/data'
import FadeIn from '@/components/FadeIn'
import SectionHead from '@/components/SectionHead'
import RobotDockZone from '@/components/RobotDockZone'
import { useUnlock } from '@/lib/unlock'

type Tab = 'experience' | 'research'

export default function Work() {
  const [tab, setTab] = useState<Tab>('experience')
  const [expandedExp, setExpandedExp] = useState<number | null>(null)
  const { unlocked } = useUnlock()
  const visibleWork = workItems.filter(item => !item.hidden || unlocked)
  const visibleResearch = researchItems.filter(item => !item.hidden || unlocked)

  return (
    <div className="relative">
      <div className="hidden lg:block fixed top-1/3 right-[4%] xl:right-[8%]">
        <RobotDockZone slot="humanoid" size={68} className="w-16 h-16" />
      </div>
      <div className="max-w-[60rem] mx-auto px-6">

      <FadeIn>
        <section className="pt-20 pb-14">
          <h1 className="font-serif text-[2.2rem] text-fg tracking-[-0.02em] leading-tight">Work</h1>
        </section>
      </FadeIn>

      {/* ── Education (always visible) ──────────────────────── */}
      <FadeIn delay={80}>
        <section className="pb-14">
          <SectionHead index="00">Education</SectionHead>
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-8">
              <div>
                <p className="text-fg font-medium text-sm mb-0.5">Yale University</p>
                <p className="text-muted text-sm mb-1.5">B.S. Computer Science & Mathematics</p>
                {/* <p className="text-muted text-sm italic leading-relaxed">
                  Select Coursework: Deep Learning Theory (Graduate), Advances in Foundation Models (Graduate), Computational Neuroscience, Systems Programming, Data Structures, Discrete Mathematics, Probability Theory, Linear Algebra, Creative Writing, Modern Comparative Literature, Microeconomics
                </p> */}
              </div>
              <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums">2025–2029</span>
            </div>
            <div className="flex items-start justify-between gap-8">
              <div>
                <p className="text-fg font-medium text-sm mb-0.5">Eton College</p>
                <p className="text-muted text-sm">
                  King's Scholar · Sixth Form Select · A-Levels (Math, Further Math, Physics, CS)
                </p>
              </div>
              <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums">2020–2025</span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Tab switcher ────────────────────────────────────── */}
      <FadeIn delay={120}>
        <div className="flex items-center gap-6 pb-6">
          <button
            onClick={() => setTab('experience')}
            className={`text-sm pb-0.5 transition-colors duration-150 ${
              tab === 'experience'
                ? 'text-fg font-medium border-b-2 border-fg'
                : 'text-muted hover:text-fg border-b-2 border-transparent'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setTab('research')}
            className={`text-sm pb-0.5 transition-colors duration-150 ${
              tab === 'research'
                ? 'text-fg font-medium border-b-2 border-fg'
                : 'text-muted hover:text-fg border-b-2 border-transparent'
            }`}
          >
            Research & Projects
          </button>
        </div>
      </FadeIn>

      {tab === 'experience' && (
        <>
          {/* ── Experience ──────────────────────────────────── */}
          <FadeIn delay={80}>
            <section className="pt-5 pb-16">
              <SectionHead index="01">Experience</SectionHead>
              <div className="circuit-list">
                {visibleWork.map((item, idx) => (
                  <article
                    key={item.company}
                    className="circuit-row tilt-row relative py-8 -mx-3 px-3 rounded-lg border-b border-line last:border-0 cursor-default"
                    onMouseEnter={() => item.links?.length ? setExpandedExp(idx) : undefined}
                    onMouseLeave={() => setExpandedExp(null)}
                  >
                    <span className="circuit-node circuit-node-lg" />
                    <div className="flex items-start justify-between gap-8 mb-4">
                      <div>
                        <p className="text-fg font-medium text-sm mb-0.5">{item.company}</p>
                        <p className="text-sm">
                          <span className="text-fg">{item.role}</span>
                          {item.note && <span className="text-muted"> · {item.note}</span>}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="font-mono text-xs text-muted tabular-nums whitespace-nowrap block">
                          {item.period}
                        </span>
                        <span className="font-mono text-xs text-muted whitespace-nowrap block mt-0.5">
                          {item.location}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2.5">
                      {item.description.map((bullet, i) => {
                        if (typeof bullet === 'string') {
                          return (
                            <li key={i} className="text-[0.8125rem] text-muted leading-relaxed">
                              {bullet}
                            </li>
                          )
                        }
                        const [before, after] = bullet.text.split(bullet.link.text)
                        return (
                          <li key={i} className="text-[0.8125rem] text-muted leading-relaxed">
                            {before}
                            <a
                              href={bullet.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:opacity-75 transition-opacity duration-150"
                            >
                              {bullet.link.text}
                            </a>
                            {after}
                          </li>
                        )
                      })}
                    </ul>
                    {item.links && item.links.length > 0 && (
                      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        expandedExp === idx ? 'max-h-12 opacity-100 mt-4' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="flex items-center gap-4 flex-wrap">
                          {item.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-accent hover:underline transition-colors duration-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {link.label} ↗
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* ── Technical ───────────────────────────────────── */}
          <FadeIn delay={160}>
            <section className="pb-24">
              <SectionHead index="02">Technical</SectionHead>
              <div className="space-y-5">
                {[
                  { label: 'Languages', items: 'Python · TypeScript · JavaScript · C++ · C · HTML · CSS · Swift · Bash · SQL' },
                  { label: 'Frameworks', items: 'Next.js · React · Linux · Supabase · PyTorch · TensorFlow · Express · PostgreSQL · MongoDB' },
                ].map(({ label, items }) => (
                  <div key={label} className="flex items-baseline gap-8">
                    <span className="font-mono text-xs text-muted w-20 flex-shrink-0">{label}</span>
                    <span className="text-[0.8125rem] text-muted leading-relaxed">{items}</span>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        </>
      )}

      {tab === 'research' && (
        <FadeIn>
          <section className="pt-4 pb-24" id="research">
            <SectionHead index="03">Research &amp; Projects</SectionHead>
            <div className="circuit-list">
              {visibleResearch.map((item, idx) => (
                <article key={idx} className="circuit-row tilt-row relative py-8 -mx-3 px-3 rounded-lg border-b border-line last:border-0">
                  <span className="circuit-node circuit-node-lg" />
                  <div className="flex items-start gap-6 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5">
                        <span className={`tag ${item.tagAccent ? 'tag-accent' : ''}`}>{item.tag}</span>
                      </div>
                      {item.titleHtml ? (
                        <p className="text-fg font-medium text-sm" dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
                      ) : (
                        <p className="text-fg font-medium text-sm">{item.title}</p>
                      )}
                    </div>
                    <span className="font-mono text-xs text-muted tabular-nums flex-shrink-0 whitespace-nowrap mt-0.5">{item.period}</span>
                  </div>
                  <ul className="space-y-2.5 mt-3">
                    {item.description.map((bullet, i) => (
                      <li key={i} className="text-[0.8125rem] text-muted leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  {item.links && item.links.length > 0 && (
                    <div className="mt-4 flex items-center gap-4">
                      {item.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-accent hover:underline transition-colors duration-150"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      </div>
    </div>
  )
}

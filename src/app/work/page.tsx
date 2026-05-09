'use client'

import { useState } from 'react'
import { workItems, researchItems } from '@/lib/data'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'

type Tab = 'experience' | 'research'

export default function Work() {
  const [tab, setTab] = useState<Tab>('experience')
  const [expandedExp, setExpandedExp] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto px-6">

      <FadeIn>
        <section className="pt-20 pb-14">
          <h1 className="font-serif text-[2.2rem] text-fg tracking-[-0.02em] leading-tight">Work</h1>
        </section>
      </FadeIn>

      {/* ── Education (always visible) ──────────────────────── */}
      <FadeIn delay={80}>
        <section className="pb-14">
          <div className="section-label">Education</div>
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-8">
              <div>
                <p className="text-fg font-medium text-sm mb-0.5">Yale University</p>
                <p className="text-muted text-sm">B.S. Computer Science & Mathematics</p>
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
        <div className="flex items-center gap-6 pb-12 border-b border-line">
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
            <section className="pt-12 pb-16">
              <SectionLabel>Experience</SectionLabel>
              <div>
                {workItems.map((item, idx) => (
                  <article
                    key={item.company}
                    className="py-8 border-b border-line last:border-0 cursor-default"
                    onMouseEnter={() => item.links?.length ? setExpandedExp(idx) : undefined}
                    onMouseLeave={() => setExpandedExp(null)}
                  >
                    <div className="flex items-start justify-between gap-8 mb-4">
                      <div>
                        <p className="text-fg font-medium text-sm mb-0.5">{item.company}</p>
                        <p className="text-sm">
                          <span className="text-fg">{item.role}</span>
                          <span className="text-muted"> · {item.location}</span>
                          {item.note && <span className="text-muted"> · {item.note}</span>}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums whitespace-nowrap">
                        {item.period}
                      </span>
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
                              className="text-fg underline underline-offset-2 decoration-line hover:text-accent transition-colors duration-150"
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
              <SectionLabel>Technical</SectionLabel>
              <div className="space-y-5">
                {[
                  { label: 'Languages', items: 'Python · TypeScript · JavaScript · C++ · Swift · SQL · Bash' },
                  { label: 'ML / AI', items: 'PyTorch · TensorFlow · Scikit-Learn · HuggingFace · Pandas · NumPy · Stim' },
                  { label: 'Web', items: 'Next.js · React · Tailwind · Supabase · PostgreSQL · MySQL · Prisma' },
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
          <section className="pt-12 pb-24" id="research">
            <SectionLabel>Research &amp; Projects</SectionLabel>
            <div>
              {researchItems.map((item, idx) => (
                <article key={idx} className="py-8 border-b border-line last:border-0">
                  <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-1 mb-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`tag ${item.tagAccent ? 'tag-accent' : ''}`}>{item.tag}</span>
                      {item.titleHtml ? (
                        <p className="text-fg font-medium text-sm" dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
                      ) : (
                        <p className="text-fg font-medium text-sm">{item.title}</p>
                      )}
                    </div>
                    <span className="font-mono text-xs text-muted tabular-nums flex-shrink-0 whitespace-nowrap">{item.period}</span>
                  </div>
                  {item.award && (
                    <p className="font-mono text-xs text-muted mb-3">{item.award}</p>
                  )}
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
  )
}

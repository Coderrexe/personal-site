import type { Metadata } from 'next'
import { publications } from '@/lib/data'
import FadeIn from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Research — Simba Shi',
}

const SCHOLAR_URL = 'https://scholar.google.com/citations?user=9u4RsnsAAAAJ&hl=en'

export default function Research() {
  const items = publications.filter(pub => !pub.hidden)
  const hasEqualContribution = items.some(pub => pub.authors.some(a => a.equal))

  return (
    <div className="max-w-[60rem] mx-auto px-8 sm:px-10">

      <FadeIn>
        <section className="pt-20 sm:pt-24 pb-10 sm:pb-14">
          <h1 className="page-title">Research</h1>
          <a
            href={SCHOLAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 font-mono text-xs text-muted hover:text-fg transition-colors duration-150"
          >
            Google Scholar ↗
          </a>
        </section>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="pb-24">
          <div className="circuit-list border-t border-line">
            {items.map(pub => (
              <article
                key={pub.href}
                className="circuit-row tilt-row relative py-6 sm:py-7 -mx-3 px-3 rounded-lg border-b border-line"
              >
                <span className="circuit-node circuit-node-lg" />

                <div className="flex items-start justify-between gap-6 mb-1.5">
                  <a
                    href={pub.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-fg font-medium leading-snug hover:text-accent transition-colors duration-150"
                  >
                    {pub.title}
                  </a>
                  <span className="font-mono text-xs text-muted tabular-nums whitespace-nowrap flex-shrink-0 mt-1">
                    {pub.date}
                  </span>
                </div>

                <p className="text-[0.9375rem] text-muted mb-1">{pub.venue}</p>

                <p className="text-sm text-muted leading-relaxed">
                  {pub.authors.map((author, i) => (
                    <span key={author.name}>
                      <span className={author.me ? 'text-fg underline decoration-subtle underline-offset-4' : undefined}>
                        {author.name}
                      </span>
                      {author.equal && '*'}
                      {i < pub.authors.length - 1 && ', '}
                    </span>
                  ))}
                </p>

                {pub.note && (
                  <p className="font-mono text-xs text-accent mt-2">{pub.note}</p>
                )}

                {pub.links && pub.links.length > 0 && (
                  <div className="mt-3 flex items-center gap-4 flex-wrap">
                    {pub.links.map(link => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent hover:underline"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          {hasEqualContribution && (
            <p className="font-mono text-xs text-muted mt-5">* Equal contribution</p>
          )}
        </div>
      </FadeIn>

    </div>
  )
}

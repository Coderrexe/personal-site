'use client'

import Link from 'next/link'
import type { Essay } from '@/lib/data'

// Rows render immediately — the scroll-reveal animation was removed on 2026-11-07.
export default function WritingList({ essays }: { essays: Essay[] }) {
  const rowClass = "circuit-row tilt-row group relative flex items-baseline justify-between py-5 border-b border-line -mx-3 px-3 rounded-lg"

  return (
    <div className="circuit-list border-t border-line">
      {essays.map((essay) => {
        const href = essay.comingSoon
          ? `/writing/${essay.collectionSlug}`
          : `/writing/${essay.collectionSlug}/${essay.slug}`

        return (
          <div key={essay.slug}>
            <Link href={href} className={rowClass}>
              <span className="circuit-node" />
              <div>
                <span className="text-fg text-[0.9375rem] group-hover:text-accent transition-colors duration-150">{essay.title}</span>
                {essay.description && (
                  <p className="text-xs text-muted mt-0.5">{essay.description}</p>
                )}
              </div>
              {essay.comingSoon ? (
                <span className="font-mono text-xs text-muted flex-shrink-0 ml-8">coming soon</span>
              ) : (
                <span className="font-mono text-xs text-muted group-hover:text-accent transition-colors duration-150 flex-shrink-0 ml-8 tabular-nums">
                  {essay.displayDate}
                </span>
              )}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

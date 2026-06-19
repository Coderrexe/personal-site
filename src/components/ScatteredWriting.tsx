'use client'

import Link from 'next/link'
import type { Essay } from '@/lib/data'

// Fixed (non-random) rotation/offset per card index — deterministic so
// server and client render identically, but reads as a scattered pile.
const TILT = [-4, 3, -6, 2, -2, 5]
const LIFT = [0, 10, -6, 14, 4, -8]

export default function ScatteredWriting({ essays }: { essays: Essay[] }) {
  return (
    <div className="scatter-cluster">
      {essays.map((essay, idx) => {
        const rotate = TILT[idx % TILT.length]
        const lift = LIFT[idx % LIFT.length]
        const href = essay.comingSoon
          ? `/writing/${essay.collectionSlug}`
          : `/writing/${essay.collectionSlug}/${essay.slug}`

        return (
          <Link
            key={essay.slug}
            href={href}
            className="scatter-card"
            style={{ '--rotate': `${rotate}deg`, '--lift': `${lift}px` } as React.CSSProperties}
          >
            <p className="font-serif text-fg italic text-lg leading-snug mb-2">{essay.title}</p>
            {essay.description ? (
              <p className="text-xs text-muted">{essay.description}</p>
            ) : essay.comingSoon ? (
              <p className="font-mono text-xs text-subtle">coming soon</p>
            ) : (
              <p className="font-mono text-xs text-muted tabular-nums">{essay.displayDate}</p>
            )}
          </Link>
        )
      })}
    </div>
  )
}

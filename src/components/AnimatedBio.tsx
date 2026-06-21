'use client'

import { CSSProperties, useEffect, useState } from 'react'
import { useBootReady } from '@/lib/bootContext'

// A paragraph is either plain text, or a list of segments where each segment is
// either plain text or an inline link. Every word becomes its own token so the
// whole bio reveals word-by-word in one continuous cascade.
type Segment = string | { text: string; href: string }
type Paragraph = string | Segment[]

const STAGGER = 32 // ms between successive words
const DURATION = 0.45 // s, per-word fade

export default function AnimatedBio({ paragraphs }: { paragraphs: Paragraph[] }) {
  const { bootReady } = useBootReady()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (!bootReady) return
    // One frame so the hidden (opacity:0) state paints before animations start.
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [bootReady])

  // Continuous index across ALL paragraphs → no timing gap between them.
  let idx = 0
  const nextStyle = (): CSSProperties => {
    if (!animate) return { opacity: 0 }
    const delay = idx * STAGGER
    idx += 1
    // `backwards` holds opacity:0 during the delay, then fades in; no fill
    // afterward so hover/opacity stays controllable on links.
    return { animation: `word-in ${DURATION}s cubic-bezier(0.22,1,0.36,1) ${delay}ms backwards` }
  }

  const renderSegment = (seg: Segment, key: string) => {
    if (typeof seg === 'string') {
      // Each word carries a trailing space so wrapping + spacing stay natural.
      return seg
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word, i) => (
          <span key={`${key}-${i}`} className="word-token" style={nextStyle()}>
            {word}{' '}
          </span>
        ))
    }
    return (
      <a
        key={key}
        href={seg.href}
        target="_blank"
        rel="noopener noreferrer"
        className="word-token text-accent hover:opacity-75 transition-opacity duration-150"
        style={nextStyle()}
      >
        {seg.text}
      </a>
    )
  }

  return (
    <div className="space-y-4 max-w-lg">
      {paragraphs.map((para, pi) => {
        const segs: Segment[] = typeof para === 'string' ? [para] : para
        return (
          <p key={pi} className="text-muted text-[0.9375rem] leading-[1.9]">
            {segs.map((s, si) => renderSegment(s, `${pi}-${si}`))}
          </p>
        )
      })}
    </div>
  )
}

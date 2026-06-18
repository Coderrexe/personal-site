'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Essay } from '@/lib/data'

export default function WritingList({ essays }: { essays: Essay[] }) {
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    refs.current.forEach((el, idx) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSet(prev => new Set([...prev, idx]))
            obs.disconnect()
          }
        },
        { threshold: 0.05 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const rowClass = "circuit-row tilt-row group relative flex items-baseline justify-between py-5 border-b border-line -mx-3 px-3 rounded-lg"

  return (
    <div className="circuit-list border-t border-line">
      {essays.map((essay, idx) => {
        const isVisible = visibleSet.has(idx)
        const wrapStyle = {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${idx * 60}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${idx * 60}ms`,
        }

        const href = essay.comingSoon
          ? `/writing/${essay.collectionSlug}`
          : `/writing/${essay.collectionSlug}/${essay.slug}`

        return (
          <div key={essay.slug} ref={el => { refs.current[idx] = el }} style={wrapStyle}>
            <Link href={href} className={rowClass}>
              <span className="circuit-node" />
              <div>
                <span className="text-fg text-sm group-hover:text-accent transition-colors duration-150">{essay.title}</span>
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

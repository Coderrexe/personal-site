'use client'

import { useEffect, useRef, useState } from 'react'
import type { ResearchItem } from '@/lib/data'

export default function ResearchList({ items }: { items: ResearchItem[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)
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
        { threshold: 0.08 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <div>
      {items.map((item, idx) => {
        const hasLinks = item.links && item.links.length > 0
        const isOpen = expanded === idx
        const isVisible = visibleSet.has(idx)

        return (
          <div
            key={idx}
            ref={el => { refs.current[idx] = el }}
            className="py-4 border-b border-line last:border-0 cursor-default"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${idx * 55}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${idx * 55}ms`,
            }}
            onMouseEnter={() => hasLinks ? setExpanded(idx) : undefined}
            onMouseLeave={() => setExpanded(null)}
          >
            <div className="flex items-start justify-between gap-4 mb-1.5">
              {item.titleHtml ? (
                <p className="text-[0.9375rem] text-fg font-medium leading-snug" dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
              ) : (
                <p className="text-[0.9375rem] text-fg font-medium leading-snug">{item.title}</p>
              )}
              <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums whitespace-nowrap ml-2">
                {item.period}
              </span>
            </div>
            {item.award && (
              <p className="text-sm text-muted mb-1">{item.award}</p>
            )}
            <p className="text-[0.8125rem] text-muted">{item.tagline}</p>

            {/* Expand links on hover */}
            {hasLinks && (
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? 'max-h-12 opacity-100 mt-2.5' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.links!.map((link) => (
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
          </div>
        )
      })}
    </div>
  )
}

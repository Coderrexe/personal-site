'use client'

import { useEffect, useRef, useState } from 'react'
import type { ResearchItem } from '@/lib/data'
import { useUnlock } from '@/lib/unlock'

export default function ResearchList({ items }: { items: ResearchItem[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const { unlocked } = useUnlock()

  const visible = items.filter(item => !item.hidden || unlocked)

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
        { threshold: 0, rootMargin: '0px 0px -20px 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [visible.length])

  return (
    <div className="circuit-list">
      {visible.map((item, idx) => {
        const hasLinks = item.links && item.links.length > 0
        const isOpen = expanded === idx
        const isVisible = visibleSet.has(idx)

        return (
          <div
            key={item.title}
            ref={el => { refs.current[idx] = el }}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${idx * 55}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${idx * 55}ms`,
            }}
          >
            <div
              className="circuit-row tilt-row relative py-4 -mx-3 px-3 rounded-lg border-b border-line last:border-0 cursor-default"
              onMouseEnter={() => hasLinks ? setExpanded(idx) : undefined}
              onMouseLeave={() => setExpanded(null)}
            >
              <span className="circuit-node" />
              {/* Tag + Title row with date pinned right */}
              <div className="flex items-start gap-6 mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <span className={`tag ${item.tagAccent ? 'tag-accent' : ''}`}>{item.tag}</span>
                  </div>
                  {item.titleHtml ? (
                    <p className="text-[0.9375rem] text-fg font-medium leading-snug" dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
                  ) : (
                    <p className="text-[0.9375rem] text-fg font-medium leading-snug">{item.title}</p>
                  )}
                </div>
                <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums whitespace-nowrap mt-0.5">
                  {item.period}
                </span>
              </div>

              <p className="text-[0.8125rem] text-muted">{item.tagline}</p>

              {hasLinks && (
                <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? 'max-h-12 opacity-100 mt-2.5' : 'max-h-0 opacity-0'
                }`}>
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
          </div>
        )
      })}
    </div>
  )
}

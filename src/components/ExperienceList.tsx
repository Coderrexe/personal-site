'use client'

import { useEffect, useRef, useState } from 'react'
import type { WorkItem } from '@/lib/data'

export default function ExperienceList({ items }: { items: WorkItem[] }) {
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
            key={item.company}
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
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
              <p className="text-[0.9375rem] text-fg font-medium">{item.company}</p>
              <span className="font-mono text-xs text-muted flex-shrink-0 tabular-nums whitespace-nowrap">
                {item.period}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-1">
              <span className="text-fg">{item.role}</span>
              {item.note && (
                <span className="text-muted"> · {item.note}</span>
              )}
            </p>
            <p className="text-[0.8125rem] text-muted leading-relaxed">{item.tagline}</p>

            {hasLinks && (
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? 'max-h-12 opacity-100 mt-2.5' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex items-center gap-4 flex-wrap">
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

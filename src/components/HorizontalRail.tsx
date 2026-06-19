'use client'

import { useEffect, useRef, useState } from 'react'
import type { WorkItem } from '@/lib/data'
import { useUnlock } from '@/lib/unlock'

export default function HorizontalRail({ items }: { items: WorkItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { unlocked } = useUnlock()
  const visible = items.filter(item => !item.hidden || unlocked)
  const [expanded, setExpanded] = useState<number | null>(null)

  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  })
  const momentumRaf = useRef<number>(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const stopMomentum = () => cancelAnimationFrame(momentumRaf.current)

    const onPointerDown = (e: PointerEvent) => {
      stopMomentum()
      drag.current = {
        active: true,
        startX: e.clientX,
        startScroll: track.scrollLeft,
        lastX: e.clientX,
        lastT: performance.now(),
        velocity: 0,
      }
      track.setPointerCapture(e.pointerId)
      track.classList.add('rail-grabbing')
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.startX
      track.scrollLeft = drag.current.startScroll - dx

      const now = performance.now()
      const dt = now - drag.current.lastT
      if (dt > 0) {
        drag.current.velocity = (e.clientX - drag.current.lastX) / dt
      }
      drag.current.lastX = e.clientX
      drag.current.lastT = now
    }

    const onPointerUp = () => {
      if (!drag.current.active) return
      drag.current.active = false
      track.classList.remove('rail-grabbing')

      let v = drag.current.velocity * -16 // px per frame, inverted to match scroll direction
      const decay = () => {
        if (Math.abs(v) < 0.5) return
        track.scrollLeft += v
        v *= 0.94
        momentumRaf.current = requestAnimationFrame(decay)
      }
      momentumRaf.current = requestAnimationFrame(decay)
    }

    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerUp)
    track.addEventListener('pointercancel', onPointerUp)

    return () => {
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerUp)
      track.removeEventListener('pointercancel', onPointerUp)
      stopMomentum()
    }
  }, [])

  return (
    <div ref={trackRef} className="rail-track no-scrollbar">
      <div className="rail-spacer" />
      {visible.map((item, idx) => {
        const isOpen = expanded === idx
        const hasLinks = item.links && item.links.length > 0
        return (
          <div
            key={item.company}
            className="rail-card"
            onMouseEnter={() => hasLinks ? setExpanded(idx) : undefined}
            onMouseLeave={() => setExpanded(null)}
          >
            <span className="font-mono text-xs text-accent tabular-nums">{item.period}</span>
            <p className="font-serif text-xl text-fg italic mt-2 mb-1">{item.company}</p>
            <p className="text-sm text-fg mb-0.5">
              {item.role}
              {item.note && <span className="text-muted"> · {item.note}</span>}
            </p>
            <p className="text-xs text-muted mb-3">{item.location}</p>
            {item.taglineHtml ? (
              <p className="text-[0.8125rem] text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: item.taglineHtml }} />
            ) : (
              <p className="text-[0.8125rem] text-muted leading-relaxed">{item.tagline}</p>
            )}
            {hasLinks && (
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-12 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <div className="flex items-center gap-3 flex-wrap">
                  {item.links!.map(link => (
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
              </div>
            )}
          </div>
        )
      })}
      <div className="rail-spacer" />
    </div>
  )
}

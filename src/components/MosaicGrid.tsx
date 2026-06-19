'use client'

import { useEffect, useRef } from 'react'
import type { ResearchItem } from '@/lib/data'
import { useUnlock } from '@/lib/unlock'
import { springStep, SpringState } from '@/lib/spring'

function Tile({ item, big }: { item: ResearchItem; big: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ rx: 0, ry: 0 })
  const spring = useRef<{ rx: SpringState; ry: SpringState }>({
    rx: { value: 0, velocity: 0 },
    ry: { value: 0, velocity: 0 },
  })
  const raf = useRef<number>(0)
  const last = useRef(performance.now())

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      target.current = { rx: -py * 10, ry: px * 10 }
    }
    const onLeave = () => { target.current = { rx: 0, ry: 0 } }

    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - last.current) / 1000, 0.05)
      last.current = now
      spring.current.rx = springStep(spring.current.rx, target.current.rx, dt, 180, 18)
      spring.current.ry = springStep(spring.current.ry, target.current.ry, dt, 180, 18)
      el.style.transform = `perspective(700px) rotateX(${spring.current.rx.value}deg) rotateY(${spring.current.ry.value}deg)`
      raf.current = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    raf.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div ref={ref} className={`mosaic-tile ${big ? 'mosaic-tile-big' : ''}`}>
      <span className={`tag ${item.tagAccent ? 'tag-accent' : ''}`}>{item.tag}</span>
      {item.titleHtml ? (
        <p className="font-serif text-fg italic mt-2 mb-2 leading-snug" style={{ fontSize: big ? '1.4rem' : '1.05rem' }} dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
      ) : (
        <p className="font-serif text-fg italic mt-2 mb-2 leading-snug" style={{ fontSize: big ? '1.4rem' : '1.05rem' }}>{item.title}</p>
      )}
      <p className="text-[0.8125rem] text-muted leading-relaxed">{item.tagline}</p>
      {item.links && item.links.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mt-4">
          {item.links.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-accent hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
      <span className="font-mono text-[0.6875rem] text-subtle absolute top-5 right-5 tabular-nums">{item.period}</span>
    </div>
  )
}

export default function MosaicGrid({ items }: { items: ResearchItem[] }) {
  const { unlocked } = useUnlock()
  const visible = items.filter(item => !item.hidden || unlocked)

  return (
    <div className="mosaic-grid">
      {visible.map((item, idx) => (
        <Tile key={item.title} item={item} big={idx === 0 || idx === 3} />
      ))}
    </div>
  )
}

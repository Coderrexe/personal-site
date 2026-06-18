'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  prefix?: string
  value: number
  suffix?: string
  label: string
}

const stats: Stat[] = [
  { value: 7, label: 'countries deployed in' },
  { value: 2000, label: 'teams outcompeted, NASA Conrad Challenge' },
  { prefix: '$', value: 1, suffix: 'B+', label: 'valuation companies worked at' },
  { value: 2, label: 'hackathons won, 1st place' },
]

function Counter({ stat, start }: { stat: Stat; start: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!start) return
    const duration = 1100
    const startTime = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(stat.value * eased))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [start, stat.value])

  return (
    <span>
      {stat.prefix}
      {display.toLocaleString()}
      {stat.suffix}
    </span>
  )
}

export default function StatStrip() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 mt-10 pt-8 border-t border-line"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="sm:border-l sm:first:border-l-0 border-line sm:pl-6 sm:first:pl-0"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
          }}
        >
          <p className="font-serif text-2xl text-fg tabular-nums leading-none mb-1.5">
            <Counter stat={stat} start={visible} />
          </p>
          <p className="text-xs text-muted leading-snug max-w-[9rem]">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

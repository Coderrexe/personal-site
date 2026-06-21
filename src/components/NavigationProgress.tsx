'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number>(0)
  const targetRef = useRef(0)

  // Smoothly animate width toward target
  const animateTo = (target: number) => {
    targetRef.current = target
    const step = () => {
      setWidth(prev => {
        const diff = target - prev
        if (Math.abs(diff) < 0.3) return target
        const next = prev + diff * 0.08
        rafRef.current = requestAnimationFrame(step)
        return next
      })
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(step)
  }

  // Intercept link clicks to start the bar
  useEffect(() => {
    const onLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return
      if (href === pathname) return
      // Start bar
      cancelAnimationFrame(rafRef.current)
      setWidth(0)
      setVisible(true)
      // Quickly reach 30%, then slowly creep to 80%
      requestAnimationFrame(() => {
        animateTo(30)
        setTimeout(() => animateTo(80), 200)
      })
    }
    window.addEventListener('click', onLinkClick, true)
    return () => window.removeEventListener('click', onLinkClick, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // When pathname changes, navigation is complete → finish the bar
  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname
    cancelAnimationFrame(rafRef.current)
    setWidth(100)
    const t = setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 350)
    return () => clearTimeout(t)
  }, [pathname])

  if (!visible && width === 0) return null

  return (
    <div
      className="fixed top-0 left-0 z-[9999999] h-[2px] pointer-events-none"
      style={{
        width: `${width}%`,
        background: 'var(--accent)',
        transition: width === 100 ? 'width 0.2s ease-out, opacity 0.35s ease 0.35s' : 'none',
        opacity: visible ? 1 : 0,
        boxShadow: '0 0 8px var(--accent)',
      }}
    />
  )
}

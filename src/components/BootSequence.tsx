'use client'

import { useEffect, useState } from 'react'

const TOTAL_MS = 1500

export default function BootSequence() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadyBooted = sessionStorage.getItem('booted')

    if (reduceMotion || alreadyBooted) {
      sessionStorage.setItem('booted', '1')
      return
    }

    sessionStorage.setItem('booted', '1')
    setShow(true)
    document.body.style.overflow = 'hidden'

    const t = setTimeout(() => {
      setShow(false)
      document.body.style.overflow = ''
    }, TOTAL_MS)

    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [])

  if (!show) return null

  return (
    <div className="boot-overlay" aria-hidden>
      <div className="boot-visual">
        <span className="boot-ring" />
        <span className="boot-line" />
        <span className="boot-dot" />
      </div>
    </div>
  )
}

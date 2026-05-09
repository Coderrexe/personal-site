'use client'

import { useEffect, useState } from 'react'

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.06 1.06M11.04 11.04l1.06 1.06M11.1 2.9l-1.06 1.06M3.96 11.04l-1.06 1.06"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M12.5 8A5.5 5.5 0 016.5 2a5.5 5.5 0 100 11A5.5 5.5 0 0012.5 8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    const dark = saved ? saved === 'dark' : true
    setIsDark(dark)
  }, [])

  const toggle = () => {
    const html = document.documentElement
    html.classList.add('theme-transitioning')

    const next = !isDark
    setIsDark(next)
    html.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')

    setTimeout(() => html.classList.remove('theme-transitioning'), 300)
  }

  if (!mounted) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 flex items-center justify-center rounded-sm text-muted hover:text-fg hover:bg-hover transition-colors duration-150"
    >
      <span
        style={{
          display: 'block',
          transition: 'transform 0.3s ease, opacity 0.2s ease',
          transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  )
}

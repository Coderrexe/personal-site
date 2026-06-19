'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import Magnetic from './Magnetic'

const links = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
]

export default function NavClient() {
  const pathname = usePathname()
  const [condensed, setCondensed] = useState(false)

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-50 flex justify-center px-4 pt-3">
      <nav
        className={`nav-bg border border-line transition-all duration-[400ms] ease-out ${
          condensed
            ? 'rounded-full px-4 py-2 mt-1 shadow-lg w-fit'
            : 'rounded-2xl px-6 py-3.5 mt-0 w-full max-w-[60rem]'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <div className="flex items-center gap-1">
          <Magnetic strength={0.4}>
            <Link
              href="/"
              className="font-mono text-sm text-fg hover:text-accent transition-colors duration-200 mr-3"
            >
              Simba Shi
            </Link>
          </Magnetic>
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Magnetic key={href} strength={0.35}>
                <Link
                  href={href}
                  className={`relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 block ${
                    active ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active && (
                    <span
                      className="absolute inset-0 rounded-md bg-surface border border-line"
                      style={{ transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              </Magnetic>
            )
          })}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  )
}

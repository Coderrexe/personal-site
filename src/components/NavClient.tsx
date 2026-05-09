'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
]

export default function NavClient() {
  const pathname = usePathname()

  return (
    <nav className="nav-bg sticky top-0 z-50 border-b border-line">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm text-fg hover:text-accent transition-colors duration-200"
        >
          Simba Shi
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                  active ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {active && (
                  <span
                    className="absolute inset-0 rounded-md bg-surface border border-line"
                    style={{
                      transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            )
          })}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import Magnetic from './Magnetic'

const links = [
  { href: '/work', label: 'work' },
  { href: '/writing', label: 'writing' },
]

export default function NavClient() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-6 sm:px-8 nav-bg">
      <Magnetic strength={0.35}>
        <Link href="/" className="font-mono text-xs text-fg hover:text-accent transition-colors duration-200">
          simba shi
        </Link>
      </Magnetic>
      <div className="flex items-center gap-5">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Magnetic key={href} strength={0.35}>
              <Link
                href={href}
                className={`font-mono text-xs transition-colors duration-200 ${active ? 'text-accent' : 'text-muted hover:text-fg'}`}
              >
                /{label}
              </Link>
            </Magnetic>
          )
        })}
        <ThemeToggle />
      </div>
    </nav>
  )
}

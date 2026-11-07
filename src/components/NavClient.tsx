'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import Magnetic from './Magnetic'

const links = [
  { href: '/work', label: 'work' },
  { href: '/research', label: 'research' },
  { href: '/writing', label: 'writing' },
]

export default function NavClient() {
  const pathname = usePathname()

  // The nav is sticky (iOS Safari keeps sticky elements pinned while its chrome
  // collapses) and grows by the status-bar inset so it also covers the notch
  // corners on iPhones; the solid strip behind the status bar keeps text from
  // showing through there. The negative margin keeps page layout unchanged.
  return (
    <>
      <div
        aria-hidden
        className="fixed top-0 inset-x-0 z-[60] h-[env(safe-area-inset-top)] bg-bg pointer-events-none"
      />
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-8 nav-bg h-[calc(3.5rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] -mb-[calc(3.5rem+env(safe-area-inset-top))]">
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
    </>
  )
}

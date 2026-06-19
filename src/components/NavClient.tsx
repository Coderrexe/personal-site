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
    <>
      <div className="fixed top-5 left-6 z-50">
        <Magnetic strength={0.35}>
          <Link href="/" className="font-mono text-xs text-fg hover:text-accent transition-colors duration-200">
            simba shi
          </Link>
        </Magnetic>
      </div>
      <div className="fixed top-5 right-6 z-50 flex items-center gap-4">
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
    </>
  )
}

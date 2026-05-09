import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
]

export default function Nav() {
  return (
    <nav className="nav-bg sticky top-0 z-50 border-b border-line">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm text-fg hover:text-accent transition-colors duration-150"
        >
          Simba Shi
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted hover:text-fg transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

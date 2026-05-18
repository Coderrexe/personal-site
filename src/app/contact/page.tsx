'use client'

import { useState } from 'react'
import FadeIn from '@/components/FadeIn'

function RevealEmail() {
  const [revealed, setReveal] = useState(false)

  const getEmail = () => {
    const u = 'simba.shi'
    const d = 'yale.edu'
    return `${u}@${d}`
  }

  if (!revealed) {
    return (
      <button
        onClick={() => setReveal(true)}
        className="text-sm text-muted hover:text-fg transition-colors duration-150 cursor-pointer"
      >
        reveal email →
      </button>
    )
  }

  const email = getEmail()
  return (
    <a
      href={`mailto:${email}`}
      className="text-sm text-fg hover:text-accent transition-colors duration-150"
    >
      {email} →
    </a>
  )
}

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <FadeIn>
        <section className="pt-20 pb-14">
          <h1 className="font-serif text-[2.2rem] text-fg tracking-[-0.02em] leading-tight">Contact</h1>
        </section>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="pb-24">

          <div className="flex items-baseline justify-between py-5 border-b border-line border-t">
            <span className="font-mono text-xs text-muted tracking-wider uppercase">Email</span>
            <RevealEmail />
          </div>

          <a
            href="https://github.com/Coderrexe"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline justify-between py-5 border-b border-line"
          >
            <span className="font-mono text-xs text-muted tracking-wider uppercase">GitHub</span>
            <span className="text-sm text-muted group-hover:text-fg transition-colors duration-150">
              Coderrexe →
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/simba-shi"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline justify-between py-5 border-b border-line"
          >
            <span className="font-mono text-xs text-muted tracking-wider uppercase">LinkedIn</span>
            <span className="text-sm text-muted group-hover:text-fg transition-colors duration-150">
              simba-shi →
            </span>
          </a>

        </div>
      </FadeIn>
    </div>
  )
}

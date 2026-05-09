import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { collections, essays } from '@/lib/data'
import FadeIn from '@/components/FadeIn'

interface Props {
  params: { collection: string; slug: string }
}

export function generateStaticParams() {
  const params: { collection: string; slug: string }[] = []
  for (const collection of collections) {
    for (const slug of collection.essaySlugs) {
      params.push({ collection: collection.slug, slug })
    }
  }
  return params
}

export function generateMetadata({ params }: Props): Metadata {
  const essay = essays.find((e) => e.slug === params.slug)
  if (!essay) return {}
  return { title: `${essay.title} — Simba Shi` }
}

export default function EssayPage({ params }: Props) {
  const collection = collections.find((c) => c.slug === params.collection)
  if (!collection) notFound()

  const essay = essays.find((e) => e.slug === params.slug)
  if (!essay || !collection.essaySlugs.includes(essay.slug)) notFound()

  return (
    <div className="max-w-4xl mx-auto px-6">

      {/* Back */}
      <FadeIn>
        <div className="pt-14 pb-12">
          <Link
            href="/writing"
            className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150"
          >
            ← Writing
          </Link>
        </div>
      </FadeIn>

      <article className="pb-28">

        {/* Title */}
        <FadeIn delay={80}>
          <header className="mb-14">
            <h1 className="font-serif text-[2rem] text-fg leading-[1.2] mb-4">
              {essay.title}
            </h1>
            <p className="font-mono text-xs text-muted tabular-nums">{essay.displayDate}</p>
          </header>
        </FadeIn>

        {/* Body */}
        <div className="space-y-10">
          {essay.sections.map((section, i) => (
            <FadeIn key={i} delay={160 + i * 60}>
              <div>
                {section.heading && (
                  <p className="font-mono text-xs text-muted mb-4">{section.heading}</p>
                )}
                {section.html ? (
                  <p
                    className="text-fg text-[0.9375rem] leading-[1.9] tracking-[0.005em]"
                    dangerouslySetInnerHTML={{ __html: section.body.replace(/\n/g, '<br />') }}
                  />
                ) : (
                  <p className="whitespace-pre-line text-fg text-[0.9375rem] leading-[1.9] tracking-[0.005em]">
                    {section.body}
                  </p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

      </article>
    </div>
  )
}

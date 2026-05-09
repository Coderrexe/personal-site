import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { collections } from '@/lib/data'
import FadeIn from '@/components/FadeIn'

interface Props {
  params: { collection: string }
}

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const collection = collections.find((c) => c.slug === params.collection)
  if (!collection) return {}
  return { title: `${collection.name} — Simba Shi` }
}

export default function CollectionPage({ params }: Props) {
  const collection = collections.find((c) => c.slug === params.collection)
  if (!collection) notFound()

  // Poetry essays link directly; collection index page not needed
  if (params.collection !== 'world-of-einsteins') redirect('/writing')

  return (
    <div className="max-w-4xl mx-auto px-6">

      {/* Back */}
      <FadeIn>
        <div className="pt-14 pb-12">
          <Link href="/writing" className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150">
            ← Writing
          </Link>
        </div>
      </FadeIn>

      {/* Epigraph */}
      {collection.quote && (
        <FadeIn delay={80}>
          <blockquote className="mb-16 max-w-lg">
            <p className="text-muted text-[0.9375rem] leading-[1.85] mb-3">
              &ldquo;{collection.quote.text}&rdquo;
            </p>
            <cite className="font-mono text-xs text-muted not-italic">
              {collection.quote.authorHtml ? (
                <span dangerouslySetInnerHTML={{ __html: `— ${collection.quote.authorHtml}` }} />
              ) : (
                <>— {collection.quote.author}</>
              )}
            </cite>
          </blockquote>
        </FadeIn>
      )}

      {/* Title */}
      <FadeIn delay={160}>
        <h1 className="font-serif text-[2.2rem] text-fg tracking-[-0.02em] leading-tight mb-3">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-muted text-sm mb-12">{collection.description}</p>
        )}
      </FadeIn>

      {/* Coming soon */}
      <FadeIn delay={240}>
        <p className="font-mono text-xs text-muted mt-4 pb-28">coming soon</p>
      </FadeIn>

    </div>
  )
}

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

  // Poems sit in a narrow column; long-form essays get a proper reading measure.
  const column = essay.wide ? 'max-w-[46rem]' : 'max-w-[38rem]'

  return (
    <div className={`${column} mx-auto px-8 sm:px-10`}>

      <FadeIn>
        <div className="pt-20 sm:pt-22 pb-10 sm:pb-12">
          <Link
            href="/writing"
            className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150"
          >
            ← Writing
          </Link>
        </div>
      </FadeIn>

      <article className="pb-28">

        <FadeIn delay={80}>
          <header className="mb-12 sm:mb-14 text-center">
            <h1 className="page-title mb-4">
              {essay.title}
            </h1>
            {essay.author && (
              <p className="text-sm text-fg mb-2">{essay.author}</p>
            )}
            <p className="font-mono text-xs text-muted tabular-nums">{essay.displayDate}</p>

            {essay.lede && essay.lede.length > 0 && (
              <div className="mt-10 sm:mt-12 mx-auto max-w-[34rem]">
                <span className="block w-8 border-t border-subtle mx-auto mb-7" />
                {essay.lede.map((line, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'text-fg text-[1.125rem] leading-[1.6] mb-3'
                        : 'text-muted text-[0.9375rem] leading-[1.7]'
                    }
                  >
                    {line}
                  </p>
                ))}
                <span className="block w-8 border-t border-subtle mx-auto mt-7" />
              </div>
            )}
          </header>
        </FadeIn>

        <div className="space-y-8 sm:space-y-10">
          {essay.sections.map((section, i) => (
            section.paragraphs ? (
              // Long-form prose: each paragraph fades in on its own, so landing
              // mid-essay (e.g. from a footnote back-link) never leaves it blank.
              <div key={i} className="essay-prose">
                {section.heading && (
                  <p className="font-mono text-xs text-muted mb-4">{section.heading}</p>
                )}
                {section.paragraphs.map((para, j) => (
                  <FadeIn key={j} delay={j === 0 ? 160 : 0}>
                    <p dangerouslySetInnerHTML={{ __html: para }} />
                  </FadeIn>
                ))}
              </div>
            ) : (
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
            )
          ))}
        </div>

        {essay.footnotes && essay.footnotes.length > 0 && (
            <footer className="mt-16 sm:mt-20 pt-8 border-t border-line">
              <p className="font-mono text-xs text-muted mb-6">Notes</p>
              <ol className="essay-notes">
                {essay.footnotes.map((note, i) => (
                  <li key={i} id={`fn${i + 1}`}>
                    <span dangerouslySetInnerHTML={{ __html: note }} />
                    <a href={`#fnref${i + 1}`} className="note-back" aria-label={`Back to note ${i + 1} in the text`}>↩</a>
                  </li>
                ))}
              </ol>
            </footer>
        )}

      </article>
    </div>
  )
}

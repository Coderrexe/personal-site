import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { collections, essays } from '@/lib/data'
import PageFade from '@/components/PageFade'

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

  // Poems: narrow, centred header. Long-form essays: wider column, left-aligned
  // header with the lede sitting under the byline like a standfirst.
  const wide = Boolean(essay.wide)
  const column = wide ? 'max-w-[52rem]' : 'max-w-[38rem]'

  return (
    <div className={`${column} mx-auto px-8 sm:px-10`}>
      <PageFade>

        <div className="pt-20 sm:pt-22 pb-10 sm:pb-12">
          <Link
            href="/writing"
            className="font-mono text-xs text-muted hover:text-fg transition-colors duration-150"
          >
            ← Writing
          </Link>
        </div>

        <article className="pb-28">

          <header className={`mb-12 sm:mb-14 ${wide ? '' : 'text-center'}`}>
            <h1 className="page-title mb-4">
              {essay.title}
            </h1>
            {essay.author && (
              <p className="text-[0.9375rem] text-fg">{essay.author}</p>
            )}
            <p className="font-mono text-xs text-muted tabular-nums mt-1.5">{essay.displayDate}</p>

            {essay.lede && essay.lede.length > 0 && (
              <div className="mt-7 max-w-[36rem]">
                {essay.lede.map((line, i) => (
                  <p key={i} className="text-[0.9375rem] text-muted leading-[1.7]">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </header>

          <div className="space-y-8 sm:space-y-10">
            {essay.sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <p className="font-mono text-xs text-muted mb-4">{section.heading}</p>
                )}
                {section.paragraphs ? (
                  <div className="essay-prose">
                    {section.paragraphs.map((para, j) => (
                      <p key={j} dangerouslySetInnerHTML={{ __html: para }} />
                    ))}
                  </div>
                ) : section.html ? (
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

      </PageFade>
    </div>
  )
}

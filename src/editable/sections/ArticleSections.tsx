import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({
      ...(category && category !== 'all' ? { category } : {}),
      page: String(nextPage),
    }).toString()}`

  return (
    <main className="min-h-screen">
      <section className={`${dc.shell.section} pt-24 pb-14 sm:pt-32`}>
        <EditableReveal>
          <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
            <span className="h-px w-6 bg-white/25" />
            {voice.eyebrow}
          </span>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className={`mt-8 max-w-4xl ${dc.type.display}`}>
            {renderTitleWithItalic(voice.headline)}
          </h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className="mt-8 max-w-2xl text-lg leading-[1.65] text-white/70">{voice.description}</p>
        </EditableReveal>
        <EditableReveal index={3}>
          <form action={basePath} className="mt-12 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              className="min-w-0 flex-1 appearance-none rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white outline-none focus:border-white/40"
            >
              <option value="all" className="bg-[#1e1e1e]">
                All categories
              </option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug} className="bg-[#1e1e1e]">
                  {item.name}
                </option>
              ))}
            </select>
            <button className={dc.button.primary}>
              <span>Filter</span>
              <span className={dc.button.icon}>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
          </form>
        </EditableReveal>
      </section>

      <section className={`${dc.shell.section} pb-24`}>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={index % 5}>
                <ArticleListCard
                  post={post}
                  href={postHref('article', post, basePath)}
                  index={index + (page - 1) * pagination.limit}
                />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-[var(--editable-radius-lg)] border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
            <h2 className="editable-display text-[1.75rem] tracking-[-0.02em] text-white">No articles yet</h2>
            <p className="mt-3 text-sm text-white/60">Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors duration-300 hover:border-white/40">
              Previous
            </Link>
          ) : null}
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/60">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link href={pageHref(page + 1)} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors duration-300 hover:border-white/40">
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className="min-h-screen">
      <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
        <Link
          href="/article"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition-colors duration-300 hover:text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15">
            <ChevronLeft className="h-3.5 w-3.5" />
          </span>
          Back to {voice.eyebrow.toLowerCase()}
        </Link>
        <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <span className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              {voice.eyebrow}
            </span>
            <h1 className={`mt-6 max-w-4xl ${dc.type.display}`}>
              {renderTitleWithItalic(post?.title || pagesContent.detailPages.article.fallbackTitle)}
            </h1>
          </div>
          <aside className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8">
            <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
              Reading note
            </p>
            <p className="mt-4 text-[14.5px] leading-[1.65] text-white/70">{voice.secondaryNote}</p>
            <Link href="/contact" className={`mt-6 ${dc.button.primary}`}>
              <span>Contact</span>
              <span className={dc.button.icon}>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-3xl px-5 pb-24 pt-14 sm:px-8">
        <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
          <p className="text-[15px] leading-[1.7] text-white/70">
            {post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}
          </p>
        </div>
      </section>
    </main>
  )
}

function renderTitleWithItalic(text: string) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return null
  const words = clean.split(' ')
  if (words.length < 4) return <span>{clean}</span>
  const italicCount = Math.min(3, Math.max(1, Math.floor(words.length / 5)))
  const head = words.slice(0, words.length - italicCount).join(' ')
  const tail = words.slice(-italicCount).join(' ')
  return (
    <>
      <span>{head} </span>
      <span className="editable-display-italic text-[var(--slot4-accent)]">{tail}</span>
    </>
  )
}

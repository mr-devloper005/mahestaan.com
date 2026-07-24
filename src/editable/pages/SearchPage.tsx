import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(content.description) ||
      compactRaw(content.excerpt) ||
      compactRaw(content.body) ||
      ''
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((value) => compactText(value).includes(query))
}

function labelForTask(task: TaskKey | null | undefined) {
  if (!task) return 'Record'
  return taskPageVoices[task]?.eyebrow || SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Record'
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = labelForTask(task)

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25"
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
          />
        </div>
      ) : null}
      <div className="p-6">
        <p className="editable-mono text-[10px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{taskLabel}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[1.25rem] leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h2>
        {summary ? (
          <p className="mt-3 line-clamp-2 text-[14px] leading-[1.55] text-white/55">{summary}</p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-[var(--slot4-accent)]">
          Open result
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-24 pb-14 sm:pt-32`}>
          <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
            <span className="h-px w-6 bg-white/25" />
            {pagesContent.search.hero.badge}
          </span>
          <h1 className={`mt-8 max-w-3xl ${dc.type.heroTitle}`}>
            <span>Search across every </span>
            <span className="editable-display-italic text-[var(--slot4-accent)]">shelf.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-white/70">{pagesContent.search.hero.description}</p>

          <form action="/search" className="mt-12 rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-6 sm:p-8">
            <input type="hidden" name="master" value="1" />
            <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3">
              <Search className="h-5 w-5 text-white/50" />
              <input
                name="q"
                defaultValue={query}
                placeholder={pagesContent.search.hero.placeholder}
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-white/40"
              />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
                <Filter className="h-4 w-4 text-white/50" />
                <input
                  name="category"
                  defaultValue={category}
                  placeholder="Category"
                  className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-white/40"
                />
              </label>
              <select
                name="task"
                defaultValue={task}
                className="appearance-none rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] font-medium text-white outline-none focus:border-white/40"
              >
                <option value="" className="bg-[#1e1e1e]">
                  All sections
                </option>
                {enabledTasks.map((item) => (
                  <option key={item.key} value={item.key} className="bg-[#1e1e1e]">
                    {taskPageVoices[item.key as TaskKey]?.eyebrow || item.label}
                  </option>
                ))}
              </select>
              <button className={dc.button.primary} type="submit">
                <span>Search</span>
                <span className={dc.button.icon}>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </form>
        </section>

        <section className={`${dc.shell.section} pb-32`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/55">
                {results.length} results
              </p>
              <h2 className="editable-display mt-4 text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.02em] text-white">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/" className={dc.button.secondary}>
              <span>Back home</span>
              <span className={dc.button.iconSecondary}>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {results.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post) => (
                <SearchResultCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[var(--editable-radius-lg)] border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
              <h3 className="editable-display text-[1.75rem] tracking-[-0.02em] text-white">Nothing matched.</h3>
              <p className="mt-3 text-sm text-white/55">Try a different keyword, category, or section.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}

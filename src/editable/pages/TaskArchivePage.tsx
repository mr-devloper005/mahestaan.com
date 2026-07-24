import Link from 'next/link'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Download,
  FileText,
  Globe,
  MapPin,
  Phone,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [
    ...media,
    ...images,
    ...(isUrl(image) ? [image] : []),
    ...(isUrl(logo) ? [logo] : []),
  ]
    .filter(Boolean)
    .slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) =>
  value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 xl:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const kicker = theme.kicker
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--tk-text)]"
      >
        <section className={`${dc.shell.section} pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24`}>
          <EditableReveal>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/55">
              <span className="editable-mono text-[var(--tk-accent)]">{kicker}</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span className="editable-mono">Section {String(Object.keys(taskGrid).indexOf(task) + 1).padStart(2, '0')}</span>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-8 max-w-4xl ${dc.type.display}`}>
              {voice?.headline ? renderTitleWithItalic(voice.headline) : `Browse ${kicker.toLowerCase()}.`}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-white/65">
              {voice?.description || theme.note}
            </p>
          </EditableReveal>

          <EditableReveal index={3}>
            <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="editable-mono text-[11px] uppercase tracking-[0.24em] text-white/50">
                <span className="text-white">{posts.length}</span>{' '}
                {posts.length === 1 ? 'record' : 'records'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-3">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-white/15 bg-white/[0.04] pl-4 pr-10 text-sm font-medium text-white outline-none transition focus:border-white/40"
                    aria-label={voice?.filterLabel || 'Filter category'}
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
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                </div>
                <button className={dc.button.primary}>
                  <span>Apply</span>
                  <span className={dc.button.icon}>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </form>
            </div>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-24 sm:pb-32`}>
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index % 6}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--editable-radius-lg)] border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
              <Search className="mx-auto h-7 w-7 text-white/40" />
              <h2 className="editable-display mt-6 text-2xl tracking-[-0.02em] text-white">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Try another category, or check back after new {kicker.toLowerCase()} are published.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-full border border-white/15 px-5 py-2.5 font-medium text-white/80 transition-colors duration-300 hover:border-white/40 hover:text-white"
                >
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-medium text-white/60">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="rounded-full border border-white/15 px-5 py-2.5 font-medium text-white/80 transition-colors duration-300 hover:border-white/40 hover:text-white"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

// Convert "Long-form articles with a calmer editorial rhythm." into a display
// heading with the last two-three words italicised as the accent word — keeps
// the Scion pattern without forcing content authors to markup their strings.
function renderTitleWithItalic(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim()
  const words = clean.split(' ')
  if (words.length < 4) return <span>{clean}</span>
  const italicCount = Math.min(3, Math.max(1, Math.floor(words.length / 5)))
  const head = words.slice(0, words.length - italicCount).join(' ')
  const tail = words.slice(-italicCount).join(' ')
  return (
    <>
      <span>{head} </span>
      <span className="editable-display-italic text-[var(--tk-accent)]">{tail}</span>
    </>
  )
}

function ArchivePostCard({
  post,
  task,
  basePath,
  index,
}: {
  post: SitePost
  task: TaskKey
  basePath: string
  index: number
}) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardMeta({ children }: { children: React.ReactNode }) {
  return <div className="editable-mono flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/45">{children}</div>
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-[var(--tk-accent)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Field note')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
        />
      </div>
      <div className="p-7">
        <CardMeta>
          <span>{category}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>No.{String(index + 1).padStart(2, '0')}</span>
        </CardMeta>
        <h2 className="editable-display mt-4 line-clamp-3 text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-2 text-[14.5px] leading-[1.6] text-white/55">{getSummary(post)}</p>
        <CardArrow label="Read note" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-start gap-6 p-6 sm:p-7`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[var(--slot4-media-bg)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-8 w-8 text-white/45" />}
      </div>
      <div className="min-w-0 flex-1">
        <CardMeta>
          <span>{taskPageVoices.listing.eyebrow}</span>
          {location ? (
            <>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="normal-case tracking-normal text-white/60">{location}</span>
            </>
          ) : null}
        </CardMeta>
        <h2 className="editable-display mt-3 truncate text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[14.5px] leading-[1.55] text-white/55">{getSummary(post)}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55">
          {phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {cleanDomain(website)}
            </span>
          ) : null}
        </div>
      </div>
      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[2rem] leading-none tracking-[-0.02em] text-[var(--tk-accent)]">
          {price || 'Open'}
        </span>
        {condition ? <span className={dc.badge.pill}>{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-6 text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
        {post.title}
      </h2>
      <p className="mt-4 line-clamp-3 flex-1 text-[14.5px] leading-[1.6] text-white/55">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/55">
        <span className="inline-flex items-center gap-1.5">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link
      href={href}
      className="group mb-6 block break-inside-avoid overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25"
    >
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.85))]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-[1.15rem] leading-[1.2] tracking-[-0.015em] text-white">
            {post.title}
          </h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/70">
            View image <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex items-start gap-4 p-6`}>
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <CardMeta>
          <span>Saved</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{String(index + 1).padStart(2, '0')}</span>
        </CardMeta>
        <h2 className="editable-display mt-3 text-[1.15rem] leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.55] text-white/55">{getSummary(post)}</p>
        {website ? (
          <p className="editable-mono mt-4 truncate text-[11px] uppercase tracking-[0.2em] text-[var(--tk-accent)]">
            {cleanDomain(website)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <FileText className="h-7 w-7" />
        </div>
        <span className={dc.badge.pill}>{category}</span>
      </div>
      <h2 className="editable-display mt-8 text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
        {post.title}
      </h2>
      <p className="mt-4 line-clamp-3 flex-1 text-[14.5px] leading-[1.6] text-white/55">{getSummary(post)}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-[var(--tk-accent)]">
        Open reference
        <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center gap-5 p-7 text-center`}>
      <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-white/10 bg-[var(--slot4-media-bg)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-white/45" />}
      </div>
      <div>
        <h2 className="editable-display text-[1.15rem] leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h2>
        {role ? (
          <p className="editable-mono mt-2 text-[10px] uppercase tracking-[0.26em] text-[var(--tk-accent)]">
            {role}
          </p>
        ) : null}
      </div>
      <p className="line-clamp-2 text-[14px] leading-[1.55] text-white/55">{getSummary(post)}</p>
      <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-[var(--tk-accent)]">
        View profile
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

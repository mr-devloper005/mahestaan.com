import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

// Reduce any content payload — rich HTML, entity-encoded HTML, or already-plain text — to
// a clean plain-text card summary. Two tag-strip passes (before + after entity decode)
// also catch entity-encoded markup like &lt;p&gt;.
export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/*
  EditorialFeatureCard — full-bleed dark hero card. Serif h2, italic accent
  isn't applied here (titles come from CMS); we lean on the display face itself.
*/
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link
      href={href}
      className={`group relative block min-w-0 overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
    >
      <div className="relative min-h-[440px] p-8 sm:p-10 lg:min-h-[560px] lg:p-12">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-[900ms] group-hover:scale-[1.03] group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,0.35)_0%,rgba(18,18,18,0.88)_78%)]" />
        <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-end lg:min-h-[500px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className={dc.badge.accentPill}>{label}</span>
            <span className={dc.badge.pill}>{getEditableCategory(post)}</span>
          </div>
          <h3 className="editable-display mt-6 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.025em] text-white">
            {post.title}
          </h3>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.65] text-white/70 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white">
            Read the story
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}

/*
  RailPostCard — used in horizontal rails. Card-radius, 4:3 image, meta row,
  serif title. Matches Scion blog card treatment.
*/
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
      style={{ transitionDelay: `${index * 20}ms` }}
    >
      <div className={`${dc.media.frame} ${dc.media.ratio} overflow-hidden`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
          <span className="editable-mono text-white/70">{getEditableCategory(post)}</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="editable-display mt-3 line-clamp-3 text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

/*
  CompactIndexCard — used in dense listings (secondary rows / sidebars).
  Small meta chip + number + serif title.
*/
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group flex min-w-0 items-start gap-5 rounded-[var(--editable-radius)] border border-transparent px-4 py-5 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.03]`}
    >
      <span className="editable-mono grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-white/60">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
          {getEditableCategory(post)}
        </p>
        <h3 className="editable-display mt-2 line-clamp-2 text-[1.15rem] leading-[1.25] tracking-[-0.01em] text-white">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.55] text-white/55">
          {getEditableExcerpt(post, 110)}
        </p>
      </div>
      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
    </Link>
  )
}

/*
  ArticleListCard — split image + copy tile used on archive/blog grids.
*/
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-5 ${dc.motion.lift} sm:grid-cols-[260px_minmax(0,1fr)] sm:p-6`}
    >
      <div className={`${dc.media.frame} aspect-[16/11] overflow-hidden sm:aspect-auto sm:min-h-[210px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 pt-1 sm:pt-3 sm:pr-2">
        <div className="flex items-center gap-2">
          <span className="editable-mono text-[10px] uppercase tracking-[0.26em] text-white/45">
            {getEditableCategory(post)}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span className="editable-mono text-[10px] uppercase tracking-[0.26em] text-white/45">
            No.{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h2 className="editable-display mt-3 line-clamp-3 text-[clamp(1.4rem,2.2vw,1.85rem)] leading-[1.18] tracking-[-0.02em] text-white">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-[15px] leading-[1.65] text-white/60">
          {getEditableExcerpt(post, 180)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
          Continue
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </div>
    </Link>
  )
}

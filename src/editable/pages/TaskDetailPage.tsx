import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Building2,
  Camera,
  CheckCircle2,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Layers,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  Shield,
  Sparkles,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { taskPageVoices } from '@/editable/content/task-pages.content'

export const revalidate = 3

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------- Content helpers ------------------------- */

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

// Numeric field lookup — handles both string and number values in content.
function getNumericField(post: SitePost, keys: string[]): number | null {
  const content = getContent(post)
  for (const key of keys) {
    const value = content[key]
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value
    if (typeof value === 'string') {
      const parsed = Number(value.replace(/[, ]/g, ''))
      if (Number.isFinite(parsed) && parsed > 0) return parsed
    }
  }
  return null
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

// Look up a size string in content directly (e.g. "2.4 MB"), else derive from
// any numeric byte-count field we can find.
function extractSize(post: SitePost): string {
  const stringSize = getField(post, ['fileSize', 'size', 'filesize'])
  if (stringSize && /[a-z]/i.test(stringSize)) return stringSize
  const bytes =
    getNumericField(post, ['fileSizeBytes', 'sizeBytes', 'bytes', 'fileSize', 'size', 'contentLength'])
  if (bytes) return formatBytes(bytes)
  // Some feeds nest file info on media entries
  const media = Array.isArray(post.media) ? post.media : []
  for (const item of media) {
    if (!item || typeof item !== 'object') continue
    const entry = item as Record<string, unknown>
    const raw = entry.size ?? entry.bytes ?? entry.fileSize
    if (typeof raw === 'number' && raw > 0) return formatBytes(raw)
    if (typeof raw === 'string' && /[a-z]/i.test(raw)) return raw
  }
  return ''
}

function extractPages(post: SitePost): string {
  const stringPages = getField(post, ['pages', 'pageCount', 'numberOfPages', 'pageNo', 'totalPages'])
  if (stringPages && /^\d+/.test(stringPages)) return stringPages
  const n = getNumericField(post, ['pages', 'pageCount', 'numberOfPages', 'pageNo', 'totalPages'])
  return n ? String(Math.floor(n)) : ''
}

// Fetch the PDF over the network (cache-shared via Next fetch cache) and pull
// out real size + page count when the CMS didn't include them.
async function fetchPdfStats(url: string): Promise<{ size?: string; pages?: string }> {
  if (!url || !/^https?:\/\//i.test(url)) return {}
  const stats: { size?: string; pages?: string } = {}
  // Try HEAD first — cheap and often carries Content-Length.
  try {
    const headRes = await fetch(url, { method: 'HEAD', cache: 'force-cache' })
    if (headRes.ok) {
      const cl = headRes.headers.get('content-length')
      if (cl) {
        const n = parseInt(cl, 10)
        if (Number.isFinite(n) && n > 0) stats.size = formatBytes(n)
      }
    }
  } catch {
    /* fall through to GET */
  }
  // GET the body to count pages (and confirm size if HEAD didn't have it).
  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return stats
    const buf = await res.arrayBuffer()
    if (!stats.size) stats.size = formatBytes(buf.byteLength)
    const bytes = new Uint8Array(buf)
    // Only scan the last 1 MB — the pages tree usually sits near the trailer,
    // and the count-fallback still works across the full file when needed.
    const scanLen = Math.min(bytes.byteLength, 1_048_576)
    const tail = new TextDecoder('latin1').decode(bytes.subarray(bytes.byteLength - scanLen))
    let pagesText: string | undefined
    const countMatch = /\/Type\s*\/Pages\b[\s\S]{0,600}?\/Count\s+(\d+)/i.exec(tail)
    if (countMatch) pagesText = countMatch[1]
    if (!pagesText) {
      // Fallback: count /Type /Page occurrences across the whole file.
      const fullText = new TextDecoder('latin1').decode(bytes)
      const matches = fullText.match(/\/Type\s*\/Page(?![a-zA-Z])/g)
      if (matches && matches.length > 0) pagesText = String(matches.length)
    }
    if (pagesText) stats.pages = pagesText
  } catch {
    /* leave whatever we got from HEAD */
  }
  return stats
}

/* ------------------------- Root dispatcher ------------------------- */

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--tk-text)]"
      >
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------- Shared UI atoms ------------------------- */

function MonoChip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'accent' | 'sage' }) {
  const tones: Record<string, string> = {
    neutral: 'border-white/10 bg-white/[0.04] text-white/70',
    accent: 'border-[var(--tk-accent)]/40 bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]',
    sage: 'border-[var(--slot4-accent-secondary)]/35 bg-[color-mix(in_oklab,var(--slot4-accent-secondary)_18%,transparent)] text-[var(--slot4-accent-secondary)]',
  }
  return (
    <span
      className={`editable-mono inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="editable-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/55">
      <span className="text-[var(--tk-accent)]">{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-white/25" />
      <span>{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const label = taskPageVoices[task]?.eyebrow || taskConfig?.label || 'section'
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors duration-300 hover:text-white"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-white/40">
        <ArrowLeft className="h-3.5 w-3.5" />
      </span>
      Back to {label.toLowerCase()}
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-[1.75]'
      }`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ post }: { post: SitePost }) {
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 6) : []
  if (!tags.length) return null
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className={dc.badge.pill}>
          <Tag className="h-3 w-3" /> {tag}
        </span>
      ))}
    </div>
  )
}

function Divider() {
  return <div className="my-12 h-px bg-white/10" />
}

/* ============================== ARTICLE ============================== */

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <BackLink task="article" />
        <div className="mt-12">
          <Kicker task="article">{categoryOf(post, 'Field note')}</Kicker>
        </div>
        <h1 className="editable-display mt-8 text-balance text-[clamp(2.5rem,5.4vw,4rem)] leading-[1.05] tracking-[-0.03em] text-white">
          {post.title}
        </h1>
        {leadText(post) ? (
          <p className="editable-display mt-8 text-[clamp(1.25rem,2vw,1.5rem)] italic leading-[1.5] text-white/80">
            {leadText(post)}
          </p>
        ) : null}
        {images[0] ? (
          <div className="mt-12 overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-media-bg)]">
            <img src={images[0]} alt="" className="aspect-[16/9] w-full object-cover" />
          </div>
        ) : null}
        <BodyContent post={post} />
        <TagChips post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ============================== LISTING ============================== */

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 7)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'opening', 'openingHours', 'schedule']) || 'By appointment'
  const category = categoryOf(post, 'Place')
  const mapSrc = mapSrcFor(post)

  return (
    <>
      <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
        <BackLink task="listing" />

        <div className="mt-12 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <MonoChip tone="accent">{taskPageVoices.listing.eyebrow}</MonoChip>
            <MonoChip>{category}</MonoChip>
            <MonoChip tone="sage">
              <Shield className="h-3 w-3" /> Verified record
            </MonoChip>
          </div>
          <h1 className="editable-display mt-8 text-balance text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.03] tracking-[-0.03em] text-white">
            {renderTitleWithItalic(post.title)}
          </h1>
          {leadText(post) ? (
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-white/70 sm:text-xl">{leadText(post)}</p>
          ) : null}
        </div>

        {hero ? (
          <div className="mt-14 overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-media-bg)]">
            <img src={hero} alt={post.title} className="aspect-[16/9] w-full object-cover" />
          </div>
        ) : (
          <div className="mt-14 grid aspect-[16/9] w-full place-items-center rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-media-bg)]">
            <Building2 className="h-16 w-16 text-white/40" />
          </div>
        )}

        <QuickFacts
          items={[
            { icon: MapPin, label: 'Location', value: address || 'Address on request' },
            { icon: Phone, label: 'Phone', value: phone || 'Contact via email' },
            { icon: Compass, label: 'Hours', value: hours },
            { icon: Shield, label: 'Status', value: 'Verified' },
          ]}
        />
      </section>

      <section className={`${dc.shell.section} pb-24 pt-20 sm:pb-32`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <div className="max-w-3xl">
              <h2 className="editable-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] tracking-[-0.02em] text-white">
                About this <span className="editable-display-italic text-[var(--tk-accent)]">place.</span>
              </h2>
              <BodyContent post={post} />
              <TagChips post={post} />
            </div>

            {gallery.length ? (
              <>
                <Divider />
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/50">Field images</p>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gallery.map((image, i) => (
                    <div
                      key={`${image}-${i}`}
                      className="overflow-hidden rounded-[var(--editable-radius)] border border-white/10 bg-[var(--slot4-media-bg)]"
                    >
                      <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {mapSrc ? (
              <>
                <Divider />
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/50">On the map</p>
                <div className="mt-6 overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-media-bg)]">
                  <iframe src={mapSrc} title={`Map for ${post.title}`} loading="lazy" className="h-[420px] w-full border-0" />
                </div>
              </>
            ) : null}
          </article>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ContactCard
              post={post}
              address={address}
              phone={phone}
              email={email}
              website={website}
              hours={hours}
            />
            <TrustPanel
              items={[
                { icon: CheckCircle2, label: 'Identity verified' },
                { icon: Sparkles, label: 'Curated by editors' },
                { icon: Shield, label: 'Contact details checked' },
              ]}
            />
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} title="More from the directory" />
    </>
  )
}

/* ============================== PDF (Reference Library) ============================== */

async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const filename = getField(post, ['filename', 'fileName']) || `${post.slug}.pdf`
  let pages = extractPages(post)
  let size = extractSize(post)
  if ((!pages || !size) && fileUrl) {
    const stats = await fetchPdfStats(fileUrl)
    if (!pages && stats.pages) pages = stats.pages
    if (!size && stats.size) size = stats.size
  }
  if (!pages) pages = '—'
  if (!size) size = '—'
  const uploader = getField(post, ['uploader', 'author', 'contributor']) || 'Editors'
  const updatedLabel = 'Recently'
  const category = categoryOf(post, 'Reference')
  const insides = Array.isArray(getContent(post).sections)
    ? (getContent(post).sections as unknown[]).filter((v): v is string => typeof v === 'string').slice(0, 6)
    : []
  const insideFallback = ['Executive summary', 'Methodology & scope', 'Findings', 'Recommendations', 'Sources']
  const insideList = insides.length ? insides : insideFallback

  return (
    <>
      <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
        <BackLink task="pdf" />

        <div className="mt-12 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <MonoChip tone="accent">Reference library</MonoChip>
            <MonoChip>File</MonoChip>
            <MonoChip tone="sage">{category}</MonoChip>
          </div>
          <h1 className="editable-display mt-10 text-balance text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] tracking-[-0.035em] text-white">
            {renderTitleWithItalic(post.title)}
          </h1>
          {leadText(post) ? (
            <blockquote className="editable-display mt-10 max-w-3xl border-l-2 border-[var(--tk-accent)] pl-6 text-[clamp(1.3rem,2.4vw,1.75rem)] italic leading-[1.4] text-white/85">
              {leadText(post)}
            </blockquote>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {fileUrl ? (
              <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.primary}>
                <span>Download file</span>
                <span className={dc.button.icon}>
                  <Download className="h-4 w-4" />
                </span>
              </Link>
            ) : null}
            {fileUrl ? (
              <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>
                <span>Open in new tab</span>
                <span className={dc.button.iconSecondary}>
                  <ExternalLink className="h-4 w-4" />
                </span>
              </Link>
            ) : null}
          </div>
        </div>

        <QuickFacts
          items={[
            { icon: ScrollText, label: 'Pages', value: String(pages) },
            { icon: Layers, label: 'File size', value: String(size) },
            { icon: FileText, label: 'Format', value: 'Reference' },
            { icon: Sparkles, label: 'Updated', value: updatedLabel },
          ]}
        />
      </section>

      {fileUrl ? (
        <section className={`${dc.shell.section} pb-14 pt-4`}>
          <div className="overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                  <FileText className="h-4 w-4" />
                </span>
                <span className="editable-mono text-[11px] uppercase tracking-[0.24em] text-white/70">
                  Reference preview · {filename}
                </span>
              </div>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 hover:text-white">
                Open full <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={post.title}
              className="h-[82vh] w-full border-0 bg-[var(--slot4-media-bg)]"
            />
          </div>
        </section>
      ) : null}

      <section className={`${dc.shell.section} pb-24 pt-16 sm:pb-32`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <h2 className="editable-display max-w-3xl text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.15] tracking-[-0.025em] text-white">
              What's inside this <span className="editable-display-italic text-[var(--tk-accent)]">reference.</span>
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <BodyContent post={post} />
              <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8">
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/50">Sections</p>
                <ol className="mt-6 grid gap-4 text-[15px] leading-[1.55] text-white/75">
                  {insideList.map((section, i) => (
                    <li key={`${section}-${i}`} className="flex items-start gap-3">
                      <span className="editable-mono grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-white/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{section}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <TagChips post={post} />

            <div className="mt-16 rounded-[var(--editable-radius-lg)] border border-[var(--tk-accent)]/30 bg-[var(--tk-accent-soft)] p-8 sm:p-12">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                    Grab a copy
                  </p>
                  <h3 className="editable-display mt-4 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] tracking-[-0.02em] text-white">
                    Keep this reference on file.
                  </h3>
                </div>
                {fileUrl ? (
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.accent}>
                    <span>Download file</span>
                    <span className={dc.button.icon}>
                      <Download className="h-4 w-4" />
                    </span>
                  </Link>
                ) : null}
              </div>
            </div>

          </article>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ReferenceIdentityCard
              filename={filename}
              category={category}
              pages={String(pages)}
              size={String(size)}
              uploader={uploader}
              updatedLabel={updatedLabel}
              fileUrl={fileUrl}
            />
            <InsidePanel items={insideList} />
          </aside>
        </div>
      </section>

      <RelatedStrip task="pdf" related={related} title="More references" />
    </>
  )
}

function ReferenceIdentityCard({
  filename,
  category,
  pages,
  size,
  uploader,
  updatedLabel,
  fileUrl,
}: {
  filename: string
  category: string
  pages: string
  size: string
  uploader: string
  updatedLabel: string
  fileUrl: string
}) {
  return (
    <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8">
      <div className="grid h-40 place-items-center rounded-[var(--editable-radius)] border border-white/10 bg-[var(--slot4-media-bg)]">
        <span className="editable-display text-[6rem] leading-none tracking-[-0.04em] text-white/85">Aa</span>
      </div>
      <p className="editable-mono mt-6 truncate text-[11px] uppercase tracking-[0.22em] text-white/55">
        {filename}
      </p>
      <dl className="mt-6 grid gap-3 text-sm">
        <IdentityRow label="Category" value={category} />
        <IdentityRow label="Pages" value={pages} />
        <IdentityRow label="File size" value={size} />
        <IdentityRow label="Uploaded by" value={uploader} />
        <IdentityRow label="Updated" value={updatedLabel} />
      </dl>
      {fileUrl ? (
        <Link
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className={`mt-8 w-full ${dc.button.primary}`}
        >
          <span>Download</span>
          <span className={dc.button.icon}>
            <Download className="h-4 w-4" />
          </span>
        </Link>
      ) : null}
    </div>
  )
}

function IdentityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-b-0 last:pb-0">
      <dt className="editable-mono text-[10px] uppercase tracking-[0.24em] text-white/45">{label}</dt>
      <dd className="text-right text-sm font-medium text-white">{value}</dd>
    </div>
  )
}

function InsidePanel({ items }: { items: string[] }) {
  return (
    <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8">
      <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/55">What's inside</p>
      <ul className="mt-6 grid gap-3 text-[14px] leading-[1.5] text-white/70">
        {items.slice(0, 6).map((item, i) => (
          <li key={`${item}-${i}`} className="flex items-start gap-3">
            <span className="mt-2 h-1 w-1 rounded-full bg-[var(--tk-accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ============================== CLASSIFIED ============================== */

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
        <BackLink task="classified" />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <MonoChip tone="accent">Notice board</MonoChip>
              {condition ? <MonoChip>{condition}</MonoChip> : null}
            </div>
            <h1 className="editable-display mt-8 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.03em] text-white">
              {renderTitleWithItalic(post.title)}
            </h1>
            {leadText(post) ? (
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-white/70">{leadText(post)}</p>
            ) : null}
            {hero ? (
              <div className="mt-12 overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-media-bg)]">
                <img src={hero} alt="" className="aspect-[16/10] w-full object-cover" />
              </div>
            ) : null}
            <BodyContent post={post} />
            <TagChips post={post} />
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8">
              <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/50">Asking</p>
              <p className="editable-display mt-3 text-[clamp(2.5rem,4vw,3.5rem)] leading-none tracking-[-0.02em] text-[var(--tk-accent)]">
                {price || 'Open'}
              </p>
              <dl className="mt-6 grid gap-3 text-sm">
                {location ? <IdentityRow label="Location" value={location} /> : null}
                {condition ? <IdentityRow label="Condition" value={condition} /> : null}
              </dl>
              <div className="mt-8 grid gap-3">
                {phone ? (
                  <a href={`tel:${phone}`} className={dc.button.primary}>
                    <span>Call now</span>
                    <span className={dc.button.icon}>
                      <Phone className="h-4 w-4" />
                    </span>
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className={dc.button.secondary}>
                    <span>Email</span>
                    <span className={dc.button.iconSecondary}>
                      <Mail className="h-4 w-4" />
                    </span>
                  </a>
                ) : null}
                {website ? (
                  <a href={website} target="_blank" rel="noreferrer" className={dc.button.secondary}>
                    <span>Website</span>
                    <span className={dc.button.iconSecondary}>
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ============================== IMAGE ============================== */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
        <BackLink task="image" />
        <div className="mt-12 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure
                key={`${image}-${index}`}
                className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-media-bg)]"
              >
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <MonoChip tone="accent">
              <Camera className="h-3 w-3" /> Visual field
            </MonoChip>
            <h1 className="editable-display mt-8 text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.06] tracking-[-0.03em] text-white">
              {renderTitleWithItalic(post.title)}
            </h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-[1.6] text-white/70">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
            <TagChips post={post} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ============================== BOOKMARK ============================== */

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className={`${dc.shell.section} pt-24 pb-24 sm:pt-32`}>
        <BackLink task="sbm" />
        <div className="mt-12 max-w-3xl">
          <div className="flex items-center gap-2">
            <MonoChip tone="accent">
              <Bookmark className="h-3 w-3" /> Saved link
            </MonoChip>
          </div>
          <h1 className="editable-display mt-8 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.03em] text-white">
            {renderTitleWithItalic(post.title)}
          </h1>
          {leadText(post) ? <p className="mt-6 text-lg leading-[1.6] text-white/70">{leadText(post)}</p> : null}
          {website ? (
            <Link href={website} target="_blank" rel="noreferrer" className={`mt-10 ${dc.button.primary}`}>
              <span>Open link</span>
              <span className={dc.button.icon}>
                <ExternalLink className="h-4 w-4" />
              </span>
            </Link>
          ) : null}
          <BodyContent post={post} />
          <TagChips post={post} />
        </div>
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ============================== PROFILE ============================== */

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${dc.shell.section} pt-24 sm:pt-32`}>
        <BackLink task="profile" />
        <div className="mt-12 grid gap-14 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8 text-center">
              <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-full border border-white/10 bg-[var(--slot4-media-bg)]">
                {images[0] ? (
                  <img src={images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-14 w-14 text-white/45" />
                )}
              </div>
              <h1 className="editable-display mt-6 text-[1.5rem] tracking-[-0.015em] text-white">{post.title}</h1>
              {role ? (
                <p className="editable-mono mt-3 text-[10px] uppercase tracking-[0.26em] text-[var(--tk-accent)]">
                  {role}
                </p>
              ) : null}
              <div className="mt-6 grid gap-2.5">
                {website ? (
                  <a href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>
                    <span>Website</span>
                    <span className={dc.button.icon}>
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className={dc.button.secondary}>
                    <span>Email</span>
                    <span className={dc.button.iconSecondary}>
                      <Mail className="h-4 w-4" />
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <h2 className="editable-display mt-6 text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.1] tracking-[-0.025em] text-white">
              About <span className="editable-display-italic text-[var(--tk-accent)]">{post.title.split(' ')[0] || 'them'}.</span>
            </h2>
            <BodyContent post={post} />
            <TagChips post={post} />
            {images.slice(1).length ? (
              <>
                <Divider />
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/50">Gallery</p>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {images.slice(1, 7).map((image, i) => (
                    <div
                      key={`${image}-${i}`}
                      className="overflow-hidden rounded-[var(--editable-radius)] border border-white/10 bg-[var(--slot4-media-bg)]"
                    >
                      <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ------------------------- Shared building blocks ------------------------- */

function QuickFacts({
  items,
}: {
  items: Array<{ icon: typeof MapPin; label: string; value: string }>
}) {
  return (
    <div className="mt-14 grid divide-white/10 rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4 md:divide-x">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex items-start gap-4 p-6 ${i > 0 ? 'border-t border-white/10 md:border-t-0' : ''}`}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
            <item.icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-white/50">{item.label}</p>
            <p className="mt-1.5 truncate text-[15px] font-medium text-white">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ContactCard({
  post,
  address,
  phone,
  email,
  website,
  hours,
}: {
  post: SitePost
  address: string
  phone: string
  email: string
  website: string
  hours: string
}) {
  return (
    <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8">
      <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/55">Contact</p>
      <h3 className="editable-display mt-4 text-[1.35rem] leading-[1.15] tracking-[-0.015em] text-white">
        {post.title}
      </h3>
      <ul className="mt-6 grid gap-4 text-sm">
        {address ? (
          <ContactRow icon={MapPin} label="Address" value={address} href={mapSrcFor(post) ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined} />
        ) : null}
        {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
        {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
        {website ? <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} external /> : null}
        {hours ? <ContactRow icon={Compass} label="Hours" value={hours} /> : null}
      </ul>
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className={`mt-8 w-full ${dc.button.primary}`}>
          <span>Visit website</span>
          <span className={dc.button.icon}>
            <ExternalLink className="h-4 w-4" />
          </span>
        </Link>
      ) : email ? (
        <a href={`mailto:${email}`} className={`mt-8 w-full ${dc.button.primary}`}>
          <span>Send email</span>
          <span className={dc.button.icon}>
            <Mail className="h-4 w-4" />
          </span>
        </a>
      ) : null}
    </div>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: typeof MapPin
  label: string
  value: string
  href?: string
  external?: boolean
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.04] text-[var(--tk-accent)]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-white/45">{label}</p>
        <p className="mt-1 break-words text-[14.5px] font-medium text-white">{value}</p>
      </div>
    </div>
  )
  if (!href) return <li>{inner}</li>
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="group block rounded-lg -mx-2 px-2 py-1 transition-colors duration-300 hover:bg-white/[0.03]"
      >
        {inner}
      </a>
    </li>
  )
}

function TrustPanel({ items }: { items: Array<{ icon: typeof CheckCircle2; label: string }> }) {
  return (
    <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8">
      <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/55">Verified</p>
      <ul className="mt-6 grid gap-3 text-[14.5px] text-white/80">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--slot4-accent-secondary)]/25 text-[var(--slot4-accent-secondary)]">
              <item.icon className="h-3.5 w-3.5" />
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* --------------- Related strips (rendered per branch above) --------------- */

function RelatedStrip({
  task,
  related,
  title,
}: {
  task: TaskKey
  related: SitePost[]
  title?: string
}) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = title || `More ${taskPageVoices[task]?.eyebrow?.toLowerCase() || taskConfig?.label?.toLowerCase() || 'records'}`
  const isPdf = task === 'pdf'
  return (
    <section className={`${dc.shell.section} border-t border-white/5 py-24 sm:py-28`}>
      <div className="flex items-end justify-between gap-4">
        <h2 className={`${dc.type.sectionTitle}`}>
          {label.split(' ').slice(0, -1).join(' ') || 'More'}{' '}
          <span className="editable-display-italic text-[var(--tk-accent)]">
            {label.split(' ').slice(-1)[0] || 'records.'}
          </span>
        </h2>
        <Link
          href={taskConfig?.route || '/'}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 hover:text-[var(--tk-accent)]"
        >
          View all
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item) =>
          isPdf ? (
            <PdfRelatedCard key={item.id || item.slug} task={task} post={item} />
          ) : (
            <StandardRelatedCard key={item.id || item.slug} task={task} post={item} />
          )
        )}
      </div>
    </section>
  )
}

function StandardRelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25"
    >
      <div className="aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <FileText className="h-8 w-8 text-white/40" />
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
          {categoryOf(post, taskPageVoices[task]?.eyebrow || 'Record')}
        </p>
        <h3 className="editable-display mt-3 line-clamp-2 text-[1.1rem] leading-[1.2] tracking-[-0.01em] text-white">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

function PdfRelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  const size = getField(post, ['fileSize', 'size'])
  const category = categoryOf(post, 'Reference')
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25"
    >
      <div className="grid aspect-[4/3] place-items-center bg-[var(--slot4-media-bg)] px-6">
        <div className="text-center">
          <span className="editable-display block text-[4.5rem] leading-none tracking-[-0.04em] text-white/85">
            Aa
          </span>
          <span className="editable-mono mt-3 block text-[10px] uppercase tracking-[0.28em] text-white/50">
            Reference · {category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="editable-display line-clamp-3 text-[1.1rem] leading-[1.2] tracking-[-0.01em] text-white">
          {post.title}
        </h3>
        <span className="mt-auto inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/70">
          <FileText className="h-3 w-3" />
          {size || 'Reference'}
        </span>
      </div>
    </Link>
  )
}

// Convert a plain title into a display heading with the last word(s) rendered in
// italic serif — mirrors the Scion reference typography (e.g. "…forward.").
function renderTitleWithItalic(text: string) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return null
  const words = clean.split(' ')
  if (words.length < 3) return <span>{clean}</span>
  const italicCount = Math.min(2, Math.max(1, Math.floor(words.length / 5)))
  const head = words.slice(0, words.length - italicCount).join(' ')
  const tail = words.slice(-italicCount).join(' ')
  return (
    <>
      <span>{head} </span>
      <span className="editable-display-italic text-[var(--tk-accent)]">{tail}</span>
    </>
  )
}

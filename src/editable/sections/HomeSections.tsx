import Link from 'next/link'
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Building2,
  Compass,
  FileText,
  Image as ImageIcon,
  Library,
  MapPin,
  Megaphone,
  Newspaper,
  UserRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: Newspaper,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: Library,
  profile: UserRound,
}

function taskDisplayLabel(task: TaskKey) {
  const voice = taskPageVoices[task]
  return voice?.eyebrow || SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
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

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------ Primitives ------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
      <span className="h-px w-6 bg-white/25" />
      {children}
    </span>
  )
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={dc.button.primary}>
      <span>{children}</span>
      <span className={dc.button.icon}>
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={dc.button.secondary}>
      <span>{children}</span>
      <span className={dc.button.iconSecondary}>
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

/* -------------------------------- Hero -------------------------------- */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const heroContent = pagesContent.home.hero
  const titleLines = heroContent.title || []
  const [firstLine, ...restLines] = titleLines
  const lead = heroContent.description
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const totalCount = pool.length
  const categoryCount = new Set(pool.map((post) => categoryOf(post)).filter(Boolean)).size

  const stats = [
    { label: 'Records live', value: totalCount ? String(totalCount) : '—' },
    { label: 'Categories', value: categoryCount ? String(categoryCount) : '—' },
    { label: 'Updated', value: 'weekly' },
  ]

  return (
    <section className={`${dc.shell.section} pt-24 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32`}>
      <div className="grid gap-16 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div>
          <EditableReveal>
            <Eyebrow>{heroContent.badge || 'A directory · a library'}</Eyebrow>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-6 ${dc.type.display}`}>
              {firstLine ? <span>{firstLine} </span> : null}
              {restLines.length ? (
                <span className="editable-display-italic text-[var(--slot4-accent)]">
                  {restLines.join(' ')}
                </span>
              ) : null}
              {!titleLines.length ? (
                <>
                  <span>Places worth knowing.</span>{' '}
                  <span className="editable-display-italic text-[var(--slot4-accent)]">
                    References worth keeping.
                  </span>
                </>
              ) : null}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`mt-8 max-w-2xl ${dc.type.lead}`}>{lead}</p>
          </EditableReveal>
          <EditableReveal index={3}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <PrimaryButton href={primaryRoute}>Browse {taskDisplayLabel(primaryTask).toLowerCase()}</PrimaryButton>
              <SecondaryButton href="/search">Search everything</SecondaryButton>
            </div>
          </EditableReveal>
        </div>

        <EditableReveal index={2} className="lg:pb-6">
          <div className="grid gap-6 rounded-[var(--editable-radius-lg)] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
            {stats.map((stat, i) => (
              <div key={stat.label} className={i === 0 ? '' : 'border-t border-white/10 pt-6'}>
                <div className="editable-display flex items-baseline gap-3 text-[clamp(2.25rem,4vw,3rem)] leading-none tracking-[-0.02em] text-white">
                  {stat.value}
                  <span className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
            <Link
              href={primaryRoute}
              className="mt-2 inline-flex items-center justify-between gap-3 text-sm font-medium text-white/80 transition-colors duration-300 hover:text-white"
            >
              Live from {SITE_CONFIG.name}
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* -------------------- Value strip (3 pillar cards) -------------------- */

const PILLARS = [
  {
    key: 'directory',
    kicker: 'Local directory',
    title: 'Real places, verified quietly.',
    body: 'Each place gets its own record — address, hours, links, quick facts — kept usable and current without noise.',
    Icon: MapPin,
  },
  {
    key: 'library',
    kicker: 'Reference library',
    title: 'References built to be re-read.',
    body: 'Reports, guides and primary sources organised so you can preview, download and cite them without hunting for a copy.',
    Icon: BookOpen,
  },
  {
    key: 'connect',
    kicker: 'How they connect',
    title: 'One search, two surfaces.',
    body: 'A place cites a reference. A reference names a place. Search moves between them and both surfaces stay in view.',
    Icon: Compass,
  },
]

export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  return (
    <section className={`${dc.shell.section} py-24 sm:py-28 lg:py-32`}>
      <EditableReveal>
        <div className="max-w-3xl">
          <Eyebrow>Why it exists</Eyebrow>
          <h2 className={`mt-6 ${dc.type.sectionTitle}`}>
            Two surfaces that <span className="editable-display-italic text-[var(--slot4-accent)]">work together.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-[1.7] text-white/60">
            We keep two catalogues going in parallel — a directory of places and a library of references — because the
            questions people ask usually cross between them.
          </p>
        </div>
      </EditableReveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <EditableReveal key={pillar.key} index={i}>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <pillar.Icon className="h-5 w-5" />
                </span>
                <p className="editable-mono mt-6 text-[11px] uppercase tracking-[0.26em] text-white/50">
                  {pillar.kicker}
                </p>
                <h3 className="editable-display mt-4 text-[1.5rem] leading-[1.2] tracking-[-0.015em] text-white">
                  {pillar.title}
                </h3>
                <p className="mt-5 text-[15px] leading-[1.65] text-white/60">{pillar.body}</p>
              </div>
              <Link
                href={primaryRoute}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 hover:text-[var(--slot4-accent)]"
              >
                Explore
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </article>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Category grid (mirrors Scion 6-card grid) --------------- */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activeTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const feature = pool[0]

  return (
    <section className={`border-t border-white/5 bg-[color:rgba(255,255,255,0.02)] ${dc.shell.section} py-24 sm:py-28 lg:py-32`}>
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-end">
        <EditableReveal>
          <div>
            <Eyebrow>Fields we cover</Eyebrow>
            <h2 className={`mt-6 ${dc.type.sectionTitle}`}>
              Structured for <span className="editable-display-italic text-[var(--slot4-accent)]">discovery.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-[1.7] text-white/60">
              Each section keeps its own tempo. Directory records lean informational; reference materials lean archival;
              field notes lean editorial.
            </p>
          </div>
        </EditableReveal>
        <EditableReveal index={1}>
          <div className="flex justify-start lg:justify-end">
            <PrimaryButton href={primaryRoute}>Open the {taskDisplayLabel(primaryTask).toLowerCase()}</PrimaryButton>
          </div>
        </EditableReveal>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeTasks.slice(0, 6).map((task, i) => {
          const Icon = taskIcon[task.key] || FileText
          const voice = taskPageVoices[task.key]
          return (
            <EditableReveal key={task.key} index={i}>
              <Link
                href={task.route}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-7 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.06] text-white/85">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="editable-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="editable-display mt-8 text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
                    {voice?.eyebrow || task.label}
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-[1.6] text-white/55">
                    {voice?.description || task.description || 'Open the section to browse.'}
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-[var(--slot4-accent)]">
                  Enter
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </EditableReveal>
          )
        })}
      </div>

      {feature ? (
        <EditableReveal index={2} className="mt-20">
          <Link
            href={postHref(primaryTask, feature, primaryRoute)}
            className="group grid overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25 md:grid-cols-2"
          >
            <div className="relative aspect-[16/12] overflow-hidden bg-[var(--slot4-media-bg)] md:aspect-auto">
              <img
                src={getEditablePostImage(feature)}
                alt={feature.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-between gap-6 p-8 sm:p-12 lg:p-14">
              <div>
                <span className={dc.badge.accentPill}>Highlight</span>
                <h3 className="editable-display mt-5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] tracking-[-0.02em] text-white">
                  {feature.title}
                </h3>
                <p className="mt-5 text-[15.5px] leading-[1.7] text-white/60">{getExcerpt(feature, 200)}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
                Open record
                <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </div>
          </Link>
        </EditableReveal>
      ) : null}
    </section>
  )
}

/* ------------------------- Latest — time collections ------------------------ */

const sectionCopy: Record<string, { eyebrow: string; title: string; italic: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last', italic: 'seven days.' },
  browse: { eyebrow: 'Currently reading', title: 'Popular this', italic: 'month.' },
  index: { eyebrow: 'From the shelves', title: 'Evergreen from the', italic: 'archive.' },
}

function LatestCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img
            src={image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <span className="editable-mono text-[10px] uppercase tracking-[0.26em] text-white/45">{category}</span>
          <h3 className="editable-display line-clamp-3 text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-[14px] leading-[1.6] text-white/55">{getExcerpt(post, 120)}</p>
          <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-[var(--slot4-accent)]">
            Read
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
          { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
          { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to', italic: 'explore.' }
        return (
          <section key={section.key} className={`${dc.shell.section} py-24 sm:py-28 lg:py-32`}>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <EditableReveal>
                <div className="max-w-xl">
                  <Eyebrow>{copy.eyebrow}</Eyebrow>
                  <h2 className={`mt-6 ${dc.type.sectionTitle}`}>
                    {copy.title}{' '}
                    <span className="editable-display-italic text-[var(--slot4-accent)]">{copy.italic}</span>
                  </h2>
                </div>
              </EditableReveal>
              <EditableReveal index={1}>
                <SecondaryButton href={section.href || primaryRoute}>See all</SecondaryButton>
              </EditableReveal>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.posts.slice(0, 6).map((post, i) => (
                <LatestCard
                  key={post.id || post.slug}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={i}
                />
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* -------------------------------- CTA band ------------------------------ */

export function EditableHomeCta() {
  return (
    <section className={`${dc.shell.section} py-28 sm:py-32 lg:py-40`}>
      <EditableReveal>
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>Contribute</Eyebrow>
          <h2 className={`mx-auto mt-6 max-w-3xl ${dc.type.display}`}>
            Add a place.{' '}
            <span className="editable-display-italic text-[var(--slot4-accent)]">Share a reference.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.6] text-white/65">
            {SITE_CONFIG.name} grows because people like you send in the record. Submit a place worth knowing, or drop a
            reference worth keeping — we handle the rest.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton href="/create">Submit an entry</PrimaryButton>
            <SecondaryButton href="/contact">Get in touch</SecondaryButton>
          </div>
        </div>
      </EditableReveal>
    </section>
  )
}

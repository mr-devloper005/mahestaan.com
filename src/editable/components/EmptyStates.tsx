import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-12 text-center',
        className
      )}
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/[0.06]">
        <SearchX className="h-6 w-6 text-white/70" />
      </div>
      <h2 className="editable-display mt-6 text-[1.75rem] leading-[1.15] tracking-[-0.02em] text-white">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-[1.65] text-white/60">{description}</p>
      <Link
        href={actionHref}
        className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 pl-5 pr-1.5 text-sm font-medium text-white transition-colors duration-300 hover:border-white/40"
      >
        <span>{actionLabel}</span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the master panel will appear here automatically. The layout stays ready even when the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'rounded-[var(--editable-radius-lg)] border border-[var(--slot4-accent-secondary)]/40 bg-[color-mix(in_oklab,var(--slot4-accent-secondary)_15%,transparent)] p-12 text-center',
        className
      )}
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--slot4-accent-secondary)]/30 text-[var(--slot4-accent-secondary)]">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-6 text-[1.75rem] leading-[1.15] tracking-[-0.02em] text-white">
        Message received
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-[1.65] text-white/70">
        Thanks for reaching out. Your request has been saved and routed through the contact workflow.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-white/25 pl-5 pr-1.5 text-sm font-medium text-white transition-colors duration-300 hover:border-white/50"
      >
        <span>Return home</span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </section>
  )
}

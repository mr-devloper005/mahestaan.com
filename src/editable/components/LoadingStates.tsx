import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--editable-radius)] bg-white/[0.06]',
        className
      )}
    />
  )
}

function LabelChip({ label }: { label: string }) {
  return (
    <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
      <span className="h-px w-6 bg-white/25" />
      {label}
    </span>
  )
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--editable-container)] px-5 py-24 sm:px-8', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <LabelChip label={label} />
      <PulseBlock className="mt-8 h-14 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-4 w-2/3 max-w-2xl" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-6"
          >
            <PulseBlock className="h-44 w-full" />
            <PulseBlock className="mt-6 h-5 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}
      aria-live="polite"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-5"
        >
          <PulseBlock className="h-44 w-full" />
          <PulseBlock className="mt-5 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-36 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]',
        className
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <PulseBlock className="h-80 w-full rounded-[var(--editable-radius-lg)]" />
      <div>
        <LabelChip label={label} />
        <PulseBlock className="mt-6 h-14 w-4/5" />
        <PulseBlock className="mt-6 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}

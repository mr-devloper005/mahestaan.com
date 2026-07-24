'use client'

import Link from 'next/link'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const description = globalContent.footer?.description || SITE_CONFIG.description
  const tagline = globalContent.nav?.tagline || SITE_CONFIG.tagline
  const domain = (SITE_CONFIG.baseUrl || '').replace(/^https?:\/\//i, '').replace(/\/$/, '') || SITE_CONFIG.name

  const resolvedTaskLabel = (key: string, fallback: string) => {
    const voice = (taskPageVoices as Record<string, { eyebrow?: string }>)[key]
    return voice?.eyebrow || fallback
  }

  const scrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0b0b0b] text-white/80">
      {/* Ambient accent glow — subtle, editorial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(224,131,92,0.10),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-5 pt-24 sm:px-8 lg:px-10">
        {/* Serif italic statement — the visual centerpiece */}
        <div className="border-b border-white/10 pb-16">
          <p className="editable-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-white/45">
            <span className="h-px w-6 bg-white/30" />
            Two shelves, one catalogue
          </p>
          <h2 className="editable-display mt-8 max-w-4xl text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.03em] text-white">
            <span>Places worth knowing. </span>
            <span className="editable-display-italic text-[var(--slot4-accent)]">
              References worth keeping.
            </span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/create" className={dc.button.primary}>
              <span>Submit an entry</span>
              <span className={dc.button.icon}>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <Link href="/contact" className={dc.button.secondary}>
              <span>Get in touch</span>
              <span className={dc.button.iconSecondary}>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Column grid */}
        <div className="grid gap-14 py-16 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] lg:py-20">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[var(--slot4-accent)]/14 ring-1 ring-inset ring-white/10 transition-[background,box-shadow] duration-500 group-hover:bg-[var(--slot4-accent)]/25">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="editable-display text-[1.35rem] tracking-[-0.01em] text-white">
                  {SITE_CONFIG.name}
                </span>
                <span className="editable-display-italic mt-1 text-[12px] tracking-[0.01em] text-[var(--slot4-accent)]/85">
                  {tagline}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.7] text-white/60">{description}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.24em] text-white/45 sm:max-w-sm">
              <MetaTile label="Directory" value={String(taskLinks.length) + ' shelves'} />
              <MetaTile label="Domain" value={domain} />
            </div>
          </div>

          <FooterColumn title="Discover">
            {taskLinks.map((task) => (
              <FooterLink key={task.key} href={task.route}>
                {resolvedTaskLabel(task.key, task.label)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Resources">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/search">Search catalogue</FooterLink>
          </FooterColumn>

          <FooterColumn title="Account">
            {session ? (
              <>
                <FooterLink href="/create">Submit an entry</FooterLink>
                <button
                  type="button"
                  onClick={logout}
                  className="group inline-flex items-center gap-2 text-left text-[15px] font-medium text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Logout
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-70" />
                </button>
              </>
            ) : (
              <>
                <FooterLink href="/login">Sign in</FooterLink>
                <FooterLink href="/signup">Get started</FooterLink>
              </>
            )}
          </FooterColumn>
        </div>

        {/* Meta bar */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <span className="text-xs text-white/45">
              © {year} {SITE_CONFIG.name}. All rights reserved.
            </span>
            <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" />
            <span className="editable-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
              Compiled with care
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="editable-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
              Back to top
            </span>
            <button
              type="button"
              onClick={scrollTop}
              aria-label="Back to top"
              className="group grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-[background,border-color,color,transform] duration-500 hover:-translate-y-0.5 hover:border-white/30 hover:text-white"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed serif wordmark — an editorial signature at the very bottom */}
      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-8 sm:px-8 lg:px-10">
          <p
            aria-hidden
            className="editable-display select-none text-[clamp(3rem,14vw,9rem)] leading-[0.9] tracking-[-0.04em] text-white/[0.05]"
          >
            {SITE_CONFIG.name}
            <span className="editable-display-italic text-[var(--slot4-accent)]/12">.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="editable-mono flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-white/45">
        <span className="h-px w-4 bg-white/25" />
        {title}
      </h3>
      <div className="mt-6 grid gap-2.5">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-[15px] font-medium text-white/65 transition-colors duration-300 hover:text-white"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-70" />
    </Link>
  )
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--editable-radius)] border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="editable-mono text-[9.5px] uppercase tracking-[0.28em] text-white/40">{label}</p>
      <p className="mt-1.5 truncate text-[13px] font-medium text-white/85">{value}</p>
    </div>
  )
}

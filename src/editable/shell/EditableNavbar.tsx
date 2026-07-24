'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const STATIC_LINKS: Array<{ label: string; href: string }> = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))

  const tagline = globalContent.nav?.tagline || SITE_CONFIG.tagline

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? 'border-b border-white/10 bg-[rgba(14,14,14,0.82)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Hairline accent brand-bar — always visible, sub-navbar mono meta */}
      <div
        aria-hidden
        className={`pointer-events-none transition-opacity duration-500 ${
          scrolled || open ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="mx-auto flex h-6 w-full max-w-[var(--editable-container)] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <span className="editable-mono flex items-center gap-2 text-[9.5px] uppercase tracking-[0.32em] text-white/35">
            <span className="h-px w-4 bg-white/25" />
            {tagline}
          </span>
          <span className="editable-mono hidden items-center gap-2 text-[9.5px] uppercase tracking-[0.32em] text-white/30 sm:flex">
            Catalogue
            <span className="h-1 w-1 rounded-full bg-white/25" />
            {SITE_CONFIG.name}
          </span>
        </div>
      </div>

      <nav className="mx-auto flex h-[72px] w-full max-w-[var(--editable-container)] items-center gap-6 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[var(--slot4-accent)]/12 ring-1 ring-inset ring-white/10 transition-[background,box-shadow] duration-500 group-hover:bg-[var(--slot4-accent)]/22 group-hover:ring-white/20">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[-4px] rounded-full bg-[var(--slot4-accent)]/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
            />
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="relative h-9 w-9 object-contain" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="editable-display truncate text-[1.15rem] tracking-[-0.01em] text-white sm:text-[1.35rem]">
              {SITE_CONFIG.name}
            </span>
            <span className="editable-display-italic mt-1 hidden truncate text-[11px] tracking-[0.01em] text-[var(--slot4-accent)]/85 sm:block">
              a directory · a library
            </span>
          </span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 md:flex">
          {STATIC_LINKS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-white/65 transition-colors duration-300 hover:text-white"
              >
                <span className={active ? 'text-white' : ''}>{item.label}</span>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-[var(--slot4-accent)] transition-transform duration-500 ${
                    active ? 'scale-x-100' : 'group-hover:scale-x-100'
                  }`}
                />
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search the catalogue"
            className="group hidden h-10 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] pl-3.5 pr-2 text-[13px] font-medium text-white/70 transition-[background,border-color,color] duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:text-white sm:inline-flex"
          >
            <Search className="h-4 w-4" />
            <span>Search catalogue</span>
            <span className="editable-mono grid h-7 min-w-[36px] items-center rounded-full border border-white/10 bg-black/25 px-2 text-[10px] uppercase tracking-[0.18em] text-white/55">
              /
            </span>
          </Link>

          <Link
            href="/search"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 transition-colors duration-300 hover:border-white/25 hover:text-white sm:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="group hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] pl-4 pr-4 text-sm font-medium text-white/85 transition-[background,border-color,color] duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:text-white sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Submit an entry</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-white/60 transition-colors duration-300 hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="group hidden h-10 items-center gap-2 rounded-full bg-[var(--slot4-accent)] pl-4 pr-1.5 text-sm font-medium text-[#121212] shadow-[0_10px_28px_-8px_rgba(224,131,92,0.55)] transition-[background,box-shadow,transform] duration-300 hover:bg-[var(--slot4-accent-hover)] hover:shadow-[0_18px_36px_-10px_rgba(224,131,92,0.7)] active:scale-[0.98] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" />
                <span>Get started</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-black/15 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-colors duration-300 hover:border-white/25 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#0e0e0e] px-5 pb-8 pt-6 sm:px-8 md:hidden">
          <p className="editable-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/40">
            <span className="h-px w-4 bg-white/25" />
            {tagline}
          </p>
          <p className="editable-display-italic mt-3 text-[1.35rem] leading-[1.15] text-[var(--slot4-accent)]/90">
            a directory · a library
          </p>
          <div className="mt-7 grid gap-1">
            {[...STATIC_LINKS, ...(session ? [{ label: 'Submit an entry', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors duration-300 ${
                  isActive(item.href)
                    ? 'bg-white/[0.06] text-white'
                    : 'text-white/70 hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 opacity-60" />
              </Link>
            ))}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="mt-1 flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                Logout
                <ArrowUpRight className="h-4 w-4 opacity-60" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/login',
    title: 'Login',
    description: pagesContent.auth.login.metadataDescription,
  })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section
          className={`${dc.shell.section} grid min-h-[calc(100vh-6rem)] items-center gap-16 pt-24 pb-24 sm:pt-32 sm:pb-32 lg:grid-cols-[1.1fr_0.9fr]`}
        >
          <EditableReveal>
            <div>
              <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
                <span className="h-px w-6 bg-white/25" />
                {pagesContent.auth.login.badge}
              </span>
              <h1 className={`mt-8 max-w-2xl ${dc.type.heroTitle}`}>
                <span>Welcome back to </span>
                <span className="editable-display-italic text-[var(--slot4-accent)]">the desk.</span>
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-[1.6] text-white/70">
                {pagesContent.auth.login.description}
              </p>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
              <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                Sign in
              </p>
              <h2 className="editable-display mt-3 text-[1.75rem] leading-[1.15] tracking-[-0.02em] text-white">
                {pagesContent.auth.login.formTitle}
              </h2>
              <div className="mt-8">
                <EditableLocalLoginForm />
              </div>
              <p className="mt-8 text-sm text-white/55">
                New here?{' '}
                <Link href="/signup" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}

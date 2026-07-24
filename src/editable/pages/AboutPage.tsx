import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  const content = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-28 pb-16 sm:pt-40 sm:pb-20`}>
          <EditableReveal>
            <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
              <span className="h-px w-6 bg-white/25" />
              {content.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-8 max-w-4xl ${dc.type.display}`}>
              <span>A quieter way to </span>
              <span className="editable-display-italic text-[var(--slot4-accent)]">catalogue what matters.</span>
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.65] text-white/70 sm:text-xl">
              {content.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} py-20 sm:py-24`}>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr]">
            <EditableReveal>
              <div>
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                  Our approach
                </p>
                <h2 className={`mt-6 ${dc.type.sectionTitle}`}>
                  Structure without <span className="editable-display-italic text-[var(--slot4-accent)]">stiffness.</span>
                </h2>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="grid gap-6 text-[16px] leading-[1.7] text-white/70">
                {content.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        <section className={`${dc.shell.section} py-24 sm:py-32`}>
          <EditableReveal>
            <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/55">Values</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h2 className={`mt-6 max-w-3xl ${dc.type.sectionTitle}`}>
              How we work — and <span className="editable-display-italic text-[var(--slot4-accent)]">why.</span>
            </h2>
          </EditableReveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {content.values.map((value, i) => (
              <EditableReveal key={value.title} index={i}>
                <article className="group flex h-full flex-col justify-between rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-white/25">
                  <div>
                    <span className="editable-mono text-[10px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                      {String(i + 1).padStart(2, '0')} · Principle
                    </span>
                    <h3 className="editable-display mt-6 text-[1.5rem] leading-[1.2] tracking-[-0.015em] text-white">
                      {value.title}
                    </h3>
                    <p className="mt-5 text-[15px] leading-[1.65] text-white/60">{value.description}</p>
                  </div>
                </article>
              </EditableReveal>
            ))}
          </div>
        </section>

        <section className={`${dc.shell.section} py-28 sm:py-32`}>
          <EditableReveal>
            <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-10 sm:p-14 lg:p-20">
              <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
                <div>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                    Get in touch
                  </p>
                  <h2 className="editable-display mt-6 max-w-2xl text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] tracking-[-0.025em] text-white">
                    Something worth listing?{' '}
                    <span className="editable-display-italic text-[var(--slot4-accent)]">Send it our way.</span>
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Link href="/contact" className={dc.button.primary}>
                    <span>Contact {SITE_CONFIG.name}</span>
                    <span className={dc.button.icon}>
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}

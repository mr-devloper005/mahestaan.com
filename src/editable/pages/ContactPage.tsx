'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Directory onboarding', body: 'Add a place, verify operational details, and get it live in the directory quickly.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Library submissions', body: 'Suggest references, primary sources, and links that deserve a place on the shelf.' },
    { icon: Mail, title: 'Reference partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-28 pb-16 sm:pt-40 sm:pb-20`}>
          <EditableReveal>
            <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
              <span className="h-px w-6 bg-white/25" />
              {pagesContent.contact.eyebrow}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`mt-8 max-w-4xl ${dc.type.display}`}>
              {renderTitleWithItalic(pagesContent.contact.title)}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.65] text-white/70 sm:text-xl">
              {pagesContent.contact.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-28 pt-4 sm:pb-40`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditableReveal>
              <div className="grid gap-4">
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/55">Routing lanes</p>
                {lanes.map((lane, i) => (
                  <div
                    key={lane.title}
                    className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-7"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-4 w-4" />
                      </span>
                      <span className="editable-mono text-[10px] uppercase tracking-[0.24em] text-white/50">
                        Lane {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="editable-display mt-5 text-[1.35rem] leading-[1.2] tracking-[-0.015em] text-white">
                      {lane.title}
                    </h2>
                    <p className="mt-3 text-[14.5px] leading-[1.6] text-white/60">{lane.body}</p>
                  </div>
                ))}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                  Send a message
                </p>
                <h2 className="editable-display mt-4 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] tracking-[-0.02em] text-white">
                  {pagesContent.contact.formTitle}
                </h2>
                <div className="mt-8">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function renderTitleWithItalic(text: string) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  const words = clean.split(' ')
  if (words.length < 4) return <span>{clean}</span>
  const italicCount = Math.min(3, Math.max(1, Math.floor(words.length / 5)))
  const head = words.slice(0, words.length - italicCount).join(' ')
  const tail = words.slice(-italicCount).join(' ')
  return (
    <>
      <span>{head} </span>
      <span className="editable-display-italic text-[var(--slot4-accent)]">{tail}</span>
    </>
  )
}

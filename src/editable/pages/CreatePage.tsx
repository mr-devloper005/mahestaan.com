'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowUpRight,
}

const fieldClass =
  'w-full rounded-[var(--editable-radius)] border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] font-medium text-white outline-none transition-colors duration-300 placeholder:text-white/40 focus:border-white/40 focus:bg-white/[0.06]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeVoice = taskPageVoices[task]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen">
          <section className={`${dc.shell.section} grid min-h-[70vh] place-items-center pt-24 sm:pt-32`}>
            <div className="mx-auto w-full max-w-3xl rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-10 text-center sm:p-14">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <Lock className="h-6 w-6" />
              </div>
              <p className="editable-mono mt-8 text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {pagesContent.create.locked.badge}
              </p>
              <h1 className="editable-display mt-4 text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.025em] text-white">
                {pagesContent.create.locked.title}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.6] text-white/60">
                {pagesContent.create.locked.description}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href="/login" className={dc.button.primary}>
                  <span>Sign in</span>
                  <span className={dc.button.icon}>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link href="/signup" className={dc.button.secondary}>
                  <span>Create account</span>
                  <span className={dc.button.iconSecondary}>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-24 pb-16 sm:pt-32 sm:pb-24`}>
          <span className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/55">
            <span className="h-px w-6 bg-white/25" />
            {pagesContent.create.hero.badge}
          </span>
          <h1 className={`mt-8 max-w-3xl ${dc.type.heroTitle}`}>
            <span>Publish a new </span>
            <span className="editable-display-italic text-[var(--slot4-accent)]">record.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-white/70">
            {pagesContent.create.hero.description}
          </p>
        </section>

        <section className={`${dc.shell.section} pb-32`}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-white/55">Choose section</p>
              <div className="mt-6 grid gap-3">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  const voice = taskPageVoices[item.key as TaskKey]
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`group flex items-start gap-4 rounded-[var(--editable-radius-lg)] border p-5 text-left transition-[border-color,background-color] duration-300 ${
                        active
                          ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)]'
                          : 'border-white/10 bg-[var(--slot4-panel-bg)] hover:border-white/25'
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                          active ? 'bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]' : 'bg-white/[0.06] text-white/85'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="editable-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
                          {String(enabledTasks.findIndex((t) => t.key === item.key) + 1).padStart(2, '0')}
                        </span>
                        <span className="editable-display mt-1 block text-[1.05rem] leading-[1.2] tracking-[-0.01em] text-white">
                          {voice?.eyebrow || item.label}
                        </span>
                        <span className="mt-1 block text-[13px] leading-[1.5] text-white/55">
                          {voice?.description || item.description}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form
              onSubmit={submit}
              className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-8 sm:p-10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                    New {activeVoice?.eyebrow?.toLowerCase() || activeTask?.label?.toLowerCase() || 'record'}
                  </p>
                  <h2 className="editable-display mt-3 text-[1.5rem] leading-[1.15] tracking-[-0.02em] text-white">
                    {pagesContent.create.formTitle}
                  </h2>
                </div>
                <span className="editable-mono rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/60">
                  {session.name}
                </span>
              </div>

              <div className="mt-8 grid gap-4">
                <input
                  className={fieldClass}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Title"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className={fieldClass}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Category"
                  />
                  <input
                    className={fieldClass}
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="Website or source URL"
                  />
                </div>
                <input
                  className={fieldClass}
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="Featured image URL"
                />
                <textarea
                  className={`${fieldClass} min-h-24`}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Short summary"
                  required
                />
                <textarea
                  className={`${fieldClass} min-h-48`}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Main content, details, notes"
                  required
                />
              </div>

              {created ? (
                <div className="mt-6 flex items-start gap-3 rounded-[var(--editable-radius)] border border-[var(--slot4-accent-secondary)]/40 bg-[color-mix(in_oklab,var(--slot4-accent-secondary)_15%,transparent)] p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-accent-secondary)]" />
                  <div>
                    <p className="text-sm font-medium text-white">{pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-sm text-white/60">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button type="submit" className={`mt-8 w-full ${dc.button.primary}`}>
                <span>{pagesContent.create.submitLabel}</span>
                <span className={dc.button.icon}>
                  <Send className="h-4 w-4" />
                </span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({
  slug,
  comments = [],
}: {
  slug: string
  comments?: Comment[]
}) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable — keep the in-memory list */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-20 border-t border-white/10 pt-14">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <MessageCircle className="h-4 w-4" />
        </span>
        <h2 className="editable-display text-[1.5rem] leading-[1.15] tracking-[-0.015em] text-white">
          Reader responses
        </h2>
        <span className="editable-mono text-[11px] uppercase tracking-[0.24em] text-white/50">
          ({all.length})
        </span>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-6"
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="h-11 w-full rounded-[var(--editable-radius)] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors duration-300 placeholder:text-white/40 focus:border-white/40"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share your thoughts…"
          rows={3}
          maxLength={1500}
          className="mt-3 w-full resize-y rounded-[var(--editable-radius)] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors duration-300 placeholder:text-white/40 focus:border-white/40"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-[var(--tk-accent)] pl-5 pr-1.5 text-sm font-medium text-[var(--tk-on-accent)] transition-[background,transform] duration-300 hover:bg-[var(--slot4-accent-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>Post response</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black/15 transition-transform duration-300 group-hover:translate-x-0.5">
              <Send className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-4">
        {all.map((comment) => (
          <article
            key={comment.id}
            className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-[var(--slot4-panel-bg)] p-6"
          >
            <div className="flex items-center gap-3">
              <span className="editable-display grid h-10 w-10 place-items-center rounded-full bg-[var(--tk-accent-soft)] text-sm text-[var(--tk-accent)]">
                {initial(comment.name)}
              </span>
              <p className="truncate text-sm font-medium text-white">{comment.name || 'Guest'}</p>
            </div>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.65] text-white/75">
              {comment.comment}
            </p>
          </article>
        ))}
        {!all.length ? <p className="text-sm text-white/55">Be the first to respond.</p> : null}
      </div>
    </section>
  )
}

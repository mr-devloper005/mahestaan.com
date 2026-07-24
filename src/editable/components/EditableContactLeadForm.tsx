'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'h-12 rounded-[var(--editable-radius)] border border-white/10 bg-white/[0.04] px-4 text-[15px] font-medium text-white outline-none transition-colors duration-300 placeholder:text-white/40 focus:border-white/40 focus:bg-white/[0.06]'

const labelClass = 'editable-mono grid gap-2 text-[10px] uppercase tracking-[0.28em] text-white/55'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="How can we help?" />
      </div>
      <label className={`mt-4 ${labelClass}`}>
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you need help with…"
          className="rounded-[var(--editable-radius)] border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] font-medium text-white outline-none transition-colors duration-300 placeholder:text-white/40 focus:border-white/40 focus:bg-white/[0.06]"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div
          className={`mt-5 flex items-start gap-3 rounded-[var(--editable-radius)] px-4 py-3 text-sm font-medium ${
            status === 'success'
              ? 'border border-[var(--slot4-accent-secondary)]/40 bg-[color-mix(in_oklab,var(--slot4-accent-secondary)_16%,transparent)] text-white'
              : 'border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] pl-6 pr-2 text-sm font-medium text-[#121212] transition-[background,transform] duration-300 hover:bg-[var(--slot4-accent-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        <span>Send message</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-black/15 transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className={labelClass}>
      {label}
      <input name={name} type={type} required={required} placeholder={placeholder} className={inputClass} />
    </label>
  )
}

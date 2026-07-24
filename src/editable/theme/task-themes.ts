import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surface tokens. All tasks share one dark editorial palette (inspired by
  the Scion reference). Only per-task copy (kicker/note) varies, so each surface
  keeps its own voice while the visual language stays cohesive. Tokens are
  emitted as CSS variables under `--tk-*` and consumed by the archive/detail
  templates.
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Newsreader', 'Times New Roman', serif"
const BODY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared dark editorial palette — matches design-contract.ts.
const base = {
  dark: true,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#121212',
  surface: '#1a1a1a',
  raised: '#1e1e1e',
  text: 'rgba(255,255,255,0.86)',
  muted: 'rgba(255,255,255,0.60)',
  line: 'rgba(255,255,255,0.10)',
  accent: '#e0835c',
  accentSoft: 'rgba(224,131,92,0.14)',
  onAccent: '#121212',
  glow: 'rgba(224,131,92,0.10)',
  radius: '10px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Field notes',
    note: 'Deep reads and reporting on the places, ideas and reference material we track.',
  },
  listing: {
    ...base,
    kicker: 'Local directory',
    note: 'Places worth knowing — carefully verified records with contact, hours and directions.',
  },
  classified: {
    ...base,
    kicker: 'Notice board',
    note: 'Fresh offers and short-form listings ready to act on.',
  },
  image: {
    ...base,
    kicker: 'Visual field',
    note: 'A visual index of images, galleries and field photography.',
  },
  sbm: {
    ...base,
    kicker: 'Saved links',
    note: 'Curated web resources worth returning to.',
  },
  pdf: {
    ...base,
    kicker: 'Reference library',
    note: 'Downloadable references — reports, guides, primary sources.',
  },
  profile: {
    ...base,
    kicker: 'People',
    note: 'The makers, operators and researchers behind the work.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Point the shared article-body accent vars to this task's accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

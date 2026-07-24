import type { CSSProperties } from 'react'

/*
  Editorial dark theme derived from the Scion reference.
  Every visual token cascades from here — palette, container, section rhythm,
  typography, buttons, cards, motion. Individual components must consume
  these CSS variables / class helpers rather than hardcode colors or fonts.
*/

export const editableRootStyle = {
  // Base surfaces
  '--slot4-page-bg': '#121212',
  '--slot4-page-text': 'rgba(255,255,255,0.86)',
  '--slot4-panel-bg': '#1e1e1e',
  '--slot4-surface-bg': '#1a1a1a',
  '--slot4-raised-bg': '#26262a',
  '--slot4-muted-text': 'rgba(255,255,255,0.62)',
  '--slot4-soft-muted-text': 'rgba(255,255,255,0.42)',
  '--slot4-heading-text': '#ffffff',

  // Accents (Scion warm orange primary, sage secondary)
  '--slot4-accent': '#e0835c',
  '--slot4-accent-fill': '#e0835c',
  '--slot4-accent-hover': '#e69275',
  '--slot4-accent-soft': 'rgba(224,131,92,0.14)',
  '--slot4-accent-secondary': '#a2b79f',
  '--slot4-on-accent': '#121212',

  // Dark helpers (mostly identical here, kept for downstream naming)
  '--slot4-dark-bg': '#0e0e0e',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#202024',
  '--slot4-cream': '#1e1e1e',
  '--slot4-warm': '#26262a',
  '--slot4-lavender': '#1e1e1e',
  '--slot4-gray': '#1a1a1a',

  '--slot4-body-gradient': 'none',

  // Editable navbar / footer / etc
  '--editable-page-bg': '#121212',
  '--editable-page-text': 'rgba(255,255,255,0.86)',
  '--editable-container': '1248px',
  '--editable-border': 'rgba(255,255,255,0.10)',
  '--editable-border-strong': 'rgba(255,255,255,0.20)',
  '--editable-hover-fill': 'rgba(255,255,255,0.06)',
  '--editable-nav-bg': 'rgba(18,18,18,0.82)',
  '--editable-nav-text': 'rgba(255,255,255,0.92)',
  '--editable-nav-active': '#e0835c',
  '--editable-nav-active-text': '#121212',
  '--editable-cta-bg': '#e0835c',
  '--editable-cta-text': '#121212',
  '--editable-search-bg': 'rgba(255,255,255,0.06)',
  '--editable-footer-bg': '#0e0e0e',
  '--editable-footer-text': 'rgba(255,255,255,0.82)',

  // Motion + sizing
  '--editable-radius-sm': '6px',
  '--editable-radius': '10px',
  '--editable-radius-lg': '14px',
  '--editable-radius-pill': '999px',
  '--editable-section-pad-y': 'clamp(4.5rem,7vw,7.5rem)',
  '--editable-section-pad-y-lg': 'clamp(6rem,10vw,10.5rem)',
  '--editable-section-pad-y-sm': 'clamp(2.5rem,4vw,3.5rem)',
  '--ease-premium': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  headingText: 'text-[var(--slot4-heading-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  raisedBg: 'bg-[var(--slot4-raised-bg)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSecondaryText: 'text-[var(--slot4-accent-secondary)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  borderStrong: 'border-[var(--editable-border-strong)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.04)]',
  shadowStrong: 'shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.75))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10',
    sectionY: 'py-[var(--editable-section-pad-y)]',
    sectionYSm: 'py-[var(--editable-section-pad-y-sm)]',
    sectionYLg: 'py-[var(--editable-section-pad-y-lg)]',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow:
      'text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    eyebrowMuted:
      'text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]',
    display:
      'editable-display text-[clamp(2.5rem,6.6vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-[var(--slot4-heading-text)]',
    heroTitle:
      'editable-display text-[clamp(2.25rem,5.6vw,3.75rem)] leading-[1.08] tracking-[-0.025em] text-[var(--slot4-heading-text)]',
    sectionTitle:
      'editable-display text-[clamp(1.85rem,3.8vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-[var(--slot4-heading-text)]',
    cardTitle:
      'editable-display text-[clamp(1.25rem,1.8vw,1.55rem)] leading-[1.25] tracking-[-0.015em] text-[var(--slot4-heading-text)]',
    body: 'text-base leading-[1.65] text-[var(--slot4-page-text)]',
    lead: 'text-lg leading-[1.55] text-[var(--slot4-page-text)] sm:text-xl',
    emphasis: 'editable-display-italic text-[var(--slot4-accent)]',
    meta:
      'text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-[var(--editable-radius)] border ${editablePalette.border} ${editablePalette.panelBg}`,
    soft: `rounded-[var(--editable-radius)] border ${editablePalette.border} bg-[var(--editable-hover-fill)]`,
    dark: `rounded-[var(--editable-radius)] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    outline: `rounded-[var(--editable-radius)] border ${editablePalette.border} bg-transparent`,
  },
  button: {
    primary:
      'group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] pl-6 pr-2 py-1 text-sm font-medium tracking-[-0.005em] text-[var(--slot4-on-accent)] transition-[background,transform] duration-300 hover:bg-[var(--slot4-accent-hover)] active:scale-[0.98]',
    secondary:
      'group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-transparent pl-6 pr-2 py-1 text-sm font-medium tracking-[-0.005em] text-white transition-[background,border-color,transform] duration-300 hover:border-white/40 hover:bg-white/[0.04] active:scale-[0.98]',
    accent:
      'group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white pl-6 pr-2 py-1 text-sm font-medium tracking-[-0.005em] text-[#121212] transition-[background,transform] duration-300 hover:bg-white/90 active:scale-[0.98]',
    ghost:
      'group inline-flex items-center gap-2 text-sm font-medium text-white transition-colors duration-300 hover:text-[var(--slot4-accent)]',
    icon:
      'ml-1 grid h-9 w-9 place-items-center rounded-full bg-black/15 text-current transition-transform duration-300 group-hover:translate-x-0.5',
    iconSecondary:
      'ml-1 grid h-9 w-9 place-items-center rounded-full border border-current/25 text-current transition-transform duration-300 group-hover:translate-x-0.5',
  },
  badge: {
    pill:
      'inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]',
    accentPill:
      'inline-flex items-center gap-1.5 rounded-full border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent)]',
    sagePill:
      'inline-flex items-center gap-1.5 rounded-full border border-[var(--slot4-accent-secondary)]/35 bg-[color-mix(in_oklab,var(--slot4-accent-secondary)_16%,transparent)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent-secondary)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[var(--editable-radius)] ${editablePalette.mediaBg}`,
    frameFull:
      'relative overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[4/3]',
    ratioWide: 'aspect-[16/9]',
    ratioUltra: 'aspect-[21/9]',
  },
  motion: {
    lift:
      'transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-[var(--editable-border-strong)]',
    fade: 'transition-opacity duration-500 hover:opacity-85',
    zoom: 'transition-transform duration-[900ms] hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Never hardcode colors, fonts, radii, or button shapes; consume CSS variables from editableRootStyle.',
  'Section vertical rhythm comes from dc.shell.sectionY (and Lg / Sm variants). Do not invent bespoke py-* values.',
  'Buttons are pill-shaped by default (h-12 rounded-full). Use dc.button.primary/secondary/accent.',
  'Cards are dark panels bg-[var(--slot4-panel-bg)] with a hairline white border. Use dc.surface.card.',
  'Display type uses Newsreader (via .editable-display). Italic accent words use .editable-display-italic.',
  'Keep dynamic post fetching intact; never inline mock data.',
  'Use postHref() so every task keeps its own route.',
] as const

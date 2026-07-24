import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Reporting, essays and reference-adjacent field notes.',
    description:
      'Longer reads that sit alongside the catalogue — essays, guides and reporting that give context to the records on both shelves.',
    filterLabel: 'Filter by topic',
    secondaryNote: 'The reading shelf is quieter than the archive; give each note room to breathe.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Short-form notices, offers and time-sensitive posts.',
    description:
      'A working notice board for offers, requests and time-limited posts — fast to scan, quick to act on.',
    filterLabel: 'Filter by notice type',
    secondaryNote: 'Prioritize urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved links',
    headline: 'Curated links kept as a working reading list.',
    description:
      'Web pages worth returning to — tools, references, and long-form pieces that sit outside the catalogue but complement it.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'The makers, operators and researchers behind the records.',
    description:
      'Profiles for the people who submit, verify and maintain what sits on both shelves — with the credits and context that place-based records tend to hide.',
    filterLabel: 'Filter by role',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Verified voices', 'Contributor cards'],
  },
  pdf: {
    eyebrow: 'Reference library',
    headline: 'References — reports, guides and primary sources.',
    description:
      'The library shelf: downloadable references organised for preview, download and citation. Every entry keeps its own workspace with sections, metadata and a working preview.',
    filterLabel: 'Filter by reference type',
    secondaryNote: 'Every reference is preview-first — the file itself is the hero.',
    chips: ['References', 'Downloadable', 'Cite-ready'],
  },
  listing: {
    eyebrow: 'Local directory',
    headline: 'Verified places, kept usable and current.',
    description:
      'The directory shelf: real places with real records — address, hours, links, quick facts — verified quietly and updated in place instead of republished.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Prioritize verified contact, location, and direct action paths.',
    chips: ['Directory', 'Verified records', 'Contact-first'],
  },
  image: {
    eyebrow: 'Visual field',
    headline: 'Images that record the catalogue.',
    description:
      'Field photography and diagrams that support the records — a working visual archive rather than a stock gallery.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the image do the talking; keep metadata quiet.',
    chips: ['Gallery', 'Field-first', 'Archive'],
  },
} satisfies Record<TaskKey, TaskPageVoice>

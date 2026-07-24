import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A directory and a reference library, kept together',
      description:
        'Verified places on one shelf, verified references on the other, and one search that moves between them.',
      openGraphTitle: 'Places worth knowing. References worth keeping.',
      openGraphDescription:
        'A working catalogue of verified places and verified references, kept usable and current.',
      keywords: ['local directory', 'reference library', 'guides', 'places', 'references'],
    },
    hero: {
      badge: 'A directory · a library',
      title: ['Places worth knowing.', 'References worth keeping.'],
      description:
        'Two shelves in one catalogue — verified places and verified references, connected by a single search and kept quietly current.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
      searchPlaceholder: 'Search places, references, categories…',
      focusLabel: 'Focus',
      featureCardBadge: 'Recent additions',
      featureCardTitle: 'What was added this week, at a glance.',
      featureCardDescription:
        'The most recent records — a new place, a fresh reference — sit at the top so returning visitors see what changed.',
    },
    intro: {
      badge: 'How it works',
      title: 'One catalogue, two shelves — kept usable and current.',
      paragraphs: [
        'Every place gets its own record: address, hours, contact, links. Every reference gets its own workspace: preview, download, sections.',
        'Search moves across both shelves so a place cites a reference, and a reference points back to the place.',
        'No feeds to keep up with, no timelines to scroll — just a working catalogue you can return to when you need it.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Verified place records with contact, hours and directions.',
        'Downloadable references with previews, sections and citations.',
        'A single search that crosses the two shelves.',
        'Quiet motion, high contrast, no infinite feed.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listing' },
      secondaryLink: { label: 'Open the library', href: '/pdf' },
    },
    cta: {
      badge: 'Contribute',
      title: 'Add a place. Share a reference.',
      description:
        `${slot4BrandConfig.siteName} grows because readers send in the record. Submit a place worth knowing, or drop a reference worth keeping (a report, a guide, a primary source) — we handle the rest.`,
      primaryCta: { label: 'Submit an entry', href: '/create' },
      secondaryCta: { label: 'Get in touch', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'The newest records in this shelf.',
    },
  },
  about: {
    badge: 'About',
    title: 'A quieter catalogue for people who take notes.',
    description: `${slot4BrandConfig.siteName} is a working catalogue with two shelves — a directory of places and a library of references — kept usable, current, and quietly connected.`,
    paragraphs: [
      'We built this because most of what we needed was scattered — a place lived in one app, a reference in another, and neither pointed at the other.',
      'So we made one catalogue with two shelves and a single search. A place cites a reference. A reference names a place. Both stay in view.',
      'No feeds, no rankings, no timelines to keep up with. Just records that stay put, get verified, and get better over time.',
    ],
    values: [
      {
        title: 'Records that stay put',
        description:
          'Every entry has a permanent home. We update it in place instead of publishing a new version every week.',
      },
      {
        title: 'Two shelves, one search',
        description:
          'The directory and the library share metadata, so one query returns places and references side by side.',
      },
      {
        title: 'Quiet by default',
        description:
          'No notifications, no dark patterns, no infinite feed. Just the catalogue and a way to search it.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what belongs on the shelf.',
    description:
      'Route your message through the lane that fits — a place to add, a reference to share, a correction to make, or a partnership to discuss.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search across the directory and the reference library in one place.',
    },
    hero: {
      badge: 'Search the catalogue',
      title: 'Find a place. Find a reference. Find both.',
      description:
        'One query moves across the directory and the library. Filter by category or by section when you need to narrow the shelf.',
      placeholder: 'Search places, references, categories…',
    },
    resultsTitle: 'Recent entries across the catalogue',
  },
  create: {
    metadata: {
      title: 'Submit an entry',
      description: 'Add a new record to the directory or the reference library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description:
        'Use your contributor account to add a place to the directory or a reference to the library. New accounts open in under a minute.',
    },
    hero: {
      badge: 'Contributor workspace',
      title: 'Add a place. Share a reference.',
      description:
        'Pick a section, fill in the details, and send it through — we review, verify, and publish it into the catalogue.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Send for review',
    successTitle: 'Entry saved locally.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your contributor account.',
      badge: 'Contributor access',
      title: 'Welcome back to the desk.',
      description: 'Sign in to continue submitting entries and managing what you have already sent through.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then sign in.',
      success: 'Signed in. Taking you home…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create a contributor account.',
      badge: 'New contributor',
      title: 'Start contributing to the catalogue.',
      description:
        'Create an account to add places to the directory, share references to the library, and track what you submit.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Taking you home…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More field notes',
      fallbackTitle: 'Field note',
    },
    listing: {
      relatedTitle: 'More from the directory',
      fallbackTitle: 'Directory record',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Visual entry',
    },
    profile: {
      relatedTitle: 'Related profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const

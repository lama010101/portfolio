/*
 * CONTENT — single source of truth for the Locale & Logic studio site.
 * Imported by Astro pages and by scripts/generate-assets.mjs (PDF, OG image).
 * Keep claims honest: no years unless verified, no invented metrics.
 */
import { CONTACT_EMAIL, GAME_URL, LINKEDIN_URL, SITE_NAME, SITE_TAGLINE, siteUrl } from '../config';

export const founder = {
  name: 'Laurent Martenot',
  role: 'Founder',
  // Honest positioning: tests, evaluates and directs software; does not write production code.
  statement: 'I test, evaluate and direct software; I don\u2019t write production code.',
};

export const location = 'Remote \u00b7 UTC+7 \u00b7 covers US/EU overnight windows';

export const languages = [
  { lang: 'French', level: 'Native', note: 'Primary working language', width: 100 },
  { lang: 'English', level: 'Near-native', note: '10 years in the United States', width: 88 },
  { lang: 'Spanish', level: 'Professional', note: 'Reviews and second-language checks, EN\u2194ES source-side', width: 72 },
] as const;

export const languageBadge = 'Native French \u00b7 Near-native English \u00b7 Professional Spanish';

export const education = [
  {
    school: 'ICN Business School, Nancy, France',
    degree: 'Dipl\u00f4me Programme Grande \u00c9cole',
    detail: 'Grade de Master, Bac+5, RNCP level 7 \u2014 international title: Master in Management',
  },
  {
    school: 'Indiana University of Pennsylvania, USA',
    degree: 'MBA',
    detail: '',
  },
];

export const experience = [
  {
    role: 'QA Test Engineer, Internationalization (i18n)',
    org: 'Google \u2014 via Accenture',
    dates: 'May 2021 \u2013 Feb 2022',
    note: 'Functional testing of Google Assistant on iOS and Android; bug reporting, triage and follow-ups.',
  },
  {
    role: 'QA Test Engineer, Localization (l10n)',
    org: 'Apple \u2014 via Moravia',
    dates: 'Aug 2016 \u2013 Dec 2017',
    note: 'Functional and linguistic testing on iOS and web.',
  },
  {
    role: 'Functional Consultant (part-time)',
    org: 'Lovie Studio, San Jos\u00e9, CA',
    dates: 'Apr 2018 \u2013 Apr 2022',
    note: 'Analysis, project coordination and QA: specs and test plans, UI/UX decisions, offshore Agile sprints and budgets.',
  },
  {
    role: 'Key Account Manager, QA testing software',
    org: 'Solution-Soft, Santa Clara, CA',
    dates: 'Apr 2015 \u2013 Jul 2016',
    note: '',
  },
  {
    role: 'Co-founder, Business Analyst & Project Manager',
    org: '5Oi50, San Francisco / Montpellier',
    dates: 'Nov 2011 \u2013 Mar 2015',
    note: 'Led teams of 5\u201315.',
  },
  {
    role: 'Founder & Managing Director',
    org: 'Eldesem, Quer\u00e9taro, Mexico',
    dates: 'Aug 2001 \u2013 Sep 2011',
    note: '',
  },
  {
    role: 'Independent Product Owner',
    org: 'Guess-History (BackToThePast)',
    dates: '2022 \u2013 present',
    note: 'Conceiving and directing a multiplayer history & geography guessing game, live in alpha. Directs AI coding agents: scopes each task, reviews every change, supervises tests.',
  },
];

export const countries = 'France, the United States, Mexico and Asia';

export const tools = [
  'Jira',
  'Trello',
  'Worldserver',
  'Smartling',
  'Figma',
  'GitHub',
  'ADB',
  'Android & iOS testing',
  'Supabase',
  'Vercel',
];

/* ---------------- offers ---------------- */

export interface Offer {
  id: 'quality' | 'ai-evaluation' | 'launch-review';
  index: string;
  title: string;
  tagline: string;
  summary: string;
  points: string[];
  deliverables: string[];
  href: string;
  cta: string;
  secondary?: boolean;
}

export const offers: Offer[] = [
  {
    id: 'quality',
    index: '01',
    title: 'Localization & i18n QA',
    tagline: 'Functional and linguistic testing of apps, web and games.',
    summary:
      'End-to-end localization and internationalization testing: functional bugs, truncated or broken strings, encoding issues, locale formats, layout overflow, and linguistic review of FR/EN/ES copy.',
    points: [
      'Functional i18n/l10n testing on Android, iOS and web',
      'Linguistic review: grammar, tone, terminology, cultural fit',
      'Bugs logged directly in your tracker (Jira, Trello, Linear, etc.)',
      'Findings severity-scored, MQM-style',
    ],
    deliverables: ['Bug report in your tracker', 'Summary scorecard with severity breakdown'],
    href: '/quality/',
    cta: 'Explore the offer',
  },
  {
    id: 'ai-evaluation',
    index: '02',
    title: 'Multilingual AI evaluation',
    tagline: 'Human evaluation of model outputs in FR/EN/ES.',
    summary:
      'Structured human evaluation of AI outputs: accuracy, fluency, cultural fit and instruction following, with rubrics and annotation guidelines written for your use case.',
    points: [
      'Human evaluation of model outputs in FR/EN/ES',
      'Rubric and annotation-guideline writing',
      'Calibration sets for annotator alignment',
      'Failure-mode report across languages',
    ],
    deliverables: ['Evaluation report per language', 'Rubric & annotation guidelines', 'Failure-mode taxonomy'],
    href: '/ai-evaluation/',
    cta: 'Explore the offer',
  },
  {
    id: 'launch-review',
    index: '03',
    title: 'Launch-readiness review',
    tagline: 'Fixed-price pre-launch pass for small AI-built products.',
    summary:
      'A single fixed-price pass combining localization QA and multilingual AI evaluation, scoped for small products shipping fast.',
    points: [
      'Combines offer 01 and offer 02 in one pass',
      'Fixed price \u2014 quoted once scope is confirmed',
      'Go/no-go checklist plus prioritized findings',
    ],
    deliverables: ['Launch checklist', 'Prioritized findings report'],
    href: '/quality/',
    cta: 'See how it works',
    secondary: true,
  },
];

/* ---------------- method ---------------- */

export const methodLine =
  'Every finding is decided by a human reviewer; AI tools are used for triage and drafting only where the client allows it.';

export const methodSteps = [
  {
    n: '01',
    title: 'Scope',
    text: 'Languages, locales, platforms, budgets and success criteria agreed in writing before work starts.',
  },
  {
    n: '02',
    title: 'Test or evaluate',
    text: 'Functional and linguistic testing, or structured human evaluation of model outputs, against the agreed rubric.',
  },
  {
    n: '03',
    title: 'Score',
    text: 'Every finding is severity-scored MQM-style; every eval score traces back to a written criterion.',
  },
  {
    n: '04',
    title: 'Report',
    text: 'Bug report in your tracker plus a summary scorecard \u2014 findings, severity, evidence, recommended fix.',
  },
  {
    n: '05',
    title: 'Retest',
    text: 'Fixed issues are retested and the scorecard is updated, so the delta is visible.',
  },
];

/* ---------------- proof ---------------- */

export interface ProofItem {
  slug: string;
  published: boolean;
  kind: 'project' | 'methodology' | 'case';
  title: string;
  status: string;
  summary: string;
  body: string[];
  url: string;
}

export const proofItems: ProofItem[] = [
  {
    slug: 'guess-history',
    published: true,
    kind: 'project',
    title: 'Guess-History (BackToThePast)',
    status: 'Live alpha',
    summary:
      'A multiplayer history & geography guessing game conceived and directed end-to-end, with AI coding agents implementing under direction. It doubles as this studio\u2019s live test subject for evaluation workflows.',
    body: [
      'Guess-History, also known as BackToThePast, is a live multiplayer history and geography guessing game.',
      'It is in alpha: playable, still being extended, and used here as the concrete subject for evaluation and QA work rather than a claim about scale.',
      'The build itself is a working example of the method on this site: a human sets scope and product decisions, AI agents implement, and every result is reviewed by a person.',
    ],
    url: GAME_URL,
  },
];

/* "How I score findings" — the studio's own methodology, always published. */
export const scoringMethodology = {
  title: 'How I score findings',
  intro:
    'Findings are scored severity-first, MQM-style: the category says what kind of problem it is, the severity says how much it matters. Scores are comparable across languages and across rounds, so a retest shows a real delta.',
  levels: [
    { sev: 'Blocker', def: 'Prevents a task from completing, or changes the meaning of content. Ship-stopper.' },
    { sev: 'Major', def: 'Serious impairment a user will hit: broken layout, wrong locale format, meaning-changing mistranslation.' },
    { sev: 'Minor', def: 'Noticeable defect with a workaround: awkward phrasing, inconsistent terminology, small overflow.' },
    { sev: 'Cosmetic', def: 'Style or polish issue: punctuation conventions, casing, minor spacing.' },
  ],
  categories: [
    'Accuracy',
    'Fluency / grammar',
    'Terminology consistency',
    'Style & register',
    'Locale conventions (dates, numbers, currency)',
    'Layout & truncation',
    'Cultural fit',
  ],
  rules: [
    'One finding = one defect, with reproduction steps and a screenshot or log line where possible.',
    'Severity is argued from user impact, not from effort to fix.',
    'The scorecard counts findings by severity and category \u2014 never an invented quality percentage.',
    'Retests re-score only the reported issues, so progress is measurable.',
  ],
};

/* ---------------- audiences (home selector) ---------------- */

export interface Audience {
  id: 'agency' | 'ai' | 'game';
  label: string;
  lead: string;
  cta: { label: string; href: string };
  alt: { label: string; href: string };
  order: string[];
}

export const sectionTitles: Record<string, string> = {
  services: 'Offers',
  method: 'Method',
  proof: 'Proof',
  partners: 'For agencies & vendors',
  about: 'About',
};

export const audiences: Audience[] = [
  {
    id: 'agency',
    label: 'Agency / vendor',
    lead: 'White-label multilingual QA and AI evaluation capacity: you keep the client relationship, I do the language work. I work inside your tracker and tools, under NDA when needed, with coverage that spans US and EU overnight windows from UTC+7.',
    cta: { label: 'Request a quote', href: '/contact/' },
    alt: { label: 'Vendor one-pager (PDF)', href: '/capability-statement.pdf' },
    order: ['services', 'partners', 'method', 'proof', 'about'],
  },
  {
    id: 'ai',
    label: 'AI / product team',
    lead: 'Human evaluation of model outputs in French, English and Spanish \u2014 rubrics, annotation guidelines, calibration sets and a failure-mode report your team can act on.',
    cta: { label: 'Request a quote', href: '/contact/' },
    alt: { label: 'See the AI evaluation offer', href: '/ai-evaluation/' },
    order: ['services', 'method', 'proof', 'partners', 'about'],
  },
  {
    id: 'game',
    label: 'Game studio',
    lead: 'Localization and i18n QA for games and apps: functional and linguistic testing, bugs in your tracker, severity-scored findings. Games are a secondary market here \u2014 Guess-History is the live test subject, not a portfolio of shipped titles.',
    cta: { label: 'Request a quote', href: '/contact/' },
    alt: { label: 'See localization QA', href: '/quality/' },
    order: ['services', 'proof', 'method', 'partners', 'about'],
  },
];

export const defaultAudience = 'agency';

/* ---------------- partners ---------------- */

export const partnerFacts = [
  { k: 'Languages', v: 'French (native) \u00b7 English (near-native) \u00b7 Spanish (professional, EN\u2194ES source-side)' },
  { k: 'Services', v: 'Localization & i18n QA \u00b7 Multilingual AI evaluation \u00b7 Launch-readiness reviews' },
  { k: 'Availability', v: 'Remote \u00b7 UTC+7 \u00b7 covers US/EU overnight windows' },
  { k: 'Working model', v: 'NDA-ready \u00b7 works in your tracker and tools \u00b7 rates on request' },
];

/* ---------------- contact ---------------- */

export const contactOptions = [
  { id: 'quality', label: offers[0].title, subject: 'Quote request \u2014 Localization & i18n QA' },
  { id: 'ai-evaluation', label: offers[1].title, subject: 'Quote request \u2014 Multilingual AI evaluation' },
  { id: 'launch-review', label: offers[2].title, subject: 'Quote request \u2014 Launch-readiness review' },
  { id: 'partner', label: 'Agency / vendor partnership', subject: `Partnership enquiry \u2014 ${SITE_NAME}` },
];

export const contact = {
  email: CONTACT_EMAIL,
  linkedin: LINKEDIN_URL,
  pdf: '/capability-statement.pdf',
  studio: SITE_NAME,
  tagline: SITE_TAGLINE,
  siteUrl,
};

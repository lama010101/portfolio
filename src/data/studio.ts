/*
 * CONTENT — single source of truth for the studio site.
 * Imported by Astro pages and by scripts/generate-assets.mjs (PDF, OG image).
 * Keep claims honest: no years unless verified, no invented metrics.
 */
import { CONTACT_EMAIL, LINKEDIN_URL, SITE_NAME, SITE_TAGLINE, siteUrl } from '../config';

export const founder = {
  name: 'Laurent Martenot',
  role: 'Founder',
  statement: 'I test, evaluate and direct software; I don’t write production code.',
};

export const location = 'Remote · UTC+7 · covers US/EU overnight windows';

export const languages = [
  { lang: 'French', level: 'Native', note: 'Primary working language', width: 100 },
  { lang: 'English', level: 'Near-native', note: '10 years in the United States', width: 88 },
  { lang: 'Spanish', level: 'Professional', note: 'Reviews and second-language checks, EN↔ES source-side', width: 72 },
] as const;

export const languageBadge = 'Native French · Near-native English · Professional Spanish';

export const education = [
  {
    school: 'ICN Business School, Nancy, France',
    degree: 'Diplôme Programme Grande École',
    detail: 'Grade de Master, Bac+5, RNCP level 7 — international title: Master in Management',
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
    org: 'Google — via Accenture',
    dates: 'May 2021 – Feb 2022',
    note: 'Functional testing of Google Assistant on iOS and Android; bug reporting, triage and follow-ups.',
  },
  {
    role: 'QA Test Engineer, Localization (l10n)',
    org: 'Apple — via Moravia',
    dates: 'Aug 2016 – Dec 2017',
    note: 'Functional and linguistic testing on iOS and web.',
  },
  {
    role: 'Functional Consultant (part-time)',
    org: 'Lovie Studio, San José, CA',
    dates: 'Apr 2018 – Apr 2022',
    note: 'Analysis, project coordination and QA: specs and test plans, UI/UX decisions, offshore Agile sprints and budgets.',
  },
  {
    role: 'Key Account Manager, QA testing software',
    org: 'Solution-Soft, Santa Clara, CA',
    dates: 'Apr 2015 – Jul 2016',
    note: '',
  },
  {
    role: 'Co-founder, Business Analyst & Project Manager',
    org: '5Oi50, San Francisco / Montpellier',
    dates: 'Nov 2011 – Mar 2015',
    note: 'Led teams of 5–15.',
  },
  {
    role: 'Founder & Managing Director',
    org: 'Eldesem, Querétaro, Mexico',
    dates: 'Aug 2001 – Sep 2011',
    note: '',
  },
  {
    role: 'Independent Product Owner',
    org: 'Dig the Past and LIKED',
    dates: '2022 – present',
    note: 'Conceives and directs software products; scopes each task, reviews every change and supervises tests performed by AI coding agents.',
  },
];

export const countries = 'France, the United States, Mexico and Asia';

export const tools = [
  'Jira',
  'Trello',
  'Linear',
  'Worldserver',
  'Smartling',
  'Figma',
  'ADB',
  'Android & iOS testing',
  'Supabase',
  'Vercel',
];

export interface ServiceTile {
  id: string;
  index: string;
  title: string;
  tagline: string;
  summary: string;
  points: string[];
  deliverables: string[];
  href: string;
  cta: string;
}

export const qualityServices: ServiceTile[] = [
  {
    id: 'localization-i18n-qa',
    index: 'Q1',
    title: 'Localization & i18n QA',
    tagline: 'Functional internationalization testing before language quality is judged.',
    summary:
      'End-to-end localization and internationalization testing for apps, web products and games: broken strings, encoding, locale formats, layout overflow, untranslated UI and wrong-language fallbacks.',
    points: [
      'Android, iOS and web builds',
      'Locale formats, pluralization, encoding and truncation',
      'Bugs logged directly in your tracker',
      'Severity-scored findings with evidence',
    ],
    deliverables: ['Bug report in your tracker', 'Severity scorecard'],
    href: '/quality/french-lqa-testing/',
    cta: 'French LQA testing',
  },
  {
    id: 'functional-qa',
    index: 'Q2',
    title: 'Functional QA',
    tagline: 'Release-focused passes that answer what breaks, where and how badly.',
    summary:
      'Structured functional testing of scoped user journeys, edge cases and regression areas, with reproducible evidence rather than a vague “tested” claim.',
    points: [
      'Scoped test plans and exploratory passes',
      'Reproduction steps, screenshots or recordings where useful',
      'Regression and retest passes',
      'Tracker-native delivery',
    ],
    deliverables: ['Reproducible defect list', 'Retest delta'],
    href: '/quality/',
    cta: 'See quality services',
  },
  {
    id: 'linguistic-qa',
    index: 'Q3',
    title: 'Linguistic QA',
    tagline: 'Native-French review with English near-native and Spanish professional support.',
    summary:
      'Linguistic review of product copy, localization output and customer-facing flows: grammar, terminology, tone, register, consistency and cultural fit.',
    points: [
      'EN>FR primary language pair',
      'FR>EN review support',
      'EN<>ES secondary checks',
      'Glossary and style-guide alignment when supplied',
    ],
    deliverables: ['Linguistic findings report', 'Terminology and style notes'],
    href: '/quality/french-lqa-testing/',
    cta: 'See French LQA',
  },
  {
    id: 'multilingual-ai-evaluation',
    index: 'Q4',
    title: 'Multilingual AI output evaluation',
    tagline: 'Human judgement of model output quality across languages.',
    summary:
      'Structured evaluation of AI outputs in French, English and Spanish: accuracy, fluency, instruction following, cultural fit and cross-language consistency.',
    points: [
      'Human review, not automated-only scoring',
      'Per-language findings and cited examples',
      'Failure-mode taxonomy',
      'Calibration sets for reviewer alignment',
    ],
    deliverables: ['Evaluation report per language', 'Failure-mode report'],
    href: '/quality/multilingual-ai-evaluation/',
    cta: 'See AI evaluation',
  },
  {
    id: 'rubrics-guidelines',
    index: 'Q5',
    title: 'Rubric & annotation-guideline writing',
    tagline: 'Written criteria that let humans score the same thing the same way.',
    summary:
      'Rubrics, annotation guidelines and calibration examples written for your product, workflow and language requirements.',
    points: [
      'Task-specific scoring criteria',
      'Examples of pass/fail and edge cases',
      'Reviewer calibration material',
      'Revision after pilot feedback',
    ],
    deliverables: ['Rubric', 'Annotation guidelines', 'Calibration examples'],
    href: '/quality/multilingual-ai-evaluation/',
    cta: 'See evaluation support',
  },
];

export const buildServices: ServiceTile[] = [
  {
    id: 'directed-builds',
    index: 'B1',
    title: 'Directed small product builds',
    tagline: 'Human product direction with AI-assisted implementation.',
    summary:
      'For small, bounded products: scope is written by a human, implementation is delegated to AI coding agents in small tasks, and every change is reviewed before release.',
    points: [
      'Product requirements and acceptance criteria',
      'Atomic implementation tasks for AI coding agents',
      'Human review of diffs, behavior and test evidence',
      'Honest status labels: live alpha, in development or planned',
    ],
    deliverables: ['Scoped build plan', 'Reviewed working increments'],
    href: '/how-we-build/',
    cta: 'How we build',
  },
  {
    id: 'build-quality-review',
    index: 'B2',
    title: 'Build quality & launch review',
    tagline: 'A pre-release reality check for small AI-built products.',
    summary:
      'A fixed-scope review combining functional QA, localization QA and product evidence so a small team can decide what is ready, what is alpha and what should not be claimed yet.',
    points: [
      'Scope and claims review',
      'Functional and language pass',
      'Prioritized launch findings',
      'Retest of fixed issues',
    ],
    deliverables: ['Launch-readiness report', 'Prioritized findings'],
    href: '/quality/',
    cta: 'Start with quality',
  },
];

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
    text: 'Bug report in your tracker plus a summary scorecard — findings, severity, evidence, recommended fix.',
  },
  {
    n: '05',
    title: 'Retest',
    text: 'Fixed issues are retested and the scorecard is updated, so the delta is visible.',
  },
];

export const buildSteps = [
  {
    n: '01',
    title: 'Write the product truth',
    text: 'A human defines the user problem, boundaries, data model expectations and honest release status before implementation starts.',
  },
  {
    n: '02',
    title: 'Slice the work atomically',
    text: 'Large features are broken into small tasks with exact files, behaviors and acceptance evidence. Vague tasks are rejected.',
  },
  {
    n: '03',
    title: 'Delegate implementation',
    text: 'AI coding agents implement bounded tasks. The founder directs and reviews; he does not present himself as the production-code author.',
  },
  {
    n: '04',
    title: 'Verify before acceptance',
    text: 'Builds, tests, type checks, screenshots or behavior proofs are reviewed against the written scope before a task is accepted.',
  },
  {
    n: '05',
    title: 'Label status honestly',
    text: 'Work is presented as live alpha, in development or planned. Unfinished features are not marketed as shipped.',
  },
];

export const scoringMethodology = {
  title: 'How findings are scored',
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
    'The scorecard counts findings by severity and category — never an invented quality percentage.',
    'Retests re-score only the reported issues, so progress is measurable.',
  ],
};

export interface Audience {
  id: 'agency' | 'product' | 'build';
  label: string;
  lead: string;
  order: string[];
}

export const sectionTitles: Record<string, string> = {
  services: 'Services',
  partners: 'For agencies',
  work: 'Work',
  build: 'How we build',
  about: 'About',
};

export const audiences: Audience[] = [
  {
    id: 'agency',
    label: 'Agency / vendor',
    lead: 'White-label multilingual QA and AI evaluation capacity: you keep the client relationship, we deliver the language work inside your tracker and tools. Human specialists and subcontractors join per project when the work needs them.',
    order: ['services', 'partners', 'work', 'build', 'about'],
  },
  {
    id: 'product',
    label: 'Product / AI team',
    lead: 'Human evaluation and localization QA for products shipping across French, English and Spanish — with rubrics, calibration and evidence your team can reuse.',
    order: ['services', 'work', 'partners', 'build', 'about'],
  },
  {
    id: 'build',
    label: 'Build client',
    lead: 'Small product builds are second priority here: human direction, AI-assisted implementation and strict acceptance review. Quality work remains the primary studio service.',
    order: ['services', 'build', 'work', 'partners', 'about'],
  },
];

export const defaultAudience = 'agency';

export const languagePairs = [
  { pair: 'EN>FR', note: 'Primary — French native lead' },
  { pair: 'FR>EN', note: 'English near-native review support' },
  { pair: 'EN<>ES', note: 'Secondary — Spanish professional checks' },
];

export const partnerServiceTypes = [
  'Localization/i18n QA',
  'Functional QA',
  'Linguistic QA',
  'Multilingual AI output evaluation',
  'Rubric and annotation-guideline writing',
];

export const engagementModel = [
  'Hourly or per project',
  'Rates on request',
  'Availability and turnaround confirmed in writing per engagement',
  'UTC+7 coverage of US/EU overnight windows',
  'NDA-ready',
  'Works in your tracker and tools',
];

export const onboardingSteps = [
  {
    n: '01',
    title: 'Send the vendor note',
    text: 'Email the studio with your language pairs, service types, expected volumes and tracker. The vendor onboarding subject is already prepared.',
  },
  {
    n: '02',
    title: 'Exchange paperwork',
    text: 'NDA, vendor forms, tax details and confidentiality constraints are completed before client material is shared.',
  },
  {
    n: '03',
    title: 'Run a scoped pilot',
    text: 'A small paid pilot or sample batch confirms quality expectations, turnaround, communication style and tool access.',
  },
  {
    n: '04',
    title: 'Calibrate and produce',
    text: 'Rubrics, severity definitions and delivery format are calibrated; production batches then run inside your tracker and tools.',
  },
];

export const partnerFacts = [
  { k: 'Language pairs', v: 'EN>FR primary · FR>EN · EN<>ES secondary' },
  { k: 'Service types', v: partnerServiceTypes.join(' · ') },
  { k: 'Engagement', v: engagementModel.join(' · ') },
  { k: 'Coverage', v: 'Remote · UTC+7 · US/EU overnight windows' },
];

export const contactOptions = [
  { id: 'vendor', label: 'Vendor onboarding / agency subcontracting', subject: `Vendor onboarding — ${SITE_NAME}` },
  { id: 'quality', label: 'Localization, functional or linguistic QA', subject: 'Quote request — QA services' },
  { id: 'ai-evaluation', label: 'Multilingual AI output evaluation', subject: 'Quote request — Multilingual AI evaluation' },
  { id: 'build', label: 'Directed small product build', subject: 'Build enquiry — scoped product work' },
];

export const contact = {
  email: CONTACT_EMAIL,
  linkedin: LINKEDIN_URL,
  pdf: '/capability-statement.pdf',
  studio: SITE_NAME,
  tagline: SITE_TAGLINE,
  siteUrl,
};

export const PH = (description: string) => `[[PLACEHOLDER: ${description}]]`;
export const isPh = (value?: string) => !value || value.startsWith('[[PLACEHOLDER');

export const atelier = {
  name: 'Laurent Martenot',
  edition: 'Laurent / Atelier',
  tagline: 'AI-native Business & Product Builder',
  email: 'laurent.martenot@gmail.com',
  linkedin: '',
  gameUrl: '',
  likedUrl: '',
  promptPulseUrl: '',
  formEndpoint: '',
  siteUrl: 'https://portfolio-psi-topaz-22.vercel.app',
  ogImage: '/atelier/og.svg',
  favicon: '/atelier/favicon.svg',
};

export const atelierAssets: Record<string, string> = {
  portrait: '',
  gameScreen1: '',
  gameScreen2: '',
  gameScreen3: '',
  likedScreen: '',
  promptPulseScreen: '',
  caseResult: '',
  datasetSample: '',
  workflowVideo: '',
};

export const mailto = (subject = 'Hello from your portfolio', body = '') =>
  `mailto:${atelier.email}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ''
  }`;

export const nav = [
  { href: '/atelier/', label: 'Home' },
  { href: '/atelier/hire/', label: 'How can I help?' },
  { href: '/atelier/backtothepast/', label: 'BackToThePast' },
  { href: '/atelier/how-i-work/', label: 'How I Work' },
  { href: '/atelier/about/', label: 'About & Contact' },
];

export const blueprintSteps = [
  {
    n: '01',
    short: 'Identify',
    title: 'Identify a problem or opportunity',
    decide:
      'Whether the problem is worth solving, who it is for, and whether a real commercial or user need sits behind it.',
    execute:
      'Scans the landscape, drafts option notes and surfaces angles I might not have considered.',
  },
  {
    n: '02',
    short: 'Objective',
    title: 'Define the business objective',
    decide:
      'What success looks like, the scope, the constraints, and what "done" must deliver for the business or the user.',
    execute:
      'Structures the objective into a working brief with assumptions made explicit.',
  },
  {
    n: '03',
    short: 'Explore',
    title: 'Explore possible solutions with AI',
    decide:
      'Which directions deserve pursuit, which get rejected, and what stays deliberately out of scope.',
    execute:
      'Generates alternatives, challenges my assumptions and prototypes approaches quickly.',
  },
  {
    n: '04',
    short: 'Requirements',
    title: 'Translate the solution into precise requirements',
    decide:
      'The specification itself: priorities, acceptance criteria, edge cases and the order of work.',
    execute:
      'Formats requirements, flags gaps and contradictions, and keeps the spec consistent as it grows.',
  },
  {
    n: '05',
    short: 'Direct',
    title: 'Direct AI coding agents',
    decide:
      'How each task is scoped, the sequence of work, and the safeguards that prevent regressions.',
    execute:
      'Implements the changes — writing, modifying and refactoring code under direction.',
  },
  {
    n: '06',
    short: 'Evaluate',
    title: 'Evaluate the implementation',
    decide:
      'Whether the output meets the objective — pass or fail against the criteria I set earlier.',
    execute:
      'Runs builds and tests, produces diffs and logs, and reports what actually changed.',
  },
  {
    n: '07',
    short: 'Challenge',
    title: 'Challenge errors and inconsistencies',
    decide:
      'What counts as wrong, which fixes are acceptable, and when an output must be redone rather than patched.',
    execute:
      'Proposes corrections and reworks its own output until it matches the requirement.',
  },
  {
    n: '08',
    short: 'Iterate',
    title: 'Iterate until objectives are met',
    decide:
      'When the product is genuinely ready — the judgement call to ship, extend or stop.',
    execute:
      'Applies each iteration cycle quickly so evaluation, not typing speed, is the bottleneck.',
  },
];

export const hireTasks = [
  {
    title: 'Multilingual AI output evaluation (EN/FR/ES)',
    text: 'Assessing the accuracy, tone and cultural fit of AI outputs in English, French and Spanish.',
    subject: 'Multilingual AI output evaluation',
  },
  {
    title: 'Localization and i18n quality testing for AI products',
    text: 'Testing AI products across languages and locales, building on past i18n/l10n QA work at Google and Apple.',
    subject: 'Localization and i18n quality testing',
  },
  {
    title: 'Writing and testing evaluation guidelines and test cases',
    text: 'Turning quality expectations into clear guidelines and repeatable test cases for AI systems.',
    subject: 'Evaluation guidelines and test cases',
  },
  {
    title: 'Directing AI-built products from idea to working release',
    text: 'Defining the product, directing AI coding agents and iterating until it works.',
    subject: 'Directing an AI-built product',
  },
];

export const experience = [
  {
    role: 'Independent Product Owner — Backtothepast',
    org: 'Thailand (remote)',
    dates: '2022 – present',
    note: 'Family caregiver until mid-2024; since then conceiving and directing a multiplayer history & geography guessing game, live in alpha. Directs AI coding agents: scopes each task, reviews every change, sets safeguards against regressions and supervises tests. Designed a pipeline that generates prompts from event themes and images, lets players guess events, and lets several AI models play and evaluate output quality. Goal: a community-built database of verified historical events.',
  },
  {
    role: 'QA Test Engineer, Internationalization (i18n) — Google (via Accenture)',
    org: 'Mountain View, CA',
    dates: 'May 2021 – Feb 2022',
    note: 'Functional testing of Google Assistant on iOS and Android; bug reporting, triage and follow-ups.',
  },
  {
    role: 'Functional Consultant — Lovie Studio',
    org: 'San José, CA · part-time',
    dates: 'Apr 2018 – Apr 2022',
    note: 'Analysis, project coordination and QA: specs and test plans, UI/UX decisions, offshore Agile sprints and budgets.',
  },
  {
    role: 'QA Test Engineer, Localization (l10n) — Apple (via Moravia)',
    org: 'Cupertino, CA',
    dates: 'Aug 2016 – Dec 2017',
    note: 'Functional and linguistic testing on iOS and web.',
  },
  {
    role: 'Key Account Manager, QA testing software — Solution-Soft',
    org: 'Santa Clara, CA',
    dates: 'Apr 2015 – Jul 2016',
    note: '',
  },
  {
    role: 'Co-founder, Business Analyst & Project Manager — 5Oi50',
    org: 'San Francisco, CA / Montpellier, France',
    dates: 'Nov 2011 – Mar 2015',
    note: 'Led teams of 5–15.',
  },
  {
    role: 'Founder & Managing Director — Eldesem',
    org: 'Querétaro, Mexico',
    dates: 'Aug 2001 – Sep 2011',
    note: '',
  },
  {
    role: 'International Business Engineer — Dassault, Erca-Formseal',
    org: '',
    dates: 'Earlier career',
    note: '',
  },
];

export const languages = [
  { lang: 'French', level: 'Native' },
  { lang: 'English', level: 'Fluent — 10 years in the United States' },
  { lang: 'Spanish', level: 'Fluent — 10 years in Mexico' },
  { lang: 'Portuguese', level: 'Conversational' },
  { lang: 'Thai', level: 'Basic' },
];

export const education = [
  'MBA, Indiana University of Pennsylvania (USA)',
  'Business engineering degree, international trade, ICN Business School (Nancy, France)',
];

export const tools = [
  'Worldserver',
  'Smartling',
  'Jira',
  'Trello',
  'Figma',
  'GitHub',
  'ADB',
  'Android & iOS testing',
  'Supabase',
  'Vercel',
];

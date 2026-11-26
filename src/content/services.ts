export interface ServiceOffer {
  id: string;
  index: string;
  title: string;
  audience: string;
  tagline: string;
  summary: string;
  points: string[];
  proof: string;
  href: string;
  cta: string;
}

export const serviceOffers: ServiceOffer[] = [
  {
    id: 'verification',
    index: '01',
    title: 'Verification',
    audience: 'For teams shipping AI-generated or user-generated content.',
    tagline: 'Independent cross-checks before content becomes a promise.',
    summary:
      'We cross-check facts, translations, product descriptions, and answers with several AI models and independent sources. People review the items where the outputs disagree.',
    points: [
      'Facts, translations, product descriptions, and answers treated as claims to test',
      'Several AI models plus independent sources, not a single-model opinion',
      'Human review concentrated on disagreement and ambiguity',
      'Written decisions with visible reasoning and unresolved items called out',
    ],
    proof: 'Built and used on Dig the Past, our own multiplayer history product, to check historical events.',
    href: '/how-we-verify/',
    cta: 'Read the verification method',
  },
  {
    id: 'localization-qa',
    index: '02',
    title: 'Localization and functional QA',
    audience: 'For apps, web products, and games entering French, English, or Spanish-speaking markets.',
    tagline: 'Linguistic and functional testing inside the real product.',
    summary:
      'We test in context, score findings by severity, and re-check after fixes. Machine-translated UI is reviewed inside the product rather than retranslated in isolation.',
    points: [
      'French native, English, and Spanish review',
      'In-context linguistic review and functional passes',
      'Severity-scored findings with screenshots or exact reproduction steps',
      'Re-check after your fixes so closure is verified',
    ],
    proof: 'QA delivery is led by a specialist who has tested localized products for Google and Apple.',
    href: '/quality/',
    cta: 'Explore QA services',
  },
  {
    id: 'build',
    index: '03',
    title: 'Build',
    audience: 'For companies that need a bounded web or app product delivered without theatre.',
    tagline: 'A human product lead directing AI engineers and specialist partners.',
    summary:
      'We build web and app products through precise instructions, gated paths, and reviewable increments. Human specialists and partners join when the project needs them.',
    points: [
      'Multi-user systems for games, companies, and groups',
      'Live synchronous connections, asynchronous modes, sign-in, and user management',
      'Permissions, visibility, and content management',
      'Implementation divided into small tasks with human review at each gate',
    ],
    proof: 'We run a live synchronous multiplayer architecture in production on Dig the Past.',
    href: '/how-we-build/',
    cta: 'See how we build',
  },
];

export const buildCapabilities = [
  'Multi-user systems for games, companies, and groups',
  'Live synchronous connections — the hardest category, and one we run in production',
  'Asynchronous modes',
  'Sign-in and user management',
  'Permissions and visibility',
  'Content management',
] as const;

export const verificationPrinciples = [
  {
    title: 'A claim is not accepted because a model sounds confident',
    text: 'Facts, translations, product descriptions, and answers are treated as testable claims. Confidence is not evidence.',
  },
  {
    title: 'Models are kept independent before they are compared',
    text: 'Several models respond without seeing one another first. Their agreement is useful; their disagreement is a signal for human review.',
  },
  {
    title: 'Independent sources stay in the loop',
    text: 'Model output is checked against sources outside the model pool where the claim type allows it, so one shared model weakness does not become the final answer.',
  },
  {
    title: 'People decide the difficult cases',
    text: 'Human reviewers spend their time where the system disagrees, where context is ambiguous, or where the cost of being wrong is high.',
  },
  {
    title: 'The output is a decision trail',
    text: 'You receive what was accepted, what was changed, what remains uncertain, and why. We do not hide uncertainty behind a score.',
  },
] as const;

export const verificationBoundaries = [
  'We do not present verification as a numerical certainty claim.',
  'We do not certify event data accuracy.',
  'We do not treat an LLM judge as final authority; it is a calibration signal, not the reviewer.',
  'We do not turn disagreement into false certainty.',
] as const;

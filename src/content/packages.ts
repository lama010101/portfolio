export interface PackageOffer {
  id: string;
  name: string;
  price: string;
  unit?: string;
  scope: string;
  includes: string[];
  delivery: string;
  featured?: boolean;
}

export const packageOffers: PackageOffer[] = [
  {
    id: 'starter-audit',
    name: 'Starter Audit',
    price: '$350',
    scope: 'Up to 25 screens or about 1,500 words of UI text, in one language.',
    includes: ['Severity-scored bug log', 'Screenshots for the findings', 'Written summary of what needs attention first'],
    delivery: '5 business days',
  },
  {
    id: 'launch-audit',
    name: 'Launch Audit',
    price: '$1,000',
    scope: 'Up to 60 screens or about 5,000 words, functional and linguistic.',
    includes: ['Severity-scored bug log with evidence', 'One re-check pass', 'Launch-focused written summary'],
    delivery: '10 business days',
    featured: true,
  },
  {
    id: 'ai-evaluation-pilot',
    name: 'AI Evaluation pilot',
    price: '$950',
    scope: 'Rubric plus 200 model responses reviewed blind in French or Spanish.',
    includes: ['Evaluation rubric', 'Blind human review', 'Calibration against an LLM judge', 'Written failure-mode summary'],
    delivery: '10 business days',
  },
  {
    id: 'release-watch',
    name: 'Release Watch',
    price: '$320',
    unit: 'per month',
    scope: 'Per-release string check and functional smoke test, up to 8 hours a month.',
    includes: ['Release string review', 'Functional smoke pass', 'Written release note of findings'],
    delivery: 'Monthly',
  },
  {
    id: 'lqa-day',
    name: 'LQA Day',
    price: '$300',
    unit: 'per day',
    scope: 'Games, one language.',
    includes: ['In-context linguistic QA', 'Severity-scored findings', 'End-of-day written handover'],
    delivery: 'By the day',
  },
  {
    id: 'fix-add-on',
    name: 'Fix add-on',
    price: 'Quoted',
    scope: 'Our team applies fixes in your repository as a pull request.',
    includes: ['Scoped fix implementation', 'Pull request handover', 'Re-check of touched items'],
    delivery: 'Quoted with scope',
  },
  {
    id: 'verification-pilot',
    name: 'Verification pilot',
    price: 'On request',
    scope: 'A bounded verification pass shaped around your content type and risk level.',
    includes: ['Verification setup', 'Cross-model and source review', 'Human decision report'],
    delivery: 'Quoted with scope',
  },
];

export const packageFootnotes = [
  'Second language in the same project: +60%.',
  'Larger scope is quoted individually.',
  'NDA on request.',
] as const;

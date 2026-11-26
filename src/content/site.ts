import { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE, mailto } from '../config';

export const brand = {
  name: SITE_NAME,
  tagline: SITE_TAGLINE,
  email: CONTACT_EMAIL,
  shortPitch:
    'A human product lead and a team of AI specialists working as a duet, with partners brought in per project.',
  languages: ['French native', 'English', 'Spanish'],
};

export const navigation = [
  { href: '/services/', label: 'Services' },
  { href: '/how-we-verify/', label: 'How we verify' },
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/spot-check/', label: 'Spot check' },
  { href: '/contact/', label: 'Contact' },
] as const;

export const spotCheckBody = `Hello Duet Studio,

I would like a free spot check.

Product or company:
Staging link, build access, or strings file:
Target market:
Language(s) to review:
What matters most:
`;

export const quoteBody = `Hello Duet Studio,

I would like a fixed-price quote.

Product or company:
What we need checked or built:
Staging link, build access, or strings file:
Target market:
Desired timing:
`;

export const ctas = {
  spotCheck: {
    label: 'Get a free spot check',
    href: mailto('Free spot check request — Duet Studio', spotCheckBody),
  },
  services: { label: 'See services and prices', href: '/services/' },
  verify: { label: 'Read how we verify', href: '/how-we-verify/' },
  quote: {
    label: 'Request a fixed-price quote',
    href: mailto('Fixed-price quote — Duet Studio', quoteBody),
  },
  build: {
    label: 'Start a build conversation',
    href: mailto('Build conversation — Duet Studio', quoteBody),
  },
  contact: {
    label: 'Email Duet Studio',
    href: mailto('Hello — Duet Studio'),
  },
};

export const footerCopy = {
  line: 'Independent verification, multilingual quality, and carefully directed builds.',
  note: 'Static site. No trackers, no forms, no third-party embeds.',
  copyright: 'Duet Studio',
};

export const studioFacts = [
  { label: 'Working model', value: 'Human product lead directing AI specialists' },
  { label: 'Added expertise', value: 'Human specialists and partners join per project' },
  { label: 'Languages', value: 'French native · English · Spanish' },
  { label: 'Contact', value: CONTACT_EMAIL },
] as const;

export const engagementSteps = [
  {
    n: '01',
    title: 'Send the build or link',
    text: 'A staging link, TestFlight/APK/Steam key, strings file, or a clear product brief is enough to start.',
  },
  {
    n: '02',
    title: 'Receive price and date',
    text: 'You receive a fixed price and a delivery date within one business day.',
  },
  {
    n: '03',
    title: 'Get the written report',
    text: 'Findings arrive with evidence, severity, context, and a recommended next action.',
  },
  {
    n: '04',
    title: 'Re-check after fixes',
    text: 'Fixed items are reviewed again so the final state is explicit rather than assumed.',
  },
] as const;

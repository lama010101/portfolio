export const sharedUi = {
  skipToContent: 'Skip to content',
  mainNavigationLabel: 'Main navigation',
  footerNavigationLabel: 'Footer navigation',
  headerCtaLabel: 'Free spot check',
  termsLabel: 'Terms of work',
  generalEmailLabel: 'Write a general email',
  brandHomeSuffix: 'home',
  ctaEyebrow: 'Start',
  featuredPackageLabel: 'Most complete audit',
  packageDeliveryLabel: 'Delivery',
  projectLinkLabel: 'Open project',
  scoreLegend: {
    human: 'Human',
    ai: 'AI',
    resolution: 'Resolution',
  },
  scoreCanvasLabels: {
    humanLine: 'Human line',
    aiLine: 'AI line',
    resolutionPoints: 'Resolution points',
  },
  scoreDescription:
    'Decorative generated visualization of two independent lines, one human and one AI, moving through a shared score and resolving at selected points.',
  copyFailureLabel: 'Copy failed — select the text',
  compareServicesLabel: 'Compare services',
  seeServicesLabel: 'See services',
  comparePackagesLabel: 'Compare packages',
  readBuildMethodLabel: 'Read the build method',
  verificationPilotLabel: 'Verification pilot',
  openDigThePastStatusLabel: 'Open Dig the Past status',
  inspectWorkLabel: 'Inspect the work',
  seeWhatExistsLabel: 'See what exists',
  backToWorkIndexLabel: 'Back to work index',
  frenchLqaTestingLabel: 'French LQA testing',
  lqaDayPackageLabel: 'LQA Day package',
  aiEvaluationPilotLabel: 'AI Evaluation pilot',
  openPrefilledEmailLabel: 'Open the prefilled email',
  termsDetailsLabel: 'Terms of work details',
  packageNotesLabel: 'Package notes',
  homeOffersLabel: 'Duet Studio offers',
  artworkLabel: (title: string) => `Abstract generated artwork for ${title}`,
  brandHomeLabel: (siteName: string) => `${siteName} home`,
} as const;

export const homeUi = {
  offerLabels: ['Verification', 'Localization + functional QA', 'Directed builds'],
} as const;

export const assetCopy = {
  ogSummary: 'Verification, localization and functional QA, and directed product builds — human judgment plus machine-paced execution.',
  ogOffers: ['Verify', 'Localize + QA', 'Build'],
  capabilityStatementLabel: 'Capability statement',
  capabilityIntroSuffix:
    'Verification, localization and functional QA, and bounded builds are scoped in writing, priced clearly, and delivered with written evidence.',
  offersHeading: 'Offers',
  packagesHeading: 'Packages',
  processHeading: 'How a project runs',
} as const;

export const aboutUi = {
  cta: {
    title: 'Work with a studio that says what the system is.',
    text: 'If the fit is wrong, the answer should be clear early. If it is right, the first step can be small and written.',
  },
} as const;

export const contactUi = {
  cta: {
    title: 'The first useful artifact is your build, link, or strings file.',
    text: 'Send what exists. The next step is a written boundary, not a call you did not ask for.',
  },
} as const;

export const howBuildUi = {
  aside: {
    title: 'Build boundary',
    text: 'This is not positioned as traditional full-service software development. It is a directed build model for bounded products and features whose shape can be made explicit.',
  },
  cta: {
    title: 'Bring a bounded product problem, not a fog machine.',
    text: 'The first task is to test fit: user, system shape, risk, and whether the duet model is the right way to build it.',
  },
} as const;

export const howVerifyUi = {
  score: {
    label: 'Independent lines, controlled resolution',
    text: 'The visual model is the operating model: compare first, decide carefully, write the outcome.',
  },
  cta: {
    title: 'Test the method on a small slice of your content.',
    text: 'A verification pilot is shaped around your content type, your risk level, and the decisions your team needs to trust.',
  },
} as const;

export const servicesUi = {
  cta: {
    title: 'Start small, then choose the right package.',
    text: 'The free spot check gives you written findings before you commit to an audit, a pilot, or a build conversation.',
  },
} as const;

export const qualityIndexUi = {
  packagesSection: {
    eyebrow: 'Relevant packages',
    title: 'Start with a bounded QA pass.',
    lede: 'The free spot check can come first; these are the paid shapes when you need the full pass.',
  },
  cta: {
    title: 'Put the product in front of a native reader.',
    text: 'Start with a small written check, then choose the audit shape only if the findings justify it.',
  },
} as const;

export const frenchLqaUi = {
  aside: {
    title: 'Best fit',
    text: 'Apps, web products, and games whose French interface must feel native inside real user flows, not merely correct in a string table.',
  },
  methodHeading: {
    eyebrow: 'Method',
    title: 'Native reading, product context, written priority.',
  },
  cta: {
    title: 'Let a native reader hit the awkward part first.',
    text: 'Send a build, a staging link, or a strings file. The spot check is small, written, and useful before you choose a paid pass.',
  },
} as const;

export const aiEvaluationUi = {
  aside: {
    title: 'Pilot shape',
    text: 'Rubric plus 200 model responses reviewed blind in French or Spanish, calibrated against an LLM judge, delivered in 10 business days.',
  },
  methodHeading: {
    eyebrow: 'Method',
    title: 'Evaluation is a written system before it is a score.',
  },
  cta: {
    title: 'Test the evaluation shape before you scale it.',
    text: 'A pilot gives you the rubric, blind review, calibration signal, and failure-mode summary without pretending automation can decide alone.',
  },
} as const;

export const spotCheckUi = {
  direct: {
    title: 'Direct email',
    text: 'The button opens your email client with the subject and checklist already filled in.',
  },
  checklist: {
    eyebrow: 'Email checklist',
    title: 'Paste-ready, but never required.',
    lede: 'Use the checklist if it helps. A plain email with the build or link is enough.',
  },
  cta: {
    title: 'Send the smallest useful slice.',
    text: 'A staging link, a build, or a strings file is enough to begin. You will know the boundary of the free check before anything starts.',
  },
} as const;

export const termsUi = {
  aside: {
    title: 'Working shape',
    text: 'Written scope, fixed price, delivery date, written report, and re-check after fixes.',
  },
  cta: {
    title: 'The terms are plain because the work should be plain.',
    text: 'Send the smallest useful artifact and receive a written next step.',
  },
} as const;

export const workIndexUi = {
  statusGuide: {
    title: 'Status labels used here',
    items: [
      { term: 'Live', text: 'The product or alpha can be opened now.' },
      { term: 'Pending', text: 'A real external approval step is still open.' },
      { term: 'Not started / in progress', text: 'No finished outcome is implied.' },
    ],
  },
  cta: {
    title: 'Judge the method by a live system, not a mood board.',
    text: 'Dig the Past and LIKED are real products with real constraints. Their status is written plainly so you can calibrate the claim.',
  },
} as const;

export const projectDetailUi = {
  status: {
    eyebrow: 'Status',
    title: 'What is true today.',
  },
  capabilities: {
    eyebrow: 'Capabilities demonstrated',
    title: 'What this project proves.',
    note: 'The claim is limited to the capabilities visible in the system. It is not a proxy for scale, revenue, or certified correctness.',
  },
  cta: {
    title: 'Want this level of candor pointed at your product?',
    text: 'Start with the free spot check, or ask for a fixed-price quote when the scope is already clear.',
  },
} as const;

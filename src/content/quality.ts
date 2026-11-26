export const qualityCopy = {
  meta: {
    title: 'Localization and functional QA',
    description:
      'Localization and functional QA for apps, web products, and games in French, English, and Spanish: in-context review, severity-scored findings, and re-checks.',
  },
  hero: {
    eyebrow: 'Localization and functional QA',
    titleA: 'The product is the test bench.',
    titleB: 'Not a spreadsheet of guesses.',
    lede:
      'Duet Studio tests apps, web products, and games in context. Linguistic findings and functional defects are severity-scored, evidenced, and re-checked after fixes.',
  },
  scope: {
    eyebrow: 'Scope',
    title: 'Two kinds of failure, one report.',
    cards: [
      {
        title: 'Functional QA',
        text: 'User journeys, release smoke passes, edge cases, layout behavior, platform-specific defects, and regression-sensitive flows.',
      },
      {
        title: 'Linguistic QA',
        text: 'Grammar, terminology, tone, truncation, wrong-language fallback, locale formats, cultural fit, and machine-translated UI reviewed inside the product.',
      },
      {
        title: 'Severity discipline',
        text: 'Findings are scored by user impact, with screenshots or reproduction steps where useful. The point is action, not volume.',
      },
      {
        title: 'Re-check after fixes',
        text: 'Fixed findings can be reviewed again, so your team knows whether the repair actually closed the problem.',
      },
    ],
  },
  languages: {
    eyebrow: 'Languages',
    title: 'French native. English. Spanish.',
    text: 'French-native review is the strongest language lane. English and Spanish are working languages for product review, QA, and evaluation work.',
  },
};

export const frenchLqaCopy = {
  meta: {
    title: 'French LQA testing',
    description:
      'French-native linguistic QA for apps, web products, and games: in-context review, severity-scored findings, machine-translated UI review, and re-checks.',
  },
  hero: {
    eyebrow: 'French LQA testing',
    titleA: 'French that belongs in the product.',
    titleB: 'Not French that merely fits in the string.',
    lede:
      'French-native review inside the real interface: tone, grammar, truncation, terminology, locale behavior, and the awkward machine-translated moments users notice immediately.',
  },
  sections: [
    {
      title: 'In-context linguistic review',
      text: 'Strings are judged where users meet them. A correct sentence can still be the wrong product copy when space, flow, or interaction changes its meaning.',
    },
    {
      title: 'Machine-translated UI review',
      text: 'Machine-translated UI is reviewed inside the product rather than retranslated from scratch. The goal is to find what must change, not to bill for rewriting what already works.',
    },
    {
      title: 'Severity-scored handover',
      text: 'Findings are prioritized so developers, writers, and localization managers know what blocks release, what hurts trust, and what can wait.',
    },
  ],
};

export const aiEvaluationCopy = {
  meta: {
    title: 'Multilingual AI evaluation',
    description:
      'AI Evaluation pilot from Duet Studio: rubric plus blind human review of model responses in French or Spanish, calibrated against an LLM judge.',
  },
  hero: {
    eyebrow: 'Multilingual AI evaluation',
    titleA: 'Model output needs a human reading.',
    titleB: 'Especially outside English.',
    lede:
      'The AI Evaluation pilot combines a written rubric, blind human review of model responses in French or Spanish, and calibration against an LLM judge without treating that judge as the final authority.',
  },
  sections: [
    {
      title: 'Rubric before review',
      text: 'The evaluation criteria are written first, so the review is anchored in your use case rather than in a generic idea of quality.',
    },
    {
      title: 'Blind human review',
      text: 'Responses are reviewed blind in French or Spanish. The reviewer evaluates the answer in front of them, not the model brand behind it.',
    },
    {
      title: 'Calibration, not delegation',
      text: 'An LLM judge is used as a calibration signal. Human review remains the deciding layer for ambiguous or high-impact cases.',
    },
  ],
};

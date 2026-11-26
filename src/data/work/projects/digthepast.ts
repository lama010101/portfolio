import { SITE_NAME } from '../../../config';
import type { WorkProject } from '../../work-types';

export const project: WorkProject = {
  slug: 'digthepast',
  title: 'Dig the Past',
  status: 'live alpha',
  summary:
    'A multiplayer history and geography guessing game directed end-to-end: players inspect historical scenes and guess both the year and the location.',
  seoDescription:
    `Dig the Past case study: a live-alpha multiplayer history and geography guessing game directed by ${SITE_NAME}, with honest platform and accuracy status.`,
  capabilities: [
    'Product direction and scoped task writing',
    'Multiplayer game-flow and scoring review',
    'AI coding-agent supervision with human acceptance review',
    'Multilingual interface and localization QA',
  ],
  body: [
    'Dig the Past is a multiplayer guessing game about historical scenes. The core loop asks players to place a scene in time and space, then scores the accuracy of both answers.',
    'The project is a working example of the studio build method: a human product owner writes the scope, AI coding agents implement bounded tasks, and every change is reviewed before it ships.',
    'The product is in live alpha. Android packaging is pending and iOS work has not started.',
    'Historical-accuracy workflows are being built and reviewed, but accuracy is not certified and is not presented as certified.',
  ],
  facts: [
    { k: 'Status', v: 'Live alpha' },
    { k: 'Android', v: 'Pending' },
    { k: 'iOS', v: 'Not started' },
    { k: 'Accuracy', v: 'Not certified' },
  ],
};

import { SITE_NAME } from '../../../config';
import type { WorkProject } from '../../work-types';

export const project: WorkProject = {
  slug: 'liked',
  title: 'LIKED',
  status: 'live alpha',
  summary:
    'A deterministic content-sharing web application whose shipped scope is a link library: URL and text cards, organization, sharing and a database-driven feed.',
  seoDescription:
    `LIKED case study: a live-alpha link library directed by ${SITE_NAME}. Shipped scope only; the v2 recommendation inbox is not marketed as shipped.`,
  capabilities: [
    'Product architecture and requirement writing',
    'Database-first visibility and feed design review',
    'AI coding-agent supervision with human acceptance review',
    'Multilingual product and interface QA',
  ],
  body: [
    'LIKED is a content-sharing application built around cards created from links or direct text. Its product rules emphasize deterministic state: visibility is resolved from database state rather than client-side inference.',
    'The shipped scope is the link library. Users can save and organize cards, share them, and consume shared material through the feed.',
    'The v2 recommendation inbox is design work, not shipped product scope, so it is deliberately not marketed here.',
  ],
  facts: [
    { k: 'Status', v: 'Live alpha' },
    { k: 'Shipped scope', v: 'Link library' },
    { k: 'Not marketed', v: 'V2 recommendation inbox' },
  ],
  links: [{ label: 'Open LIKED', url: 'https://liked-zeta.vercel.app/' }],
};

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  name: string;
  kind: string;
  status: string;
  summary: string;
  facts: string[];
  capabilities: string[];
  links: ProjectLink[];
  caveat?: string;
  visual: 'atlas' | 'nodes' | 'tools';
}

export const projects: Project[] = [
  {
    slug: 'dig-the-past',
    name: 'Dig the Past',
    kind: 'Multiplayer history and geography guessing game',
    status: 'Web alpha live',
    summary:
      'A multiplayer history and geography guessing game used as a real production environment for live synchronization, product direction, QA, and multi-model verification work.',
    facts: [
      'Web alpha is live.',
      'Android is pending store approval.',
      'iOS has not started.',
      'The interface is available in 11 languages.',
      'A multi-model AI pool is used to check and test events.',
    ],
    capabilities: ['Live multiplayer sync architecture', 'Multi-user game systems', 'AI-assisted event checking', 'Localization-heavy product operation'],
    links: [{ label: 'Open digthepast.org', href: 'https://digthepast.org' }],
    caveat: 'Event data accuracy is not certified.',
    visual: 'atlas',
  },
  {
    slug: 'liked',
    name: 'LIKED',
    kind: 'Collaborative link library',
    status: 'Live product',
    summary:
      'A collaborative link library organized as nodes rather than flat lists, with a permissions and visibility model designed for groups.',
    facts: [
      'Node-based organization for saved links.',
      'Permissions and visibility are part of the product model.',
      'Built for collaborative rather than purely private use.',
    ],
    capabilities: ['Multi-user systems', 'Permissions and visibility', 'Content organization', 'Sign-in and user management'],
    links: [{ label: 'Open LIKED', href: 'https://liked-zeta.vercel.app' }],
    visual: 'nodes',
  },
  {
    slug: 'prompt-image-tools',
    name: 'Prompt and image generation tools',
    kind: 'Internal product tooling',
    status: 'In progress',
    summary:
      'Internal tools being embedded into Dig the Past to support controlled prompt and image generation workflows.',
    facts: [
      'The tools are internal rather than a separate public product.',
      'They are being embedded into Dig the Past.',
      'The work is in progress and is not presented as a finished result.',
    ],
    capabilities: ['Content management', 'Directed AI workflows', 'Product operations tooling'],
    links: [],
    visual: 'tools',
  },
];

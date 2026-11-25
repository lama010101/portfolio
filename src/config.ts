/*
 * SITE CONFIG — single source of truth for brand, contact and URLs.
 * SITE_NAME is used everywhere: title, meta, JSON-LD, footer, OG image, PDF.
 */

export const SITE_NAME = 'Locale & Logic';
export const SITE_TAGLINE = 'Multilingual quality for AI and software — FR · EN · ES.';

// Interim contact address until a studio-domain mailbox exists.
export const CONTACT_EMAIL = 'laurent.martenot@gmail.com';

// Optional externals — leave '' to hide the corresponding link.
export const LINKEDIN_URL = '';
export const GAME_URL = '';

// Public production URL. Override with the SITE_URL env var when a custom
// domain is live; no DNS or domain changes are made from this repo.
export const siteUrl = (import.meta.env?.SITE_URL || 'https://portfolio-psi-topaz-22.vercel.app').replace(/\/+$/, '');

// Path under /public for the social share image (1200x630 PNG).
export const ogImage = '/og.png';

export const mailto = (subject: string, body = '') =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

export const pageUrl = (path: string) => new URL(path, siteUrl).href;

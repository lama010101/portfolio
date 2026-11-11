/*
 * SITE CONFIG - edit the values below.
 * Any value that is still "[[PLACEHOLDER: ...]]" is shown on the site as a visible
 * placeholder and flagged. See PLACEHOLDERS.md for the full list.
 */
export const PH = (description: string) => `[[PLACEHOLDER: ${description}]]`;
export const isPlaceholder = (value?: string) => !value || value.startsWith('[[PLACEHOLDER');

export const config = {
  name: 'Laurent Martenot',
  email: PH('email address'),
  linkedin: PH('LinkedIn profile URL'),
  gameUrl: PH('live BackToThePast / Guess-History game URL'),
  likedUrl: PH('LIKED project URL'),
  promptPulseUrl: PH('PromptPulse project URL'),
  // Optional: URL of a form service (Formspree, Basin, etc). Leave '' to use mailto only.
  formEndpoint: '',
  // Public production URL (used for canonical, sitemap, social tags).
  siteUrl: 'https://portfolio-psi-topaz-22.vercel.app',
  // Path under /public, e.g. '/og.png' (1200x630). '' = no social image yet.
  ogImage: '',
  tagline: 'AI-native Business & Product Builder',
};

export const mailto = (subject = 'Hello from your portfolio') =>
  isPlaceholder(config.email) ? undefined : `mailto:${config.email}?subject=${encodeURIComponent(subject)}`;

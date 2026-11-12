/*
 * SITE CONFIG — edit the values below.
 *
 * Any value that still starts with "[[PLACEHOLDER:" is treated as missing content:
 * it is rendered on the site as a visible, marked placeholder and cannot ship by
 * accident. See PLACEHOLDERS.md for the full list of what is still needed.
 */
(function () {
  'use strict';

  window.SITE_CONFIG = {
    name: 'Laurent Martenot',
    // From CV — real address.
    email: 'laurent.martenot@gmail.com',

    // TODO: LinkedIn profile URL (e.g. https://www.linkedin.com/in/...).
    linkedin: '[[PLACEHOLDER: LinkedIn profile URL]]',

    // TODO: public URL of the live BackToThePast / Guess-History game.
    gameUrl: '[[PLACEHOLDER: live BackToThePast / Guess-History game URL]]',

    // TODO: public URLs for the LIKED and PromptPulse projects (if/when public).
    likedUrl: '[[PLACEHOLDER: LIKED project URL]]',
    promptPulseUrl: '[[PLACEHOLDER: PromptPulse project URL]]',

    // Optional contact-form endpoint (Formspree, Basin, etc.).
    // Leave '' to use mailto links only. If set, a form with a honeypot field is rendered.
    formEndpoint: '',

    // Public production URL — used for canonical, sitemap and social tags.
    // TODO: replace with the real domain once deployed.
    siteUrl: '[[PLACEHOLDER: production URL, e.g. https://www.example.com]]',
  };
})();

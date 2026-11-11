// Edit this file to make the site yours. Everything global lives here.
export const SITE = {
  name: 'Mind of KV',
  author: 'KV',
  email: 'hello@mindofkv.com',
  url: 'https://mindofkv.com',
  tagline: 'A builder’s public notebook.',
  description:
    'Essays, videos, series and products from KV — a builder documenting what gets made and what gets learned along the way.',

  // Newsletter. Point `action` at your provider's form endpoint
  // (Buttondown, Kit/ConvertKit, Beehiiv, Substack…). Field name is usually "email".
  newsletter: {
    name: 'The Build Log',
    pitch: 'One email every Sunday. What I shipped, what broke, and the best thing I read that week.',
    action: 'https://buttondown.com/api/emails/embed-subscribe/mindofkv',
    emailField: 'email',
  },

  socials: [
    { label: 'YouTube', href: 'https://youtube.com/@mindofkv' },
    { label: 'X', href: 'https://x.com/mindofkv' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/mindofkv' },
    { label: 'GitHub', href: 'https://github.com/mindofkv' },
  ],

  nav: [
    { label: 'Writing', href: '/articles' },
    { label: 'Videos', href: '/videos' },
    { label: 'Series', href: '/series' },
    { label: 'Building', href: '/building' },
  ],
  navRight: [
    { label: 'About', href: '/about' },
    { label: 'Now', href: '/now' },
  ],
};

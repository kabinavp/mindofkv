// Edit this file to make the site yours. Everything global lives here.
export const SITE = {
  name: 'Mind of KV',
  author: 'KV',
  url: 'https://mindofkv.com',
  tagline: 'I build things and write about what I learn along the way.',
  description:
    'Essays, videos and series from KV — a builder sharing products, experiments and lessons on making things.',

  // Newsletter. Point `action` at your provider's form endpoint
  // (Buttondown, Kit/ConvertKit, Beehiiv, Substack…). Field name is usually "email".
  newsletter: {
    name: 'The Build Log',
    pitch: 'One email every Sunday: what I shipped, what broke, and the best thing I read that week.',
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
    { label: 'Start here', href: '/start-here' },
    { label: 'Articles', href: '/articles' },
    { label: 'Videos', href: '/videos' },
    { label: 'Series', href: '/series' },
    { label: 'Building', href: '/building' },
    { label: 'About', href: '/about' },
  ],
};

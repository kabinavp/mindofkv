// Edit this file to make the site yours. Everything global lives here.
export const SITE = {
  name: 'Mind of KV',
  author: 'KV',
  email: 'hello@mindofkv.com',
  url: 'https://mindofkv.com',
  tagline: 'Notes from a curious mind.',
  description:
    'Essays, videos, books and experiments from KV, following curiosity wherever it goes.',

  // Essays are drafted on Substack and published here (each gets a page on mindofkv.com).
  substack: {
    url: 'https://mindofkv.substack.com',
  },

  newsletter: {
    name: 'Stay Curious',
    club: 'Join the Curious Club',
    // Your real subscriber count. When set, signups read “Join 340+ curious readers”. Leave null to hide.
    subscribers: null as number | null,
    pitch: 'A short email every Sunday: one idea, one question, one book, and one line worth keeping.',
    // The email list lives on Kit (kit.com, free up to 10,000 subscribers). Form ID 10179714.
    action: 'https://app.kit.com/forms/10179714/subscriptions',
    emailField: 'email_address',
  },

  // The hill on the homepage. Set lat/lon to your favourite spot to get live wind
  // ("Slight breeze at … right now"). Leave them null to use a gentle default breeze.
  hill: {
    spot: 'my favourite hill',
    city: '',
    lat: null as number | null,
    lon: null as number | null,
  },

  // Book links. Put your Amazon Associates tracking ID in `tag` (e.g. "mindofkv-21") to earn on purchases.
  // Use the store for your audience: amazon.in, amazon.com, amazon.co.uk… Each country is a separate Associates account.
  amazon: {
    domain: 'amazon.in',
    tag: '',
  },

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/apkarthik' },
    { label: 'Substack', href: 'https://mindofkv.substack.com' },
  ],

  nav: [
    { label: 'Weekly', href: '/weekly' },
    { label: 'Models', href: '/models' },
    { label: 'Opinions', href: '/opinions' },
    { label: 'Books', href: '/books' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
  ],
};

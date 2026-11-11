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
    pitch: 'One email on Sundays with the most interesting things I found that week: ideas, books, experiments, and the occasional rabbit hole.',
    // The email list lives on Buttondown so every email is sent from mindofkv.com.
    // Buttondown's "RSS-to-email" watches https://mindofkv.com/rss.xml and emails each new post automatically.
    action: 'https://buttondown.com/api/emails/embed-subscribe/mindofkv',
    emailField: 'email',
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

  // Questions on the homepage ("Currently wondering"). Visitors can flip through them.
  wondering: [
    'Why does the ride home always feel shorter?',
    'What would you make if nobody could ever see it?',
    'Why do the best ideas show up mid-climb and never at the desk?',
    'How much of good taste can actually be learned?',
    'What’s the smallest change that would change everything?',
  ],

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
    { label: 'Books', href: '/books' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
  ],
};

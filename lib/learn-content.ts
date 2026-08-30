// lib/learn-content.ts
//
// Content config for /kids/learn/[topic]. Each entry drives one <LessonFlow>.
// Add a new topic here and it automatically gets a route via [topic]/page.tsx.

export type LessonBeat = {
  text: string;
  visual?: string; // optional icon/illustration key, wire up to your icon set later
};

export type LessonCheck = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type LessonTopic = {
  slug: string;
  title: string;
  icon: string; // icon key matching your icon set (see redesign notes)
  hook: string;
  beats: LessonBeat[];
  check: LessonCheck;
  ctaLabel: string;
  ctaHref: string;
};

export const learnContent: LessonTopic[] = [
  {
    slug: 'what-is-a-wallet',
    title: 'What is a Wallet?',
    icon: 'wallet',
    hook: 'You know how a real wallet holds your cash? This one holds your coins instead.',
    beats: [
      {
        text: "A crypto wallet doesn't actually store your coins inside it. It stores the keys that prove the coins are yours, wherever they live on the blockchain.",
        visual: 'wallet-key',
      },
      {
        text: 'Your address is like your mailbox number: safe to share, so people know where to send you coins.',
        visual: 'address',
      },
      {
        text: 'Your secret phrase is like the key to that mailbox: only you (and your parent) should ever have it.',
        visual: 'secret-phrase',
      },
    ],
    check: {
      question: "What's safe to share with a friend?",
      options: ['My secret phrase', 'My wallet address', 'Both'],
      correctIndex: 1,
    },
    ctaLabel: 'Go see your wallet',
    ctaHref: '/kids/dashboard',
  },
  {
    slug: 'what-are-coins',
    title: 'What are Coins?',
    icon: 'coins',
    hook: 'You know how dollars live in a bank app? Coins live on the blockchain instead.',
    beats: [
      {
        text: 'A coin is just a number that says how much you have. Instead of one bank keeping track, thousands of computers all keep the same record together.',
        visual: 'coins-network',
      },
      {
        text: "That's why nobody can secretly change your balance. Everyone would notice, because they all have the same copy.",
        visual: 'coins-check',
      },
    ],
    check: {
      question: 'If you have 10 MAGIC, where is that number stored?',
      options: [
        "One bank's computer",
        'Thousands of computers together',
        "Nowhere, it's magic",
      ],
      correctIndex: 1,
    },
    ctaLabel: 'Check your balance',
    ctaHref: '/kids/dashboard',
  },
  {
    slug: 'what-is-ethereum',
    title: 'What is Ethereum?',
    icon: 'ethereum',
    hook: 'Coins need somewhere to live and move around. That’s Ethereum.',
    beats: [
      {
        text: 'Ethereum is a giant shared computer that anyone in the world can use. Nobody owns it. Everybody who runs it owns a piece of keeping it running.',
        visual: 'ethereum-network',
      },
      {
        text: "It doesn't just move coins around. It can run little programs too. That's how your wallet's rules actually work.",
        visual: 'ethereum-programs',
      },
    ],
    check: {
      question: 'Who owns Ethereum?',
      options: [
        'One big company',
        'Nobody — everyone running it owns a piece',
        'The government',
      ],
      correctIndex: 1,
    },
    ctaLabel: 'See it in action',
    ctaHref: '/kids/send',
  },
  {
    slug: 'what-is-eth',
    title: 'What is ETH?',
    icon: 'eth',
    hook: "Sending a coin isn't free. Someone has to do the work of writing it down.",
    beats: [
      {
        text: "ETH is the fuel that pays the computers for that work. It's not a coin you spend on toys. It's what makes sending any coin possible.",
        visual: 'eth-fuel',
      },
      {
        text: "Think of it like a stamp: MAGIC is the letter, ETH is the stamp that gets it delivered.",
        visual: 'eth-stamp',
      },
    ],
    check: {
      question: 'What does ETH pay for?',
      options: ['Sending transactions', 'Buying toys', 'Nothing'],
      correctIndex: 0,
    },
    ctaLabel: 'Get some ETH',
    ctaHref: '/kids/receive',
  },
  {
    slug: 'what-are-blocks',
    title: 'What are Blocks?',
    icon: 'blocks',
    hook: 'How does everyone agree on what happened, and in what order?',
    beats: [
      {
        text: "A block is a page of transactions. Once a page is full, it's sealed and a new page starts, like a diary that can't be erased or rewritten.",
        visual: 'block-page',
      },
      {
        text: 'Each new block links to the one before it. That chain of pages is the blockchain.',
        visual: 'block-chain',
      },
    ],
    check: {
      question: 'What happens once a block is full?',
      options: [
        'It gets erased',
        "It's sealed and a new one starts",
        'Nothing, it keeps growing forever',
      ],
      correctIndex: 1,
    },
    ctaLabel: 'See recent activity',
    ctaHref: '/kids/tasks',
  },
  {
    slug: 'what-are-transactions',
    title: 'What are Transactions?',
    icon: 'send',
    hook: 'Sending someone MAGIC is just... writing it down, everywhere at once.',
    beats: [
      {
        text: 'A transaction says: from this wallet, to that wallet, this much. Once it’s in a block, everyone agrees it happened, forever.',
        visual: 'transaction-flow',
      },
      {
        text: "You can't take it back once it's sent, so wallets always ask you to double check first. That's why the app confirms before sending.",
        visual: 'transaction-confirm',
      },
    ],
    check: {
      question: "Can a transaction be undone after it's confirmed?",
      options: ['Yes, anytime', 'No', 'Only by a parent'],
      correctIndex: 1,
    },
    ctaLabel: 'Try sending now',
    ctaHref: '/kids/send',
  },
  {
    slug: 'is-it-safe',
    title: 'Is it Safe?',
    icon: 'shield',
    hook: 'Your wallet is protected by a secret phrase, not a password.',
    beats: [
      {
        text: "Whoever knows your secret phrase controls your wallet. It's like a house key, not a username.",
        visual: 'shield-key',
      },
      {
        text: "Never type it into a game, a website, or tell a friend, even if they ask nicely. If you're ever not sure, ask your parent first.",
        visual: 'shield-parent',
      },
    ],
    check: {
      question: 'Who is allowed to know your secret phrase?',
      options: ['Anyone who asks nicely', 'Only me and my parent', 'My friends'],
      correctIndex: 1,
    },
    ctaLabel: 'Back to Learn',
    ctaHref: '/kids/learn',
  },
];

export const LEARN_DONE_KEY = 'kiddo-learn-done';
export const LEARN_PROGRESS_KEY = 'kiddo-learn-stars';

export function getLessonBySlug(slug: string): LessonTopic | undefined {
  return learnContent.find((topic) => topic.slug === slug);
}

export function getLearnedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEARN_DONE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markLessonComplete(slug: string): string[] {
  const prev = getLearnedSlugs();
  if (prev.includes(slug)) return prev;
  const next = [...prev, slug];
  try {
    localStorage.setItem(LEARN_DONE_KEY, JSON.stringify(next));
    localStorage.setItem(LEARN_PROGRESS_KEY, String(next.length));
  } catch {
    /* ignore */
  }
  return next;
}

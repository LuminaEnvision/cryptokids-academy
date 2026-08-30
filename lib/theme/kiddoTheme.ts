/**
 * KiddoPay kids design tokens
 * Playful Duolingo / Khan Kids energy — not bank UI.
 * Parent routes should not import this for layout chrome.
 */

export const kiddoColors = {
  /** Primary actions, CTA buttons */
  coral: '#FF5A5F',
  coralSoft: '#FFE8E9',
  /** Secondary / success / progress */
  green: '#58CC02',
  greenSoft: '#E8F9D4',
  /** Stars, rewards, highlights */
  gold: '#FFC800',
  goldSoft: '#FFF4CC',
  /** Info, links, secondary accents */
  sky: '#1CB0F6',
  skySoft: '#DDF3FE',
  /** Body text */
  ink: '#3C3C3C',
  inkMuted: '#777777',
  /** Surfaces */
  cream: '#FFF9F0',
  white: '#FFFFFF',
  softBg: '#EAF7FF',
} as const;

export const kiddoRadii = {
  /** Cards, panels */
  card: '1.5rem', // 24px
  /** Buttons, inputs */
  button: '1.25rem', // 20px
  /** Chips, stars wrappers */
  pill: '9999px',
  /** Icon wells */
  icon: '1.25rem',
} as const;

export const kiddoShadows = {
  coral: '0 8px 0 rgba(255, 90, 95, 0.35)',
  green: '0 8px 0 rgba(88, 204, 2, 0.35)',
  gold: '0 8px 0 rgba(255, 200, 0, 0.45)',
  sky: '0 8px 0 rgba(28, 176, 246, 0.35)',
  soft: '0 10px 24px rgba(28, 176, 246, 0.18)',
  press: '0 2px 0 rgba(0, 0, 0, 0.12)',
} as const;

export const kiddoFonts = {
  display: 'var(--font-fredoka), system-ui, sans-serif',
  body: 'var(--font-nunito), system-ui, sans-serif',
} as const;

export type KiddoAccent = 'coral' | 'green' | 'gold' | 'sky';

export const kiddoAccentMap: Record<
  KiddoAccent,
  { solid: string; soft: string; shadow: string; border: string }
> = {
  coral: {
    solid: kiddoColors.coral,
    soft: kiddoColors.coralSoft,
    shadow: kiddoShadows.coral,
    border: kiddoColors.coral,
  },
  green: {
    solid: kiddoColors.green,
    soft: kiddoColors.greenSoft,
    shadow: kiddoShadows.green,
    border: kiddoColors.green,
  },
  gold: {
    solid: kiddoColors.gold,
    soft: kiddoColors.goldSoft,
    shadow: kiddoShadows.gold,
    border: kiddoColors.gold,
  },
  sky: {
    solid: kiddoColors.sky,
    soft: kiddoColors.skySoft,
    shadow: kiddoShadows.sky,
    border: kiddoColors.sky,
  },
};

/** Friendly copy for kid-facing error / empty / loading states */
export const kidFriendlyCopy = {
  loading: {
    title: 'Just a sec…',
    message: 'Your buddy is getting things ready!',
  },
  empty: {
    title: 'Nothing here yet',
    message: 'Come back soon — there will be fun stuff!',
  },
  error: {
    title: 'Oops! Something went wobbly',
    message: 'Try again in a moment. You’ve got this!',
  },
  stakingUnavailable: {
    title: 'Saving is taking a nap',
    message: 'This feature isn’t ready yet. Check back later with a grown-up!',
  },
  celebrate: {
    title: 'You did it!',
    message: 'High five! You’re amazing!',
  },
} as const;

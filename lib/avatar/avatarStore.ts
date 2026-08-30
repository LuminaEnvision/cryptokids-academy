/**
 * Avatar State Management with Zustand
 * Stores Lil Nouns traits + MagicKids custom traits
 *
 * TRAIT_OPTIONS only lists assets that exist under public/lilnouns/
 * (missing filenames = invisible layers). Refresh via:
 *   node scripts/sync-lilnouns-assets.mjs
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AvatarTraits {
  background: string;
  body: string;
  head: string;
  glasses: string;
  accessory: string;
  magic: string[]; // Array of custom MagicKids traits
}

interface AvatarStore {
  traits: AvatarTraits;
  setTrait: (category: keyof AvatarTraits, value: string | string[]) => void;
  setTraits: (traits: Partial<AvatarTraits>) => void;
  randomize: () => void;
  randomizeMagic: () => void;
  reset: () => void;
}

const DEFAULT_TRAITS: AvatarTraits = {
  background: 'cool',
  body: 'blue-sky',
  head: 'ducky',
  glasses: 'none',
  accessory: 'none',
  magic: [],
};

/** Curated kid-friendly subset — every id must match a file on disk */
export const TRAIT_OPTIONS = {
  backgrounds: ['cool', 'warm'],
  bodies: [
    'blue-sky',
    'purple',
    'red',
    'orange',
    'green',
    'teal',
    'magenta',
    'gold',
    'peachy-a',
    'peachy-B',
    'orange-yellow',
    'teal-light',
    'redpinkish',
    'yellow',
  ],
  heads: [
    // animals & friends (all verified on disk)
    'aardvark',
    'ape',
    'bear',
    'beluga',
    'capybara',
    'cat',
    'chicken',
    'cow',
    'crab',
    'dino',
    'dog',
    'duck',
    'ducky',
    'fox',
    'frog',
    'goldfish',
    'jellyfish',
    'mouse',
    'owl',
    'panda',
    'rabbit',
    'shark',
    'tiger',
    'whale',
    'whale-alive',
    'zebra',
    // fun food / objects kids like
    'banana',
    'beet',
    'blueberry',
    'burger-dollarmenu',
    'cake',
    'cherry',
    'cotton-candy',
    'heart',
    'piggybank',
  ],
  glasses: [
    'none',
    'hip-rose',
    'square-blue',
    'square-pink-purple-multi',
    'square-red',
    'square-teal',
    'square-yellow-orange-multi',
    'square-watermelon',
    'square-guava',
    'square-honey',
    'deep-teal',
    'grass',
  ],
  accessories: [
    'none',
    'bling-sparkles',
    'bling-love',
    'bling-rings',
    'bling-anchor',
    'bling-anvil',
    'bling-arrow',
    'bling-cheese',
    'bling-gold-ingot',
    'bling-mask',
    'bling-scissors',
    'bird-flying',
    'bird-side',
    'axe',
    'carrot',
    'belly-chameleon',
    'aardvark',
    '1n',
    'wave',
    'think',
    'broken-heart',
    'sweater',
  ],
  magic: ['magic-wand', 'fairy-wings', 'sparkle', 'robot-antenna', 'dragon-horns'],
};

export const useAvatarStore = create<AvatarStore>()(
  persist(
    (set) => ({
      traits: DEFAULT_TRAITS,

      setTrait: (category, value) =>
        set((state) => ({
          traits: {
            ...state.traits,
            [category]: value,
          },
        })),

      setTraits: (newTraits) =>
        set((state) => ({
          traits: {
            ...state.traits,
            ...newTraits,
          },
        })),

      randomize: () => {
        const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
        set({
          traits: {
            background: randomItem(TRAIT_OPTIONS.backgrounds),
            body: randomItem(TRAIT_OPTIONS.bodies),
            head: randomItem(TRAIT_OPTIONS.heads),
            glasses: randomItem(TRAIT_OPTIONS.glasses),
            accessory: randomItem(TRAIT_OPTIONS.accessories),
            magic: [],
          },
        });
      },

      randomizeMagic: () => {
        const magicTraits = TRAIT_OPTIONS.magic;
        const numTraits = Math.floor(Math.random() * 3) + 1;
        const selected: string[] = [];
        for (let i = 0; i < numTraits; i++) {
          const trait = magicTraits[Math.floor(Math.random() * magicTraits.length)];
          if (!selected.includes(trait)) {
            selected.push(trait);
          }
        }
        set((state) => ({
          traits: {
            ...state.traits,
            magic: selected,
          },
        }));
      },

      reset: () => set({ traits: DEFAULT_TRAITS }),
    }),
    {
      name: 'magicKidsAvatar',
    }
  )
);

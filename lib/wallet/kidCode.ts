/**
 * KidCode System
 * Maps wallet addresses to kid-friendly identities
 * Format: "🌈 Pink Dragon #248"
 */

const EMOJIS = ['🌈', '✨', '🦄', '🐉', '🦋', '🌟', '💫', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎤', '🎧', '🎬', '🎮', '🎰'];
const COLORS = ['Pink', 'Blue', 'Purple', 'Green', 'Yellow', 'Orange', 'Red', 'Rainbow', 'Gold', 'Silver', 'Crystal', 'Starlight', 'Cosmic', 'Magic', 'Sparkle'];
const ANIMALS = ['Dragon', 'Unicorn', 'Phoenix', 'Butterfly', 'Dolphin', 'Fox', 'Rabbit', 'Tiger', 'Lion', 'Eagle', 'Owl', 'Wolf', 'Bear', 'Deer', 'Horse', 'Cat', 'Dog', 'Panda', 'Koala', 'Penguin'];

export interface KidCode {
  emoji: string;
  color: string;
  animal: string;
  number: number;
  displayName: string; // e.g., "🌈 Pink Dragon #248"
}

const KIDCODE_STORAGE_KEY = 'magic_kids_code';

/**
 * Generate a unique KidCode from wallet address
 */
export function generateKidCode(address: string): KidCode {
  // Use address hash to deterministically generate KidCode
  const hash = address.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const emojiIndex = Math.abs(hash) % EMOJIS.length;
  const colorIndex = Math.abs(hash >> 8) % COLORS.length;
  const animalIndex = Math.abs(hash >> 16) % ANIMALS.length;
  const number = Math.abs(hash) % 1000;
  
  const kidCode: KidCode = {
    emoji: EMOJIS[emojiIndex],
    color: COLORS[colorIndex],
    animal: ANIMALS[animalIndex],
    number,
    displayName: `${EMOJIS[emojiIndex]} ${COLORS[colorIndex]} ${ANIMALS[animalIndex]} #${number}`,
  };
  
  // Store mapping
  if (typeof window !== 'undefined') {
    const mappings = getKidCodeMappings();
    mappings[address.toLowerCase()] = kidCode;
    localStorage.setItem(KIDCODE_STORAGE_KEY, JSON.stringify(mappings));
  }
  
  return kidCode;
}

/**
 * Get KidCode for an address (generate if doesn't exist)
 */
export function getKidCode(address: string): KidCode {
  if (typeof window === 'undefined') {
    // Fallback for SSR
    return {
      emoji: '🌈',
      color: 'Magic',
      animal: 'Dragon',
      number: 0,
      displayName: '🌈 Magic Dragon #0',
    };
  }
  
  const mappings = getKidCodeMappings();
  const stored = mappings[address.toLowerCase()];
  
  if (stored) {
    return stored;
  }
  
  return generateKidCode(address);
}

/**
 * Get all KidCode mappings
 */
function getKidCodeMappings(): Record<string, KidCode> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(KIDCODE_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Get wallet address from KidCode (reverse lookup)
 * Note: This is one-way, but we can search stored mappings
 */
export function findAddressByKidCode(kidCode: string): string | null {
  const mappings = getKidCodeMappings();
  for (const [address, code] of Object.entries(mappings)) {
    if (code.displayName === kidCode) {
      return address;
    }
  }
  return null;
}


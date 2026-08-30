/**
 * Avatar Utility Functions
 * Helper functions for avatar generation and asset paths
 */

import { AvatarTraits, TRAIT_OPTIONS } from './avatarStore';

/**
 * Get asset path for a trait
 */
export function getTraitPath(category: string, trait: string): string {
  if (trait === 'none') return '';

  // Custom MagicKids traits
  if (category === 'magic') {
    return `/lilnouns/custom/${trait}.png`;
  }

  // Lil Nouns traits - handle prefix naming
  const categoryMap: Record<string, { folder: string; prefix: string }> = {
    background: { folder: 'backgrounds', prefix: 'bg-' },
    body: { folder: 'bodies', prefix: 'body-' },
    head: { folder: 'heads', prefix: 'head-' },
    glasses: { folder: 'glasses', prefix: 'glasses-' },
    accessory: { folder: 'accessories', prefix: 'accessory-' },
  };

  const mapping = categoryMap[category] || { folder: category, prefix: '' };
  const filename = mapping.prefix + trait;
  return `/lilnouns/${mapping.folder}/${filename}.png`;
}

function pickOrFallback(value: string, options: string[], fallback: string): string {
  if (value === 'none' && options.includes('none')) return 'none';
  if (options.includes(value)) return value;
  return fallback;
}

/**
 * Coerce persisted traits onto known-on-disk options so missing layers never 404.
 */
export function sanitizeTraits(traits: AvatarTraits): AvatarTraits {
  return {
    background: pickOrFallback(traits.background, TRAIT_OPTIONS.backgrounds, 'cool'),
    body: pickOrFallback(traits.body, TRAIT_OPTIONS.bodies, 'blue-sky'),
    head: pickOrFallback(traits.head, TRAIT_OPTIONS.heads, 'ducky'),
    glasses: pickOrFallback(traits.glasses, TRAIT_OPTIONS.glasses, 'none'),
    accessory: pickOrFallback(traits.accessory, TRAIT_OPTIONS.accessories, 'none'),
    magic: (traits.magic || []).filter((m) => TRAIT_OPTIONS.magic.includes(m)),
  };
}

/**
 * Where each magic trait sits in the Nouns 32×32 stack.
 * - behind: wings (after body, before head)
 * - hand: held items in the bottom grip slot (same pixels as carrot/axe)
 * - crown: horns/antenna resting on top of the head
 */
export const MAGIC_SLOT: Record<string, 'behind' | 'hand' | 'crown'> = {
  'fairy-wings': 'behind',
  'magic-wand': 'hand',
  sparkle: 'hand',
  'dragon-horns': 'crown',
  'robot-antenna': 'crown',
};

/**
 * Get ordered layer paths for avatar rendering.
 * Nouns compositing: bg → body → behind-magic → accessory → head → glasses → hand/crown magic.
 */
export function getAvatarLayers(traits: AvatarTraits): string[] {
  const safe = sanitizeTraits(traits);
  const magic = safe.magic.filter(Boolean);
  const behind = magic.filter((m) => MAGIC_SLOT[m] === 'behind');
  const hand = magic.filter((m) => MAGIC_SLOT[m] === 'hand' || !MAGIC_SLOT[m]);
  const crown = magic.filter((m) => MAGIC_SLOT[m] === 'crown');

  const layers: string[] = [];

  if (safe.background && safe.background !== 'none') {
    layers.push(getTraitPath('background', safe.background));
  }
  if (safe.body && safe.body !== 'none') {
    layers.push(getTraitPath('body', safe.body));
  }

  behind.forEach((m) => layers.push(getTraitPath('magic', m)));

  // Official Nouns order places accessories under the head
  if (safe.accessory && safe.accessory !== 'none') {
    layers.push(getTraitPath('accessory', safe.accessory));
  }

  if (safe.head && safe.head !== 'none') {
    layers.push(getTraitPath('head', safe.head));
  }
  if (safe.glasses && safe.glasses !== 'none') {
    layers.push(getTraitPath('glasses', safe.glasses));
  }

  // Held items read in the grip notch; crown sits on the head
  hand.forEach((m) => layers.push(getTraitPath('magic', m)));
  crown.forEach((m) => layers.push(getTraitPath('magic', m)));

  return layers.filter(Boolean);
}

/**
 * Generate avatar as base64 (for saving)
 * Note: This is a placeholder - actual implementation would use canvas
 */
export async function generateAvatarBase64(_traits: AvatarTraits): Promise<string> {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}

/**
 * Check if avatar exists
 */
export function hasAvatar(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('magicKidsAvatar');
}

'use client';

import { useState } from 'react';
import { kiddoColors, type KiddoAccent } from '@/lib/theme/kiddoTheme';

export type KidIconName =
  | 'coins'
  | 'ethereum'
  | 'eth'
  | 'blocks'
  | 'send'
  | 'shield'
  | 'book'
  | 'piggy'
  | 'star'
  | 'tasks'
  | 'friends'
  | 'receive'
  | 'home'
  | 'wallet'
  | 'cats'
  | 'food'
  | 'globe'
  | 'education'
  | 'animals';

interface KidIconProps {
  name: KidIconName | string;
  size?: number;
  /** Tint applied via CSS mask (SVGs should be single-color silhouettes) */
  color?: KiddoAccent | string;
  className?: string;
  well?: boolean;
}

const accentHex: Record<KiddoAccent, string> = {
  coral: kiddoColors.coral,
  green: kiddoColors.green,
  gold: kiddoColors.gold,
  sky: kiddoColors.sky,
};

/**
 * Single icon system for kids UI.
 * Drop SVGs into /public/icons/{name}.svg — solid black shapes work best (colored via mask).
 * Prefer rounded stroke (stroke-width ~2.5, round caps/joins) for a consistent set.
 */
export default function KidIcon({
  name,
  size = 40,
  color = 'sky',
  className = '',
  well = false,
}: KidIconProps) {
  const [failed, setFailed] = useState(false);
  const hex =
    color in accentHex
      ? accentHex[color as KiddoAccent]
      : typeof color === 'string'
        ? color
        : kiddoColors.sky;

  const src = `/icons/${name}.svg`;

  const icon = (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={name}
    >
      {!failed ? (
        <>
          {/* Hidden probe to detect missing assets */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="sr-only"
            onError={() => setFailed(true)}
          />
          <span
            aria-hidden
            className="block w-full h-full"
            style={{
              backgroundColor: hex,
              WebkitMaskImage: `url(${src})`,
              maskImage: `url(${src})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
        </>
      ) : (
        <span
          className="font-display font-bold leading-none select-none"
          style={{ fontSize: size * 0.45, color: hex }}
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );

  if (!well) return icon;

  return (
    <span
      className="inline-flex items-center justify-center rounded-kid"
      style={{
        width: size + 20,
        height: size + 20,
        backgroundColor: `${hex}22`,
      }}
    >
      {icon}
    </span>
  );
}

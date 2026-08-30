'use client';

import { ReactNode } from 'react';
import Mascot, { type MascotPose } from './Mascot';
import { kidFriendlyCopy } from '@/lib/theme/kiddoTheme';

type KidStateKind = 'loading' | 'empty' | 'error' | 'stakingUnavailable' | 'celebrate';

interface KidStateProps {
  kind?: KidStateKind;
  pose?: MascotPose;
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
  size?: number;
}

const kindToPose: Record<KidStateKind, MascotPose> = {
  loading: 'wave',
  empty: 'thinking',
  error: 'error',
  stakingUnavailable: 'sleep',
  celebrate: 'celebrate',
};

/**
 * Kid-safe empty / error / loading panel.
 * Never surface env vars or technical stack traces here.
 */
export default function KidState({
  kind = 'empty',
  pose,
  title,
  message,
  action,
  className = '',
  size = 140,
}: KidStateProps) {
  const copy = kidFriendlyCopy[kind];
  const resolvedPose = pose ?? kindToPose[kind];

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center gap-4
        bg-white border-[3px] border-kiddo-sky rounded-kid-lg shadow-kid-sky
        px-6 py-8 ${className}
      `}
    >
      <Mascot pose={resolvedPose} size={size} />
      <div>
        <h2 className="font-display text-2xl font-semibold text-kiddo-ink mb-2">
          {title ?? copy.title}
        </h2>
        <p className="font-kid text-base text-kiddo-muted max-w-xs mx-auto leading-snug">
          {message ?? copy.message}
        </p>
      </div>
      {action}
    </div>
  );
}

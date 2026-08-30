'use client';

import { motion, type Transition } from 'framer-motion';
import { getTraitPath } from '@/lib/avatar/avatarUtils';

export type MascotPose = 'wave' | 'celebrate' | 'thinking' | 'sleep' | 'error';

interface MascotProps {
  pose?: MascotPose;
  size?: number;
  className?: string;
  /** Optional caption under the mascot */
  label?: string;
}

const POSE_TRAITS: Record<
  MascotPose,
  { body: string; head: string; accessory: string; glasses: string }
> = {
  wave: {
    body: 'yellow',
    head: 'ducky',
    accessory: 'wave',
    glasses: 'none',
  },
  celebrate: {
    body: 'orange-yellow',
    head: 'ducky',
    accessory: 'bling-sparkles',
    glasses: 'none',
  },
  thinking: {
    body: 'blue-sky',
    head: 'owl',
    accessory: 'think',
    glasses: 'none',
  },
  sleep: {
    body: 'purple',
    head: 'owl',
    accessory: 'none',
    glasses: 'square-black',
  },
  error: {
    body: 'red',
    head: 'chicken',
    accessory: 'bird-side',
    glasses: 'none',
  },
};

const poseMotion: Record<
  MascotPose,
  { animate: Record<string, number | number[]>; transition: Transition }
> = {
  wave: {
    animate: { rotate: [0, -8, 8, -6, 0], y: [0, -4, 0] },
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
  celebrate: {
    animate: { y: [0, -18, 0], rotate: [0, -6, 6, 0], scale: [1, 1.08, 1] },
    transition: { duration: 0.7, repeat: Infinity, ease: 'easeOut' },
  },
  thinking: {
    animate: { rotate: [0, 4, 0, -3, 0], y: [0, -2, 0] },
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
  sleep: {
    animate: { y: [0, 3, 0], opacity: [1, 0.85, 1] },
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  error: {
    animate: { x: [0, -6, 6, -4, 0], rotate: [0, -4, 4, 0] },
    transition: { duration: 0.55, repeat: Infinity, repeatDelay: 1.2 },
  },
};

function buildLayers(pose: MascotPose): string[] {
  const t = POSE_TRAITS[pose];
  return [
    getTraitPath('background', 'cool'),
    getTraitPath('body', t.body),
    getTraitPath('head', t.head),
    getTraitPath('glasses', t.glasses),
    getTraitPath('accessory', t.accessory),
  ].filter(Boolean);
}

export default function Mascot({
  pose = 'wave',
  size = 120,
  className = '',
  label,
}: MascotProps) {
  const layers = buildLayers(pose);
  const motionConfig = poseMotion[pose];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={motionConfig.animate}
        transition={motionConfig.transition}
      >
        <div
          className="relative w-full h-full overflow-hidden rounded-kid-lg bg-kiddo-sky-soft shadow-kid-sky"
          style={{ imageRendering: 'pixelated' }}
        >
          {layers.map((src, index) => (
            <img
              key={`${pose}-${src}-${index}`}
              src={src}
              alt=""
              width={size}
              height={size}
              className="absolute inset-0 object-contain"
              style={{
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
                zIndex: index,
              }}
              draggable={false}
            />
          ))}
        </div>

        {pose === 'sleep' && (
          <motion.span
            className="absolute -right-1 top-0 font-display text-kiddo-sky text-lg"
            animate={{ opacity: [0, 1, 0], y: [0, -10], x: [0, 6] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden
          >
            zzz
          </motion.span>
        )}
      </motion.div>

      {label && (
        <p className="font-kid text-sm font-semibold text-kiddo-ink text-center max-w-[14rem]">
          {label}
        </p>
      )}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface ProgressStarsProps {
  count: number;
  total: number;
  className?: string;
  /** Optional label, e.g. "Lessons done" */
  label?: string;
  size?: 'sm' | 'md';
}

export default function ProgressStars({
  count,
  total,
  className = '',
  label,
  size = 'md',
}: ProgressStarsProps) {
  const safeTotal = Math.max(total, 1);
  const filled = Math.min(Math.max(count, 0), safeTotal);
  const starSize = size === 'sm' ? 'text-lg' : 'text-2xl';

  return (
    <div
      className={`inline-flex flex-col gap-1 ${className}`}
      role="img"
      aria-label={`${filled} of ${safeTotal} stars`}
    >
      {label && (
        <span className="font-kid text-xs font-bold uppercase tracking-wide text-kiddo-muted">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: safeTotal }).map((_, i) => {
          const isOn = i < filled;
          return (
            <motion.span
              key={i}
              initial={false}
              animate={
                isOn
                  ? { scale: [1, 1.25, 1], rotate: [0, -8, 0] }
                  : { scale: 1, opacity: 0.35 }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 14, delay: i * 0.04 }}
              className={`${starSize} leading-none select-none ${
                isOn ? 'text-kiddo-gold drop-shadow-sm' : 'text-gray-300'
              }`}
              aria-hidden
            >
              ★
            </motion.span>
          );
        })}
        <span className="ml-2 font-display text-sm font-semibold text-kiddo-ink">
          {filled}/{safeTotal}
        </span>
      </div>
    </div>
  );
}

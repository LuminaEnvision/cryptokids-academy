'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { KiddoAccent } from '@/lib/theme/kiddoTheme';

interface KidCardProps {
  title: string;
  description?: string;
  /** Icon or illustration at top */
  icon?: ReactNode;
  /** Accent for thick border + drop shadow */
  accent?: KiddoAccent;
  /** Bottom CTA label */
  actionLabel?: string;
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  /** Horizontal layout (icon left) vs stacked (icon top) */
  layout?: 'stack' | 'row';
}

const accentClasses: Record<
  KiddoAccent,
  { border: string; shadow: string; soft: string; btn: string }
> = {
  coral: {
    border: 'border-kiddo-coral',
    shadow: 'shadow-kid-coral',
    soft: 'bg-kiddo-coral-soft',
    btn: 'bg-kiddo-coral text-white',
  },
  green: {
    border: 'border-kiddo-green',
    shadow: 'shadow-kid-green',
    soft: 'bg-kiddo-green-soft',
    btn: 'bg-kiddo-green text-white',
  },
  gold: {
    border: 'border-kiddo-gold',
    shadow: 'shadow-kid-gold',
    soft: 'bg-kiddo-gold-soft',
    btn: 'bg-kiddo-gold text-kiddo-ink',
  },
  sky: {
    border: 'border-kiddo-sky',
    shadow: 'shadow-kid-sky',
    soft: 'bg-kiddo-sky-soft',
    btn: 'bg-kiddo-sky text-white',
  },
};

export default function KidCard({
  title,
  description,
  icon,
  accent = 'sky',
  actionLabel,
  href,
  onClick,
  children,
  className = '',
  layout = 'stack',
}: KidCardProps) {
  const a = accentClasses[accent];

  const body = (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`
        bg-white border-[3px] ${a.border} ${a.shadow}
        rounded-kid-lg p-5
        ${className}
      `}
    >
      <div
        className={
          layout === 'row'
            ? 'flex items-start gap-4'
            : 'flex flex-col items-center text-center gap-3'
        }
      >
        {icon && (
          <div
            className={`
              flex items-center justify-center rounded-kid ${a.soft}
              ${layout === 'stack' ? 'w-16 h-16' : 'w-14 h-14 shrink-0'}
            `}
          >
            {icon}
          </div>
        )}

        <div className={layout === 'row' ? 'flex-1 text-left' : 'w-full'}>
          <h3 className="font-display text-xl font-semibold text-kiddo-ink mb-1">
            {title}
          </h3>
          {description && (
            <p className="font-kid text-base text-kiddo-muted leading-snug mb-3">
              {description}
            </p>
          )}
          {children}
          {actionLabel && (
            <span
              className={`
                inline-flex items-center justify-center
                mt-2 px-5 py-2.5 rounded-kid font-display font-semibold text-sm
                ${a.btn}
                ${layout === 'stack' ? 'w-full' : ''}
              `}
            >
              {actionLabel}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-kiddo-sky/40 rounded-kid-lg"
      >
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-kiddo-sky/40 rounded-kid-lg">
        {body}
      </button>
    );
  }

  return body;
}

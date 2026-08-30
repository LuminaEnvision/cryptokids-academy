'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { NavArrowLeft } from 'iconoir-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  variant?: 'kid' | 'parent';
}

export default function Header({ title, showBack = false, backHref, variant = 'kid' }: HeaderProps) {
  const defaultBackHref = variant === 'parent' ? '/parent/dashboard' : '/kids/dashboard';
  const href = backHref || defaultBackHref;

  const isKid = variant === 'kid';
  const bgClass = isKid
    ? 'bg-white border-b-[3px] border-kiddo-sky/30'
    : 'bg-gradient-to-r from-slate-100 to-slate-200 shadow-lg';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`${bgClass} p-4`}
    >
      <div className="flex items-center gap-4">
        {showBack && (
          <Link href={href}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`text-2xl flex items-center justify-center w-10 h-10 touch-target ${
                isKid
                  ? 'rounded-kid bg-kiddo-sky-soft text-kiddo-sky border-2 border-kiddo-sky'
                  : 'rounded-full bg-white/50 backdrop-blur-sm'
              }`}
            >
              <NavArrowLeft width={24} height={24} strokeWidth={2} />
            </motion.button>
          </Link>
        )}
        <h1
          className={`text-2xl font-bold flex-1 ${
            isKid
              ? 'font-display text-kiddo-ink'
              : 'font-rounded text-gray-800'
          }`}
        >
          {title}
        </h1>
      </div>
    </motion.header>
  );
}


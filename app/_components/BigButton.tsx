'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface BigButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'success';
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function BigButton({
  children,
  onClick,
  href,
  variant = 'primary',
  icon,
  className = '',
  disabled = false,
}: BigButtonProps) {
  const baseClasses = 'px-6 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all touch-target min-h-[44px]';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-magic-pink to-magic-purple hover:from-magic-pink/90 hover:to-magic-purple/90 text-white shadow-magic-pink/30',
    secondary: 'bg-white text-magic-purple border-2 border-magic-purple hover:bg-magic-purple/5 shadow-sm',
    success: 'bg-gradient-to-r from-magic-mint to-teal-400 hover:from-magic-mint/90 hover:to-teal-400/90 text-white shadow-magic-mint/30',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className} flex items-center gap-3 justify-center`;

  if (href) {
    return (
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={buttonClasses}
        >
          {icon && <span className="text-2xl flex items-center">{icon}</span>}
          {children}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {icon && <span className="text-2xl flex items-center">{icon}</span>}
      {children}
    </motion.button>
  );
}


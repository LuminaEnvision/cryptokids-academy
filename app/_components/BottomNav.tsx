'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import NavIcon from './NavIcon';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/kids/dashboard', label: 'Home', icon: 'home' },
  { href: '/kids/tasks', label: 'Tasks', icon: 'tasks' },
  { href: '/kids/send', label: 'Send', icon: 'send' },
  { href: '/kids/receive', label: 'Receive', icon: 'receive' },
  { href: '/friends', label: 'Friends', icon: 'friends' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on certain pages
  const hideOnPages = ['/parent', '/kids/avatar', '/kids/learn', '/kids/stake'];
  if (hideOnPages.some(page => pathname?.startsWith(page))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t-2 border-gray-100 safe-area-inset-bottom z-50 shadow-lg">
      <div className="flex justify-around items-center px-2 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 rounded-xl transition-all gap-1 ${isActive
                    ? 'bg-gradient-to-br from-magic-blue to-magic-purple text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
              >
                <NavIcon name={item.icon} size={20} className={isActive ? 'text-white' : 'text-gray-600'} />
                <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'} font-rounded`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


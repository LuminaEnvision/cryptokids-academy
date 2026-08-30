'use client';

import { motion } from 'framer-motion';

interface TokenCardProps {
  symbol: string;
  balance: string;
  icon: string;
  color: string;
}

export default function TokenCard({ symbol, balance, icon, color }: TokenCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-4xl mb-2">{icon}</div>
          <div className="text-xl font-bold text-gray-800">{symbol}</div>
          <div className="text-2xl font-bold text-gray-700 mt-1">{balance}</div>
        </div>
      </div>
    </motion.div>
  );
}


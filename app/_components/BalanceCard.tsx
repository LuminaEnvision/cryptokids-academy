'use client';

import { motion } from 'framer-motion';
import { formatEther } from 'viem';

interface BalanceCardProps {
  ethBalance: string;
  tokenBalance: string;
  address: string;
}

export default function BalanceCard({ ethBalance, tokenBalance, address }: BalanceCardProps) {
  const ethDisplay = parseFloat(formatEther(BigInt(ethBalance || '0'))).toFixed(4);
  const tokenDisplay = parseFloat(formatEther(BigInt(tokenBalance || '0'))).toFixed(2);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="bg-gradient-to-br from-magic-pink via-magic-blue to-magic-gold rounded-3xl p-6 shadow-2xl"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-6xl mb-4"
        >
          💰
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Wallet</h2>
        <div className="bg-white/80 rounded-2xl p-4 mb-4">
          <div className="text-sm text-gray-600 mb-1">ETH Balance</div>
          <motion.div
            key={ethBalance}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-purple-600"
          >
            {ethDisplay} ETH
          </motion.div>
        </div>
        <div className="bg-white/80 rounded-2xl p-4">
          <div className="text-sm text-gray-600 mb-1">Magic Tokens</div>
          <motion.div
            key={tokenBalance}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-pink-600"
          >
            {tokenDisplay} MAGIC
          </motion.div>
        </div>
        <div className="mt-4 text-xs text-gray-600 font-mono break-all">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>
    </motion.div>
  );
}


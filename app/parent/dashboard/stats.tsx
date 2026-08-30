'use client';

import { motion } from 'framer-motion';
import { formatEther } from 'viem';

interface ChildStatsProps {
  address: string;
  tokenBalance: string;
  ethBalance: string;
  totalTasks: number;
  completedTasks: number;
  totalEarned: string;
}

export default function ChildStats({
  address,
  tokenBalance,
  ethBalance,
  totalTasks,
  completedTasks,
  totalEarned,
}: ChildStatsProps) {
  const tokenDisplay = parseFloat(formatEther(BigInt(tokenBalance || '0'))).toFixed(2);
  const ethDisplay = parseFloat(formatEther(BigInt(ethBalance || '0'))).toFixed(4);

  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <div className="text-sm text-gray-600 mb-1">MAGIC Balance</div>
        <div className="text-2xl font-bold text-purple-600">{tokenDisplay}</div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <div className="text-sm text-gray-600 mb-1">ETH Balance</div>
        <div className="text-2xl font-bold text-blue-600">{ethDisplay}</div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <div className="text-sm text-gray-600 mb-1">Tasks Completed</div>
        <div className="text-2xl font-bold text-green-600">
          {completedTasks} / {totalTasks}
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <div className="text-sm text-gray-600 mb-1">Total Earned</div>
        <div className="text-2xl font-bold text-yellow-600">{totalEarned} MAGIC</div>
      </motion.div>
    </div>
  );
}


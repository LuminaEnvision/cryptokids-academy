'use client';

import { motion } from 'framer-motion';

interface TransactionItemProps {
  type: 'send' | 'receive';
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: Date;
}

export default function TransactionItem({
  type,
  amount,
  token,
  to,
  from,
  timestamp,
}: TransactionItemProps) {
  const isSend = type === 'send';
  const icon = isSend ? '📤' : '📥';
  const color = isSend ? 'text-red-500' : 'text-green-500';
  const bgColor = isSend ? 'bg-red-50' : 'bg-green-50';

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`${bgColor} rounded-xl p-4 mb-3 shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <div className={`font-bold text-lg ${color}`}>
              {isSend ? 'Sent' : 'Received'} {amount} {token}
            </div>
            <div className="text-sm text-gray-600">
              {isSend ? `To: ${to?.slice(0, 6)}...${to?.slice(-4)}` : `From: ${from?.slice(0, 6)}...${from?.slice(-4)}`}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


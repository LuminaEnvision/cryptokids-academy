'use client';

import { motion } from 'framer-motion';
import { formatEther } from 'viem';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'reward' | 'stake' | 'unstake';
  amount: string;
  token: 'MAGIC' | 'ETH';
  timestamp: number;
  to?: string;
  from?: string;
  description?: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export default function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <div className="text-4xl mb-2">📭</div>
        <p className="text-gray-600">No transactions yet</p>
      </div>
    );
  }

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sent': return '📤';
      case 'received': return '📥';
      case 'reward': return '🎁';
      case 'stake': return '🔒';
      case 'unstake': return '🔓';
      default: return '💸';
    }
  };

  const getColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sent': return 'text-red-600';
      case 'received': return 'text-green-600';
      case 'reward': return 'text-purple-600';
      case 'stake': return 'text-blue-600';
      case 'unstake': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.id}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl p-4 shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getIcon(tx.type)}</div>
              <div>
                <div className="font-bold text-gray-800 capitalize">{tx.type}</div>
                {tx.description && (
                  <div className="text-sm text-gray-600">{tx.description}</div>
                )}
                <div className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            <div className={`text-right font-bold ${getColor(tx.type)}`}>
              {tx.type === 'sent' ? '-' : '+'}
              {parseFloat(formatEther(BigInt(tx.amount || '0'))).toFixed(tx.token === 'ETH' ? 4 : 2)} {tx.token}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}


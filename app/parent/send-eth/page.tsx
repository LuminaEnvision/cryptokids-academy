'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isParentAuthenticated } from '@/lib/parent/pinAuth';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { parseEther } from 'viem';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';

export default function SendETHPage() {
  const router = useRouter();
  const [wallet] = useState(getStoredKidWallet);
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  if (!isParentAuthenticated()) {
    router.push('/parent/login');
    return null;
  }

  if (!wallet) {
    router.push('/');
    return null;
  }

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      // Call API to send ETH (uses FAUCET_PK server-side)
      const response = await fetch('/api/parent/send-eth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childAddress: wallet.address,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send ETH');
      }

      // Save transaction locally
      const tx = {
        id: data.txHash,
        type: 'received' as const,
        amount: parseEther(amount).toString(),
        token: 'ETH' as const,
        timestamp: Date.now(),
        description: 'Sent from parent',
      };

      const storedTxs = localStorage.getItem(`kiddopay_txs_${wallet.address}`);
      const txs = storedTxs ? JSON.parse(storedTxs) : [];
      txs.unshift(tx);
      localStorage.setItem(`kiddopay_txs_${wallet.address}`, JSON.stringify(txs.slice(0, 50)));

      alert(`✅ Sent ${amount} ETH to your child!`);
      router.push('/parent/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to send ETH');
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Header title="Send ETH to Child" showBack variant="parent" />
      
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Send ETH</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.001"
                step="0.0001"
                min="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-2xl"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 rounded-xl p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Recipient</div>
              <div className="font-mono text-sm break-all text-gray-800">{wallet.address}</div>
            </div>

            <BigButton
              onClick={handleSend}
              variant="primary"
              icon="💸"
              className="w-full"
              disabled={isSending || !amount}
            >
              {isSending ? 'Sending...' : 'Send ETH'}
            </BigButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


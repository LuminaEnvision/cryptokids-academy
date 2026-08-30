'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { sendEth } from '@/lib/wallet/sendEth';
import { calculateDonationReward } from '@/lib/wallet/tokenLogic';
import { formatEther, parseEther } from 'viem';
import Header from '../_components/Header';
import BigButton from '../_components/BigButton';

interface DonationCause {
  id: string;
  name: string;
  description: string;
  icon: string;
  address: string; // Testnet donation address
  color: string;
}

const DONATION_CAUSES: DonationCause[] = [
  {
    id: 'cats',
    name: 'Help Cats 🐱',
    description: 'Donate to save and care for cats in need!',
    icon: '🐱',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example - replace with real address
    color: 'from-orange-200 to-pink-200',
  },
  {
    id: 'hunger',
    name: 'Feed Hungry People 🍽️',
    description: 'Help provide food for people who need it!',
    icon: '🍽️',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example - replace with real address
    color: 'from-yellow-200 to-orange-200',
  },
  {
    id: 'disasters',
    name: 'Natural Disaster Aid 🌍',
    description: 'Support people affected by natural disasters!',
    icon: '🌍',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example - replace with real address
    color: 'from-blue-200 to-cyan-200',
  },
  {
    id: 'education',
    name: 'Kids Education 📚',
    description: 'Help kids learn and grow!',
    icon: '📚',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example - replace with real address
    color: 'from-purple-200 to-pink-200',
  },
  {
    id: 'animals',
    name: 'Save Animals 🦁',
    description: 'Protect endangered animals!',
    icon: '🦁',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example - replace with real address
    color: 'from-green-200 to-emerald-200',
  },
];

export default function DonatePage() {
  const router = useRouter();
  const [selectedCause, setSelectedCause] = useState<DonationCause | null>(null);
  const [amount, setAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('0');
  const wallet = getStoredKidWallet();

  if (!wallet) {
    router.push('/');
    return null;
  }

  // Calculate reward when amount changes
  const updateReward = (donationAmount: string) => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setRewardAmount('0');
      return;
    }
    const reward = calculateDonationReward(donationAmount);
    setRewardAmount(formatEther(BigInt(reward)));
  };

  const handleDonate = async () => {
    if (!selectedCause || !amount) return;

    setDonating(true);
    try {
      // Send ETH to cause
      await sendEth(selectedCause.address, amount);
      
      // Request MAGIC reward from API
      const reward = calculateDonationReward(amount);
      const response = await fetch('/api/donate-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: wallet.address,
          rewardAmount: reward.toString()
        }),
      });

      if (!response.ok) {
        console.warn('Reward not sent, but donation succeeded');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedCause(null);
        setAmount('');
        setRewardAmount('0');
        router.push('/kids/dashboard');
      }, 3000);
    } catch (error: any) {
      alert('Donation failed: ' + (error.message || 'Unknown error'));
      setDonating(false);
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <Header title="Donate & Help" showBack />
      
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Make a Difference!
          </h2>
          <p className="text-gray-600">
            Donate ETH to causes and earn MAGIC tokens as a reward!
          </p>
        </motion.div>

        {/* Donation Causes */}
        <div className="space-y-4">
          {DONATION_CAUSES.map((cause, index) => (
            <motion.div
              key={cause.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCause(cause)}
              className={`bg-gradient-to-r ${cause.color} rounded-2xl p-5 shadow-lg cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{cause.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{cause.name}</h3>
                  <p className="text-gray-700">{cause.description}</p>
                </div>
                <div className="text-2xl">→</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marketplace Coming Soon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-magic-purple to-magic-pink rounded-2xl p-6 text-center"
        >
          <div className="text-5xl mb-3">🛒</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Magic Marketplace
          </h3>
          <p className="text-gray-700">
            Coming soon! Use your MAGIC tokens to buy cool stuff!
          </p>
        </motion.div>

        {/* Donation Modal */}
        <AnimatePresence>
          {selectedCause && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
              onClick={() => !donating && setSelectedCause(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 w-full max-w-md"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedCause.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Donate to {selectedCause.name}
                  </h2>
                  <p className="text-gray-600">{selectedCause.description}</p>
                </div>

                <AnimatePresence>
                  {success ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="text-6xl mb-4">🎉</div>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        Thank You!
                      </div>
                      <p className="text-gray-600">
                        Your donation was sent successfully!
                      </p>
                    </motion.div>
                  ) : (
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
                            updateReward(e.target.value);
                          }}
                          placeholder="0.001"
                          step="0.0001"
                          min="0.0001"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-lg"
                        />
                        {parseFloat(amount) > 0 && (
                          <div className="mt-2 bg-green-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">You'll earn:</div>
                            <div className="text-lg font-bold text-green-600">
                              {parseFloat(rewardAmount).toFixed(2)} MAGIC
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              (Max 10 MAGIC per donation)
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setAmount('0.001');
                            updateReward('0.001');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-bold text-gray-800 hover:bg-gray-200"
                        >
                          0.001 ETH
                        </button>
                        <button
                          onClick={() => {
                            setAmount('0.005');
                            updateReward('0.005');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-bold text-gray-800 hover:bg-gray-200"
                        >
                          0.005 ETH
                        </button>
                        <button
                          onClick={() => {
                            setAmount('0.01');
                            updateReward('0.01');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-bold text-gray-800 hover:bg-gray-200"
                        >
                          0.01 ETH
                        </button>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <BigButton
                          onClick={() => setSelectedCause(null)}
                          variant="secondary"
                          className="flex-1"
                        >
                          Cancel
                        </BigButton>
                        <BigButton
                          onClick={handleDonate}
                          variant="primary"
                          className="flex-1"
                        >
                          {donating ? 'Donating...' : '💝 Donate'}
                        </BigButton>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


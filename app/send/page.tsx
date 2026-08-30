'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredWallet } from '@/lib/wallet/createWallet';
import { sendEth } from '@/lib/wallet/sendEth';
import { sendMagicToken } from '@/lib/wallet/sendToken';
import { getFriends, Friend } from '@/lib/friends/friends';
import Header from '../_components/Header';
import BigButton from '../_components/BigButton';

export default function SendPage() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<'eth' | 'magic'>('magic');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showFriends, setShowFriends] = useState(false);

  const wallet = getStoredWallet();

  useEffect(() => {
    setFriends(getFriends());
  }, []);

  if (!wallet) {
    router.push('/');
    return null;
  }

  const handleSend = async () => {
    if (!address || !amount) return;

    setSending(true);
    try {
      if (tokenType === 'eth') {
        await sendEth(address, amount);
      } else {
        await sendMagicToken(address, amount);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to send'));
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Send Tokens" showBack />
      
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 rounded-2xl p-6"
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🪄
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Send Magic!</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Send To
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x... or choose a friend"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-magic-pink focus:border-magic-purple focus:outline-none text-lg"
                />
                {friends.length > 0 && (
                  <button
                    onClick={() => setShowFriends(!showFriends)}
                    className="px-4 py-3 bg-magic-blue rounded-xl font-bold text-gray-800"
                  >
                    👥
                  </button>
                )}
              </div>
              {showFriends && friends.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 bg-white rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto"
                >
                  {friends.map((friend) => (
                    <button
                      key={friend.address}
                      onClick={() => {
                        setAddress(friend.address);
                        setShowFriends(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-magic-pink rounded-lg transition-colors"
                    >
                      <span className="text-3xl">{friend.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-gray-800">{friend.name}</div>
                        <div className="text-xs text-gray-600 font-mono">
                          {friend.address.slice(0, 6)}...{friend.address.slice(-4)}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="0.001"
                className="w-full px-4 py-3 rounded-xl border-2 border-magic-pink focus:border-magic-purple focus:outline-none text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Token Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTokenType('magic')}
                  className={`px-4 py-3 rounded-xl font-bold ${
                    tokenType === 'magic'
                      ? 'bg-magic-pink text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  🪙 MAGIC
                </button>
                <button
                  onClick={() => setTokenType('eth')}
                  className={`px-4 py-3 rounded-xl font-bold ${
                    tokenType === 'eth'
                      ? 'bg-magic-blue text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  💎 ETH
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-green-100 rounded-2xl p-6 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-green-800">Sent Successfully!</div>
            </motion.div>
          )}
        </AnimatePresence>

        {friends.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-magic-blue/50 rounded-xl p-4 text-center"
          >
            <p className="text-gray-700 text-sm">
              💡 Tip: Add friends in the Friends page to send tokens easily!
            </p>
          </motion.div>
        )}

        <BigButton
          onClick={handleSend}
          variant="primary"
          icon="✨"
          className="w-full"
        >
          {sending ? 'Sending...' : 'Send Magic!'}
        </BigButton>
      </div>
    </div>
  );
}


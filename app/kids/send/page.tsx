'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SendDiagonal, User, NavArrowRight, Check, Sparks } from 'iconoir-react';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { sendEth } from '@/lib/wallet/sendEth';
import { getFriends, Friend } from '@/lib/friends/friends';
import { getAddressFromENS } from '@/lib/wallet/ensKid';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';

export default function KidsSendPage() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showFriends, setShowFriends] = useState(true); // Show friends by default

  const wallet = getStoredKidWallet();

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
      // Check if it's an ENS .kid name
      let recipientAddress = address;
      if (address.includes('.kid')) {
        const ensAddress = getAddressFromENS(address);
        if (!ensAddress) {
          alert('Address name not found!');
          setSending(false);
          return;
        }
        recipientAddress = ensAddress;
      }

      // Send ETH only (MAGIC tokens are earned through chores, donations, staking)
      await sendEth(recipientAddress, amount);
      setSuccess(true);
      setTimeout(() => {
        router.push('/kids/dashboard');
      }, 2000);
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to send'));
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header title="Send" showBack />

      <div className="p-6 space-y-6">
        {/* Friends List - Show First */}
        {friends.length > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 font-rounded">Your Friends</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {friends.map((friend) => (
                <button
                  key={friend.address}
                  onClick={() => {
                    setAddress(friend.address);
                    setShowFriends(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
                >
                  <span className="text-3xl text-gray-400">
                    <User width={32} height={32} />
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-800">{friend.name}</div>
                    <div className="text-xs text-gray-600 font-mono">
                      {friend.address.slice(0, 8)}...{friend.address.slice(-6)}
                    </div>
                  </div>
                  <span className="text-gray-400"><NavArrowRight width={20} height={20} /></span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Send Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 text-magic-blue flex justify-center"><SendDiagonal width={64} height={64} /></div>
            <h2 className="text-2xl font-bold text-gray-800 font-rounded">Send ETH</h2>
            <p className="text-sm text-gray-600 mt-2">Send ETH to friends. MAGIC tokens are earned through chores, donations, and staking.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-rounded">
                Send To (name.kid or address)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="unicorn.kid or 0x..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 focus:outline-none text-lg transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-rounded">
                Amount (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="0.001"
                min="0"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 focus:outline-none text-lg transition-all"
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-green-100 border-2 border-green-400 rounded-2xl p-6 text-center"
            >
              <div className="text-6xl mb-4 text-green-600 flex justify-center"><Check width={48} height={48} /></div>
              <div className="text-2xl font-bold text-green-800 font-rounded">Sent Successfully!</div>
            </motion.div>
          )}
        </AnimatePresence>

        {friends.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200"
          >
            <p className="text-gray-700 text-sm flex items-center justify-center gap-2">
              <Sparks width={16} height={16} /> Tip: Add friends to send coins easily!
            </p>
          </motion.div>
        )}

        <BigButton
          onClick={handleSend}
          variant="primary"
          icon={<SendDiagonal width={24} height={24} />}
          className="w-full"
          disabled={sending || !address || !amount}
        >
          {sending ? 'Sending...' : 'Send'}
        </BigButton>
      </div>
    </div>
  );
}


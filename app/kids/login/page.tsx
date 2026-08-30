'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, UserPlus, LightBulb } from 'iconoir-react';
import { loginWithPassphrase, createAndSaveWallet } from '@/lib/wallet/walletManager';
import { getENSFromAddress } from '@/lib/wallet/ensKid';
import BigButton from '../../_components/BigButton';
import Header from '../../_components/Header';

export default function KidsLoginPage() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleLogin = async () => {
    if (!passphrase.trim()) {
      setError('Please enter your 3-word passphrase');
      return;
    }

    // Trim passphrase (walletManager will handle case variations)
    const trimmedPhrase = passphrase.trim();

    setIsLoggingIn(true);
    setError('');

    try {
      const wallet = loginWithPassphrase(trimmedPhrase);

      if (wallet) {
        // Success! Redirect to dashboard
        router.push('/kids/dashboard');
      } else {
        setError('Wrong passphrase! Please check your 3 words and try again.');
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleCreateNew = async () => {
    setIsCreating(true);
    try {
      const wallet = await createAndSaveWallet();

      // Store magic phrase for settings
      if (typeof window !== 'undefined') {
        localStorage.setItem('kidMagicPhrase', wallet.magicPhrase);
      }

      // Store magic phrase for settings
      if (typeof window !== 'undefined') {
        localStorage.setItem('kidMagicPhrase', wallet.magicPhrase);
      }

      // Call faucet (silently fail if not configured)
      try {
        const faucetResponse = await fetch('/api/faucet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: wallet.address }),
        });
        if (!faucetResponse.ok) {
          console.log('Faucet not available - wallet created!');
          console.log('Wallet address:', wallet.address);
        }
      } catch (error) {
        console.log('Faucet not available - wallet created!');
        console.log('Wallet address:', wallet.address);
      }

      // Redirect to avatar creation
      router.push('/kids/avatar?firstTime=true');
    } catch (error) {
      console.error('Wallet creation error:', error);
      setError('Failed to create wallet. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header title="Login" showBack={false} />

      <div className="p-6 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-2xl p-6 text-center shadow-lg backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4 text-magic-blue flex justify-center"
          >
            <Lock width={64} height={64} />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-rounded">
            Enter Your Secret Phrase
          </h2>
          <p className="text-gray-600 mb-6 font-rounded">
            Type your 3-word passphrase to access your wallet
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  setError('');
                }}
                placeholder="moon jelly rabbit"
                className="w-full px-4 py-3 text-lg text-center font-semibold rounded-xl border-2 border-gray-200 focus:border-magic-blue focus:ring-4 focus:ring-magic-blue/20 focus:outline-none transition-all font-rounded"
                disabled={isLoggingIn || isCreating}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 font-rounded">
                Enter your 3 words separated by spaces
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-2 border-red-400 rounded-xl p-3 text-red-700 text-sm font-rounded"
              >
                {error}
              </motion.div>
            )}

            <BigButton
              onClick={handleLogin}
              variant="primary"
              className="w-full"
              disabled={isLoggingIn || isCreating || !passphrase.trim()}
              icon={<Lock width={20} height={20} />}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </BigButton>
          </div>
        </motion.div>

        <div className="text-center">
          <p className="text-gray-600 mb-4 font-rounded">Don't have a wallet yet?</p>
          <BigButton
            onClick={handleCreateNew}
            variant="secondary"
            className="w-full"
            disabled={isLoggingIn || isCreating}
            icon={<UserPlus width={20} height={20} />}
          >
            {isCreating ? 'Creating...' : 'Create New Wallet'}
          </BigButton>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100 backdrop-blur-sm"
        >
          <p className="text-sm text-gray-700 flex items-center justify-center gap-2 font-rounded">
            <LightBulb width={16} height={16} /> Your passphrase is your password. Keep it safe and never share it!
          </p>
        </motion.div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparks, ArrowRight } from 'iconoir-react';
import { createAndSaveWallet } from '@/lib/wallet/walletManager';
import { registerENSName, isValidENSName, isENSAvailable } from '@/lib/wallet/ensKid';
import BigButton from '../../_components/BigButton';
import Header from '../../_components/Header';

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'ens' | 'avatar'>('ens');
  const [ensName, setEnsName] = useState('');
  const [ensError, setEnsError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleENSSubmit = async () => {
    setEnsError('');

    if (!ensName.trim()) {
      setEnsError('Please enter a name');
      return;
    }

    if (!isValidENSName(ensName)) {
      setEnsError('Name must be 2-20 letters/numbers, lowercase only');
      return;
    }

    if (!isENSAvailable(ensName)) {
      setEnsError('This name is already taken! Try another one.');
      return;
    }

    // Create wallet
    setIsCreating(true);
    try {
      const wallet = await createAndSaveWallet();

      // Register ENS name
      const registered = registerENSName(ensName, wallet.address);
      if (!registered) {
        setEnsError('Could not register name. Please try again.');
        setIsCreating(false);
        return;
      }

      // Update wallet with ENS name
      wallet.ensName = `${ensName}.kid`;
      const { saveWallet } = require('@/lib/wallet/walletManager');
      saveWallet(wallet);

      // Store magic phrase for settings
      if (typeof window !== 'undefined') {
        localStorage.setItem('kidMagicPhrase', wallet.magicPhrase);
      }

      // Call faucet to send ETH for gas (silently fail if not configured)
      // If FAUCET_PK is not set, you can manually send ETH to this wallet address
      try {
        const faucetResponse = await fetch('/api/faucet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: wallet.address }),
        });
        if (!faucetResponse.ok) {
          // Faucet not configured - wallet created but needs manual ETH funding
          console.log('Faucet not available - wallet created!');
          console.log('Wallet address:', wallet.address);
          console.log('You can manually send ETH to this address for gas fees');
        }
      } catch (error) {
        // Silently fail - faucet is optional
        console.log('Faucet not available - wallet created!');
        console.log('Wallet address:', wallet.address);
        console.log('You can manually send ETH to this address for gas fees');
      }

      // Redirect to avatar creation
      router.push('/kids/avatar?firstTime=true');
    } catch (error) {
      console.error('Setup error:', error);
      setEnsError('Something went wrong. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-magic-pink via-magic-blue to-magic-gold">
      <Header title="Welcome to KiddoPay!" showBack={false} />

      <div className="p-6 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-3xl p-6 text-center shadow-2xl backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-rounded">
            Choose Your Address Name
          </h2>
          <p className="text-gray-600 mb-6 font-rounded">
            Pick a cool name like "unicorn.kid" or "star.kid"
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={ensName}
                onChange={(e) => {
                  setEnsName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                  setEnsError('');
                }}
                placeholder="unicorn"
                className="w-full px-4 py-3 text-2xl text-center font-bold rounded-xl border-2 border-gray-200 focus:border-magic-blue focus:ring-4 focus:ring-magic-blue/20 focus:outline-none transition-all font-rounded"
                disabled={isCreating}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleENSSubmit();
                }}
              />
              <div className="mt-2 text-xl font-bold text-gray-700 font-mono">
                {ensName ? `${ensName}.kid` : 'yourname.kid'}
              </div>
            </div>

            {ensError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-2 border-red-400 rounded-xl p-3 text-red-700 text-sm font-rounded"
              >
                {ensError}
              </motion.div>
            )}

            <BigButton
              onClick={handleENSSubmit}
              variant="primary"
              icon={<ArrowRight width={24} height={24} />}
              className="w-full"
              disabled={isCreating || !ensName.trim()}
            >
              {isCreating ? 'Creating...' : 'Continue'}
            </BigButton>
          </div>

          <div className="mt-6 text-sm text-gray-500 font-rounded">
            <p className="flex items-center justify-center gap-2">
              <Sparks width={16} height={16} /> Examples: star, dragon, rocket, moon, sun
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


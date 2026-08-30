'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparks, Group } from 'iconoir-react';
import { createKidWallet, getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import BigButton from './_components/BigButton';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Check if wallet exists (using walletManager for multi-wallet support)
    const { getCurrentWallet } = require('@/lib/wallet/walletManager');
    const wallet = getCurrentWallet() || getStoredKidWallet();

    if (wallet) {
      router.push('/kids/dashboard');
    } else {
      setIsLoading(false);
      // Redirect to login page (can create new or login with passphrase)
      router.push('/kids/login');
    }
  }, [router]);

  const handleCreateWallet = async () => {
    setIsCreating(true);
    try {
      const wallet = await createKidWallet();

      // Call faucet API for initial funding (silently fail if not configured)
      try {
        const faucetResponse = await fetch('/api/faucet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: wallet.address }),
        });
        if (!faucetResponse.ok) {
          // Faucet not configured or rate limited - that's okay
          console.log('Faucet not available (this is okay)');
        }
      } catch (error) {
        // Silently fail - faucet is optional
        console.log('Faucet not available (this is okay)');
      }

      router.push('/kids/dashboard');
    } catch (error) {
      console.error('Wallet creation error:', error);
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-magic-pink via-magic-blue to-magic-gold">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-magic-purple"
        >
          <Sparks width={64} height={64} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-magic-pink via-magic-blue to-magic-gold overflow-hidden">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-center mb-8 relative z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <Image
            src="/hero-3d.png"
            alt="Kiddo Wallet Hero"
            width={350}
            height={350}
            className="drop-shadow-2xl mx-auto rounded-3xl"
            priority
          />
        </motion.div>
        <h1 className="text-6xl font-bold text-white drop-shadow-md mb-2 font-rounded">KiddoPay</h1>
        <p className="text-2xl text-white drop-shadow-sm font-semibold">Your magical crypto journey!</p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md space-y-4 relative z-10"
      >
        <BigButton
          onClick={handleCreateWallet}
          variant="primary"
          icon={<Sparks width={32} height={32} />}
          className="w-full text-xl py-6"
        >
          {isCreating ? 'Setting up...' : 'Get Started'}
        </BigButton>

        <BigButton
          href="/parent/login"
          variant="secondary"
          icon={<Group width={32} height={32} />}
          className="w-full text-xl py-6"
        >
          Parent Mode
        </BigButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center text-gray-600"
      >
        <p className="text-sm">✨ Safe & Fun ✨</p>
        <p className="text-sm">Testnet Only</p>
      </motion.div>
    </div>
  );
}

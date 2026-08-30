'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isParentAuthenticated, setParentAuthenticated } from '@/lib/parent/pinAuth';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';

export default function ParentSettingsPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<ReturnType<typeof getStoredKidWallet>>(null);

  useEffect(() => {
    if (!isParentAuthenticated()) {
      router.push('/parent/login');
      return;
    }

    const stored = getStoredKidWallet();
    if (!stored) {
      router.push('/');
      return;
    }

    setWallet(stored);
  }, [router]);

  const handleLogout = () => {
    setParentAuthenticated(false);
    router.push('/');
  };

  if (!wallet) {
    return null;
  }

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Header title="Settings" showBack variant="parent" />
      
      <div className="p-6 space-y-6">
        {/* Wallet Info */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Child Wallet Information</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">KidCode</div>
              <div className="text-lg font-bold text-purple-600">{wallet.kidCode.displayName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Wallet Address</div>
              <div className="font-mono text-xs break-all text-gray-800 bg-gray-50 p-2 rounded">
                {wallet.address}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Magic Phrase</div>
              <div className="text-sm font-bold text-gray-800 bg-purple-50 p-2 rounded">
                {wallet.magicPhrase}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="space-y-4">
          <BigButton
            href="/parent/dashboard"
            variant="primary"
            icon="🏠"
            className="w-full"
          >
            Back to Dashboard
          </BigButton>

          <BigButton
            onClick={handleLogout}
            variant="secondary"
            icon="🚪"
            className="w-full"
          >
            Logout
          </BigButton>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 rounded-2xl p-4"
        >
          <div className="text-sm text-gray-700">
            <p className="font-bold mb-2">Parent Mode Features:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Create and manage tasks for your child</li>
              <li>Approve completed tasks and send rewards</li>
              <li>View child's wallet balance</li>
              <li>Access full wallet address and details</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


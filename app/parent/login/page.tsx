'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { setParentPIN, hasParentPIN, verifyParentPIN, setParentAuthenticated } from '@/lib/parent/pinAuth';
import BigButton from '../../_components/BigButton';

export default function ParentLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsSettingUp(!hasParentPIN());
  }, []);

  const handleSetup = () => {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    try {
      setParentPIN(pin);
      setParentAuthenticated(true);
      router.push('/parent/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to set PIN');
    }
  };

  const handleLogin = () => {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (verifyParentPIN(pin)) {
      setParentAuthenticated(true);
      router.push('/parent/dashboard');
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👨‍👩‍👦</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isSettingUp ? 'Set Up Parent Mode' : 'Parent Mode'}
          </h1>
          <p className="text-gray-600">
            {isSettingUp
              ? 'Create a 4-digit PIN to access parent features'
              : 'Enter your 4-digit PIN'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {isSettingUp ? 'Create PIN' : 'Enter PIN'}
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                setError('');
              }}
              placeholder="0000"
              maxLength={4}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-2xl text-center tracking-widest font-bold"
            />
          </div>

          {isSettingUp && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm PIN
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => {
                  setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                  setError('');
                }}
                placeholder="0000"
                maxLength={4}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-2xl text-center tracking-widest font-bold"
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <BigButton
            onClick={isSettingUp ? handleSetup : handleLogin}
            variant="primary"
            icon="🔐"
            className="w-full"
          >
            {isSettingUp ? 'Set Up Parent Mode' : 'Enter Parent Mode'}
          </BigButton>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}


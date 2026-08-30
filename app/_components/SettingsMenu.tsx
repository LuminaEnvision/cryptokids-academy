'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Xmark, User, Palette, Key, LogOut } from 'iconoir-react';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';


export default function SettingsMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showSecretPhrase, setShowSecretPhrase] = useState(false);
  const [secretPhrase, setSecretPhrase] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleParentDashboard = () => {
    router.push('/parent/login');
    setIsOpen(false);
  };

  const handleChangeAvatar = () => {
    router.push('/kids/avatar');
    setIsOpen(false);
  };

  const handleRevealSecretPhrase = async () => {
    const wallet = getStoredKidWallet();
    if (!wallet) return;

    try {
      // Get the magic phrase from wallet data or localStorage
      const storedPhrase = localStorage.getItem('kidMagicPhrase') || wallet.magicPhrase;
      if (storedPhrase) {
        // The phrase is stored as 3 words
        const words = storedPhrase.split(' ');
        setSecretPhrase(words);
        setShowSecretPhrase(true);
      } else {
        alert('Secret phrase not found. Please create a new wallet.');
      }
    } catch (error) {
      console.error('Error revealing secret phrase:', error);
      alert('Could not reveal secret phrase.');
    }
  };

  const handleLogout = () => {
    if (confirm('Log out? You can log back in with your 3-word passphrase.')) {
      // Clear current wallet
      const { logout } = require('@/lib/wallet/walletManager');
      logout();
      // Also clear the old single-wallet storage for compatibility
      const { clearStoredKidWallet } = require('@/lib/wallet/createKidWallet');
      clearStoredKidWallet();
      // Clear magic phrase from localStorage
      localStorage.removeItem('kidMagicPhrase');
      // Redirect to login
      router.push('/kids/login');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all backdrop-blur-sm"
        aria-label="Settings"
      >
        <Settings width={24} height={24} className="text-gray-700" />
      </button>

      {/* Settings Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md z-50 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 font-rounded">Settings</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Xmark width={24} height={24} />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleParentDashboard}
                    className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <div className="text-magic-blue"><User width={24} height={24} /></div>
                    <div>
                      <div className="font-bold text-gray-800 font-rounded">Parent Dashboard</div>
                      <div className="text-sm text-gray-600 font-rounded">Manage tasks and rewards</div>
                    </div>
                  </button>

                  <button
                    onClick={handleChangeAvatar}
                    className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <div className="text-magic-purple"><Palette width={24} height={24} /></div>
                    <div>
                      <div className="font-bold text-gray-800 font-rounded">Change Avatar</div>
                      <div className="text-sm text-gray-600 font-rounded">Customize your avatar</div>
                    </div>
                  </button>

                  <button
                    onClick={handleRevealSecretPhrase}
                    className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <div className="text-magic-gold"><Key width={24} height={24} /></div>
                    <div>
                      <div className="font-bold text-gray-800 font-rounded">Reveal Secret Phrase</div>
                      <div className="text-sm text-gray-600 font-rounded">Your 3-word recovery phrase</div>
                    </div>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors border border-red-200 flex items-center gap-3"
                  >
                    <div className="text-red-500"><LogOut width={24} height={24} /></div>
                    <div>
                      <div className="font-bold text-red-700 font-rounded">Log Out</div>
                      <div className="text-sm text-red-600 font-rounded">Switch to another wallet</div>
                    </div>
                  </button>
                </div>

                {/* Secret Phrase Modal */}
                <AnimatePresence>
                  {showSecretPhrase && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-6 backdrop-blur-sm"
                      onClick={() => setShowSecretPhrase(false)}
                    >
                      <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">Your Secret Phrase</h3>
                        <p className="text-sm text-gray-600 mb-4 font-rounded">
                          Keep these 3 words safe! Never share them with anyone except your parent.
                        </p>
                        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-4">
                          <div className="flex gap-2 justify-center flex-wrap">
                            {secretPhrase.map((word, i) => (
                              <span
                                key={i}
                                className="bg-white px-4 py-2 rounded-lg font-bold text-gray-800 border border-yellow-400 font-mono"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setShowSecretPhrase(false)}
                          className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 font-rounded"
                        >
                          I've Saved It
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


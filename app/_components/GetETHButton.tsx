'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, HandCard } from 'iconoir-react';

interface GetETHButtonProps {
  address: string;
}

export default function GetETHButton({ address }: GetETHButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showGold, setShowGold] = useState(false);

  const handleGetETH = async () => {
    setIsLoading(true);
    try {
      // Call our local faucet API (max 0.0001 ETH per day)
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show gold animation
        setShowGold(true);
        setTimeout(() => setShowGold(false), 2000);
      } else {
        alert(data.error || 'Could not get ETH. Please try again later.');
      }
    } catch (error) {
      console.error('Faucet error:', error);
      alert('Could not get ETH. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleGetETH}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
      >
        <HandCard width={16} height={16} />
        {isLoading ? 'Getting...' : 'Get ETH'}
      </button>

      {/* Gold Animation */}
      <AnimatePresence>
        {showGold && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute text-yellow-400"
                style={{
                  left: '50%',
                  top: '50%',
                }}
              >
                <Coins width={24} height={24} fill="currentColor" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


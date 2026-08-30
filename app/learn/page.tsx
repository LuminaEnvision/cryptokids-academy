'use client';

import { motion } from 'framer-motion';
import Header from '../_components/Header';

const learnCards = [
  {
    icon: '🪙',
    title: 'What is Crypto?',
    description: 'Crypto is digital money that lives on the internet! It\'s like coins in a video game, but real.',
    color: 'from-magic-pink to-magic-purple',
  },
  {
    icon: '💼',
    title: 'What is a Wallet?',
    description: 'A wallet is like a piggy bank, but for digital coins! It keeps your crypto safe.',
    color: 'from-magic-blue to-magic-mint',
  },
  {
    icon: '🔐',
    title: 'Stay Safe!',
    description: 'Never share your wallet password with anyone! It\'s like the key to your treasure chest.',
    color: 'from-magic-gold to-magic-pink',
  },
  {
    icon: '✨',
    title: 'Magic Tokens',
    description: 'Magic Tokens are special coins you can send to friends! They\'re fun to collect and share.',
    color: 'from-magic-mint to-magic-blue',
  },
  {
    icon: '🌐',
    title: 'The Blockchain',
    description: 'The blockchain is like a magic book that remembers every transaction forever!',
    color: 'from-magic-purple to-magic-gold',
  },
  {
    icon: '🎁',
    title: 'Testnet Mode',
    description: 'We\'re on testnet - that means these are practice coins, not real money! Perfect for learning.',
    color: 'from-magic-pink to-magic-gold',
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen pb-6">
      <Header title="Learn About Crypto" showBack />
      
      <div className="p-6 space-y-4">
        {learnCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">{card.icon}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-lg">
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 rounded-2xl p-6 text-center mt-6"
        >
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            You're a Crypto Expert!
          </h3>
          <p className="text-gray-600">
            Keep learning and having fun with your wallet!
          </p>
        </motion.div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { getStoredWallet } from '@/lib/wallet/createWallet';
import Header from '../_components/Header';
import BigButton from '../_components/BigButton';

export default function ReceivePage() {
  const wallet = getStoredWallet();
  const [copied, setCopied] = useState(false);

  if (!wallet) {
    return null;
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <Header title="Receive Tokens" showBack />
      
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 rounded-2xl p-6 text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            📥
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Share Your Address
          </h2>

          <div className="bg-white rounded-2xl p-6 mb-6 flex justify-center">
            <QRCodeSVG
              value={wallet.address}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="bg-magic-pink rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-600 mb-2">Your Address</div>
            <div className="font-mono text-sm break-all text-gray-800">
              {wallet.address}
            </div>
          </div>

          <BigButton
            onClick={copyAddress}
            variant={copied ? 'success' : 'primary'}
            icon={copied ? '✅' : '📋'}
            className="w-full"
          >
            {copied ? 'Copied!' : 'Copy Address'}
          </BigButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-magic-blue/50 rounded-2xl p-4"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">💡</div>
            <p className="text-gray-700 font-bold">
              Share this QR code or address to receive tokens!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


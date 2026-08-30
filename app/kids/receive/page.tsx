'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'iconoir-react';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { getENSFromAddress } from '@/lib/wallet/ensKid';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';

export default function KidsReceivePage() {
  const wallet = getStoredKidWallet();
  const [copied, setCopied] = useState(false);

  if (!wallet) {
    return null;
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ensName = getENSFromAddress(wallet.address);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header title="Receive" showBack />

      <div className="p-6 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4 text-magic-blue flex justify-center"
          >
            <Download width={64} height={64} />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-rounded">
            Share Your Address
          </h2>

          <div className="bg-white rounded-2xl p-6 mb-6 flex justify-center border-2 border-gray-200 shadow-inner">
            <QRCodeSVG
              value={wallet.address}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="bg-gray-100 rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-600 mb-2 font-rounded">Your Address Name</div>
            <div className="text-lg font-bold text-gray-800 break-all font-mono">
              {ensName || wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4)}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
            <p className="text-sm text-gray-700 font-rounded">
              Show this QR code to receive coins from friends or your parent!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


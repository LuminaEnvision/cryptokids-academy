'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { isParentAuthenticated, setParentAuthenticated } from '@/lib/parent/pinAuth';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { getChoresByChildAddress, getChoresByStatus } from '@/lib/chores/choreTypes';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';
import { getENSFromAddress } from '@/lib/wallet/ensKid';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';
import AvatarDisplay from '../../_components/AvatarDisplay';
import ChildStats from './stats';
import TransactionsList from './transactions';

export default function ParentDashboardPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<ReturnType<typeof getStoredKidWallet>>(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [pendingChores, setPendingChores] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalEarned, setTotalEarned] = useState('0');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
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
    loadData(stored.address);
  }, [router]);

  const loadData = async (address: string) => {
    // Load token balance
    try {
      const config = getBlockchainConfig();
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(config.rpcUrl),
      });

      if (isValidContractAddress(config.magicTokenAddress)) {
        const tokenBal = await client.readContract({
          address: config.magicTokenAddress as `0x${string}`,
          abi: [
            {
              name: 'balanceOf',
              type: 'function',
              stateMutability: 'view',
              inputs: [{ name: 'account', type: 'address' }],
              outputs: [{ name: '', type: 'uint256' }],
            },
          ],
          functionName: 'balanceOf',
          args: [address as `0x${string}`],
        });
        setTokenBalance(tokenBal.toString());
      }
    } catch (error) {
      console.error('Balance error:', error);
    }

    // Load pending chores
    const chores = getChoresByChildAddress(address);
    const pending = chores.filter(c => c.status === 'completed').length;
    setPendingChores(pending);

    setLoading(false);
  };

  const handleLogout = () => {
    setParentAuthenticated(false);
    router.push('/');
  };

  if (loading || !wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          ⏳
        </motion.div>
      </div>
    );
  }

  const tokenDisplay = parseFloat(formatEther(BigInt(tokenBalance || '0'))).toFixed(2);
  const ensName = wallet ? getENSFromAddress(wallet.address) : null;
  const headerTitle = ensName ? `🎸 ${ensName}` : wallet?.address.slice(0, 8) + '...' + wallet?.address.slice(-6);

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Header title={headerTitle || "Parent Dashboard"} variant="parent" />
      
      <div className="p-6 space-y-6">
        {/* Child Info */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4">
            <AvatarDisplay size={80} animate />
            <div>
              <h3 className="text-xl font-bold text-gray-800">{wallet.kidCode.displayName}</h3>
              <p className="text-sm text-gray-600">Child's Wallet</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-600 mb-1">Wallet Address</div>
            <div className="font-mono text-xs break-all text-gray-800 mb-2">{wallet.address}</div>
            <div className="text-xs text-gray-500 italic">
              Feel free to refill your child's wallet on Base Sepolia using this wallet address
            </div>
          </div>
        </motion.div>

        {/* Child Stats */}
        <ChildStats
          address={wallet.address}
          tokenBalance={tokenBalance}
          ethBalance={ethBalance}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          totalEarned={totalEarned}
        />

        {/* Transactions */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <TransactionsList transactions={transactions} />
        </motion.div>

        {/* Pending Approvals */}
        {pendingChores > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {pendingChores} Task{pendingChores !== 1 ? 's' : ''} Waiting
                </div>
                <p className="text-gray-600">Approve completed tasks to send rewards</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <BigButton
            href="/parent/tasks"
            variant="primary"
            icon="📋"
            className="w-full"
          >
            Manage Tasks
            {pendingChores > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-sm">
                {pendingChores}
              </span>
            )}
          </BigButton>

          <div className="grid grid-cols-2 gap-4">
            <BigButton
              href="/parent/settings"
              variant="secondary"
              icon="⚙️"
            >
              Settings
            </BigButton>
            <BigButton
              onClick={handleLogout}
              variant="secondary"
              icon="🚪"
            >
              Logout
            </BigButton>
          </div>
        </div>
      </div>
    </div>
  );
}


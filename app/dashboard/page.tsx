'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getStoredWallet } from '@/lib/wallet/createWallet';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';
import { claimDailyFaucet, canClaimDaily, getTimeUntilNextClaim } from '@/lib/wallet/claimDaily';
import Header from '../_components/Header';
import BalanceCard from '../_components/BalanceCard';
import BigButton from '../_components/BigButton';
import TransactionItem from '../_components/TransactionItem';

export default function DashboardPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<{ address: string } | null>(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilClaim, setTimeUntilClaim] = useState(0);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const stored = getStoredWallet();
    if (!stored) {
      router.push('/');
      return;
    }

    setWallet(stored);
    loadBalances(stored.address);
    checkClaimStatus(stored.address);

    // Refresh balances every 30 seconds
    const interval = setInterval(() => {
      loadBalances(stored.address);
      checkClaimStatus(stored.address);
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  const checkClaimStatus = async (address: string) => {
    const config = getBlockchainConfig();
    // Only check claim status if faucet contract is deployed
    if (!isValidContractAddress(config.faucetContractAddress)) {
      setCanClaim(false);
      return;
    }
    
    try {
      const canClaimNow = await canClaimDaily(address);
      setCanClaim(canClaimNow);
      if (!canClaimNow) {
        const timeLeft = await getTimeUntilNextClaim(address);
        setTimeUntilClaim(timeLeft);
      }
    } catch (error) {
      console.error('Claim status error:', error);
      setCanClaim(false);
    }
  };

  const handleClaim = async () => {
    if (!wallet || !canClaim) return;
    
    setClaiming(true);
    try {
      await claimDailyFaucet();
      // Refresh balances and claim status
      if (wallet) {
        await loadBalances(wallet.address);
        await checkClaimStatus(wallet.address);
      }
      alert('🎉 You claimed your daily MAGIC! 100 MAGIC + 0.001 ETH added to your wallet!');
    } catch (error: any) {
      alert('Claim failed: ' + (error.message || 'Unknown error'));
    } finally {
      setClaiming(false);
    }
  };

  const formatTimeUntilClaim = (seconds: number): string => {
    if (seconds === 0) return 'Now!';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const loadBalances = async (address: string) => {
    try {
      const config = getBlockchainConfig();
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(config.rpcUrl),
      });

      // Get ETH balance
      const ethBal = await client.getBalance({ address: address as `0x${string}` });
      setEthBalance(ethBal.toString());

      // Get MagicToken balance (only if contract address is set)
      if (isValidContractAddress(config.magicTokenAddress)) {
        try {
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
        } catch (error) {
          console.error('Token balance error:', error);
          setTokenBalance('0');
        }
      } else {
        // Contract not deployed yet, set balance to 0
        setTokenBalance('0');
      }
    } catch (error) {
      console.error('Balance load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header title="My Wallet" />
      
      <div className="p-6 space-y-6">
        <BalanceCard
          ethBalance={ethBalance}
          tokenBalance={tokenBalance}
          address={wallet.address}
        />

        {/* Daily Claim Button - Leprechaun Gold Theme */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-3xl p-6 shadow-2xl ${
            canClaim
              ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500'
              : 'bg-gradient-to-br from-gray-300 to-gray-400'
          }`}
        >
          <div className="text-center">
            <motion.div
              animate={canClaim ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: canClaim ? Infinity : 0, repeatDelay: 2 }}
              className="text-7xl mb-4"
            >
              🍀
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {canClaim ? 'Find Your Daily Gold!' : 'Come Back Tomorrow!'}
            </h3>
            <p className="text-gray-700 mb-4">
              {canClaim
                ? 'Claim 100 MAGIC + 0.001 ETH for gas!'
                : `Next claim in: ${formatTimeUntilClaim(timeUntilClaim)}`}
            </p>
            <BigButton
              onClick={handleClaim}
              variant={canClaim ? 'success' : 'secondary'}
              icon={canClaim ? '✨' : '⏰'}
              className="w-full"
              disabled={!canClaim || claiming}
            >
              {claiming
                ? 'Claiming...'
                : canClaim
                ? '🍀 Claim Daily Gold!'
                : '⏰ Wait for Tomorrow'}
            </BigButton>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <BigButton
            href="/send"
            variant="primary"
            icon="🪄"
          >
            Send
          </BigButton>
          <BigButton
            href="/receive"
            variant="secondary"
            icon="📥"
          >
            Receive
          </BigButton>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 rounded-2xl p-4"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            <TransactionItem
              type="receive"
              amount="100"
              token="MAGIC"
              from="0x1234...5678"
              timestamp={new Date()}
            />
            <TransactionItem
              type="receive"
              amount="0.005"
              token="ETH"
              from="0x1234...5678"
              timestamp={new Date(Date.now() - 3600000)}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <BigButton
            href="/friends"
            variant="secondary"
            icon="👥"
          >
            Friends
          </BigButton>
          <BigButton
            href="/donate"
            variant="primary"
            icon="💝"
          >
            Donate
          </BigButton>
        </div>

        <BigButton
          href="/learn"
          variant="success"
          icon="📚"
        >
          Learn About Crypto
        </BigButton>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <button className="text-2xl">🏠</button>
          <button className="text-2xl">💳</button>
          <button className="text-2xl">📚</button>
        </div>
      </div>
    </div>
  );
}


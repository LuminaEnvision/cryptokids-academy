'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Key, HandCard, PiggyBank, WarningTriangle, Clock } from 'iconoir-react';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { formatEther, parseEther } from 'viem';
import {
  getStakingPosition,
  stakeOnChain,
  unstakeOnChain,
  claimRewardsOnChain,
  getPendingRewards,
  getTotalStakedOnChain,
} from '@/lib/wallet/stakingOnChain';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';

export default function StakePage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<ReturnType<typeof getStoredKidWallet>>(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('');
  const [position, setPosition] = useState<Awaited<ReturnType<typeof getStakingPosition>>>(null);
  const [totalStaked, setTotalStaked] = useState('0');
  const [loading, setLoading] = useState(true);
  const [staking, setStaking] = useState(false);
  const [unstaking, setUnstaking] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const stored = getStoredKidWallet();
    if (!stored) {
      router.push('/');
      return;
    }
    setWallet(stored);
    loadBalance(stored.address);
    loadStakingData(stored.address);
  }, [router]);

  // ... (keep existing loadBalance and loadStakingData functions)
  // Re-implementing simplified versions for clarity if needed, 
  // but assuming they persist in the actual file edit if not replaced.
  // Wait, I need to provide FULL replacement content for the chunks or consistent replacement.
  // I will just replace the render part mostly? No, replacing full file is safer to avoid context loss.

  const loadBalance = async (address: string) => {
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
    } finally {
      setLoading(false);
    }
  };

  const loadStakingData = async (address: string) => {
    try {
      const config = getBlockchainConfig();
      if (!isValidContractAddress(config.stakingContractAddress)) {
        setLoading(false);
        return;
      }

      const [pos, total] = await Promise.all([
        getStakingPosition(address),
        getTotalStakedOnChain(),
      ]);

      setPosition(pos);
      setTotalStaked(total);
    } catch (error) {
      console.error('Error loading staking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amountWei = parseEther(stakeAmount);
    const balance = BigInt(tokenBalance);

    if (amountWei > balance) {
      alert('Not enough MAGIC tokens!');
      return;
    }

    setStaking(true);
    try {
      await stakeOnChain(stakeAmount);
      setStakeAmount('');
      await loadBalance(wallet!.address);
      await loadStakingData(wallet!.address);
      alert(`✅ Staked ${stakeAmount} MAGIC! You'll earn rewards over time!`);
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to stake'));
    } finally {
      setStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!position || !confirm('Unstake your tokens? You will stop earning rewards.')) return;

    setUnstaking(true);
    try {
      const amount = formatEther(BigInt(position.amount));
      await unstakeOnChain(amount);
      await loadBalance(wallet!.address);
      await loadStakingData(wallet!.address);
      alert(`✅ Unstaked ${amount} MAGIC!`);
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to unstake'));
    } finally {
      setUnstaking(false);
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await claimRewardsOnChain();
      await loadBalance(wallet!.address);
      await loadStakingData(wallet!.address);
      alert(`✅ Claimed rewards!`);
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Failed to claim rewards'));
    } finally {
      setClaiming(false);
    }
  };

  if (loading || !wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-magic-pink via-magic-blue to-magic-gold">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-magic-purple"
        >
          <Clock width={64} height={64} />
        </motion.div>
      </div>
    );
  }

  const availableBalance = parseFloat(formatEther(BigInt(tokenBalance || '0'))).toFixed(2);
  const stakedDisplay = position ? formatEther(BigInt(position.amount)) : '0';
  const pendingDisplay = position ? formatEther(BigInt(position.pendingRewards)) : '0';
  const hasStakingContract = wallet && isValidContractAddress(getBlockchainConfig().stakingContractAddress);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-magic-pink via-magic-blue to-magic-gold">
      <Header title="Save & Earn" showBack />

      <div className="p-6 space-y-6">
        {/* Info Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-rounded">Save Your Tokens</h2>
          <p className="text-gray-600 text-sm mb-4">
            Lock your MAGIC tokens to earn rewards! The longer you save, the more you earn.
          </p>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1 font-rounded">Available to Save</div>
            <div className="text-3xl font-bold text-blue-600 font-mono">{availableBalance} MAGIC</div>
          </div>
        </motion.div>

        {/* Stake Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-rounded">Save Tokens</h3>
          <div className="space-y-4">
            <div>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount to save"
                step="0.01"
                min="0"
                max={availableBalance}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 focus:outline-none text-lg transition-all"
              />
            </div>
            <BigButton
              onClick={handleStake}
              variant="primary"
              icon={<Lock width={24} height={24} />}
              className="w-full"
              disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || staking || !hasStakingContract}
            >
              {staking ? 'Staking...' : hasStakingContract ? 'Save Tokens' : 'Staking Contract Not Deployed'}
            </BigButton>
          </div>
        </motion.div>

        {/* Stats */}
        {position && parseFloat(stakedDisplay) > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-xl text-white backdrop-blur-md"
          >
            <div className="text-center">
              <div className="text-5xl mb-3 flex justify-center"><PiggyBank width={48} height={48} /></div>
              <div className="text-sm mb-1 opacity-90 font-rounded">Total Saved</div>
              <div className="text-3xl font-bold mb-4 font-mono">{parseFloat(stakedDisplay).toFixed(2)} MAGIC</div>
              <div className="text-sm mb-1 opacity-90 font-rounded">Pending Rewards</div>
              <div className="text-2xl font-bold font-mono">{parseFloat(pendingDisplay).toFixed(4)} MAGIC</div>
            </div>
          </motion.div>
        )}

        {/* Active Position */}
        {position && parseFloat(stakedDisplay) > 0 && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/90 rounded-xl p-4 shadow backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-gray-800 font-mono">{stakedDisplay} MAGIC</div>
                <div className="text-sm text-gray-600 font-rounded">
                  Earning rewards
                </div>
              </div>
              <div className="text-3xl text-magic-purple"><Lock width={32} height={32} /></div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 mb-3">
              <div className="text-xs text-gray-600 font-rounded">Pending Rewards</div>
              <div className="text-lg font-bold text-green-600 font-mono">{pendingDisplay} MAGIC</div>
            </div>
            <div className="flex gap-2">
              <BigButton
                onClick={handleClaim}
                variant="success"
                icon={<HandCard width={24} height={24} />}
                className="flex-1"
                disabled={claiming || parseFloat(pendingDisplay) === 0}
              >
                {claiming ? 'Claiming...' : 'Claim'}
              </BigButton>
              <BigButton
                onClick={handleUnstake}
                variant="secondary"
                icon={<Key width={24} height={24} />}
                className="flex-1"
                disabled={unstaking}
              >
                {unstaking ? 'Unstaking...' : 'Unsave'}
              </BigButton>
            </div>
          </motion.div>
        )}

        {!hasStakingContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4"
          >
            <p className="text-sm text-gray-700 text-center flex items-center justify-center gap-2">
              <WarningTriangle width={24} height={24} />
              Staking contract not deployed yet. Please set NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS in .env.local
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


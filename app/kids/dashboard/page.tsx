'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getCurrentWallet } from '@/lib/wallet/walletManager';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';
import { getChoresByChildAddress } from '@/lib/chores/choreTypes';
import Header from '../../_components/Header';
import AvatarDisplay from '../../_components/AvatarDisplay';
import GetETHButton from '../../_components/GetETHButton';
import Mascot from '../../_components/kids/Mascot';
import KidCard from '../../_components/kids/KidCard';
import KidIcon from '../../_components/kids/KidIcon';
import KidState from '../../_components/kids/KidState';
import ProgressStars from '../../_components/kids/ProgressStars';
import { getENSFromAddress } from '@/lib/wallet/ensKid';

const LEARN_TOTAL = 6;
const LEARN_PROGRESS_KEY = 'kiddo-learn-stars';

export default function KidsDashboardPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<ReturnType<typeof getCurrentWallet>>(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [learnStars, setLearnStars] = useState(0);

  useEffect(() => {
    setMounted(true);
    const stored = getCurrentWallet() || getStoredKidWallet();
    if (!stored) {
      router.push('/kids/login');
      return;
    }

    setWallet(stored);
    loadBalances(stored.address);
    loadPendingTasks(stored.address);

    try {
      const saved = Number(localStorage.getItem(LEARN_PROGRESS_KEY) || '0');
      setLearnStars(Number.isFinite(saved) ? saved : 0);
    } catch {
      setLearnStars(0);
    }

    const interval = setInterval(() => {
      loadBalances(stored.address);
      loadPendingTasks(stored.address);
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  const loadBalances = async (address: string) => {
    try {
      const config = getBlockchainConfig();
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(config.rpcUrl),
      });

      const ethBal = await client.getBalance({ address: address as `0x${string}` });
      setEthBalance(ethBal.toString());

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
        setTokenBalance('0');
      }
    } catch (error) {
      console.error('Balance load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingTasks = (address: string) => {
    const chores = getChoresByChildAddress(address);
    const pending = chores.filter(c => c.status === 'pending' || c.status === 'completed').length;
    setPendingTasks(pending);
  };

  if (!mounted || !wallet || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-kiddo-soft">
        <KidState kind="loading" size={128} />
      </div>
    );
  }

  const ethDisplay = parseFloat(formatEther(BigInt(ethBalance || '0'))).toFixed(4);
  const tokenDisplay = parseFloat(formatEther(BigInt(tokenBalance || '0'))).toFixed(2);
  const ensName = mounted && wallet ? getENSFromAddress(wallet.address) : null;

  return (
    <div className="min-h-screen bg-kiddo-soft pb-8">
      <Header title={ensName ? `Hi, ${ensName}!` : 'Hi, friend!'} />

      <div className="px-4 py-5 space-y-5 safe-area-inset-top">
        {/* Progress strip */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3 bg-white border-[3px] border-kiddo-gold rounded-kid-lg shadow-kid-gold px-4 py-3"
        >
          <ProgressStars
            count={learnStars}
            total={LEARN_TOTAL}
            label="Lesson stars"
            size="sm"
          />
          {pendingTasks > 0 && (
            <span className="font-display text-xs font-semibold bg-kiddo-coral-soft text-kiddo-coral px-3 py-1.5 rounded-kid whitespace-nowrap">
              {pendingTasks} task{pendingTasks === 1 ? '' : 's'}
            </span>
          )}
        </motion.div>

        {/* Address / name */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-kid-lg p-4 border-[3px] border-kiddo-sky shadow-kid-sky text-center"
        >
          <div className="font-kid text-xs font-bold uppercase tracking-wide text-kiddo-muted mb-1">
            Your address
          </div>
          {ensName ? (
            <>
              <div className="font-display text-xl text-kiddo-sky">{ensName}</div>
              <div className="font-kid text-xs text-kiddo-muted mt-1 font-mono">
                {wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}
              </div>
            </>
          ) : (
            <>
              <div className="font-display text-base text-kiddo-ink mb-1">Pick a fun name!</div>
              <div className="font-kid text-xs text-kiddo-muted font-mono mb-3">
                {wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}
              </div>
              <a
                href="/kids/setup"
                className="inline-flex font-display font-semibold text-sm bg-kiddo-sky text-white px-5 py-2.5 rounded-kid"
              >
                Set Your Name
              </a>
            </>
          )}
        </motion.div>

        {/* Avatar + Balance */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-kid-lg p-4 shadow-kid-coral border-[3px] border-kiddo-coral flex flex-col items-center justify-center gap-2"
          >
            <AvatarDisplay size={112} animate />
            <span className="font-display text-sm text-kiddo-coral">You!</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-kid-lg p-4 shadow-kid-gold border-[3px] border-kiddo-gold flex flex-col"
          >
            <div className="flex justify-center mb-2">
              <KidIcon name="coins" size={36} color="gold" well />
            </div>
            <h3 className="font-display text-sm text-center text-kiddo-ink mb-2">Your coins</h3>
            <div className="bg-kiddo-gold-soft rounded-kid p-3 mb-2 text-center border-2 border-kiddo-gold/40">
              <div className="font-display text-lg text-kiddo-ink">{tokenDisplay} MAGIC</div>
            </div>
            <div className="font-kid text-sm font-bold text-center text-kiddo-ink mb-1">
              {ethDisplay} ETH
            </div>
            <p className="font-kid text-[10px] text-center text-kiddo-muted mb-3 leading-tight">
              A little ETH helps magic happen
            </p>
            <GetETHButton address={wallet.address} />
          </motion.div>
        </div>

        {/* Learn CTA */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <KidCard
            accent="sky"
            layout="row"
            title="Learn about coins"
            description="Fun lessons about blockchain — earn stars as you go!"
            icon={<KidIcon name="book" size={32} color="sky" />}
            actionLabel="Start Learning"
            href="/kids/learn"
          />
        </motion.div>

        {/* Save + Donate */}
        <div className="grid grid-cols-2 gap-4">
          <KidCard
            accent="green"
            title="Save & Earn"
            description="Grow your coins over time"
            icon={<KidIcon name="piggy" size={28} color="green" />}
            actionLabel="Let's Save"
            href="/kids/stake"
          />
          <KidCard
            accent="coral"
            title="Donate"
            description="Help someone today"
            icon={<KidIcon name="star" size={28} color="coral" />}
            actionLabel="Give"
            href="/donate"
          />
        </div>

        {/* Buddy tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 bg-white/80 rounded-kid-lg border-[3px] border-kiddo-green/40 px-4 py-3"
        >
          <Mascot pose="wave" size={72} />
          <p className="font-kid text-sm text-kiddo-ink leading-snug">
            <span className="font-display font-semibold text-kiddo-green">Tip: </span>
            Finish a lesson to light up more stars. You&apos;re doing great!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

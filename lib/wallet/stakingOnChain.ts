/**
 * On-Chain Staking System
 * Interacts with MagicStaking contract on Base Sepolia
 */

import { createPublicClient, createWalletClient, http, formatEther, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';
import { getAccount } from './decrypt';

const STAKING_ABI = [
  {
    name: 'stake',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'unstake',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'claimRewards',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'getPosition',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'lastClaimTime', type: 'uint256' },
      { name: 'totalEarned', type: 'uint256' },
      { name: 'pendingRewards', type: 'uint256' },
    ],
  },
  {
    name: 'calculateRewards',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalStaked',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'rewardPool',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export interface OnChainStakingPosition {
  amount: string;
  startTime: number;
  lastClaimTime: number;
  totalEarned: string;
  pendingRewards: string;
}

/**
 * Get staking contract address
 */
function getStakingAddress(): `0x${string}` {
  const config = getBlockchainConfig();
  if (!isValidContractAddress(config.stakingContractAddress)) {
    throw new Error('Staking contract not deployed. Please set NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS in .env.local');
  }
  return config.stakingContractAddress as `0x${string}`;
}

/**
 * Get public client for reading
 */
function getPublicClient() {
  const config = getBlockchainConfig();
  return createPublicClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });
}

/**
 * Get wallet client for writing
 */
function getWalletClient() {
  const account = getAccount();
  if (!account) throw new Error('No wallet found');
  
  const config = getBlockchainConfig();
  return createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });
}

/**
 * Get user's staking position from contract
 */
export async function getStakingPosition(address: string): Promise<OnChainStakingPosition | null> {
  try {
    const client = getPublicClient();
    const stakingAddress = getStakingAddress();
    
    const result = await client.readContract({
      address: stakingAddress,
      abi: STAKING_ABI,
      functionName: 'getPosition',
      args: [address as `0x${string}`],
    });

    const [amount, startTime, lastClaimTime, totalEarned, pendingRewards] = result;

    // Check if user has a position
    if (amount === 0n) return null;

    return {
      amount: amount.toString(),
      startTime: Number(startTime) * 1000, // Convert to milliseconds
      lastClaimTime: Number(lastClaimTime) * 1000,
      totalEarned: totalEarned.toString(),
      pendingRewards: pendingRewards.toString(),
    };
  } catch (error) {
    console.error('Error getting staking position:', error);
    return null;
  }
}

/**
 * Stake tokens on-chain
 */
export async function stakeOnChain(amount: string): Promise<`0x${string}`> {
  const client = getWalletClient();
  const stakingAddress = getStakingAddress();
  const amountWei = parseEther(amount);

  const hash = await client.writeContract({
    address: stakingAddress,
    abi: STAKING_ABI,
    functionName: 'stake',
    args: [amountWei],
  });

  return hash;
}

/**
 * Unstake tokens on-chain
 */
export async function unstakeOnChain(amount: string): Promise<`0x${string}`> {
  const client = getWalletClient();
  const stakingAddress = getStakingAddress();
  const amountWei = parseEther(amount);

  const hash = await client.writeContract({
    address: stakingAddress,
    abi: STAKING_ABI,
    functionName: 'unstake',
    args: [amountWei],
  });

  return hash;
}

/**
 * Claim rewards on-chain
 */
export async function claimRewardsOnChain(): Promise<`0x${string}`> {
  const client = getWalletClient();
  const stakingAddress = getStakingAddress();

  const hash = await client.writeContract({
    address: stakingAddress,
    abi: STAKING_ABI,
    functionName: 'claimRewards',
    args: [],
  });

  return hash;
}

/**
 * Get pending rewards for a user
 */
export async function getPendingRewards(address: string): Promise<string> {
  try {
    const client = getPublicClient();
    const stakingAddress = getStakingAddress();

    const rewards = await client.readContract({
      address: stakingAddress,
      abi: STAKING_ABI,
      functionName: 'calculateRewards',
      args: [address as `0x${string}`],
    });

    return rewards.toString();
  } catch (error) {
    console.error('Error getting pending rewards:', error);
    return '0';
  }
}

/**
 * Get total staked amount
 */
export async function getTotalStakedOnChain(): Promise<string> {
  try {
    const client = getPublicClient();
    const stakingAddress = getStakingAddress();

    const total = await client.readContract({
      address: stakingAddress,
      abi: STAKING_ABI,
      functionName: 'totalStaked',
      args: [],
    });

    return total.toString();
  } catch (error) {
    console.error('Error getting total staked:', error);
    return '0';
  }
}

/**
 * Get reward pool balance
 */
export async function getRewardPoolBalance(): Promise<string> {
  try {
    const client = getPublicClient();
    const stakingAddress = getStakingAddress();

    const balance = await client.readContract({
      address: stakingAddress,
      abi: STAKING_ABI,
      functionName: 'rewardPool',
      args: [],
    });

    return balance.toString();
  } catch (error) {
    console.error('Error getting reward pool:', error);
    return '0';
  }
}


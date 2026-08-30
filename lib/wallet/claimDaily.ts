import { createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getAccount } from './decrypt';
import { getBlockchainConfig, isValidContractAddress } from '../blockchain/config';

const FAUCET_ABI = [
  {
    name: 'claimDaily',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'canClaim',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'timeUntilNextClaim',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export async function claimDailyFaucet(): Promise<`0x${string}`> {
  const account = getAccount();
  if (!account) throw new Error('No wallet found');

  const config = getBlockchainConfig();
  
  if (!isValidContractAddress(config.faucetContractAddress)) {
    throw new Error('Faucet contract not deployed yet. Please set NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS in your .env.local file.');
  }
  
  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });

  const hash = await client.writeContract({
    address: config.faucetContractAddress as `0x${string}`,
    abi: FAUCET_ABI,
    functionName: 'claimDaily',
  });

  return hash;
}

export async function canClaimDaily(address: string): Promise<boolean> {
  const config = getBlockchainConfig();
  
  if (!isValidContractAddress(config.faucetContractAddress)) {
    return false;
  }
  
  const { createPublicClient } = await import('viem');
  
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });

  try {
    const result = await client.readContract({
      address: config.faucetContractAddress as `0x${string}`,
      abi: FAUCET_ABI,
      functionName: 'canClaim',
      args: [address as `0x${string}`],
    });
    return result as boolean;
  } catch {
    return false;
  }
}

export async function getTimeUntilNextClaim(address: string): Promise<number> {
  const config = getBlockchainConfig();
  
  if (!isValidContractAddress(config.faucetContractAddress)) {
    return 0;
  }
  
  const { createPublicClient } = await import('viem');
  
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });

  try {
    const result = await client.readContract({
      address: config.faucetContractAddress as `0x${string}`,
      abi: FAUCET_ABI,
      functionName: 'timeUntilNextClaim',
      args: [address as `0x${string}`],
    });
    return Number(result);
  } catch {
    return 0;
  }
}


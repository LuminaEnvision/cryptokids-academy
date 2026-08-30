import { baseSepolia } from 'viem/chains';

export interface BlockchainConfig {
  chain: typeof baseSepolia;
  rpcUrl: string;
  magicTokenAddress: string;
  faucetContractAddress: string;
  stakingContractAddress: string;
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function isValidContractAddress(address: string): boolean {
  return address !== ZERO_ADDRESS && address.startsWith('0x') && address.length === 42;
}

export function getBlockchainConfig(): BlockchainConfig {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 
    'https://sepolia.base.org';
  
  const magicTokenAddress = process.env.NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS || 
    ZERO_ADDRESS; // Replace with deployed contract

  const faucetContractAddress = process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS ||
    ZERO_ADDRESS; // Replace with deployed faucet contract

  const stakingContractAddress = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS ||
    ZERO_ADDRESS; // Replace with deployed staking contract

  return {
    chain: baseSepolia,
    rpcUrl,
    magicTokenAddress,
    faucetContractAddress,
    stakingContractAddress,
  };
}


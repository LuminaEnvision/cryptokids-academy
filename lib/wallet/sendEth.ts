import { createWalletClient, http, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getAccount } from './decrypt';
import { getBlockchainConfig } from '../blockchain/config';

export async function sendEth(
  to: string,
  amount: string
): Promise<`0x${string}`> {
  const account = getAccount();
  if (!account) throw new Error('No wallet found');

  const config = getBlockchainConfig();
  
  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });

  const hash = await client.sendTransaction({
    to: to as `0x${string}`,
    value: parseEther(amount),
  });

  return hash;
}


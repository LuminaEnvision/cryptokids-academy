import { createWalletClient, http, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getAccount } from './decrypt';
import { getBlockchainConfig } from '../blockchain/config';

export async function sendMagicToken(
  to: string,
  amount: string
): Promise<`0x${string}`> {
  const account = getAccount();
  if (!account) throw new Error('No wallet found');

  const config = getBlockchainConfig();
  const tokenAddress = config.magicTokenAddress as `0x${string}`;
  
  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });

  // ERC20 transfer
  const hash = await client.writeContract({
    address: tokenAddress,
    abi: [
      {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ],
    functionName: 'transfer',
    args: [to as `0x${string}`, parseEther(amount)],
  });

  return hash;
}


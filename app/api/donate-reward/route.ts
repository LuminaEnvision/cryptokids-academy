import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';

/**
 * API route to send MAGIC token rewards after donation
 */
export async function POST(req: NextRequest) {
  try {
    const { address, rewardAmount } = await req.json();
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Address required' },
        { status: 400 }
      );
    }

    if (!rewardAmount || typeof rewardAmount !== 'string') {
      return NextResponse.json(
        { error: 'Reward amount required' },
        { status: 400 }
      );
    }

    // Get faucet private key from env
    const faucetPk = process.env.FAUCET_PK;
    if (!faucetPk) {
      return NextResponse.json(
        { error: 'Faucet not configured' },
        { status: 503 }
      );
    }

    const config = getBlockchainConfig();
    if (!isValidContractAddress(config.magicTokenAddress)) {
      return NextResponse.json(
        { error: 'Token contract not deployed' },
        { status: 503 }
      );
    }

    const faucetAccount = privateKeyToAccount(faucetPk as `0x${string}`);
    
    const client = createWalletClient({
      account: faucetAccount,
      chain: baseSepolia,
      transport: http(config.rpcUrl),
    });

    const recipient = address as `0x${string}`;
    const tokenAmount = BigInt(rewardAmount);

    // Send MAGIC tokens as reward
    const tokenHash = await client.writeContract({
      address: config.magicTokenAddress as `0x${string}`,
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
      args: [recipient, tokenAmount],
    });

    return NextResponse.json({
      success: true,
      tokenHash,
      message: 'Reward sent successfully!',
    });
  } catch (error: any) {
    console.error('Donation reward error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reward' },
      { status: 500 }
    );
  }
}


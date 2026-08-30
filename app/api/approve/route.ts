import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig } from '@/lib/blockchain/config';

/**
 * API route to approve a chore and send reward tokens
 * Uses the faucet wallet to send MagicTokens to the child
 */
export async function POST(req: NextRequest) {
  try {
    const { childAddress, rewardAmount } = await req.json();
    
    if (!childAddress || typeof childAddress !== 'string') {
      return NextResponse.json(
        { error: 'Child address required' },
        { status: 400 }
      );
    }

    if (!rewardAmount || isNaN(parseFloat(rewardAmount))) {
      return NextResponse.json(
        { error: 'Valid reward amount required' },
        { status: 400 }
      );
    }

    // Get faucet private key from env
    const faucetPk = process.env.FAUCET_PK;
    if (!faucetPk) {
      console.error('FAUCET_PK not set in environment');
      return NextResponse.json(
        { error: 'Faucet not configured' },
        { status: 500 }
      );
    }

    const config = getBlockchainConfig();
    const faucetAccount = privateKeyToAccount(faucetPk as `0x${string}`);
    
    const client = createWalletClient({
      account: faucetAccount,
      chain: baseSepolia,
      transport: http(config.rpcUrl),
    });

    const recipient = childAddress as `0x${string}`;
    const tokenAmount = parseEther(rewardAmount);

    // Send MagicToken (ERC20)
    let tokenHash: `0x${string}` | null = null;
    try {
      tokenHash = await client.writeContract({
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
    } catch (error: any) {
      console.error('Error sending token:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send reward tokens' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tokenHash,
      message: 'Reward sent successfully!',
    });
  } catch (error: any) {
    console.error('Approve error:', error);
    return NextResponse.json(
      { error: error.message || 'Approval failed' },
      { status: 500 }
    );
  }
}


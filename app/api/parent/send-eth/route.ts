import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig } from '@/lib/blockchain/config';

/**
 * API route for parent to send ETH to child
 * Uses FAUCET_PK (same as deployer wallet)
 */
export async function POST(req: NextRequest) {
  try {
    const { childAddress, amount } = await req.json();
    
    if (!childAddress || typeof childAddress !== 'string') {
      return NextResponse.json(
        { error: 'Child address required' },
        { status: 400 }
      );
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Valid amount required' },
        { status: 400 }
      );
    }

    // Get faucet private key from env (parent uses same wallet)
    const faucetPk = process.env.FAUCET_PK;
    if (!faucetPk) {
      return NextResponse.json(
        { error: 'Parent wallet not configured' },
        { status: 503 }
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
    const ethAmount = parseEther(amount);

    // Send ETH
    const txHash = await client.sendTransaction({
      to: recipient,
      value: ethAmount,
    });

    return NextResponse.json({
      success: true,
      txHash,
      message: `Sent ${amount} ETH to child!`,
    });
  } catch (error: any) {
    console.error('Parent send ETH error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send ETH' },
      { status: 500 }
    );
  }
}


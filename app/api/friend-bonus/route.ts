import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';
import { parseEther } from 'viem';

/**
 * API route to send 1% MAGIC bonus when accepting friend request
 */
export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Address required' },
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

    // Fixed 1 MAGIC bonus when accepting friend request
    // (Not based on amount - just a welcome bonus)
    const bonusAmount = parseEther('1'); // 1 MAGIC fixed bonus

    const faucetAccount = privateKeyToAccount(faucetPk as `0x${string}`);
    
    const client = createWalletClient({
      account: faucetAccount,
      chain: baseSepolia,
      transport: http(config.rpcUrl),
    });

    const recipient = address as `0x${string}`;

    // Send MAGIC bonus
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
      args: [recipient, BigInt(bonusAmount)],
    });

    return NextResponse.json({
      success: true,
      tokenHash,
      bonusAmount: bonusAmount.toString(),
      message: 'Friend bonus sent!',
    });
  } catch (error: any) {
    console.error('Friend bonus error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send bonus' },
      { status: 500 }
    );
  }
}


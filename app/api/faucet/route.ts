import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { getBlockchainConfig, isValidContractAddress } from '@/lib/blockchain/config';
import { getInitialTokenAmount } from '@/lib/wallet/tokenLogic';

// Track addresses that have received initial tokens (in-memory, use DB in production)
const initialTokensReceived = new Set<string>();

// Rate limiting: store last faucet time per fingerprint
const faucetCache = new Map<string, number>();
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours

function getFingerprint(req: NextRequest): string {
  // Use IP + User-Agent as fingerprint
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const ua = req.headers.get('user-agent') || 'unknown';
  return `${ip}-${ua}`;
}

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Address required' },
        { status: 400 }
      );
    }

    // Check rate limit
    const fingerprint = getFingerprint(req);
    const lastFaucet = faucetCache.get(fingerprint);
    const now = Date.now();
    
    if (lastFaucet && (now - lastFaucet) < RATE_LIMIT_MS) {
      const hoursLeft = Math.ceil((RATE_LIMIT_MS - (now - lastFaucet)) / (1000 * 60 * 60));
      return NextResponse.json(
        { error: `Please wait ${hoursLeft} more hours before requesting again` },
        { status: 429 }
      );
    }

    // Get faucet private key from env
    const faucetPk = process.env.FAUCET_PK;
    if (!faucetPk) {
      console.warn('FAUCET_PK not set in environment - faucet disabled');
      return NextResponse.json(
        { 
          error: 'Faucet not configured',
          message: 'The faucet is not set up. Please configure FAUCET_PK in your environment variables.',
          configured: false
        },
        { status: 503 } // Service Unavailable instead of 500
      );
    }

    const config = getBlockchainConfig();
    const faucetAccount = privateKeyToAccount(faucetPk as `0x${string}`);
    
    const client = createWalletClient({
      account: faucetAccount,
      chain: baseSepolia,
      transport: http(config.rpcUrl),
    });

    const recipient = address as `0x${string}`;
    const addressLower = address.toLowerCase();
    
    // Check if this is first-time wallet creation
    const isFirstTime = !initialTokensReceived.has(addressLower);
    const ethAmount = parseEther(isFirstTime ? '0.0001' : '0.0001'); // Same amount for both
    
    // Send ETH
    const ethHash = await client.sendTransaction({
      to: recipient,
      value: ethAmount,
    });

    // Send MAGIC tokens only on first time
    let tokenHash: `0x${string}` | null = null;
    if (isFirstTime && isValidContractAddress(config.magicTokenAddress)) {
      try {
        const tokenAmount = BigInt(getInitialTokenAmount()); // 100 MAGIC
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
        initialTokensReceived.add(addressLower);
      } catch (error) {
        console.error('Error sending MAGIC tokens:', error);
        // Continue even if token send fails
      }
    }

    // Update rate limit
    faucetCache.set(fingerprint, now);

    return NextResponse.json({
      success: true,
      ethHash,
      tokenHash,
      isFirstTime,
      message: isFirstTime 
        ? 'Welcome! 100 MAGIC tokens + 0.0001 ETH sent!' 
        : '0.0001 ETH sent for gas fees!',
    });
  } catch (error: any) {
    console.error('Faucet error:', error);
    return NextResponse.json(
      { error: error.message || 'Faucet failed' },
      { status: 500 }
    );
  }
}


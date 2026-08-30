import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { encrypt } from './encrypt';
import { generateKidCode } from './kidCode';

export interface KidWalletData {
  address: string;
  encryptedKey: string;
  magicPhrase: string;
  kidCode: {
    emoji: string;
    color: string;
    animal: string;
    number: number;
    displayName: string;
  };
  createdAt?: number;
}

const STORAGE_KEY = 'magic_kids_wallet';
const MAGIC_PHRASES = [
  'Moon Jelly Rabbit',
  'Rainbow Jelly Tiger',
  'Sparkle Moon Unicorn',
  'Cosmic Star Dragon',
  'Magic Cloud Butterfly',
  'Golden Sun Phoenix',
  'Crystal Ocean Dolphin',
  'Starlight Forest Fox',
  'Dreamy Night Owl',
  'Shimmering Sky Whale',
];

export function generateMagicPhrase(): string {
  return MAGIC_PHRASES[Math.floor(Math.random() * MAGIC_PHRASES.length)];
}

export async function createKidWallet(): Promise<KidWalletData> {
  // Generate private key
  const privateKey = generatePrivateKey();

  // Derive account
  const account = privateKeyToAccount(privateKey);

  // Generate magic phrase
  const magicPhrase = generateMagicPhrase();

  // Encrypt private key
  const encryptedKey = encrypt(privateKey, magicPhrase);

  // Generate KidCode
  const kidCode = generateKidCode(account.address);

  const walletData: KidWalletData = {
    address: account.address,
    encryptedKey,
    magicPhrase,
    kidCode,
    createdAt: Date.now(),
  };

  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(walletData));
  }

  return walletData;
}

export function getStoredKidWallet(): KidWalletData | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data = JSON.parse(stored) as KidWalletData;
    // Ensure kidCode exists (for old wallets)
    let modified = false;
    if (!data.kidCode) {
      const { generateKidCode } = require('./kidCode');
      data.kidCode = generateKidCode(data.address);
      modified = true;
    }
    // Ensure createdAt exists
    if (!data.createdAt) {
      data.createdAt = Date.now();
      modified = true;
    }

    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return data;
  } catch {
    return null;
  }
}

export function clearStoredKidWallet(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}


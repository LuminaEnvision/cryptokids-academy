import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { encrypt } from './encrypt';

export interface WalletData {
  address: string;
  encryptedKey: string;
  magicPhrase: string;
}

const STORAGE_KEY = 'magic_kids_wallet';
const MAGIC_PHRASES = [
  'Rainbow Jelly Tiger',
  'Sparkle Moon Unicorn',
  'Cosmic Star Dragon',
  'Magic Cloud Butterfly',
  'Golden Sun Phoenix',
  'Crystal Ocean Dolphin',
  'Starlight Forest Fox',
];

export function generateMagicPhrase(): string {
  return MAGIC_PHRASES[Math.floor(Math.random() * MAGIC_PHRASES.length)];
}

export async function createWallet(): Promise<WalletData> {
  // Generate private key
  const privateKey = generatePrivateKey();
  
  // Derive account
  const account = privateKeyToAccount(privateKey);
  
  // Generate magic phrase
  const magicPhrase = generateMagicPhrase();
  
  // Encrypt private key
  const encryptedKey = encrypt(privateKey, magicPhrase);
  
  const walletData: WalletData = {
    address: account.address,
    encryptedKey,
    magicPhrase,
  };
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(walletData));
  }
  
  return walletData;
}

export function getStoredWallet(): WalletData | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as WalletData;
  } catch {
    return null;
  }
}

export function clearStoredWallet(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}


/**
 * Wallet Manager
 * Handles multiple wallets and switching between them
 */

import { KidWalletData, createKidWallet, getStoredKidWallet } from './createKidWallet';
import { decrypt as decryptUtil } from './encrypt';
import { privateKeyToAccount } from 'viem/accounts';

const WALLETS_STORAGE_KEY = 'kiddopay_wallets'; // All wallets
const CURRENT_WALLET_KEY = 'kiddopay_current_wallet'; // Current active wallet address
const OLD_STORAGE_KEY = 'magic_kids_wallet'; // Old single-wallet storage

export interface StoredWallet {
  address: string;
  encryptedKey: string;
  magicPhrase: string; // Stored for login (encrypted in production)
  kidCode: {
    emoji: string;
    color: string;
    animal: string;
    number: number;
    displayName: string;
  };
  createdAt: number;
  ensName?: string;
}

/**
 * Get all stored wallets
 */
export function getAllWallets(): StoredWallet[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WALLETS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as StoredWallet[];
  } catch {
    return [];
  }
}

/**
 * Get current active wallet address
 */
export function getCurrentWalletAddress(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_WALLET_KEY);
}

/**
 * Set current active wallet
 */
export function setCurrentWallet(address: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_WALLET_KEY, address);
  }
}

/**
 * Migrate old single-wallet storage to new multi-wallet system
 */
function migrateOldWallet(): StoredWallet | null {
  if (typeof window === 'undefined') return null;
  
  // Check if old wallet exists
  const oldWallet = getStoredKidWallet();
  if (!oldWallet) return null;
  
  // Check if already migrated
  const wallets = getAllWallets();
  if (wallets.some(w => w.address.toLowerCase() === oldWallet.address.toLowerCase())) {
    return null; // Already migrated
  }
  
  // Migrate to new system
  const storedWallet: StoredWallet = {
    address: oldWallet.address,
    encryptedKey: oldWallet.encryptedKey,
    magicPhrase: oldWallet.magicPhrase,
    kidCode: oldWallet.kidCode,
    createdAt: Date.now(),
  };
  
  saveWallet(storedWallet);
  setCurrentWallet(storedWallet.address);
  
  return storedWallet;
}

/**
 * Get current active wallet data
 * Also checks old storage for backward compatibility
 */
export function getCurrentWallet(): StoredWallet | null {
  // First try new system
  const address = getCurrentWalletAddress();
  if (address) {
    const wallets = getAllWallets();
    const wallet = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (wallet) return wallet;
  }
  
  // Try to migrate old wallet
  const migrated = migrateOldWallet();
  if (migrated) return migrated;
  
  // Fallback to old system
  const oldWallet = getStoredKidWallet();
  if (!oldWallet) return null;
  
  return {
    address: oldWallet.address,
    encryptedKey: oldWallet.encryptedKey,
    magicPhrase: oldWallet.magicPhrase,
    kidCode: oldWallet.kidCode,
    createdAt: Date.now(),
  };
}

/**
 * Save a wallet to storage
 */
export function saveWallet(wallet: StoredWallet): void {
  if (typeof window === 'undefined') return;
  
  const wallets = getAllWallets();
  const index = wallets.findIndex(w => w.address.toLowerCase() === wallet.address.toLowerCase());
  
  if (index >= 0) {
    wallets[index] = wallet;
  } else {
    wallets.push(wallet);
  }
  
  localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));
}

/**
 * Login with passphrase
 * Returns wallet if passphrase is correct, null otherwise
 * Also checks old storage for backward compatibility
 */
// Helper to convert string to title case
function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export function loginWithPassphrase(passphrase: string): StoredWallet | null {
  // Trim passphrase
  const trimmedPhrase = passphrase.trim();
  const lowerPhrase = trimmedPhrase.toLowerCase();
  const titlePhrase = toTitleCase(trimmedPhrase);
  
  // First try new multi-wallet system
  const wallets = getAllWallets();
  
  for (const wallet of wallets) {
    try {
      // Try multiple variations: original, lowercase, title case, and stored phrase
      const variations = [
        trimmedPhrase,
        lowerPhrase,
        titlePhrase,
        wallet.magicPhrase,
        wallet.magicPhrase.toLowerCase(),
        wallet.magicPhrase.toUpperCase(),
      ];
      
      let decrypted: string | null = null;
      for (const variation of variations) {
        try {
          decrypted = decryptUtil(wallet.encryptedKey, variation);
          if (decrypted && decrypted.startsWith('0x') && decrypted.length === 66) {
            break; // Successfully decrypted
          }
        } catch {
          continue; // Try next variation
        }
      }
      
      // Verify it's a valid private key
      if (decrypted && decrypted.startsWith('0x') && decrypted.length === 66) {
        // Verify the address matches
        const account = privateKeyToAccount(decrypted as `0x${string}`);
        if (account.address.toLowerCase() === wallet.address.toLowerCase()) {
          // Passphrase is correct!
          setCurrentWallet(wallet.address);
          return wallet;
        }
      }
    } catch {
      // Wrong passphrase for this wallet, try next
      continue;
    }
  }
  
  // Try old single-wallet storage
  const oldWallet = getStoredKidWallet();
  if (oldWallet) {
    try {
      const variations = [
        trimmedPhrase,
        lowerPhrase,
        titlePhrase,
        oldWallet.magicPhrase,
        oldWallet.magicPhrase.toLowerCase(),
        oldWallet.magicPhrase.toUpperCase(),
      ];
      
      let decrypted: string | null = null;
      for (const variation of variations) {
        try {
          decrypted = decryptUtil(oldWallet.encryptedKey, variation);
          if (decrypted && decrypted.startsWith('0x') && decrypted.length === 66) {
            break;
          }
        } catch {
          continue;
        }
      }
      
      if (decrypted && decrypted.startsWith('0x') && decrypted.length === 66) {
        const account = privateKeyToAccount(decrypted as `0x${string}`);
        if (account.address.toLowerCase() === oldWallet.address.toLowerCase()) {
          // Migrate to new system
          const storedWallet: StoredWallet = {
            address: oldWallet.address,
            encryptedKey: oldWallet.encryptedKey,
            magicPhrase: oldWallet.magicPhrase,
            kidCode: oldWallet.kidCode,
            createdAt: Date.now(),
          };
          
          saveWallet(storedWallet);
          setCurrentWallet(storedWallet.address);
          return storedWallet;
        }
      }
    } catch {
      // Wrong passphrase
    }
  }
  
  return null;
}

/**
 * Create and save a new wallet
 */
export async function createAndSaveWallet(): Promise<StoredWallet> {
  const walletData = await createKidWallet();
  
  const storedWallet: StoredWallet = {
    address: walletData.address,
    encryptedKey: walletData.encryptedKey,
    magicPhrase: walletData.magicPhrase,
    kidCode: walletData.kidCode,
    createdAt: Date.now(),
  };
  
  saveWallet(storedWallet);
  setCurrentWallet(storedWallet.address);
  
  return storedWallet;
}

/**
 * Logout - clear current wallet
 * Also clears old storage for compatibility
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_WALLET_KEY);
    // Also clear old single-wallet storage for compatibility
    localStorage.removeItem(OLD_STORAGE_KEY);
    // Keep wallets stored in new system, just clear current selection
  }
}

/**
 * Delete a wallet (permanent)
 */
export function deleteWallet(address: string): void {
  const wallets = getAllWallets();
  const filtered = wallets.filter(w => w.address.toLowerCase() !== address.toLowerCase());
  localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(filtered));
  
  // If deleted wallet was current, clear current
  const current = getCurrentWalletAddress();
  if (current && current.toLowerCase() === address.toLowerCase()) {
    logout();
  }
}

/**
 * Check if a wallet exists for an address
 */
export function walletExists(address: string): boolean {
  const wallets = getAllWallets();
  return wallets.some(w => w.address.toLowerCase() === address.toLowerCase());
}


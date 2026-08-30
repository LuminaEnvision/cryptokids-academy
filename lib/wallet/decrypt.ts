import { decrypt as decryptUtil } from './encrypt';
import { privateKeyToAccount } from 'viem/accounts';
import { getCurrentWallet } from './walletManager';
import { getStoredKidWallet } from './createKidWallet';

export function getPrivateKey(): `0x${string}` | null {
  // Try new wallet manager first
  const wallet = getCurrentWallet();
  if (!wallet) {
    // Fallback to old system
    const oldWallet = getStoredKidWallet();
    if (!oldWallet) return null;
    
    try {
      const privateKey = decryptUtil(oldWallet.encryptedKey, oldWallet.magicPhrase) as `0x${string}`;
      return privateKey;
    } catch {
      return null;
    }
  }
  
  try {
    const privateKey = decryptUtil(wallet.encryptedKey, wallet.magicPhrase) as `0x${string}`;
    return privateKey;
  } catch {
    return null;
  }
}

export function getAccount() {
  const privateKey = getPrivateKey();
  if (!privateKey) return null;
  
  return privateKeyToAccount(privateKey);
}


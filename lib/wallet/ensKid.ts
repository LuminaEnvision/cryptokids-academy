/**
 * ENS-style .kid Address System
 * Kids can pick names like "unicorn.kid" or "star.kid"
 */

export interface ENSKidName {
  name: string; // e.g., "unicorn"
  fullName: string; // e.g., "unicorn.kid"
  address: string; // Wallet address
}

const ENS_STORAGE_KEY = 'kiddopay_ens_names';
const RESERVED_NAMES = ['admin', 'parent', 'system', 'kiddopay'];

/**
 * Validate ENS name
 */
export function isValidENSName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 20) return false;
  if (!/^[a-z0-9-]+$/.test(name)) return false; // Only lowercase letters, numbers, hyphens
  if (RESERVED_NAMES.includes(name.toLowerCase())) return false;
  return true;
}

/**
 * Register an ENS name for an address
 */
export function registerENSName(name: string, address: string): boolean {
  if (!isValidENSName(name)) return false;

  const fullName = `${name.toLowerCase()}.kid`;
  const mappings = getENSMappings();
  
  // Check if name is already taken
  if (mappings[fullName]) {
    return false;
  }

  mappings[fullName] = {
    name: name.toLowerCase(),
    fullName,
    address: address.toLowerCase(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(ENS_STORAGE_KEY, JSON.stringify(mappings));
  }

  return true;
}

/**
 * Get address from ENS name
 */
export function getAddressFromENS(ensName: string): string | null {
  const fullName = ensName.includes('.kid') ? ensName : `${ensName}.kid`;
  const mappings = getENSMappings();
  return mappings[fullName]?.address || null;
}

/**
 * Get ENS name for an address
 */
export function getENSFromAddress(address: string): string | null {
  const mappings = getENSMappings();
  for (const [fullName, data] of Object.entries(mappings)) {
    if (data.address.toLowerCase() === address.toLowerCase()) {
      return fullName;
    }
  }
  return null;
}

/**
 * Get all ENS mappings
 */
function getENSMappings(): Record<string, ENSKidName> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(ENS_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Check if ENS name is available
 */
export function isENSAvailable(name: string): boolean {
  if (!isValidENSName(name)) return false;
  const fullName = `${name.toLowerCase()}.kid`;
  const mappings = getENSMappings();
  return !mappings[fullName];
}


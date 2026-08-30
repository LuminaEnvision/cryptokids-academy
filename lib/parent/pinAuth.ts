/**
 * Parent PIN Authentication
 */

const PARENT_PIN_KEY = 'magic_parent_pin_hash';

/**
 * Simple hash function for PIN (not cryptographically secure, but good enough for this use case)
 */
function hashPIN(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Set parent PIN (first time setup)
 */
export function setParentPIN(pin: string): void {
  if (typeof window === 'undefined') return;
  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    throw new Error('PIN must be exactly 4 digits');
  }
  
  const hashed = hashPIN(pin);
  localStorage.setItem(PARENT_PIN_KEY, hashed);
}

/**
 * Check if PIN is set
 */
export function hasParentPIN(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(PARENT_PIN_KEY);
}

/**
 * Verify parent PIN
 */
export function verifyParentPIN(pin: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const storedHash = localStorage.getItem(PARENT_PIN_KEY);
  if (!storedHash) return false;
  
  const inputHash = hashPIN(pin);
  return storedHash === inputHash;
}

/**
 * Clear parent PIN (logout)
 */
export function clearParentPIN(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PARENT_PIN_KEY);
}

/**
 * Check if parent is currently authenticated
 */
export function isParentAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('magic_parent_authenticated') === 'true';
}

/**
 * Set parent authentication session
 */
export function setParentAuthenticated(authenticated: boolean): void {
  if (typeof window === 'undefined') return;
  if (authenticated) {
    localStorage.setItem('magic_parent_authenticated', 'true');
  } else {
    localStorage.removeItem('magic_parent_authenticated');
  }
}


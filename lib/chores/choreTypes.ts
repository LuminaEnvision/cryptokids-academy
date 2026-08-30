/**
 * Chore System Types
 */

export interface Chore {
  id: string;
  title: string;
  description?: string;
  rewardAmount: string; // MAGIC tokens
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  createdAt: number;
  completedAt?: number;
  approvedAt?: number;
  childAddress: string;
  parentNote?: string;
  /** Kid attached a proof photo (blob lives in IndexedDB) */
  hasProofPhoto?: boolean;
}

export interface ChoreWithKidCode extends Chore {
  kidCode?: {
    emoji: string;
    color: string;
    animal: string;
    displayName: string;
  };
}

const CHORES_STORAGE_KEY = 'magic_kids_chores';

export function getChores(): Chore[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CHORES_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Chore[];
  } catch {
    return [];
  }
}

export function saveChores(chores: Chore[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHORES_STORAGE_KEY, JSON.stringify(chores));
}

export function createChore(chore: Omit<Chore, 'id' | 'status' | 'createdAt'>): Chore {
  const newChore: Chore = {
    ...chore,
    id: `chore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    createdAt: Date.now(),
  };
  
  const chores = getChores();
  chores.push(newChore);
  saveChores(chores);
  
  return newChore;
}

export function updateChoreStatus(choreId: string, status: Chore['status']): Chore | null {
  const chores = getChores();
  const index = chores.findIndex(c => c.id === choreId);
  
  if (index === -1) return null;
  
  const updatedChore = {
    ...chores[index],
    status,
    ...(status === 'completed' && !chores[index].completedAt ? { completedAt: Date.now() } : {}),
    ...(status === 'approved' && !chores[index].approvedAt ? { approvedAt: Date.now() } : {}),
  };
  
  chores[index] = updatedChore;
  saveChores(chores);
  
  return updatedChore;
}

/** Mark chore complete and flag that a proof photo was saved. */
export function completeChoreWithProof(choreId: string, hasProofPhoto: boolean): Chore | null {
  const chores = getChores();
  const index = chores.findIndex((c) => c.id === choreId);
  if (index === -1) return null;

  const updated: Chore = {
    ...chores[index],
    status: 'completed',
    completedAt: chores[index].completedAt || Date.now(),
    hasProofPhoto,
  };
  chores[index] = updated;
  saveChores(chores);
  return updated;
}

export function getChoresByStatus(status: Chore['status']): Chore[] {
  return getChores().filter(c => c.status === status);
}

export function getChoresByChildAddress(address: string): Chore[] {
  return getChores().filter(c => c.childAddress.toLowerCase() === address.toLowerCase());
}

/**
 * If the active kid has no open tasks but this browser has open chores
 * under another address (old vs multi-wallet key drift), reattach them.
 */
export function reassignChoresToAddress(targetAddress: string): number {
  if (typeof window === 'undefined') return 0;

  const chores = getChores();
  const target = targetAddress.toLowerCase();
  const activeOpen = chores.some(
    (c) =>
      c.childAddress.toLowerCase() === target &&
      (c.status === 'pending' || c.status === 'completed')
  );
  if (activeOpen) return 0;

  let changed = 0;
  for (const chore of chores) {
    if (
      (chore.status === 'pending' || chore.status === 'completed') &&
      chore.childAddress.toLowerCase() !== target
    ) {
      chore.childAddress = targetAddress;
      changed += 1;
    }
  }

  if (changed > 0) saveChores(chores);
  return changed;
}


export interface Friend {
  address: string;
  name: string;
  icon: string; // emoji or icon identifier
  addedAt: number; // timestamp
}

const FRIENDS_STORAGE_KEY = 'magic_kids_friends';

export function getFriends(): Friend[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FRIENDS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Friend[];
  } catch {
    return [];
  }
}

export function addFriend(friend: Friend): void {
  if (typeof window === 'undefined') return;
  
  const friends = getFriends();
  
  // Check if friend already exists
  if (friends.some(f => f.address.toLowerCase() === friend.address.toLowerCase())) {
    throw new Error('Friend already added!');
  }
  
  friends.push({
    ...friend,
    addedAt: Date.now(),
  });
  
  localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
}

export function removeFriend(address: string): void {
  if (typeof window === 'undefined') return;
  
  const friends = getFriends();
  const filtered = friends.filter(f => f.address.toLowerCase() !== address.toLowerCase());
  localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(filtered));
}

export function updateFriend(address: string, updates: Partial<Friend>): void {
  if (typeof window === 'undefined') return;
  
  const friends = getFriends();
  const index = friends.findIndex(f => f.address.toLowerCase() === address.toLowerCase());
  
  if (index === -1) throw new Error('Friend not found');
  
  friends[index] = { ...friends[index], ...updates };
  localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
}

export function getFriendByAddress(address: string): Friend | null {
  const friends = getFriends();
  return friends.find(f => f.address.toLowerCase() === address.toLowerCase()) || null;
}


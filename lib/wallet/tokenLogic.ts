/**
 * Token Logic
 * Magic tokens are received only once (100 tokens)
 * Then earned through chores, friends, donations
 */

const INITIAL_TOKEN_AMOUNT = '100000000000000000000'; // 100 tokens (18 decimals)
const INITIAL_TOKEN_RECEIVED_KEY = 'kiddopay_initial_tokens_received';
const MAX_DONATION_REWARD = 10; // Max 10 MAGIC per donation

/**
 * Check if initial tokens have been received
 */
export function hasReceivedInitialTokens(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(INITIAL_TOKEN_RECEIVED_KEY) === 'true';
}

/**
 * Mark initial tokens as received
 */
export function markInitialTokensReceived(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(INITIAL_TOKEN_RECEIVED_KEY, 'true');
  }
}

/**
 * Get initial token amount
 */
export function getInitialTokenAmount(): string {
  return INITIAL_TOKEN_AMOUNT;
}

/**
 * Calculate donation reward (varies, max 10 MAGIC)
 */
export function calculateDonationReward(donationAmount: string): string {
  // Reward is 1-10 MAGIC based on donation amount
  // More donation = more reward, but capped at 10
  const amount = parseFloat(donationAmount);
  const reward = Math.min(Math.max(Math.floor(amount / 0.001), 1), MAX_DONATION_REWARD);
  
  // Convert to wei (18 decimals)
  return (BigInt(reward) * BigInt(10 ** 18)).toString();
}

/**
 * Get reward for completing a chore
 */
export function getChoreReward(rewardAmount: string): string {
  // Convert reward amount to wei
  return (BigInt(rewardAmount) * BigInt(10 ** 18)).toString();
}

/**
 * Get reward for receiving from friends
 */
export function getFriendReceiveReward(amount: string): string {
  // Small bonus for receiving from friends (1% of amount, max 5 MAGIC)
  const amountBigInt = BigInt(amount);
  const bonus = amountBigInt / BigInt(100);
  const maxBonus = BigInt(5) * BigInt(10 ** 18);
  return bonus > maxBonus ? maxBonus.toString() : bonus.toString();
}


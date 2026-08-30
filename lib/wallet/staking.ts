/**
 * Staking System
 * Kids can "save" their MAGIC tokens and earn 5% APY
 */

export interface StakingPosition {
  id: string;
  amount: string; // Amount staked (in wei)
  startTime: number; // Timestamp when staked
  lastClaimTime: number; // Last time rewards were claimed
  totalEarned: string; // Total rewards earned (in wei)
}

const STAKING_STORAGE_KEY = 'kiddopay_staking';
const APY = 5; // 5% annual percentage yield
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

/**
 * Calculate staking rewards
 * Formula: amount * APY * (timeElapsed / secondsPerYear)
 */
export function calculateRewards(
  amount: string,
  startTime: number,
  lastClaimTime: number,
  currentTime: number = Date.now()
): string {
  const amountBigInt = BigInt(amount);
  const timeElapsed = currentTime - lastClaimTime;
  const timeElapsedSeconds = BigInt(Math.floor(timeElapsed / 1000));
  
  // Calculate: amount * APY * (timeElapsed / secondsPerYear) / 100
  const apyBigInt = BigInt(APY * 100); // 500 for 5%
  const secondsPerYearBigInt = BigInt(SECONDS_PER_YEAR);
  
  const rewards = (amountBigInt * apyBigInt * timeElapsedSeconds) / (secondsPerYearBigInt * BigInt(10000));
  
  return rewards.toString();
}

/**
 * Stake tokens
 */
export function stakeTokens(amount: string): StakingPosition {
  const position: StakingPosition = {
    id: `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    startTime: Date.now(),
    lastClaimTime: Date.now(),
    totalEarned: '0',
  };

  const positions = getStakingPositions();
  positions.push(position);
  saveStakingPositions(positions);

  return position;
}

/**
 * Unstake tokens
 */
export function unstakeTokens(positionId: string): StakingPosition | null {
  const positions = getStakingPositions();
  const index = positions.findIndex(p => p.id === positionId);
  
  if (index === -1) return null;

  const position = positions[index];
  
  // Claim any pending rewards before unstaking
  const currentTime = Date.now();
  const rewards = calculateRewards(position.amount, position.startTime, position.lastClaimTime, currentTime);
  position.totalEarned = (BigInt(position.totalEarned) + BigInt(rewards)).toString();

  positions.splice(index, 1);
  saveStakingPositions(positions);

  return position;
}

/**
 * Claim staking rewards
 */
export function claimRewards(positionId: string): string {
  const positions = getStakingPositions();
  const position = positions.find(p => p.id === positionId);
  
  if (!position) return '0';

  const currentTime = Date.now();
  const rewards = calculateRewards(position.amount, position.startTime, position.lastClaimTime, currentTime);
  
  position.totalEarned = (BigInt(position.totalEarned) + BigInt(rewards)).toString();
  position.lastClaimTime = currentTime;

  saveStakingPositions(positions);

  return rewards.toString();
}

/**
 * Get all staking positions
 */
export function getStakingPositions(): StakingPosition[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STAKING_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Get total staked amount
 */
export function getTotalStaked(): string {
  const positions = getStakingPositions();
  return positions.reduce((total, pos) => {
    return (BigInt(total) + BigInt(pos.amount)).toString();
  }, '0');
}

/**
 * Get total pending rewards across all positions
 */
export function getTotalPendingRewards(): string {
  const positions = getStakingPositions();
  const currentTime = Date.now();
  
  return positions.reduce((total, pos) => {
    const rewards = calculateRewards(pos.amount, pos.startTime, pos.lastClaimTime, currentTime);
    return (BigInt(total) + BigInt(rewards)).toString();
  }, '0');
}

function saveStakingPositions(positions: StakingPosition[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STAKING_STORAGE_KEY, JSON.stringify(positions));
  }
}


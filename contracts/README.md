# Smart Contracts

## Overview

KiddoPay uses three smart contracts on Base Sepolia:

1. **MagicToken.sol** - ERC20 token (REQUIRED)
2. **MagicStaking.sol** - Staking contract with 5% monthly APY (REQUIRED)
3. **MagicFaucet.sol** - Daily claim faucet (OPTIONAL - we use API faucet instead)

## Deployment Order

### Step 1: Deploy MagicToken
- **No constructor parameters**
- Deploys with 1,000,000 MAGIC tokens minted to deployer
- Copy address to `.env.local` as `NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS`

### Step 2: Deploy MagicStaking
- **Constructor parameter**: MagicToken address (from Step 1)
- Copy address to `.env.local` as `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS`
- **Fund reward pool**: Transfer MAGIC tokens to staking contract address
- Recommended: 50,000+ MAGIC tokens for reward pool

### Step 3: Deploy MagicFaucet (Optional)
- **Constructor parameter**: MagicToken address (from Step 1)
- Copy address to `.env.local` as `NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS`
- **Note**: We use API faucet (`/api/faucet`) instead, so this is optional

## Deployment Methods

### Method 1: Remix IDE (Easiest)

See `scripts/deploy-remix.md` for detailed instructions.

**Quick steps:**
1. Go to https://remix.ethereum.org/
2. Install OpenZeppelin contracts
3. Copy contract files
4. Compile with Solidity 0.8.20+
5. Deploy to Base Sepolia via MetaMask
6. Copy addresses to `.env.local`

### Method 2: Hardhat

**Setup:**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
cp hardhat.config.js.example hardhat.config.js
# Edit hardhat.config.js with your PRIVATE_KEY
```

**Deploy:**
```bash
npx hardhat run scripts/deploy-hardhat.js --network baseSepolia
```

### Method 3: Foundry

```bash
forge install OpenZeppelin/openzeppelin-contracts
forge build
forge create contracts/MagicToken.sol:MagicToken --rpc-url $BASE_SEPOLIA_RPC --private-key $PRIVATE_KEY
# Repeat for other contracts
```

## Post-Deployment

### 1. Fund Staking Reward Pool

Transfer MAGIC tokens to the staking contract:
- **Via Remix**: Call `transfer(stakingAddress, amount)` on MagicToken
- **Via MetaMask**: Send tokens to staking contract address
- **Via Contract**: Call `depositRewardPool(amount)` on MagicStaking as owner

**Recommended**: 50,000+ MAGIC tokens

### 2. Fund Faucet Wallet

The deployer wallet (FAUCET_PK) needs:
- **Base Sepolia ETH**: For sending 0.0001 ETH per new wallet
- **MAGIC tokens**: For sending 100 MAGIC per new wallet + rewards

**Recommended amounts:**
- ETH: 0.5+ ETH (for 5000+ wallets)
- MAGIC: 100,000+ MAGIC (for 1000+ initial distributions + rewards)

### 3. Update Environment Variables

Update `.env.local`:
```env
NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x...  # Optional
FAUCET_PK=0x...  # Deployer wallet private key
```

## Contract Details

### MagicToken
- **Name**: Magic Token
- **Symbol**: MAGIC
- **Decimals**: 18
- **Initial Supply**: 1,000,000 MAGIC (minted to deployer)

### MagicStaking
- **APY**: 5% monthly (0.4167% per month)
- **Reward Pool**: Funded by owner
- **Functions**: `stake()`, `unstake()`, `claimRewards()`, `depositRewardPool()`

### MagicFaucet (Optional)
- **Daily Claim**: 100 MAGIC + 0.001 ETH
- **Cooldown**: 24 hours
- **Functions**: `claimDaily()`, `depositFunds()`

## Verification

After deployment, verify contracts on BaseScan:
1. Go to https://sepolia.basescan.org/
2. Find your contract
3. Click "Contract" → "Verify and Publish"
4. Enter contract code and verify


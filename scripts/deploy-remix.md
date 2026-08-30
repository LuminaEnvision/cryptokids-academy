# Deploy Contracts Using Remix IDE

## Prerequisites

1. MetaMask installed and connected to Base Sepolia
2. Base Sepolia ETH in your wallet (for gas fees)
3. Remix IDE: https://remix.ethereum.org/

## Step 1: Setup Remix

1. Go to https://remix.ethereum.org/
2. Create a new workspace (or use default)
3. Install OpenZeppelin contracts:
   - Click "File Explorer" tab
   - Right-click → "New Folder" → Name: `@openzeppelin`
   - Create folder structure: `@openzeppelin/contracts/token/ERC20/`
   - Create file: `ERC20.sol`
   - Copy content from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
   - Repeat for other OpenZeppelin contracts needed:
     - `IERC20.sol`
     - `SafeERC20.sol`
     - `Ownable.sol`
     - `ReentrancyGuard.sol`

## Step 2: Add Contract Files

1. In Remix, create folder: `contracts/`
2. Create these files:
   - `contracts/MagicToken.sol`
   - `contracts/MagicStaking.sol`
   - `contracts/MagicFaucet.sol` (optional)

3. Copy the contract code from your local files:
   - `/contracts/MagicToken.sol`
   - `/contracts/MagicStaking.sol`
   - `/contracts/MagicFaucet.sol`

## Step 3: Compile

1. Go to "Solidity Compiler" tab
2. Select compiler version: `0.8.20` or higher
3. Click "Compile MagicToken.sol"
4. Repeat for other contracts
5. Check for errors (should be none)

## Step 4: Deploy MagicToken

1. Go to "Deploy & Run Transactions" tab
2. Select "Injected Provider - MetaMask"
3. Make sure you're on Base Sepolia network
4. Select "MagicToken" from contract dropdown
5. Click "Deploy" (no constructor parameters needed)
6. Confirm transaction in MetaMask
7. **Copy the deployed contract address** - you'll need this!

## Step 5: Deploy MagicStaking

1. Still in "Deploy & Run Transactions"
2. Select "MagicStaking" from contract dropdown
3. In the "Deploy" section, you'll see a field for constructor parameters
4. Enter the MagicToken address (from Step 4) in the field
5. Click "Deploy"
6. Confirm transaction in MetaMask
7. **Copy the deployed contract address**

## Step 6: Deploy MagicFaucet (Optional)

1. Select "MagicFaucet" from contract dropdown
2. Enter the MagicToken address in constructor field
3. Click "Deploy"
4. Confirm transaction in MetaMask
5. **Copy the deployed contract address**

## Step 7: Update Environment Variables

Update your `.env.local` file:

```env
NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS=0xYourMagicTokenAddress
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0xYourStakingAddress
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xYourFaucetAddress  # Optional
```

## Step 8: Fund Contracts

### Fund Staking Reward Pool

1. In Remix, interact with your deployed MagicToken contract
2. Call `transfer(stakingContractAddress, amount)` to send MAGIC tokens
3. Or interact with MagicStaking contract and call `depositRewardPool(amount)` as owner

**Recommended amounts:**
- Staking reward pool: 50,000+ MAGIC tokens
- Faucet (if using): 10,000+ MAGIC tokens + ETH

### Fund Faucet (if using MagicFaucet contract)

1. Interact with MagicFaucet contract
2. Call `depositFunds(magicAmount)` with ETH value
3. Or manually transfer tokens and ETH to the contract address

## Step 9: Verify Contracts (Optional but Recommended)

1. Go to BaseScan: https://sepolia.basescan.org/
2. Find your contract address
3. Click "Contract" tab → "Verify and Publish"
4. Enter contract code and verify

## Done! 🎉

Your contracts are now deployed and ready to use!


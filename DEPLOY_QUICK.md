# ⚡ Ultra-Quick Deployment (5 minutes)

## Prerequisites
- MetaMask installed
- Base Sepolia ETH (get from https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- Your FAUCET_PK wallet has ETH for gas

## Remix IDE Deployment

### 1. Open Remix
👉 https://remix.ethereum.org/

### 2. Quick Setup
- Click "File Explorer"
- Create folder: `contracts/`
- Create file: `contracts/MagicToken.sol`
- Copy code from: `contracts/MagicToken.sol` in your project

### 3. Install OpenZeppelin (Simplified)
Instead of manual install, use Remix's import feature:
- In your contract, Remix will show "Import not found" - click it
- Remix will auto-install OpenZeppelin contracts

### 4. Compile & Deploy
1. **Solidity Compiler** tab → Select `0.8.20`
2. Click **"Compile MagicToken.sol"**
3. **Deploy & Run** tab → Select **"Injected Provider - MetaMask"**
4. Make sure you're on **Base Sepolia** network
5. Select **"MagicToken"** → Click **"Deploy"**
6. **Copy the deployed address!**

### 5. Deploy MagicStaking
1. Add `contracts/MagicStaking.sol` (copy from your project)
2. Compile it
3. Deploy with MagicToken address as constructor parameter
4. **Copy the deployed address!**

### 6. Update .env.local
```env
NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0x...
```

### 7. Fund Staking Pool
In Remix, interact with deployed MagicToken:
- Call `transfer(stakingAddress, "50000000000000000000000")` 
- This sends 50,000 MAGIC to staking contract

## ✅ Done! Restart dev server.


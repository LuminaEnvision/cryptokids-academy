# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Edit `.env.local` and add:
   - `NEXT_PUBLIC_BASE_SEPOLIA_RPC`: Your Base Sepolia RPC URL
   - `NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS`: Your deployed MagicToken contract address
   - `FAUCET_PK`: Private key of your faucet wallet (testnet only!)

## Step 3: Deploy MagicToken Contract

You need to deploy an ERC20 token contract to Base Sepolia. Here's a simple contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MagicToken is ERC20 {
    constructor() ERC20("Magic Token", "MAGIC") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
```

Deploy using Remix, Hardhat, or Foundry. Make sure to:
- Deploy to Base Sepolia testnet
- Copy the contract address to `.env.local`

## Step 4: Fund the Faucet Wallet

1. Get some Base Sepolia ETH from a faucet:
   - https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Or use another Base Sepolia faucet

2. Send some MagicTokens to your faucet wallet address

3. Make sure the wallet has enough ETH for gas fees

## Step 5: Create PWA Icons (Optional)

Create two PNG files:
- `public/icons/icon-192.png` (192x192)
- `public/icons/icon-512.png` (512x512)

You can use any image editor or online tool. The app will work without these, but they're needed for proper PWA installation.

## Step 6: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎉 You're Ready!

1. Click "Create My Wallet" on the home page
2. The app will automatically:
   - Generate a new wallet
   - Encrypt and store it
   - Request tokens from the faucet
3. Start using your wallet!

## 📱 Install as PWA

### Android:
1. Open in Chrome
2. Menu → "Add to Home Screen"

### iOS:
1. Open in Safari
2. Share → "Add to Home Screen"

## ⚠️ Important Notes

- **Testnet Only**: This is for Base Sepolia testnet, not mainnet
- **No Real Money**: All tokens are test tokens
- **Faucet Rate Limit**: One request per device per 24 hours
- **Backup**: If you clear browser data, the wallet cannot be recovered (for now)

## 🐛 Troubleshooting

**"Faucet not configured"**
- Check that `FAUCET_PK` is set in `.env.local`

**"Token balance error"**
- Verify `NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS` is correct
- Make sure contract is deployed to Base Sepolia

**Service Worker not working**
- Make sure you're accessing via `http://localhost:3000` (not file://)
- Check browser console for errors

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize colors in `tailwind.config.js`
- Add more magic phrases in `lib/wallet/createWallet.ts`
- Deploy to Vercel or your preferred hosting platform

Happy building! ✨


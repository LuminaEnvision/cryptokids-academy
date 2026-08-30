# Manual Wallet Funding Guide

## Option 1: Automated Faucet (Recommended)
The `/api/faucet` endpoint automatically sends:
- 0.005 ETH (for gas fees)

**Requires:**
- `FAUCET_PK` in `.env.local` (private key of funded wallet)
- Funded wallet with Base Sepolia ETH (at least 0.5 ETH recommended)

## Option 2: Manual Funding (No FAUCET_PK needed)

If you don't want to use `FAUCET_PK`, you can manually fund wallets:

### Step 1: Create Wallet in App
When a kid creates their wallet, the app will:
- Create the wallet
- Show the wallet address
- Skip the faucet (it will fail silently if FAUCET_PK is not set)

### Step 2: Manually Send Funds

**For ETH:**
1. Open MetaMask (or your wallet)
2. Switch to Base Sepolia network
3. Send 0.005 ETH (or more) to the new wallet address
4. You can copy the address from the dashboard or setup page

**Note:** MAGIC tokens are not sent automatically. They can be:
- Earned through completing chores
- Received from friends
- Sent manually by parents
- Claimed from daily faucet (if MagicFaucet contract is deployed)

### Step 3: Verify Funds
The kid's dashboard will automatically show the balance once the transactions are confirmed.

## Option 3: Hybrid Approach

You can:
- Use automated faucet for ETH (set `FAUCET_PK`)
- Manually send ETH if faucet is not configured
- MAGIC tokens are earned through gameplay, not sent automatically

The faucet API will gracefully fail if `FAUCET_PK` is not set, so the wallet creation still works.

## Finding Wallet Addresses

After a wallet is created, you can find the address:
1. In the dashboard (top of the page)
2. In the browser's localStorage (developer tools)
3. In the "Receive" page (shows QR code with address)

## Tips

- **Batch Funding**: If you have multiple wallets to fund, you can:
  - Export all addresses
  - Use a script to send ETH to all addresses
  - Use Remix to batch transfer MAGIC tokens

- **Testing**: For testing, you can manually fund just one wallet and test the full flow

- **Production**: For production, you'll want the automated faucet (`FAUCET_PK`) to avoid manual work

## Current Behavior

Right now, if `FAUCET_PK` is not set:
- ✅ Wallet creation still works
- ✅ Wallet is saved to localStorage
- ❌ No automatic ETH funding
- ✅ You can manually send ETH to the wallet after creation
- ℹ️ MAGIC tokens are not sent automatically (earned through gameplay)

The app will show "Faucet not available - wallet created!" in the console with the wallet address, so you can manually fund it.


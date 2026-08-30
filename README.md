# 🎩 Magic Kids Wallet

A **kid-friendly crypto wallet PWA** built for **Base Sepolia testnet**. This wallet automatically creates wallets for kids, provides tokens via a backend faucet, and features a cute, animated UI perfect for learning about crypto!

## ✨ Features

- 🎨 **Kid-Friendly UI**: Soft pastel colors, large buttons, cute icons, and fun animations
- 🔐 **Auto Wallet Creation**: Automatically generates and encrypts wallets on first use
- 💸 **Auto-Faucet**: Backend API automatically sends test tokens to new wallets (no faucet UI needed)
- 📱 **PWA Support**: Install to home screen on mobile devices
- 🪙 **Dual Token Support**: Send and receive both ETH and MagicTokens (ERC20)
- 🎓 **Educational Content**: Built-in learning section explaining crypto concepts
- 🎭 **Animations**: Smooth Framer Motion animations throughout
- 🔒 **Secure**: Private keys encrypted with kid-friendly magic phrases

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A Base Sepolia RPC endpoint (from Alchemy, Infura, or QuickNode)
- A testnet wallet with some Sepolia ETH for the faucet

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC`: Your Base Sepolia RPC URL
- `NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS`: Your deployed MagicToken ERC20 contract address
- `FAUCET_PK`: Private key of a testnet wallet that will fund new users

3. **Deploy MagicToken Contract:**

You need to deploy an ERC20 contract with:
- Name: "Magic Token"
- Symbol: "MAGIC"
- Decimals: 18
- Initial Supply: 1,000,000 MAGIC

Use Remix, Hardhat, or any deployment tool. Make sure to deploy to **Base Sepolia** testnet.

4. **Fund the Faucet Wallet:**

Send some Base Sepolia ETH and MagicTokens to the wallet whose private key you set as `FAUCET_PK`. This wallet will automatically send tokens to new users.

5. **Generate PWA Icons:**

Create two icon files:
- `public/icons/icon-192.png` (192x192)
- `public/icons/icon-512.png` (512x512)

You can use any image editor or online tool. For now, placeholder files are fine.

6. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
magic-kids-wallet/
├── app/
│   ├── _components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── TokenCard.tsx
│   │   ├── TransactionItem.tsx
│   │   └── BigButton.tsx
│   ├── api/
│   │   └── faucet/
│   │       └── route.ts      # Backend faucet API
│   ├── dashboard/            # Main wallet dashboard
│   ├── send/                 # Send tokens page
│   ├── receive/              # Receive tokens (QR code)
│   ├── learn/                # Educational content
│   ├── layout.tsx            # Root layout with PWA setup
│   ├── page.tsx              # Splash/wallet creation
│   └── globals.css           # Global styles
├── lib/
│   ├── wallet/               # Wallet utilities
│   │   ├── createWallet.ts
│   │   ├── encrypt.ts
│   │   ├── decrypt.ts
│   │   ├── sendToken.ts
│   │   └── sendEth.ts
│   └── blockchain/           # Blockchain config
│       ├── client.ts
│       └── config.ts
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icons/                # PWA icons
└── env.example               # Environment template
```

## 🔐 How It Works

### Wallet Creation

1. On first visit, the app generates a new wallet using `viem`
2. The private key is encrypted using AES with a randomly selected "magic phrase" (e.g., "Rainbow Jelly Tiger")
3. Encrypted key and address are stored in `localStorage`
4. The app automatically calls `/api/faucet` to fund the new wallet

### Faucet System

- **No UI**: The faucet runs automatically in the background
- **Rate Limited**: One faucet request per device per 24 hours
- **Sends**:
  - 0.005 Base Sepolia ETH
  - 100 MagicTokens (ERC20)
- **Backend**: Uses the `FAUCET_PK` wallet to send tokens

### Security

- Private keys are **never** sent to the server
- Encryption happens client-side
- All transactions are signed locally
- Testnet only - no real money at risk

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```js
colors: {
  'magic-pink': '#FFE6F2',
  'magic-blue': '#CCF2FF',
  // ... add your colors
}
```

### Icons & Backgrounds

- Replace placeholder emojis with custom SVG icons
- Add background images to `public/` and reference them in components
- Update PWA icons in `public/icons/`

### Magic Phrases

Edit `lib/wallet/createWallet.ts` to add more magic phrases:

```ts
const MAGIC_PHRASES = [
  'Your Custom Phrase',
  // ... more phrases
];
```

## 📱 PWA Installation

### Android

1. Open the app in Chrome
2. Tap the menu (3 dots)
3. Select "Add to Home Screen"
4. The app will appear as an icon on your home screen

### iOS

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear as an icon on your home screen

## 🔧 Troubleshooting

### "Faucet not configured"

Make sure `FAUCET_PK` is set in your `.env.local` file.

### "Token balance error"

- Verify `NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS` is correct
- Ensure the contract is deployed to Base Sepolia
- Check that the contract has the standard ERC20 `balanceOf` function

### "Insufficient funds" when sending

- Make sure the wallet has enough ETH for gas
- Check that token balances are sufficient

### Service Worker not registering

- Make sure you're accessing via `http://localhost:3000` (not file://)
- Check browser console for errors
- Clear browser cache and reload

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Build the project: `npm run build`
- Serve the `out/` directory (if using static export) or run `npm start`

## 📝 Notes

- **Testnet Only**: This wallet is designed for Base Sepolia testnet. Never use real mainnet funds.
- **Educational Purpose**: This is a learning tool. Always supervise kids when using crypto apps.
- **Rate Limiting**: The faucet is rate-limited to prevent abuse. One request per device per day.
- **No Recovery**: If localStorage is cleared, the wallet cannot be recovered. Consider adding backup features for production.

## 🎯 Future Enhancements

- [ ] Wallet backup/restore with seed phrases
- [ ] Transaction history from blockchain
- [ ] More educational content
- [ ] Parent dashboard
- [ ] Spending limits
- [ ] Custom token support
- [ ] NFT display

## 📄 License

MIT License - feel free to use this for educational purposes!

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [Viem](https://viem.sh/)
- [Framer Motion](https://www.framer.com/motion/)
- [TailwindCSS](https://tailwindcss.com/)

---

**Made with ✨ for kids learning about crypto!**


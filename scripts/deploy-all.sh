#!/bin/bash

# Deploy All Contracts to Base Sepolia
# This script helps deploy MagicToken, MagicStaking, and optionally MagicFaucet

set -e

echo "🚀 KiddoPay Contract Deployment Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found!${NC}"
    echo "Please create .env.local with your configuration."
    exit 1
fi

echo -e "${YELLOW}⚠️  This script uses Remix IDE for deployment.${NC}"
echo "For Hardhat/Foundry deployment, see DEPLOYMENT.md"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

echo ""
echo "📋 Deployment Steps:"
echo "==================="
echo ""
echo "1. Go to https://remix.ethereum.org/"
echo "2. Create a new workspace"
echo "3. Install OpenZeppelin contracts:"
echo "   - File Explorer → Create New File"
echo "   - Name: @openzeppelin/contracts/token/ERC20/ERC20.sol"
echo "   - Copy ERC20.sol from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol"
echo ""
echo "4. Create these files in Remix:"
echo "   - contracts/MagicToken.sol"
echo "   - contracts/MagicStaking.sol"
echo "   - contracts/MagicFaucet.sol (optional)"
echo ""
echo "5. Copy contract code from:"
echo "   - contracts/MagicToken.sol"
echo "   - contracts/MagicStaking.sol"
echo "   - contracts/MagicFaucet.sol (optional)"
echo ""
echo "6. Compile with Solidity 0.8.20+"
echo ""
echo "7. Connect MetaMask to Base Sepolia"
echo ""
echo "8. Deploy in this order:"
echo ""
echo -e "${GREEN}Step 1: Deploy MagicToken${NC}"
echo "   - No constructor parameters"
echo "   - Copy the deployed address"
echo ""
echo -e "${GREEN}Step 2: Deploy MagicStaking${NC}"
echo "   - Constructor parameter: MagicToken address (from Step 1)"
echo "   - Copy the deployed address"
echo ""
echo -e "${YELLOW}Step 3: Deploy MagicFaucet (OPTIONAL)${NC}"
echo "   - Constructor parameter: MagicToken address (from Step 1)"
echo "   - Copy the deployed address"
echo ""
echo "9. Update .env.local with the addresses:"
echo "   NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS=0x..."
echo "   NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0x..."
echo "   NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x... (optional)"
echo ""
echo "10. Fund the staking contract reward pool:"
echo "    - Transfer MAGIC tokens to the staking contract"
echo "    - Or call depositRewardPool(amount) as owner"
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"


/**
 * Hardhat Deployment Script
 * Deploys all contracts to Base Sepolia
 * 
 * Usage:
 * 1. Install dependencies: npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
 * 2. Install OpenZeppelin: npm install @openzeppelin/contracts
 * 3. Setup hardhat.config.js (see below)
 * 4. Run: npx hardhat run scripts/deploy-hardhat.js --network baseSepolia
 */

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying KiddoPay Contracts to Base Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString(), "wei\n");

  // Step 1: Deploy MagicToken
  console.log("📝 Step 1: Deploying MagicToken...");
  const MagicToken = await hre.ethers.getContractFactory("MagicToken");
  const magicToken = await MagicToken.deploy();
  await magicToken.waitForDeployment();
  const magicTokenAddress = await magicToken.getAddress();
  console.log("✅ MagicToken deployed to:", magicTokenAddress);
  console.log("   Total supply:", (await magicToken.totalSupply()).toString(), "MAGIC\n");

  // Step 2: Deploy MagicStaking
  console.log("📝 Step 2: Deploying MagicStaking...");
  const MagicStaking = await hre.ethers.getContractFactory("MagicStaking");
  const magicStaking = await MagicStaking.deploy(magicTokenAddress);
  await magicStaking.waitForDeployment();
  const stakingAddress = await magicStaking.getAddress();
  console.log("✅ MagicStaking deployed to:", stakingAddress);
  console.log("   MagicToken address:", await magicStaking.magicToken(), "\n");

  // Step 3: Deploy MagicFaucet (Optional)
  console.log("📝 Step 3: Deploying MagicFaucet (optional)...");
  const MagicFaucet = await hre.ethers.getContractFactory("MagicFaucet");
  const magicFaucet = await MagicFaucet.deploy(magicTokenAddress);
  await magicFaucet.waitForDeployment();
  const faucetAddress = await magicFaucet.getAddress();
  console.log("✅ MagicFaucet deployed to:", faucetAddress, "\n");

  // Summary
  console.log("=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("MagicToken Address:", magicTokenAddress);
  console.log("MagicStaking Address:", stakingAddress);
  console.log("MagicFaucet Address:", faucetAddress);
  console.log("\n📝 Update your .env.local file:");
  console.log(`NEXT_PUBLIC_MAGIC_TOKEN_ADDRESS=${magicTokenAddress}`);
  console.log(`NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=${stakingAddress}`);
  console.log(`NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=${faucetAddress}`);
  console.log("\n💰 Next Steps:");
  console.log("1. Fund the staking reward pool:");
  console.log(`   - Transfer MAGIC tokens to: ${stakingAddress}`);
  console.log(`   - Or call: magicStaking.depositRewardPool(amount)`);
  console.log("2. Fund the faucet (if using):");
  console.log(`   - Transfer MAGIC tokens and ETH to: ${faucetAddress}`);
  console.log("3. Restart your dev server to load new addresses");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


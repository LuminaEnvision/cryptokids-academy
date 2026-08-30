// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MagicFaucet
 * @notice A kid-friendly daily faucet that distributes MAGIC tokens and ETH for gas
 * @dev Kids can claim once per day: 100 MAGIC tokens + 0.001 ETH for gas
 */
contract MagicFaucet is Ownable, ReentrancyGuard {
    IERC20 public magicToken;
    
    // Daily claim amounts
    uint256 public constant MAGIC_AMOUNT = 100 * 10**18; // 100 MAGIC tokens
    uint256 public constant ETH_AMOUNT = 0.001 * 10**18; // 0.001 ETH for gas
    
    // Track last claim time per address
    mapping(address => uint256) public lastClaimTime;
    
    // 24 hours in seconds
    uint256 public constant CLAIM_COOLDOWN = 24 * 60 * 60;
    
    // Events
    event Claimed(address indexed user, uint256 magicAmount, uint256 ethAmount);
    event FundsDeposited(address indexed depositor, uint256 magicAmount, uint256 ethAmount);
    
    constructor(address _magicTokenAddress) Ownable(msg.sender) {
        magicToken = IERC20(_magicTokenAddress);
    }
    
    /**
     * @notice Claim daily MAGIC tokens and ETH for gas
     * @dev Can only claim once per 24 hours
     */
    function claimDaily() external nonReentrant {
        require(canClaim(msg.sender), "MagicFaucet: Already claimed today! Come back tomorrow! 🍀");
        
        // Check contract has enough balance
        require(
            magicToken.balanceOf(address(this)) >= MAGIC_AMOUNT,
            "MagicFaucet: Not enough MAGIC in the pot! The leprechaun needs to refill it! 🍀"
        );
        require(
            address(this).balance >= ETH_AMOUNT,
            "MagicFaucet: Not enough ETH in the pot! The leprechaun needs to refill it! 🍀"
        );
        
        // Update last claim time
        lastClaimTime[msg.sender] = block.timestamp;
        
        // Transfer MAGIC tokens
        require(
            magicToken.transfer(msg.sender, MAGIC_AMOUNT),
            "MagicFaucet: MAGIC transfer failed"
        );
        
        // Transfer ETH for gas
        (bool sent, ) = payable(msg.sender).call{value: ETH_AMOUNT}("");
        require(sent, "MagicFaucet: ETH transfer failed");
        
        emit Claimed(msg.sender, MAGIC_AMOUNT, ETH_AMOUNT);
    }
    
    /**
     * @notice Check if an address can claim
     * @param user The address to check
     * @return true if user can claim, false otherwise
     */
    function canClaim(address user) public view returns (bool) {
        if (lastClaimTime[user] == 0) {
            return true; // Never claimed before
        }
        return block.timestamp >= lastClaimTime[user] + CLAIM_COOLDOWN;
    }
    
    /**
     * @notice Get time until next claim is available
     * @param user The address to check
     * @return seconds until next claim, 0 if can claim now
     */
    function timeUntilNextClaim(address user) external view returns (uint256) {
        if (canClaim(user)) {
            return 0;
        }
        uint256 nextClaimTime = lastClaimTime[user] + CLAIM_COOLDOWN;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @notice Owner can deposit funds to refill the faucet
     * @param magicAmount Amount of MAGIC tokens to deposit
     */
    function depositFunds(uint256 magicAmount) external payable onlyOwner {
        require(
            magicToken.transferFrom(msg.sender, address(this), magicAmount),
            "MagicFaucet: MAGIC deposit failed"
        );
        emit FundsDeposited(msg.sender, magicAmount, msg.value);
    }
    
    /**
     * @notice Owner can withdraw excess funds (emergency only)
     */
    function withdrawFunds(uint256 magicAmount, uint256 ethAmount) external onlyOwner {
        if (magicAmount > 0) {
            require(
                magicToken.transfer(owner(), magicAmount),
                "MagicFaucet: MAGIC withdrawal failed"
            );
        }
        if (ethAmount > 0) {
            (bool sent, ) = payable(owner()).call{value: ethAmount}("");
            require(sent, "MagicFaucet: ETH withdrawal failed");
        }
    }
    
    /**
     * @notice Get contract balances
     */
    function getBalances() external view returns (uint256 magicBalance, uint256 ethBalance) {
        return (magicToken.balanceOf(address(this)), address(this).balance);
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}


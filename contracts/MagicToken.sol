// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MagicToken
 * @notice A kid-friendly ERC20 token for the Magic Kids Wallet
 */
contract MagicToken is ERC20 {
    constructor() ERC20("Magic Token", "MAGIC") {
        // Mint 1,000,000 MAGIC tokens to the deployer
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }
}


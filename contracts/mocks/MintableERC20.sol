// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MintableERC20
 * @dev ERC20 minting logic
 */
contract MintableERC20 is ERC20 {
  constructor(
    string memory name,
    string memory symbol
  ) ERC20(name, symbol) {}

  /**
   * @dev Function to mint tokens
   * @param value The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(uint256 value) public returns (bool) {
    _mint(_msgSender(), value);
    return true;
  }
}
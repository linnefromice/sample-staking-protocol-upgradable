// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ExampleToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
  uint256 public contractVersion;
  uint256 public upgradedVersion;

  function initialize() public initializer {
    console.log("ExampleToken#initialize");
    __ERC20_init("Example Token", "TOKEN");
    contractVersion = 1;
    upgradedVersion = 1;
  }
}
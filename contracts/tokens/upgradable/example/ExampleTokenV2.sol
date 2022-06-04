// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ExampleTokenV2 is Initializable, ERC20Upgradeable, OwnableUpgradeable {
  uint256 public contractVersion;
  uint256 public upgradedVersion;

  /// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

  // for test
  function initialize() external initializer {
    contractVersion = 0;
  }

  // for test
  function initializeV2() external reinitializer(2) {
    contractVersion = 0;
  }
  
  function upgradeNextVersion() external reinitializer(2) {
    require(upgradedVersion < 2, "Already upgraded");
    console.log("ExampleTokenV2#upgradeNextVersion");
    contractVersion = 2;
    upgradedVersion = 2;
  }

  function upgradeNextVersionWithUpgradeable() external reinitializer(2) {
    require(upgradedVersion < 2, "Already upgraded");
    console.log("ExampleTokenV2#upgradeNextVersionWithUpgradeable");
    __ERC20_init("Example Token V2", "TOKENV2");
    contractVersion = 2;
    upgradedVersion = 2;
  }
}

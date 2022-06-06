// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ExampleTokenV3 is Initializable, ERC20Upgradeable, OwnableUpgradeable {
  uint256 public contractVersion;
  uint256 public upgradedVersion;

  /// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

  function upgradeNextVersionWithUpgradeable() external reinitializer(3) {
    require(upgradedVersion < 3, "Already upgraded");
    console.log("ExampleTokenV3#upgradeNextVersionWithUpgradeable");
    __ERC20_init("Example Token V3", "TOKENV3");
    contractVersion = 3;
    upgradedVersion = 3;
  }
}

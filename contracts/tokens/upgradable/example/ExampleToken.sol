// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ExampleToken is ERC20Upgradeable, OwnableUpgradeable {
  string public version;

  function initialize(
    string memory _version,
    string memory _name,
    string memory _symbol
  ) public initializer {
    version = _version;
    __ERC20_init(_name, _symbol);
  }
}
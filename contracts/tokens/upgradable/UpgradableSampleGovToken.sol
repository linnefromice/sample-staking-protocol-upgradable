// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UpgradableSampleGovToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
  mapping(address => bool) public minterList;

  function initialize() public initializer {
    __ERC20_init("Sample Governance Token", "SAMPLEGOVTOKEN");
  }

  function addMinter(address _minter) external onlyOwner {
    minterList[_minter] = true;
  }

  function removeMinter(address _minter) external onlyOwner {
    minterList[_minter] = false;
  }

  function mint(address _to, uint256 _amount) public returns (bool) {
    require(minterList[msg.sender], "Only minter");
    _mint(_to, _amount);
    return true;
  }

  function mint(uint256 _amount) external returns (bool) {
    _mint(msg.sender, _amount);
    return true;
  }
}
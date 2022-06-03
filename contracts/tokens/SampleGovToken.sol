// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleGovToken is ERC20, Ownable {

  constructor() ERC20(
    "Sample Governance Token",
    "SAMPLEGOVTOKEN"
  ) {}

  mapping(address => bool) public minterList;

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
// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleVeToken is ERC20, Ownable {
  address public operator;

  constructor(
    address _operator
  ) ERC20(
    "Sample Vote Escrow Token",
    "SAMPLEveTOKEN"
  ) {
    operator = _operator;
  }

  function setOperator(address _operator) external onlyOwner {
    operator = _operator;
  }

  function mint(address _to, uint256 _amount) public returns (bool) {
    require(msg.sender == operator, "Only operator");
    _mint(_to, _amount);
    return true;
  }

  function mint(uint256 _amount) external returns (bool) {
    _mint(msg.sender, _amount);
    return true;
  }
}
// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UpgradableSampleVeToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
  address public operator;

  function initialize(address _operator) public initializer {
    __ERC20_init("Sample Vote Escrow Token", "SAMPLEveTOKEN");
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

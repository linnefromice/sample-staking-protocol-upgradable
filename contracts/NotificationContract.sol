// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract NotificationContract is Ownable {
  event ResetPool();
  event ResetStakingPool();

  function notifyResetPool() external onlyOwner {
    emit ResetPool();
  }

  function notifyResetStakingPool() external onlyOwner {
    emit ResetStakingPool();
  }
}
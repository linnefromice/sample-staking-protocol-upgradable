// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

interface IMintableERC20 {
  function mint(uint256) external returns (bool);
}

contract Pool is Initializable, OwnableUpgradeable {
  using SafeMathUpgradeable for uint256;
  using SafeERC20Upgradeable for IERC20Upgradeable;

  IERC20Upgradeable public token;
  IERC20Upgradeable public rewardToken;
  uint256 public maxSupply;
  uint256 public _totalSupply;
  mapping(address => uint256) private _balances;

  event Deposited(address indexed user, uint256 amount);
  event Withdrawed(address indexed user, uint256 amount);

  function initialize(
    address _token,
    address _rewardToken
  ) initializer public {
    token = IERC20Upgradeable(_token);
    rewardToken = IERC20Upgradeable(_rewardToken);
    
    // premint rewardToken
    maxSupply = 1 * 1000000 * 1e18; // 1 million;
    IMintableERC20(_rewardToken).mint(maxSupply);
  }

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }
  function balanceOf(address _account) public view returns (uint256) {
    return _balances[_account];
  }

  function deposit(uint256 _amount) public returns (bool) {
    require(_amount > 0, "amount is positive number");
    _totalSupply = _totalSupply.add(_amount);
    _balances[msg.sender] = _balances[msg.sender].add(_amount);

    token.safeTransferFrom(msg.sender, address(this), _amount);
    
    rewardToken.safeApprove(msg.sender, 0);
    rewardToken.safeApprove(msg.sender, _amount);
    rewardToken.safeTransfer(msg.sender, _amount);

    emit Deposited(msg.sender, _amount);
    return true;
  }

  function withdraw(uint256 _amount) public returns (bool) {
    require(_amount < _balances[msg.sender] && _amount > 0, "amount is sender's balance or less");
    _totalSupply = _totalSupply.sub(_amount);
    _balances[msg.sender] = _balances[msg.sender].sub(_amount);

    rewardToken.safeTransferFrom(msg.sender, address(this), _amount);

    token.safeApprove(msg.sender, 0);
    token.safeApprove(msg.sender, _amount);
    token.safeTransfer(msg.sender, _amount);

    emit Withdrawed(msg.sender, _amount);
    return true;
  }
}
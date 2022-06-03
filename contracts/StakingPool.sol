// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMintableERC20 {
  function mint(uint256) external returns (bool);
}

contract StakingPool is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  IERC20 public token;
  IERC20 public rewardToken;
  uint256 public maxSupply = 1 * 1000000 * 1e18; // 1 million;
  uint256 public _totalSupply;
  mapping(address => uint256) private _balances;

  event Staked(address indexed user, uint256 amount);
  event Unstaked(address indexed user, uint256 amount);

  constructor(
    address _token,
    address _rewardToken
  ) {
    token = IERC20(_token);
    rewardToken = IERC20(_rewardToken);
    
    // premint rewardToken
    IMintableERC20(_rewardToken).mint(maxSupply);
  }

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }
  function balanceOf(address _account) public view returns (uint256) {
    return _balances[_account];
  }

  function stake(uint256 _amount) public returns (bool) {
    require(_amount > 0, "amount is positive number");
    _totalSupply = _totalSupply.add(_amount);
    _balances[msg.sender] = _balances[msg.sender].add(_amount);

    token.safeTransferFrom(msg.sender, address(this), _amount);
    
    rewardToken.safeApprove(msg.sender, 0);
    rewardToken.safeApprove(msg.sender, _amount);
    rewardToken.safeTransfer(msg.sender, _amount);

    emit Staked(msg.sender, _amount);
    return true;
  }

  function unstake(uint256 _amount) public returns (bool) {
    require(_amount < _balances[msg.sender] && _amount > 0, "amount is sender's balance or less");
    _totalSupply = _totalSupply.sub(_amount);
    _balances[msg.sender] = _balances[msg.sender].sub(_amount);

    rewardToken.safeTransferFrom(msg.sender, address(this), _amount);

    token.safeApprove(msg.sender, 0);
    token.safeApprove(msg.sender, _amount);
    token.safeTransfer(msg.sender, _amount);

    emit Unstaked(msg.sender, _amount);
    return true;
  }
}
pragma solidity 0.6.12;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./XStableGovernanceToken.sol";


// XSGTReward is the master of XSGT. He can make XSGT and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once XSGT is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract XSGTReward is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of XSGTs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accXSGTPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accXSGTPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 lpTokenAmount;
        uint256 allocPoint;       // How many allocation points assigned to this pool. XSGTs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that XSGTs distribution occurs.
        uint256 accXSGTPerShare; // Accumulated XSGTs per share, times 1e12. See below.
    }

    // The XSGT TOKEN!
    XStableGovernanceToken public xsgt;
    // The XSDT TOKEN!
    IERC20 public xsdt;
    // Dev address.
    address public devaddr;
    // Block number when bonus XSGT period ends.
    uint256 public bonusEndBlock;
    // XSGT tokens created per block.
    uint256 public xsgtPerBlock;
    // Bonus muliplier for early xsgt makers.
    uint256 public constant BONUS_MULTIPLIER = 10;
    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when XSGT mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor(
        IERC20 _xsdt,
        XStableGovernanceToken _xsgt,
        address _devaddr,
        uint256 _xsgtPerBlock,
        uint256 _startBlock,
        uint256 _bonusEndBlock
    ) public {
        xsdt = _xsdt;
        xsgt = _xsgt;
        devaddr = _devaddr;
        xsgtPerBlock = _xsgtPerBlock;
        bonusEndBlock = _bonusEndBlock;
        startBlock = _startBlock;
    }

    function setXSDTAddress(IERC20 _xsdt) public onlyOwner {
        xsdt = _xsdt;
    }

    function setXSGTAddress(XStableGovernanceToken _xsgt) public onlyOwner {
        xsgt = _xsgt;
    }

    function setBonusPerBlock(uint256 _xsgtPerBlock) public onlyOwner {
        xsgtPerBlock = _xsgtPerBlock;
    }

    function setBonusStartBlock(uint256 _startBlock) public onlyOwner {
        startBlock = _startBlock;
    }

    function setBonusEndBlock(uint256 _bonusEndBlock) public onlyOwner {
        bonusEndBlock = _bonusEndBlock;
    }

    function setDevAddr(address _devaddr) public onlyOwner {
        devaddr = _devaddr;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(uint256 _allocPoint, IERC20 _lpToken, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            lpTokenAmount: 0,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accXSGTPerShare: 0
        }));
    }

    // Update the given pool's XSGT allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        if (_to <= bonusEndBlock) {
            return _to.sub(_from).mul(BONUS_MULTIPLIER);
        } else if (_from >= bonusEndBlock) {
            return _to.sub(_from);
        } else {
            return bonusEndBlock.sub(_from).mul(BONUS_MULTIPLIER).add(
                _to.sub(bonusEndBlock)
            );
        }
    }

    // View function to see pending XSGTs on frontend.
    function pendingReward(address _user) external view returns (uint256) {
        uint256 _pid = 0;
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accXSGTPerShare = pool.accXSGTPerShare;
        // uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        uint256 lpSupply = pool.lpTokenAmount;
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 xsgtReward = multiplier.mul(xsgtPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accXSGTPerShare = accXSGTPerShare.add(xsgtReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(accXSGTPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward vairables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        // uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        uint256 lpSupply = pool.lpTokenAmount;
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 xsgtReward = multiplier.mul(xsgtPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        xsgt.mint(devaddr, xsgtReward.div(10));
        xsgt.mint(address(this), xsgtReward);
        pool.accXSGTPerShare = pool.accXSGTPerShare.add(xsgtReward.mul(1e12).div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to XSGTReward for XSGT allocation.
    function deposit(address _account, uint256 _amount) public onlyXSDT {
        uint256 _pid = 0;
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_account];
        // we do not need to transfer the real XSDT
        // pool.lpToken.safeTransferFrom(address(_account), address(this), _amount);
        pool.lpTokenAmount = pool.lpTokenAmount.add(_amount);
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accXSGTPerShare).div(1e12).sub(user.rewardDebt);
            safeXSGTTransfer(_account, pending);
        }
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accXSGTPerShare).div(1e12);
        emit Deposit(_account, _pid, _amount);
    }

    // Withdraw LP tokens from XSGTReward.
    function withdraw() public {
        uint256 _pid = 0;
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accXSGTPerShare).div(1e12).sub(user.rewardDebt);
        safeXSGTTransfer(msg.sender, pending);
        // user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accXSGTPerShare).div(1e12);
        // pool.lpToken.safeTransfer(address(msg.sender), _amount);
        // pool.lpTokenAmount = pool.lpTokenAmount.sub(_amount);
        emit Withdraw(msg.sender, _pid, pending);
    }

    // Withdraw LP tokens from XSGTReward.
    function burn(address _account, uint256 _amount) public onlyXSDT {
        uint256 _pid = 0;
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_account];
        require(user.amount >= _amount, "burn: not good");
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accXSGTPerShare).div(1e12).sub(user.rewardDebt);
        safeXSGTTransfer(_account, pending);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accXSGTPerShare).div(1e12);
        // pool.lpToken.safeTransfer(address(_account), _amount);
        pool.lpTokenAmount = pool.lpTokenAmount.sub(_amount);
        emit Withdraw(_account, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public onlyXSDT {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        // pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        pool.lpTokenAmount = 0;
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe xsgt transfer function, just in case if rounding error causes pool to not have enough XSGTs.
    function safeXSGTTransfer(address _to, uint256 _amount) internal {
        uint256 xsgtBal = xsgt.balanceOf(address(this));
        if (_amount > xsgtBal) {
            xsgt.transfer(_to, xsgtBal);
        } else {
            xsgt.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }

    modifier onlyXSDT {
        require(msg.sender == address(xsdt));
        _;
    }
}
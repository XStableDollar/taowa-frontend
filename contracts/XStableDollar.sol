// SPDX-License-Identifier: SimPL-2.0
pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";

/// @title
/// @author
/// @notice
contract XStableDollar {
    using SafeMath for uint256;

    // 每一块格子信息
    struct GridInfo {
        uint256 rank;       // 格子等级
        uint256 nftTokenId; // 游戏道具nft资产TokenId
        address nftOwner;   // nft资产拥有者
    }

    // 赛季信息
    struct VersionInfo {
        uint256 roadFee;           // 过路费
        uint256 basePrice;         // 一级房子价格
        uint256 gridSize;          // 栅格数量
        GridInfo[] gridInfos;      // 本赛季的所有栅格，数组index为格子编号
        uint256 timeOutBlockSize;  // 过去多少区块执行结算
        uint256 recentBlockNumber; // 最后一次交易的区块编号，用户结算倒计时
        bool close;                // 赛季是否结束，true 已结束，false 未结束
    }

    uint256 public constant DIV_RATE = 10000;
    // 土地等级增长系数：万分之11000
    uint256 public constant GROW_MULTIPLIER = 11000;
    // 奖池收取比例：万2000
    uint256 public constant POOL_RATE = 2000;
    // 奖池收取比例：万50
    uint256 public constant DEV_RATE = 50;
    // 总奖池
    uint256 public poolTotalFee;
    uint256 public devTotalFee;
    // 当前游戏赛季
    uint256 public currentVersion;

    // 开发者地址
    address public devAddress;

    // 所有的赛季信息
    mapping(uint256 => VersionInfo) public allVersion;

    // 事件1
    event PayHouse(address indexed user, uint256 indexed gridId, uint256 paid, uint256 remain);
    // 事件2
    event Pass(address indexed user, uint256 indexed gridId, uint256 paid, uint256 remain);

    constructor(address _devAddress) public {
        devAddress = _devAddress;
        currentVersion = 0;
        poolTotalFee = 0;
        devTotalFee = 0;
    }

    // 跳到自己的地，不做处理退还所有资金
    function fly() public payable {
        // 校验支付的金额至少大于一级地
        VersionInfo storage version = allVersion[currentVersion];
        require(version.basePrice <= msg.value, 'Game: EXCESSIVE_INPUT_AMOUNT');

        uint256 rand = genRandNumber();
        uint256 index = rand.mod(version.gridSize);

        address gridOwner;

        if (index <= 20) {
            // 支付
            uint256 paid = 1;
            uint256 remain = msg.value.sub(paid);

            emit PayHouse(msg.sender, index, paid, remain);
        } else {
            // 过路
            uint256 paid = version.roadFee;
            uint256 remain = msg.value.sub(paid);
            uint256 poolFee = paid.mul(POOL_RATE).div(DIV_RATE);
            uint256 devFee = paid.mul(DEV_RATE).div(DIV_RATE);
            uint256 gridOwnerFee = paid.sub(poolFee.add(devFee));

            poolTotalFee = poolTotalFee.add(poolFee);
            devTotalFee = devTotalFee.add(devFee);
            // 给原来土地owner
            address(uint160(gridOwner)).transfer(gridOwnerFee);
            msg.sender.transfer(remain);
            emit Pass(msg.sender, index, paid, remain);
        }
    }

    function genRandNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.number, block.difficulty)));
    }
}

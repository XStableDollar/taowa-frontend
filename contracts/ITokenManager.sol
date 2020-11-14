// SPDX-License-Identifier: SimPL-2.0
pragma solidity 0.6.12;

import { TokenStructs } from "./TokenStructs.sol";

// ITokenManager
interface ITokenManager is TokenStructs {

    // 创建一个自定义代码
    function create(string memory name, string memory symbol) external;

    // 多个ERC20代币合成一个自定义代币
    function mintMulti(address erc20Addr, address[] calldata _preToken, uint256[] calldata _bassetAmount, bool[] calldata _isTransferFee, address receipt) external returns (uint256 massetMinted);

    // 一个自定义代币赎回对应的多个ERC20
    function redeem(address _targetAsset, uint256 _bassetAmount) external returns (uint256 massetRedeemed);
}

// SPDX-License-Identifier: SimPL-2.0
pragma solidity 0.6.12;

import { IProxy } from "./IProxy.sol";
import { ITokenManager } from "./ITokenManager.sol";
import { IDataManager } from "./IDataManager.sol";
import { TokenStructs } from "./TokenStructs.sol";

/// Token服务合约
contract Proxy {
    // ITokenManager public tokenManager;
    // IDataManager public dataManager;

    // constructor (ITokenManager _tokenManager, IDataManager _dataManager) public {
    //     tokenManager = _tokenManager;        
    //     dataManager = _dataManager;        
    // }

    // function setTokenManager(IDataManager _dataManager) public {
    //     dataManager = _dataManager;        
    // }

    // function setTokenManager(IDataManager _dataManager) public {
    //     dataManager = _dataManager;        
    // }

    // // get token list
    // function tokenList() view public returns (TokenStructs.CustomAsset[]) {
    //     return IDataManager(dataManager).tokenList;
    // }

    // // create: 创建合成代币
    // // function create(string memory name, string memory symbol) external returns (address);
    // function create(string memory name, string memory symbol) external returns (address) {
    //     return ITokenManager.create(name, symbol);
    // }

    // // mintMulti: 多个ERC20代币合成一个自定义代币
    // // function mintMulti(address[] calldata _preToken, uint256[] calldata _bassetAmount) external returns (uint256 massetMinted);
    // function mintMulti(address[] calldata _preToken, uint256[] calldata _bassetAmount) external returns (uint256 massetMinted) {
    //     return ITokenManager.mintMulti(_preToken, _bassetAmount);
    // }

    // // redeem: 一个自定义代币赎回对应的多个ERC20
    // // function redeem(address _targetAsset, uint256 _bassetAmount) external returns (uint256 massetRedeemed);
    // function redeem(address _targetAsset, uint256 _bassetAmount) external returns (uint256 massetRedeemed) {
    //     return ITokenManager.redeem(_targetAsset, _bassetAmount);
    // }
}


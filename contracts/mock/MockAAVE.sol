// SPDX-License-Identifier: SimPL-2.0
pragma solidity 0.6.12;

contract MockAAVE{
    function deposit(
        address _bAsset,
        uint256 quantityTransferred,
        bool _erc20TransferFeeCharged
    ) public  returns (uint256){
        return quantityTransferred;
    }

    function withdraw(address _recipient, address bAsset, uint256 q, bool isFeeCharged) public {
        // , bAsset, q, _bAssets[i].isTransferFeeCharged
    }
}
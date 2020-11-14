// SPDX-License-Identifier: SimPL-2.0
pragma solidity 0.6.12;

import { IBasicToken } from "./IBasicToken.sol";

library CommonHelpers {

    /**
     * Fetch the `decimals()` from an ERC20 token
     * Grabs the `decimals()` from a contract and fails if
     *      the decimal value does not live within a certain range
     * _token Address of the ERC20 token
     * uint256 Decimals of the ERC20 token
     */
    function getDecimals(address _token) internal view returns (uint256) {
        uint256 decimals = IBasicToken(_token).decimals();
        require(decimals >= 4 && decimals <= 18, "Token must have sufficient decimal places");
        return decimals;
    }

}
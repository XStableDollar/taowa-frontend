// SPDX-License-Identifier: SimPL-2.0
pragma solidity 0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title  InitializableToken
 * @author 
 * @dev    Basic ERC20Detailed Token functionality for Masset
 */
contract InitializableToken is ERC20 {
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) public {
    }
}
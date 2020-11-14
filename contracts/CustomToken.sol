// SPDX-License-Identifier: SimPL-2.0
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20 {
    constructor (string memory name, string memory symbol) public ERC20(name, symbol) {
    }
}
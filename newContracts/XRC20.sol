//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XRC20 is ERC20 {
    constructor(uint256 initialSupply) ERC20("XDSea Token", "XDST") {
        _mint(msg.sender, initialSupply);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
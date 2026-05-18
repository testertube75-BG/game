// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BCGSToken is ERC20, ERC20Permit, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(address treasury, uint256 initialSupply) ERC20("BCGS Token", "BCGS") ERC20Permit("BCGS Token") {
        _grantRole(DEFAULT_ADMIN_ROLE, treasury);
        _grantRole(MINTER_ROLE, treasury);
        _mint(treasury, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}

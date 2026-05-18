// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GameEscrow is AccessControl, ReentrancyGuard {
    bytes32 public constant SETTLER_ROLE = keccak256("SETTLER_ROLE");

    enum Status {
        Open,
        Settled,
        Refunded
    }

    struct Escrow {
        IERC20 token;
        Status status;
        uint256 total;
        mapping(address => uint256) deposits;
    }

    mapping(bytes32 => Escrow) private escrows;

    event Deposited(bytes32 indexed roomId, address indexed player, address indexed token, uint256 amount);
    event Settled(bytes32 indexed roomId, address indexed winner, uint256 amount);
    event Refunded(bytes32 indexed roomId, address indexed player, uint256 amount);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SETTLER_ROLE, admin);
    }

    function deposit(bytes32 roomId, IERC20 token, uint256 amount) external nonReentrant {
        Escrow storage e = escrows[roomId];
        require(e.status == Status.Open, "escrow closed");
        require(address(e.token) == address(0) || address(e.token) == address(token), "token mismatch");
        e.token = token;
        e.deposits[msg.sender] += amount;
        e.total += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "deposit failed");
        emit Deposited(roomId, msg.sender, address(token), amount);
    }

    function settle(bytes32 roomId, address winner) external onlyRole(SETTLER_ROLE) nonReentrant {
        Escrow storage e = escrows[roomId];
        require(e.status == Status.Open, "escrow closed");
        uint256 amount = e.total;
        e.status = Status.Settled;
        e.total = 0;
        require(e.token.transfer(winner, amount), "settlement failed");
        emit Settled(roomId, winner, amount);
    }

    function refund(bytes32 roomId, address[] calldata players) external onlyRole(SETTLER_ROLE) nonReentrant {
        Escrow storage e = escrows[roomId];
        require(e.status == Status.Open, "escrow closed");
        e.status = Status.Refunded;
        for (uint256 i = 0; i < players.length; i++) {
            uint256 amount = e.deposits[players[i]];
            if (amount == 0) continue;
            e.deposits[players[i]] = 0;
            e.total -= amount;
            require(e.token.transfer(players[i], amount), "refund failed");
            emit Refunded(roomId, players[i], amount);
        }
    }
}

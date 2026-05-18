// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TournamentRewards is AccessControl, ReentrancyGuard {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct Tournament {
        IERC20 token;
        uint256 pool;
        bool finalized;
        mapping(address => uint256) rewards;
        mapping(address => bool) claimed;
    }

    mapping(bytes32 => Tournament) private tournaments;

    event Funded(bytes32 indexed tournamentId, address indexed token, uint256 amount);
    event Finalized(bytes32 indexed tournamentId);
    event Claimed(bytes32 indexed tournamentId, address indexed player, uint256 amount);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    function fund(bytes32 tournamentId, IERC20 token, uint256 amount) external nonReentrant {
        Tournament storage t = tournaments[tournamentId];
        require(address(t.token) == address(0) || address(t.token) == address(token), "token mismatch");
        t.token = token;
        t.pool += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "fund transfer failed");
        emit Funded(tournamentId, address(token), amount);
    }

    function finalizeRewards(bytes32 tournamentId, address[] calldata players, uint256[] calldata amounts) external onlyRole(OPERATOR_ROLE) {
        require(players.length == amounts.length, "length mismatch");
        Tournament storage t = tournaments[tournamentId];
        require(!t.finalized, "already finalized");

        uint256 total;
        for (uint256 i = 0; i < players.length; i++) {
            t.rewards[players[i]] = amounts[i];
            total += amounts[i];
        }
        require(total <= t.pool, "insufficient pool");
        t.finalized = true;
        emit Finalized(tournamentId);
    }

    function claim(bytes32 tournamentId) external nonReentrant {
        Tournament storage t = tournaments[tournamentId];
        require(t.finalized, "not finalized");
        require(!t.claimed[msg.sender], "already claimed");
        uint256 amount = t.rewards[msg.sender];
        require(amount > 0, "no reward");

        t.claimed[msg.sender] = true;
        require(t.token.transfer(msg.sender, amount), "reward transfer failed");
        emit Claimed(tournamentId, msg.sender, amount);
    }

    function rewardOf(bytes32 tournamentId, address player) external view returns (uint256) {
        return tournaments[tournamentId].rewards[player];
    }
}

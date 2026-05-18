// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TreasuryMultisig is ReentrancyGuard {
    struct Transaction {
        address target;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }

    mapping(address => bool) public isOwner;
    mapping(uint256 => mapping(address => bool)) public confirmedBy;
    Transaction[] public transactions;
    uint256 public immutable threshold;

    event Submitted(uint256 indexed txId, address indexed target, uint256 value);
    event Confirmed(uint256 indexed txId, address indexed owner);
    event Executed(uint256 indexed txId);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    constructor(address[] memory owners, uint256 requiredConfirmations) {
        require(owners.length >= requiredConfirmations && requiredConfirmations > 0, "bad threshold");
        threshold = requiredConfirmations;
        for (uint256 i = 0; i < owners.length; i++) {
            require(owners[i] != address(0), "zero owner");
            require(!isOwner[owners[i]], "duplicate owner");
            isOwner[owners[i]] = true;
        }
    }

    receive() external payable {}

    function submit(address target, uint256 value, bytes calldata data) external onlyOwner returns (uint256 txId) {
        txId = transactions.length;
        transactions.push(Transaction({target: target, value: value, data: data, executed: false, confirmations: 0}));
        emit Submitted(txId, target, value);
    }

    function confirm(uint256 txId) external onlyOwner {
        Transaction storage txn = transactions[txId];
        require(!txn.executed, "executed");
        require(!confirmedBy[txId][msg.sender], "already confirmed");
        confirmedBy[txId][msg.sender] = true;
        txn.confirmations += 1;
        emit Confirmed(txId, msg.sender);
    }

    function execute(uint256 txId) external onlyOwner nonReentrant {
        Transaction storage txn = transactions[txId];
        require(!txn.executed, "executed");
        require(txn.confirmations >= threshold, "insufficient confirmations");
        txn.executed = true;
        (bool ok, ) = txn.target.call{value: txn.value}(txn.data);
        require(ok, "execution failed");
        emit Executed(txId);
    }

    function transactionCount() external view returns (uint256) {
        return transactions.length;
    }
}

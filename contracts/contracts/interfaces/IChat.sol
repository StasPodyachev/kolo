// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IChat {
    struct ChatParams {
        uint256 timestamp;
        address sender;
        string message;
    }

    function sendMessage(
        uint256 dealId,
        string memory message,
        address sender
    ) external;

    function sendSystemMessage(uint256 dealId, string memory message) external;
}

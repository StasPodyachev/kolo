// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IChat.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStore.sol";

import "./StoreDeployer.sol";
import "./Store.sol";

contract Chat is IChat {
    mapping(uint256 => ChatParams[]) private chats;

    function getChat(uint256 dealId)
        external
        view
        returns (ChatParams[] memory)
    {
        return chats[dealId];
    }

    function sendMessage(
        uint256 dealId,
        string memory message,
        address sender
    ) external {
        // TODO: Security only Integration

        chats[dealId].push(
            ChatParams({
                timestamp: block.timestamp,
                message: message,
                sender: sender
            })
        );
    }

    function sendSystemMessage(uint256 dealId, string memory message) external {
        // TODO: Security
        this.sendMessage(dealId, message, address(0));
    }
}

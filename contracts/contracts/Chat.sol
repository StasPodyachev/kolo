// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IChat.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStore.sol";

import "./StoreDeployer.sol";
import "./Store.sol";

contract Chat is IChat, Ownable {
    IFactory public _factory;

    modifier integrationOnly() {
        require(
            _factory.integrationExist(msg.sender),
            "Chat: Only integration"
        );
        _;
    }

    mapping(uint256 => ChatParams[]) private chats;

    function setFactory(address factory) external onlyOwner {
        _factory = IFactory(factory);
    }

    function getChat(uint256 dealId)
        external
        view
        returns (ChatParams[] memory)
    {
        return chats[dealId];
    }

    function _sendMessage(
        uint256 dealId,
        string memory message,
        address sender
    ) internal {
        chats[dealId].push(
            ChatParams({
                timestamp: block.timestamp,
                message: message,
                sender: sender
            })
        );
    }

    function sendMessage(
        uint256 dealId,
        string memory message,
        address sender
    ) external integrationOnly {
        _sendMessage(dealId, message, sender);
    }

    function sendSystemMessage(uint256 dealId, string memory message)
        external
        integrationOnly
    {
        _sendMessage(dealId, message, address(0));
    }
}

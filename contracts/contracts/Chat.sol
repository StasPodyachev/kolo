// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IChat.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStore.sol";

import "./StoreDeployer.sol";
import "./Store.sol";

import "hardhat/console.sol";

/**
 * @title Kolo chat storage
 *
 * This contract stores all messages of all deals.
 * It also allows to send a message, to send a
 * system message and to get chat by deal.
 *
 */
contract Chat is IChat, Ownable {
    IFactory public immutable _factory;

    modifier integrationOnly() {
        require(
            _factory.integrationExist(msg.sender),
            "Chat: Only integration"
        );
        _;
    }

    /// @dev Holds a mapping of deals to chats.
    mapping(uint256 => ChatParams[]) private chats;

    constructor(IFactory factory) {
        _factory = factory;
    }

    /// @notice Get chat by `dealId`
    function getChat(uint256 dealId)
        external
        view
        returns (ChatParams[] memory)
    {
        return chats[dealId];
    }

    ///  @notice Adding `message` by `dealId` into chat storage
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

    /**
     * @notice Send a message
     *
     * @param dealId ID of a deal
     * @param message Text of a message
     * @param sender A sender of a message
     * @dev this function adds a message into chat storage
     *
     * Requirements:
     *
     * - Only integration contract can call this function
     *
     */
    function sendMessage(
        uint256 dealId,
        string memory message,
        address sender
    ) external integrationOnly {
        _sendMessage(dealId, message, sender);
    }

    /**
     * @notice Send a system message
     *
     * @param dealId ID of a deal
     * @param message Text of a message
     * @dev this function adds a message into chat storage
     *
     * Requirements:
     *
     * - Only integration contract can call this function
     *
     */
    function sendSystemMessage(uint256 dealId, string memory message)
        external
        integrationOnly
    {
        _sendMessage(dealId, message, address(0));
    }
}

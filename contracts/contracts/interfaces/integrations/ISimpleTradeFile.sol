// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IIntegration.sol";

interface ISimpleTradeFile {
    enum SimpleTradeFileStatus {
        OPEN,
        CANCEL,
        CLOSE,
        DISPUTE,
        FINALIZE
    }

    struct SimpleTradeFileParams {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 collateralAmount;
        address seller;
        address buyer;
        uint256 dateExpire;
        bytes cid;
        SimpleTradeFileStatus status;
    }

    event DisputeCreated(uint256 id);
    event DealCreated(uint256 dealId, address sender);
    event DealCanceled(uint256 dealId, address sender);

    function setFactory(address factory) external;

    function setPeriodDispute(uint256 value) external;

    function setColletoralAmount(uint256 value) external;

    function sendMessage(uint256 dealId, string calldata message) external;

    function create(
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 dateExpire,
        bytes calldata cid
    ) external payable returns (uint256);

    function buy(uint256 dealId) external payable;

    function cancel(uint256 dealId) external;

    function dispute(uint256 dealId) external payable;

    function finalize(uint256 dealId) external;

    function getChat(uint256 dealId)
        external
        view
        returns (IIntegration.ChatParams[] memory);
}

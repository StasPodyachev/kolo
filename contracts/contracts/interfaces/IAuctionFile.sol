// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IIntegration.sol";

interface IAuctionFile {
    enum AuctionStatus {
        OPEN,
        CANCEL,
        CLOSE,
        DISPUTE,
        FINALIZE
    }

    struct AuctionFileParams {
        string name;
        string description;
        uint256 price;
        uint256 priceStart;
        uint256 priceForceStop;
        uint256 collateralAmount;
        address seller;
        address buyer;
        uint256 dateExpire;
        bytes cid;
        AuctionStatus status;
    }

    struct BidParams {
        uint256 timestamp;
        address buyer;
        uint256 bid;
    }

    struct ChatParams {
        uint256 timestamp;
        address sender;
        string message;
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
        uint256 priceStart,
        uint256 priceForceStop,
        uint256 dateExpire,
        bytes calldata cid
    ) external payable returns (uint256);

    function bid(uint256 dealId) external payable;

    function cancel(uint256 dealId) external;

    function dispute(uint256 dealId) external payable;

    function finalize(uint256 dealId) external;

    function getBidHistory(uint256 dealId)
        external
        returns (BidParams[] memory);

    function getChat(uint256 dealId)
        external
        view
        returns (ChatParams[] memory);
}
